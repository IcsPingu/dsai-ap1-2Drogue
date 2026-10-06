import { BinaryHeap } from './BinaryHeap';
import { NavigationGrid } from './NavigationGrid';
import {
  DEFAULT_SEARCH_OPTIONS,
  NavCell,
  PathSearchOptions,
  PathSearchResult,
  cellKey,
  sameCell,
} from './types';

interface OpenNode {
  cell: NavCell;
  cost: number;
  estimate: number;
}

export class AStarPathfinder {
  public constructor(private readonly grid: NavigationGrid) {}

  public find(startInput: NavCell, goalInput: NavCell, options: PathSearchOptions = {}): PathSearchResult {
    const settings = { ...DEFAULT_SEARCH_OPTIONS, ...options };
    const start = this.grid.closestWalkable(startInput);
    const goal = this.grid.closestWalkable(goalInput);
    if (!start || !goal) return { cells: [], reachedGoal: false, visited: 0, cost: Infinity };
    if (sameCell(start, goal)) return { cells: [start], reachedGoal: true, visited: 1, cost: 0 };

    const open = new BinaryHeap<OpenNode>();
    const costs = new Map<string, number>([[cellKey(start), 0]]);
    const parents = new Map<string, NavCell>();
    const closed = new Set<string>();
    let closest = start;
    let closestHeuristic = this.heuristic(start, goal, settings.allowDiagonal);
    let visited = 0;
    open.push({ cell: start, cost: 0, estimate: closestHeuristic }, closestHeuristic);

    while (!open.empty && visited < settings.maximumVisited) {
      const current = open.pop()!;
      const currentKey = cellKey(current.cell);
      if (closed.has(currentKey)) continue;
      const knownCost = costs.get(currentKey);
      if (knownCost === undefined || current.cost > knownCost) continue;
      closed.add(currentKey);
      visited++;

      const heuristic = this.heuristic(current.cell, goal, settings.allowDiagonal);
      if (heuristic < closestHeuristic || (heuristic === closestHeuristic && current.cost < (costs.get(cellKey(closest)) ?? Infinity))) {
        closest = current.cell;
        closestHeuristic = heuristic;
      }
      if (sameCell(current.cell, goal)) {
        const raw = this.reconstruct(parents, start, goal);
        return {
          cells: settings.smooth ? this.grid.smoothPath(raw) : raw,
          reachedGoal: true,
          visited,
          cost: current.cost,
        };
      }

      for (const neighbor of this.grid.neighbors(current.cell, settings.allowDiagonal, settings.preventCornerCutting)) {
        const key = cellKey(neighbor.cell);
        if (closed.has(key)) continue;
        const nextCost = current.cost + neighbor.cost;
        if (nextCost >= (costs.get(key) ?? Infinity)) continue;
        costs.set(key, nextCost);
        parents.set(key, current.cell);
        const nextHeuristic = this.heuristic(neighbor.cell, goal, settings.allowDiagonal);
        const estimate = nextCost + nextHeuristic * settings.heuristicWeight;
        open.push({ cell: neighbor.cell, cost: nextCost, estimate }, estimate);
      }
    }

    if (!settings.acceptPartial || sameCell(closest, start)) {
      return { cells: [], reachedGoal: false, visited, cost: Infinity };
    }
    const raw = this.reconstruct(parents, start, closest);
    return {
      cells: settings.smooth ? this.grid.smoothPath(raw) : raw,
      reachedGoal: false,
      visited,
      cost: costs.get(cellKey(closest)) ?? Infinity,
    };
  }

  private heuristic(a: NavCell, b: NavCell, diagonal: boolean): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    if (!diagonal) return dx + dy;
    // Octile distance is admissible for 8-direction movement.
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  }

  private reconstruct(parents: ReadonlyMap<string, NavCell>, start: NavCell, goal: NavCell): NavCell[] {
    const result: NavCell[] = [{ ...goal }];
    let cursor = goal;
    let guard = this.grid.width * this.grid.height + 1;
    while (!sameCell(cursor, start) && guard-- > 0) {
      const parent = parents.get(cellKey(cursor));
      if (!parent) return [];
      result.push({ ...parent });
      cursor = parent;
    }
    result.reverse();
    return result;
  }
}
