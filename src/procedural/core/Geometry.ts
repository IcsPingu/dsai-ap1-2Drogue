import { Point, Rect, samePoint } from './types';

export function manhattan(left: Point, right: Point): number {
  return Math.abs(left.x - right.x) + Math.abs(left.y - right.y);
}

export function euclideanSquared(left: Point, right: Point): number {
  const dx = left.x - right.x;
  const dy = left.y - right.y;
  return dx * dx + dy * dy;
}

export function euclidean(left: Point, right: Point): number {
  return Math.sqrt(euclideanSquared(left, right));
}

export function chebyshev(left: Point, right: Point): number {
  return Math.max(Math.abs(left.x - right.x), Math.abs(left.y - right.y));
}

export function rectCenter(rect: Rect): Point {
  return { x: Math.floor(rect.x + rect.width / 2), y: Math.floor(rect.y + rect.height / 2) };
}

export function rectArea(rect: Rect): number {
  return Math.max(0, rect.width) * Math.max(0, rect.height);
}

export function rectContains(rect: Rect, point: Point, padding = 0): boolean {
  return point.x >= rect.x - padding && point.y >= rect.y - padding &&
    point.x < rect.x + rect.width + padding && point.y < rect.y + rect.height + padding;
}

export function rectsIntersect(left: Rect, right: Rect, padding = 0): boolean {
  return left.x - padding < right.x + right.width && left.x + left.width + padding > right.x &&
    left.y - padding < right.y + right.height && left.y + left.height + padding > right.y;
}

export function intersection(left: Rect, right: Rect): Rect | undefined {
  const x = Math.max(left.x, right.x);
  const y = Math.max(left.y, right.y);
  const maxX = Math.min(left.x + left.width, right.x + right.width);
  const maxY = Math.min(left.y + left.height, right.y + right.height);
  return maxX > x && maxY > y ? { x, y, width: maxX - x, height: maxY - y } : undefined;
}

export function expandRect(rect: Rect, amount: number): Rect {
  return { x: rect.x - amount, y: rect.y - amount, width: rect.width + amount * 2, height: rect.height + amount * 2 };
}

export function pointsInRect(rect: Rect): Point[] {
  const result: Point[] = [];
  for (let y = rect.y; y < rect.y + rect.height; y++) {
    for (let x = rect.x; x < rect.x + rect.width; x++) result.push({ x, y });
  }
  return result;
}

export function pointsOnRectBorder(rect: Rect): Point[] {
  return pointsInRect(rect).filter((point) => point.x === rect.x || point.y === rect.y ||
    point.x === rect.x + rect.width - 1 || point.y === rect.y + rect.height - 1);
}

export function bresenhamLine(start: Point, end: Point): Point[] {
  const result: Point[] = [];
  let x = start.x;
  let y = start.y;
  const dx = Math.abs(end.x - start.x);
  const sx = start.x < end.x ? 1 : -1;
  const dy = -Math.abs(end.y - start.y);
  const sy = start.y < end.y ? 1 : -1;
  let error = dx + dy;
  while (true) {
    result.push({ x, y });
    if (x === end.x && y === end.y) break;
    const doubled = error * 2;
    if (doubled >= dy) { error += dy; x += sx; }
    if (doubled <= dx) { error += dx; y += sy; }
  }
  return result;
}

export function orthogonalLine(start: Point, end: Point, horizontalFirst = true): Point[] {
  const corner = horizontalFirst ? { x: end.x, y: start.y } : { x: start.x, y: end.y };
  return [...bresenhamLine(start, corner), ...bresenhamLine(corner, end).slice(1)];
}

export function thickLine(start: Point, end: Point, width: number): Point[] {
  const points = new Map<string, Point>();
  const radius = Math.max(0, Math.floor((width - 1) / 2));
  for (const center of bresenhamLine(start, end)) {
    for (let y = center.y - radius; y <= center.y + radius; y++) {
      for (let x = center.x - radius; x <= center.x + radius; x++) points.set(x + ',' + y, { x, y });
    }
  }
  return [...points.values()];
}

export function circle(center: Point, radius: number, filled = true): Point[] {
  const result: Point[] = [];
  const radiusSquared = radius * radius;
  const innerSquared = (radius - 1) * (radius - 1);
  for (let y = -radius; y <= radius; y++) {
    for (let x = -radius; x <= radius; x++) {
      const distance = x * x + y * y;
      if (distance <= radiusSquared && (filled || distance >= innerSquared)) result.push({ x: center.x + x, y: center.y + y });
    }
  }
  return result;
}

export function ellipse(center: Point, radiusX: number, radiusY: number): Point[] {
  const result: Point[] = [];
  for (let y = -radiusY; y <= radiusY; y++) {
    for (let x = -radiusX; x <= radiusX; x++) {
      if ((x * x) / (radiusX * radiusX) + (y * y) / (radiusY * radiusY) <= 1) {
        result.push({ x: center.x + x, y: center.y + y });
      }
    }
  }
  return result;
}

export function polygonContains(point: Point, vertices: readonly Point[]): boolean {
  let inside = false;
  for (let current = 0, previous = vertices.length - 1; current < vertices.length; previous = current++) {
    const a = vertices[current];
    const b = vertices[previous];
    const intersects = (a.y > point.y) !== (b.y > point.y) &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function rasterizePolygon(vertices: readonly Point[]): Point[] {
  if (vertices.length < 3) return [];
  const minX = Math.floor(Math.min(...vertices.map((point) => point.x)));
  const maxX = Math.ceil(Math.max(...vertices.map((point) => point.x)));
  const minY = Math.floor(Math.min(...vertices.map((point) => point.y)));
  const maxY = Math.ceil(Math.max(...vertices.map((point) => point.y)));
  const result: Point[] = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) if (polygonContains({ x: x + 0.5, y: y + 0.5 }, vertices)) result.push({ x, y });
  }
  return result;
}

export function simplifyPath(path: readonly Point[]): Point[] {
  if (path.length <= 2) return [...path];
  const result: Point[] = [path[0]];
  for (let index = 1; index < path.length - 1; index++) {
    const before = path[index - 1];
    const current = path[index];
    const after = path[index + 1];
    const firstDirection = { x: Math.sign(current.x - before.x), y: Math.sign(current.y - before.y) };
    const secondDirection = { x: Math.sign(after.x - current.x), y: Math.sign(after.y - current.y) };
    if (!samePoint(firstDirection, secondDirection)) result.push(current);
  }
  result.push(path[path.length - 1]);
  return result;
}

export function closestPair(left: readonly Point[], right: readonly Point[]): [Point, Point] | undefined {
  if (left.length === 0 || right.length === 0) return undefined;
  let best: [Point, Point] = [left[0], right[0]];
  let bestDistance = euclideanSquared(best[0], best[1]);
  for (const a of left) {
    for (const b of right) {
      const distance = euclideanSquared(a, b);
      if (distance < bestDistance) { best = [a, b]; bestDistance = distance; }
    }
  }
  return best;
}

export function pathLength(path: readonly Point[]): number {
  let total = 0;
  for (let index = 1; index < path.length; index++) total += euclidean(path[index - 1], path[index]);
  return total;
}
