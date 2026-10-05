import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from './Grid';
import {
  Corridor,
  GeneratedMap,
  GenerationStep,
  GeneratorAlgorithm,
  GeneratorContext,
  GeneratorOptions,
  Point,
  Room,
  TileKind,
  TopologyMetrics,
  normalizeOptions,
} from './types';

export interface MutableLayout {
  grid: Grid<number>;
  rooms: Room[];
  corridors: Corridor[];
  spawn?: Point;
  exit?: Point;
  metadata: Record<string, string | number | boolean>;
}

export abstract class AbstractGenerator {
  public abstract readonly algorithm: GeneratorAlgorithm;

  public generate(rawOptions: GeneratorOptions): GeneratedMap {
    const options = normalizeOptions(rawOptions);
    const random = new DeterministicRandom(options.seed).fork(this.algorithm);
    const context: GeneratorContext = { options, steps: [], operationCount: 0 };
    const layout = this.createLayout(options, random, context);
    layout.grid.drawBorder(TileKind.Wall);
    const fallback = this.pickDistantEndpoints(layout.grid);
    const spawn = layout.spawn ?? fallback.spawn;
    const exit = layout.exit ?? fallback.exit;
    if (layout.grid.inBounds(spawn.x, spawn.y)) layout.grid.set(spawn.x, spawn.y, TileKind.Spawn);
    if (layout.grid.inBounds(exit.x, exit.y)) layout.grid.set(exit.x, exit.y, TileKind.Exit);
    this.step(context, 'complete', 'layout-complete', 'The structural generator completed.', 0);
    return {
      algorithm: this.algorithm,
      seed: String(options.seed),
      width: options.width,
      height: options.height,
      tiles: layout.grid.toRows(),
      rooms: layout.rooms,
      corridors: layout.corridors,
      spawn,
      exit,
      enemies: [],
      items: [],
      decorations: [],
      encounters: [],
      metrics: emptyMetrics(),
      steps: context.steps,
      metadata: layout.metadata,
    };
  }

  protected abstract createLayout(
    options: GeneratorOptions,
    random: DeterministicRandom,
    context: GeneratorContext,
  ): MutableLayout;

  protected step(
    context: GeneratorContext,
    phase: GenerationStep['phase'],
    name: string,
    detail: string,
    changedCells: number,
  ): void {
    context.operationCount += Math.max(1, changedCells);
    context.steps.push({ phase, name, detail, changedCells, elapsedOperations: context.operationCount });
  }

  protected pickDistantEndpoints(grid: Grid<number>): { spawn: Point; exit: Point } {
    const floors = grid.filter((tile) => tile === TileKind.Floor);
    if (floors.length === 0) {
      const spawn = { x: 1, y: 1 };
      const exit = { x: grid.width - 2, y: grid.height - 2 };
      grid.set(spawn.x, spawn.y, TileKind.Floor);
      grid.set(exit.x, exit.y, TileKind.Floor);
      return { spawn, exit };
    }
    const first = floors[0];
    const fromFirst = farthestReachable(grid, first);
    const fromSecond = farthestReachable(grid, fromFirst.point);
    return { spawn: fromFirst.point, exit: fromSecond.point };
  }
}

export function emptyLayout(options: GeneratorOptions, fill = TileKind.Wall): MutableLayout {
  return {
    grid: new Grid<number>(options.width, options.height, fill),
    rooms: [],
    corridors: [],
    metadata: {},
  };
}

export function emptyMetrics(): TopologyMetrics {
  return {
    walkableCells: 0,
    wallCells: 0,
    componentCount: 0,
    deadEndCount: 0,
    junctionCount: 0,
    loopCount: 0,
    chokepointCount: 0,
    averageBranching: 0,
    mainPathLength: 0,
    openness: 0,
    linearity: 0,
  };
}

export function tileIsPassable(tile: number): boolean {
  return tile === TileKind.Floor || tile === TileKind.Spawn || tile === TileKind.Exit ||
    tile === TileKind.Chest || tile === TileKind.Boss || tile === TileKind.LockedDoor;
}

export function farthestReachable(grid: Grid<number>, start: Point): { point: Point; distance: number } {
  const distances = new Map<string, number>();
  const queue: Point[] = [start];
  distances.set(start.x + ',' + start.y, 0);
  let farthest = start;
  let maxDistance = 0;
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const point = queue[cursor];
    const distance = distances.get(point.x + ',' + point.y) ?? 0;
    if (distance > maxDistance) { maxDistance = distance; farthest = point; }
    for (const next of grid.neighbors4(point.x, point.y)) {
      const key = next.x + ',' + next.y;
      if (!distances.has(key) && tileIsPassable(grid.get(next.x, next.y))) {
        distances.set(key, distance + 1);
        queue.push(next);
      }
    }
  }
  return { point: farthest, distance: maxDistance };
}

export function makeRoom(id: string, x: number, y: number, width: number, height: number): Room {
  return {
    id,
    x,
    y,
    width,
    height,
    center: { x: Math.floor(x + width / 2), y: Math.floor(y + height / 2) },
    area: width * height,
    kind: 'combat',
    tags: [],
  };
}

export function carveRoom(grid: Grid<number>, room: Room, tile = TileKind.Floor): number {
  return grid.fillRect(room, tile);
}

export function carvePoints(grid: Grid<number>, points: readonly Point[], tile = TileKind.Floor): number {
  let changed = 0;
  for (const point of points) {
    if (grid.inBounds(point.x, point.y) && !grid.isBorder(point.x, point.y) && grid.get(point.x, point.y) !== tile) {
      grid.set(point.x, point.y, tile);
      changed++;
    }
  }
  return changed;
}
