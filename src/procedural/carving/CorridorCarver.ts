import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { bresenhamLine, circle, orthogonalLine, simplifyPath } from '../core/Geometry';
import { Corridor, Point, TileKind } from '../core/types';

export type CorridorStyle = 'horizontal-first' | 'vertical-first' | 'straight' | 'zigzag' | 'winding';

export class CorridorCarver {
  private serial = 0;

  public carve(
    grid: Grid<number>,
    start: Point,
    end: Point,
    width: number,
    style: CorridorStyle,
    random: DeterministicRandom,
    fromRoomId?: string,
    toRoomId?: string,
  ): Corridor {
    const centerline = this.centerline(start, end, style, random);
    const points = this.expand(centerline, width).filter((point) => grid.inBounds(point.x, point.y) && !grid.isBorder(point.x, point.y));
    for (const point of points) grid.set(point.x, point.y, TileKind.Floor);
    return {
      id: 'corridor-' + this.serial++,
      fromRoomId,
      toRoomId,
      points,
      width,
      locked: false,
    };
  }

  public carveDoor(grid: Grid<number>, point: Point, locked: boolean): void {
    if (grid.inBounds(point.x, point.y) && !grid.isBorder(point.x, point.y)) {
      grid.set(point.x, point.y, locked ? TileKind.LockedDoor : TileKind.Floor);
    }
  }

  private centerline(start: Point, end: Point, style: CorridorStyle, random: DeterministicRandom): Point[] {
    if (style === 'straight') return bresenhamLine(start, end);
    if (style === 'horizontal-first') return orthogonalLine(start, end, true);
    if (style === 'vertical-first') return orthogonalLine(start, end, false);
    if (style === 'zigzag') {
      const horizontal = Math.abs(end.x - start.x) > Math.abs(end.y - start.y);
      const first = horizontal
        ? { x: Math.round((start.x + end.x) / 2), y: start.y }
        : { x: start.x, y: Math.round((start.y + end.y) / 2) };
      const second = horizontal
        ? { x: first.x, y: end.y }
        : { x: end.x, y: first.y };
      return [...bresenhamLine(start, first), ...bresenhamLine(first, second).slice(1), ...bresenhamLine(second, end).slice(1)];
    }
    const waypoints: Point[] = [start];
    const segments = Math.max(2, Math.floor((Math.abs(end.x - start.x) + Math.abs(end.y - start.y)) / 8));
    for (let index = 1; index < segments; index++) {
      const ratio = index / segments;
      waypoints.push({
        x: Math.round(start.x + (end.x - start.x) * ratio + random.integer(-2, 2)),
        y: Math.round(start.y + (end.y - start.y) * ratio + random.integer(-2, 2)),
      });
    }
    waypoints.push(end);
    const points: Point[] = [];
    for (let index = 1; index < waypoints.length; index++) {
      points.push(...bresenhamLine(waypoints[index - 1], waypoints[index]).slice(index === 1 ? 0 : 1));
    }
    return simplifyPath(points).flatMap((point, index, values) => index === 0 ? [point] : bresenhamLine(values[index - 1], point).slice(1));
  }

  private expand(centerline: readonly Point[], width: number): Point[] {
    const result = new Map<string, Point>();
    const radius = Math.max(0, Math.floor(width / 2));
    for (const point of centerline) {
      for (const expanded of circle(point, radius)) result.set(expanded.x + ',' + expanded.y, expanded);
    }
    return [...result.values()];
  }
}
