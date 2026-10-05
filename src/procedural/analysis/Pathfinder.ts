import { Grid } from '../core/Grid';
import { manhattan } from '../core/Geometry';
import { Point, pointKey } from '../core/types';

interface SearchNode {
  point: Point;
  cost: number;
  estimate: number;
}

export class Pathfinder {
  public breadthFirst(grid: Grid<number>, start: Point, goal: Point, passable: (tile: number) => boolean): Point[] {
    const queue: Point[] = [start];
    const parents = new Map<string, string>();
    const visited = new Set<string>([pointKey(start)]);
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const current = queue[cursor];
      if (current.x === goal.x && current.y === goal.y) return this.reconstruct(parents, current);
      for (const next of grid.neighbors4(current.x, current.y)) {
        const key = pointKey(next);
        if (!visited.has(key) && passable(grid.get(next.x, next.y))) {
          visited.add(key);
          parents.set(key, pointKey(current));
          queue.push(next);
        }
      }
    }
    return [];
  }

  public aStar(
    grid: Grid<number>,
    start: Point,
    goal: Point,
    movementCost: (tile: number, point: Point) => number,
  ): Point[] {
    const open: SearchNode[] = [{ point: start, cost: 0, estimate: manhattan(start, goal) }];
    const costs = new Map<string, number>([[pointKey(start), 0]]);
    const parents = new Map<string, string>();
    const closed = new Set<string>();
    while (open.length > 0) {
      open.sort((left, right) => left.estimate - right.estimate || left.cost - right.cost);
      const current = open.shift()!;
      const currentKey = pointKey(current.point);
      if (closed.has(currentKey)) continue;
      if (current.point.x === goal.x && current.point.y === goal.y) return this.reconstruct(parents, current.point);
      closed.add(currentKey);
      for (const next of grid.neighbors4(current.point.x, current.point.y)) {
        const stepCost = movementCost(grid.get(next.x, next.y), next);
        if (!Number.isFinite(stepCost) || stepCost < 0) continue;
        const nextCost = current.cost + stepCost;
        const key = pointKey(next);
        if (nextCost < (costs.get(key) ?? Infinity)) {
          costs.set(key, nextCost);
          parents.set(key, currentKey);
          open.push({ point: next, cost: nextCost, estimate: nextCost + manhattan(next, goal) });
        }
      }
    }
    return [];
  }

  public distanceField(grid: Grid<number>, starts: readonly Point[], passable: (tile: number) => boolean): Grid<number> {
    const distances = new Grid<number>(grid.width, grid.height, Infinity);
    const queue: Point[] = [];
    for (const start of starts) {
      if (grid.inBounds(start.x, start.y)) {
        distances.set(start.x, start.y, 0);
        queue.push(start);
      }
    }
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const point = queue[cursor];
      const distance = distances.get(point.x, point.y);
      for (const next of grid.neighbors4(point.x, point.y)) {
        if (passable(grid.get(next.x, next.y)) && distances.get(next.x, next.y) > distance + 1) {
          distances.set(next.x, next.y, distance + 1);
          queue.push(next);
        }
      }
    }
    return distances;
  }

  public lineOfSight(grid: Grid<number>, start: Point, end: Point, transparent: (tile: number) => boolean): boolean {
    let x = start.x;
    let y = start.y;
    const dx = Math.abs(end.x - start.x);
    const sx = start.x < end.x ? 1 : -1;
    const dy = -Math.abs(end.y - start.y);
    const sy = start.y < end.y ? 1 : -1;
    let error = dx + dy;
    while (true) {
      if ((x !== start.x || y !== start.y) && (x !== end.x || y !== end.y) && !transparent(grid.get(x, y))) return false;
      if (x === end.x && y === end.y) return true;
      const doubled = error * 2;
      if (doubled >= dy) { error += dy; x += sx; }
      if (doubled <= dx) { error += dx; y += sy; }
    }
  }

  private reconstruct(parents: Map<string, string>, goal: Point): Point[] {
    const result: Point[] = [goal];
    let key = pointKey(goal);
    while (parents.has(key)) {
      key = parents.get(key)!;
      const [x, y] = key.split(',').map(Number);
      result.push({ x, y });
    }
    return result.reverse();
  }
}
