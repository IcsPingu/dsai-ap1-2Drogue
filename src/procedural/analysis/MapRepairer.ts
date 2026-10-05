import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { closestPair, orthogonalLine } from '../core/Geometry';
import { GeneratedMap, Point, TileKind } from '../core/types';
import { carvePoints, tileIsPassable } from '../core/GenerationSupport';
import { Pathfinder } from './Pathfinder';

export class MapRepairer {
  private readonly pathfinder = new Pathfinder();

  public repair(map: GeneratedMap): { map: GeneratedMap; repairs: string[] } {
    const grid = Grid.fromRows(map.tiles);
    const random = new DeterministicRandom(map.seed).fork('map-repair');
    const repairs: string[] = [];
    grid.drawBorder(TileKind.Wall);
    this.ensurePoint(grid, map.spawn, TileKind.Spawn, repairs, 'spawn');
    this.ensurePoint(grid, map.exit, TileKind.Exit, repairs, 'exit');
    let path = this.pathfinder.breadthFirst(grid, map.spawn, map.exit, tileIsPassable);
    if (path.length === 0) {
      const connector = orthogonalLine(map.spawn, map.exit, random.boolean());
      carvePoints(grid, connector, TileKind.Floor);
      grid.set(map.spawn.x, map.spawn.y, TileKind.Spawn);
      grid.set(map.exit.x, map.exit.y, TileKind.Exit);
      repairs.push('connected-spawn-to-exit');
      path = this.pathfinder.breadthFirst(grid, map.spawn, map.exit, tileIsPassable);
    }
    this.connectRegions(grid, random, repairs);
    this.removeTinyRegions(grid, repairs);
    grid.drawBorder(TileKind.Wall);
    return { map: { ...map, tiles: grid.toRows(), metadata: { ...map.metadata, repaired: true, repairCount: repairs.length } }, repairs };
  }

  private ensurePoint(grid: Grid<number>, point: Point, tile: TileKind, repairs: string[], label: string): void {
    point.x = Math.max(1, Math.min(grid.width - 2, point.x));
    point.y = Math.max(1, Math.min(grid.height - 2, point.y));
    if (grid.get(point.x, point.y) !== tile) {
      grid.set(point.x, point.y, tile);
      repairs.push('restored-' + label);
    }
  }

  private connectRegions(grid: Grid<number>, random: DeterministicRandom, repairs: string[]): void {
    let regions = grid.regions((tile) => tileIsPassable(tile)).sort((a, b) => b.cells.length - a.cells.length);
    while (regions.length > 1) {
      const main = regions[0];
      const other = regions[1];
      const pair = closestPair(main.cells, other.cells);
      if (!pair) break;
      carvePoints(grid, orthogonalLine(pair[0], pair[1], random.boolean()), TileKind.Floor);
      repairs.push('joined-region-' + other.id);
      regions = grid.regions((tile) => tileIsPassable(tile)).sort((a, b) => b.cells.length - a.cells.length);
    }
  }

  private removeTinyRegions(grid: Grid<number>, repairs: string[]): void {
    const regions = grid.regions((tile) => tileIsPassable(tile));
    for (const region of regions) {
      if (region.cells.length >= 6) continue;
      for (const point of region.cells) grid.set(point.x, point.y, TileKind.Wall);
      repairs.push('removed-tiny-region-' + region.id);
    }
  }
}
