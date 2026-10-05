import { Grid } from '../core/Grid';
import { GeneratedMap, Point, TileKind, TopologyMetrics, pointKey } from '../core/types';
import { Pathfinder } from './Pathfinder';
import { tileIsPassable } from '../core/GenerationSupport';

export class TopologyAnalyzer {
  private readonly pathfinder = new Pathfinder();

  public analyze(map: Pick<GeneratedMap, 'tiles' | 'spawn' | 'exit'>): TopologyMetrics {
    const grid = Grid.fromRows(map.tiles);
    const walkable = grid.filter((tile) => tileIsPassable(tile));
    const regions = grid.regions((tile) => tileIsPassable(tile));
    let deadEnds = 0;
    let junctions = 0;
    let degreeTotal = 0;
    let edges = 0;
    for (const point of walkable) {
      const degree = grid.neighbors4(point.x, point.y).filter((next) => tileIsPassable(grid.get(next.x, next.y))).length;
      degreeTotal += degree;
      edges += degree;
      if (degree === 1) deadEnds++;
      if (degree >= 3) junctions++;
    }
    edges /= 2;
    const loops = Math.max(0, edges - walkable.length + regions.length);
    const path = this.pathfinder.breadthFirst(grid, map.spawn, map.exit, tileIsPassable);
    const chokepoints = this.articulationPoints(grid).length;
    const maximumCells = Math.max(1, (grid.width - 2) * (grid.height - 2));
    return {
      walkableCells: walkable.length,
      wallCells: grid.count((tile) => tile === TileKind.Wall),
      componentCount: regions.length,
      deadEndCount: deadEnds,
      junctionCount: junctions,
      loopCount: loops,
      chokepointCount: chokepoints,
      averageBranching: walkable.length === 0 ? 0 : degreeTotal / walkable.length,
      mainPathLength: path.length,
      openness: walkable.length / maximumCells,
      linearity: walkable.length === 0 ? 0 : path.length / walkable.length,
    };
  }

  public articulationPoints(grid: Grid<number>): Point[] {
    const discovery = new Map<string, number>();
    const low = new Map<string, number>();
    const parent = new Map<string, string>();
    const result = new Set<string>();
    let time = 0;
    const visit = (point: Point): void => {
      const key = pointKey(point);
      discovery.set(key, ++time);
      low.set(key, time);
      let children = 0;
      for (const next of grid.neighbors4(point.x, point.y)) {
        if (!tileIsPassable(grid.get(next.x, next.y))) continue;
        const nextKey = pointKey(next);
        if (!discovery.has(nextKey)) {
          children++;
          parent.set(nextKey, key);
          visit(next);
          low.set(key, Math.min(low.get(key)!, low.get(nextKey)!));
          if (!parent.has(key) && children > 1) result.add(key);
          if (parent.has(key) && low.get(nextKey)! >= discovery.get(key)!) result.add(key);
        } else if (parent.get(key) !== nextKey) {
          low.set(key, Math.min(low.get(key)!, discovery.get(nextKey)!));
        }
      }
    };
    for (const point of grid.filter((tile) => tileIsPassable(tile))) {
      if (!discovery.has(pointKey(point))) visit(point);
    }
    return [...result].map((key) => {
      const [x, y] = key.split(',').map(Number);
      return { x, y };
    });
  }

  public deadEnds(grid: Grid<number>): Point[] {
    return grid.filter((tile, x, y) => tileIsPassable(tile) &&
      grid.neighbors4(x, y).filter((point) => tileIsPassable(grid.get(point.x, point.y))).length === 1);
  }

  public junctions(grid: Grid<number>): Point[] {
    return grid.filter((tile, x, y) => tileIsPassable(tile) &&
      grid.neighbors4(x, y).filter((point) => tileIsPassable(grid.get(point.x, point.y))).length >= 3);
  }
}
