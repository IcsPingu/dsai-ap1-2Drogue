import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { NoiseField } from '../core/Noise';
import { BiomeId, GeneratedMap, Point, TileKind } from '../core/types';
import { tileIsPassable } from '../core/GenerationSupport';

interface BiomeRules {
  hazard: TileKind.Pit | TileKind.Lava;
  hazardThreshold: number;
  pillarChance: number;
  symmetry: 'none' | 'horizontal' | 'vertical' | 'radial';
  erosion: number;
}

const RULES: Record<BiomeId, BiomeRules> = {
  cathedral: { hazard: TileKind.Pit, hazardThreshold: 0.87, pillarChance: 0.025, symmetry: 'vertical', erosion: 0 },
  inferno: { hazard: TileKind.Lava, hazardThreshold: 0.72, pillarChance: 0.015, symmetry: 'none', erosion: 0.12 },
  celestial: { hazard: TileKind.Pit, hazardThreshold: 0.82, pillarChance: 0.04, symmetry: 'radial', erosion: 0.04 },
  streets: { hazard: TileKind.Pit, hazardThreshold: 0.93, pillarChance: 0.008, symmetry: 'horizontal', erosion: 0 },
  ruins: { hazard: TileKind.Pit, hazardThreshold: 0.83, pillarChance: 0.045, symmetry: 'none', erosion: 0.15 },
  garden: { hazard: TileKind.Pit, hazardThreshold: 0.78, pillarChance: 0.02, symmetry: 'radial', erosion: 0.08 },
  crypt: { hazard: TileKind.Pit, hazardThreshold: 0.9, pillarChance: 0.035, symmetry: 'none', erosion: 0.05 },
  clocktower: { hazard: TileKind.Pit, hazardThreshold: 0.86, pillarChance: 0.055, symmetry: 'vertical', erosion: 0 },
  colosseum: { hazard: TileKind.Pit, hazardThreshold: 0.96, pillarChance: 0.018, symmetry: 'radial', erosion: 0 },
  void: { hazard: TileKind.Pit, hazardThreshold: 0.68, pillarChance: 0.01, symmetry: 'none', erosion: 0.22 },
};

export class BiomePainter {
  public paint(map: GeneratedMap, random: DeterministicRandom): void {
    const biome = (map.metadata.biome ?? 'cathedral') as BiomeId;
    const rules = RULES[biome];
    const grid = Grid.fromRows(map.tiles);
    const noise = new NoiseField(map.seed + ':' + biome + ':terrain');
    const protectedCells = this.protectedRoute(grid, map.spawn, map.exit);
    grid.forEach((tile, x, y) => {
      if (tile !== TileKind.Floor || protectedCells.has(x + ',' + y)) return;
      const field = biome === 'void' ? noise.domainWarp(x, y, 10, 0.07) : noise.fractal(x, y, { frequency: 0.08, octaves: 4 });
      if (field > rules.hazardThreshold && random.boolean(Number(map.metadata.hazardDensity ?? 0.03) * 8)) {
        grid.set(x, y, rules.hazard);
      } else if (random.boolean(rules.pillarChance) && grid.neighbors8(x, y).every((point) => tileIsPassable(grid.get(point.x, point.y)))) {
        grid.set(x, y, TileKind.Pillar);
      }
    });
    if (rules.erosion > 0) this.erode(grid, rules, random, protectedCells);
    this.applySymmetryAccents(grid, rules, random, protectedCells);
    grid.set(map.spawn.x, map.spawn.y, TileKind.Spawn);
    grid.set(map.exit.x, map.exit.y, TileKind.Exit);
    grid.drawBorder(TileKind.Wall);
    map.tiles = grid.toRows();
    map.metadata.terrainPainter = biome;
  }

  private protectedRoute(grid: Grid<number>, start: Point, end: Point): Set<string> {
    const queue: Point[] = [start];
    const parents = new Map<string, string>();
    const visited = new Set<string>([start.x + ',' + start.y]);
    let found = false;
    for (let cursor = 0; cursor < queue.length && !found; cursor++) {
      const point = queue[cursor];
      for (const next of grid.neighbors4(point.x, point.y)) {
        const key = next.x + ',' + next.y;
        if (visited.has(key) || !tileIsPassable(grid.get(next.x, next.y))) continue;
        visited.add(key);
        parents.set(key, point.x + ',' + point.y);
        queue.push(next);
        if (next.x === end.x && next.y === end.y) { found = true; break; }
      }
    }
    const route = new Set<string>();
    let key = end.x + ',' + end.y;
    route.add(key);
    while (parents.has(key)) { key = parents.get(key)!; route.add(key); }
    return route;
  }

  private erode(grid: Grid<number>, rules: BiomeRules, random: DeterministicRandom, protectedCells: Set<string>): void {
    const before = grid.clone();
    grid.forEach((tile, x, y) => {
      if (tile !== TileKind.Wall || grid.isBorder(x, y) || protectedCells.has(x + ',' + y)) return;
      const floors = before.neighbors8(x, y).filter((point) => tileIsPassable(before.get(point.x, point.y))).length;
      if (floors >= 5 && random.boolean(rules.erosion)) grid.set(x, y, TileKind.Floor);
    });
  }

  private applySymmetryAccents(grid: Grid<number>, rules: BiomeRules, random: DeterministicRandom, protectedCells: Set<string>): void {
    if (rules.symmetry === 'none') return;
    const candidates = grid.filter((tile, x, y) => tile === TileKind.Floor && !protectedCells.has(x + ',' + y));
    for (const point of random.sample(candidates, Math.min(candidates.length, Math.floor(candidates.length * 0.02)))) {
      let mirror: Point;
      if (rules.symmetry === 'horizontal') mirror = { x: grid.width - 1 - point.x, y: point.y };
      else if (rules.symmetry === 'vertical') mirror = { x: point.x, y: grid.height - 1 - point.y };
      else mirror = { x: grid.width - 1 - point.x, y: grid.height - 1 - point.y };
      if (grid.inBounds(mirror.x, mirror.y) && grid.get(mirror.x, mirror.y) === TileKind.Floor && !protectedCells.has(mirror.x + ',' + mirror.y)) {
        grid.set(point.x, point.y, TileKind.Pillar);
        grid.set(mirror.x, mirror.y, TileKind.Pillar);
      }
    }
  }
}
