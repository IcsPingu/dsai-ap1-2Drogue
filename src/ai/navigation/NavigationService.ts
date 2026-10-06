import { AStarPathfinder } from './AStarPathfinder';
import { NavigationGrid } from './NavigationGrid';
import { PathCache } from './PathCache';
import {
  NavCell,
  NavPoint,
  NavigationPath,
  NavigationTilePolicy,
  PathSearchOptions,
  cellKey,
} from './types';

export interface NavigationServiceOptions {
  tileSize?: number;
  cacheCapacity?: number;
  policy?: NavigationTilePolicy;
}

export class NavigationService {
  public readonly grid: NavigationGrid;
  private readonly pathfinder: AStarPathfinder;
  private readonly cache: PathCache;
  private readonly gridSignature: string;
  private searches = 0;
  private cacheHits = 0;

  public constructor(rows: readonly (readonly number[])[], options: NavigationServiceOptions = {}) {
    this.grid = new NavigationGrid(rows, options.tileSize ?? 32, options.policy);
    this.pathfinder = new AStarPathfinder(this.grid);
    this.cache = new PathCache(options.cacheCapacity ?? 384);
    this.gridSignature = this.grid.signature();
  }

  public findPath(startWorld: NavPoint, goalWorld: NavPoint, options: PathSearchOptions = {}): NavigationPath {
    const start = this.grid.closestWalkable(this.grid.worldToCell(startWorld));
    const goal = this.grid.closestWalkable(this.grid.worldToCell(goalWorld));
    if (!start || !goal) return { points: [], reachedGoal: false, visited: 0, cost: Infinity };
    const key = this.cacheKey(start, goal, options);
    const cached = this.cache.get(key);
    if (cached) {
      this.cacheHits++;
      return cached;
    }
    this.searches++;
    const result = this.pathfinder.find(start, goal, options);
    const points = result.cells.map((cell) => this.grid.cellToWorld(cell));
    const path = { points, reachedGoal: result.reachedGoal, visited: result.visited, cost: result.cost };
    this.cache.set(key, path);
    return path;
  }

  public hasLineOfSight(startWorld: NavPoint, endWorld: NavPoint): boolean {
    return this.grid.worldLineOfSight(startWorld, endWorld);
  }

  public closestWalkableWorld(point: NavPoint): NavPoint | undefined {
    const cell = this.grid.closestWalkable(this.grid.worldToCell(point));
    return cell ? this.grid.cellToWorld(cell) : undefined;
  }

  public isWalkableWorld(point: NavPoint): boolean {
    return this.grid.isWalkable(this.grid.worldToCell(point));
  }

  public diagnostics(): { searches: number; cacheHits: number; cacheSize: number } {
    return { searches: this.searches, cacheHits: this.cacheHits, cacheSize: this.cache.size };
  }

  private cacheKey(start: NavCell, goal: NavCell, options: PathSearchOptions): string {
    return [
      this.gridSignature,
      cellKey(start),
      cellKey(goal),
      options.allowDiagonal === false ? '4' : '8',
      options.preventCornerCutting === false ? 'cut' : 'safe',
      options.smooth === false ? 'raw' : 'smooth',
    ].join('|');
  }
}
