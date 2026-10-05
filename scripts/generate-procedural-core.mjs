import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = join(process.cwd(), 'src', 'procedural');
const files = new Map();
const emit = (name, source) => files.set(name, source.trimStart().replaceAll('\r\n', '\n'));

emit('core/types.ts', String.raw`
export enum TileKind {
  Floor = 0,
  Wall = 1,
  Pillar = 2,
  Pit = 3,
  Lava = 4,
  Exit = 5,
  LockedDoor = 6,
  Chest = 7,
  Spawn = 8,
  Boss = 9,
}

export type GeneratorAlgorithm =
  | 'bsp'
  | 'drunkard-walk'
  | 'cellular-automata'
  | 'depth-first-maze'
  | 'prim-maze'
  | 'kruskal-maze'
  | 'eller-maze'
  | 'room-graph'
  | 'wave-function-collapse'
  | 'grammar'
  | 'voronoi-caves'
  | 'hybrid';

export type CardinalDirection = 'north' | 'east' | 'south' | 'west';
export type GenerationPhase =
  | 'initialization'
  | 'layout'
  | 'connectivity'
  | 'terrain'
  | 'content'
  | 'validation'
  | 'complete';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export interface WeightedPoint extends Point {
  weight: number;
}

export interface Room extends Rect {
  id: string;
  center: Point;
  area: number;
  kind: 'start' | 'exit' | 'combat' | 'treasure' | 'boss' | 'connector' | 'secret';
  tags: string[];
}

export interface Corridor {
  id: string;
  fromRoomId?: string;
  toRoomId?: string;
  points: Point[];
  width: number;
  locked: boolean;
}

export interface Region {
  id: number;
  cells: Point[];
  bounds: Rect;
  centroid: Point;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface GenerationStep {
  phase: GenerationPhase;
  name: string;
  detail: string;
  changedCells: number;
  elapsedOperations: number;
}

export interface GeneratorOptions {
  width: number;
  height: number;
  seed: string | number;
  algorithm: GeneratorAlgorithm;
  difficulty: number;
  floorTarget: number;
  roomMinSize: number;
  roomMaxSize: number;
  corridorWidth: number;
  loopChance: number;
  hazardDensity: number;
  treasureDensity: number;
  enemyDensity: number;
  decorationDensity: number;
  smoothingPasses: number;
  biome: BiomeId;
  ensureConnected: boolean;
}

export type BiomeId =
  | 'cathedral'
  | 'inferno'
  | 'celestial'
  | 'streets'
  | 'ruins'
  | 'garden'
  | 'crypt'
  | 'clocktower'
  | 'colosseum'
  | 'void';

export interface GeneratorContext {
  options: GeneratorOptions;
  steps: GenerationStep[];
  operationCount: number;
}

export interface EnemySpawn {
  id: string;
  archetype: string;
  position: Point;
  level: number;
  patrol: Point[];
  encounterId: string;
}

export interface ItemSpawn {
  id: string;
  itemType: string;
  position: Point;
  quantity: number;
  guarded: boolean;
}

export interface DecorationSpawn {
  id: string;
  decorationType: string;
  position: Point;
  rotation: number;
  scale: number;
  tint?: number;
}

export interface EncounterPlan {
  id: string;
  roomId?: string;
  enemies: string[];
  budget: number;
  trigger: 'enter-room' | 'cross-threshold' | 'pickup' | 'boss-door';
  rewardItemId?: string;
}

export interface TopologyMetrics {
  walkableCells: number;
  wallCells: number;
  componentCount: number;
  deadEndCount: number;
  junctionCount: number;
  loopCount: number;
  chokepointCount: number;
  averageBranching: number;
  mainPathLength: number;
  openness: number;
  linearity: number;
}

export interface GeneratedMap {
  algorithm: GeneratorAlgorithm;
  seed: string;
  width: number;
  height: number;
  tiles: number[][];
  rooms: Room[];
  corridors: Corridor[];
  spawn: Point;
  exit: Point;
  enemies: EnemySpawn[];
  items: ItemSpawn[];
  decorations: DecorationSpawn[];
  encounters: EncounterPlan[];
  metrics: TopologyMetrics;
  steps: GenerationStep[];
  metadata: Record<string, string | number | boolean>;
}

export interface GenerationResult {
  map: GeneratedMap;
  warnings: string[];
  repaired: boolean;
  attempts: number;
}

export interface MapGenerator {
  readonly algorithm: GeneratorAlgorithm;
  generate(options: GeneratorOptions): GeneratedMap;
}

export interface ValidationIssue {
  code: string;
  severity: 'warning' | 'error';
  message: string;
  position?: Point;
}

export interface ValidationReport {
  valid: boolean;
  issues: ValidationIssue[];
  metrics: TopologyMetrics;
}

export const CARDINAL_DIRECTIONS: ReadonlyArray<Readonly<Point>> = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

export const DIAGONAL_DIRECTIONS: ReadonlyArray<Readonly<Point>> = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
];

export const ALL_DIRECTIONS: ReadonlyArray<Readonly<Point>> = [
  ...CARDINAL_DIRECTIONS,
  ...DIAGONAL_DIRECTIONS,
];

export function pointKey(point: Point): string {
  return point.x + ',' + point.y;
}

export function parsePointKey(key: string): Point {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
}

export function samePoint(left: Point, right: Point): boolean {
  return left.x === right.x && left.y === right.y;
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

export function isWalkableTile(tile: number): boolean {
  return tile === TileKind.Floor || tile === TileKind.Exit || tile === TileKind.Chest ||
    tile === TileKind.Spawn || tile === TileKind.Boss || tile === TileKind.LockedDoor;
}

export function createDefaultOptions(
  seed: string | number,
  algorithm: GeneratorAlgorithm = 'hybrid',
): GeneratorOptions {
  return {
    width: 40,
    height: 25,
    seed,
    algorithm,
    difficulty: 3,
    floorTarget: 0.48,
    roomMinSize: 4,
    roomMaxSize: 10,
    corridorWidth: 2,
    loopChance: 0.18,
    hazardDensity: 0.035,
    treasureDensity: 0.012,
    enemyDensity: 0.025,
    decorationDensity: 0.05,
    smoothingPasses: 4,
    biome: 'cathedral',
    ensureConnected: true,
  };
}

export function normalizeOptions(input: Partial<GeneratorOptions> & Pick<GeneratorOptions, 'seed'>): GeneratorOptions {
  const defaults = createDefaultOptions(input.seed, input.algorithm ?? 'hybrid');
  const result = { ...defaults, ...input };
  result.width = Math.max(15, Math.floor(result.width));
  result.height = Math.max(15, Math.floor(result.height));
  result.difficulty = clamp(Math.floor(result.difficulty), 1, 10);
  result.floorTarget = clamp(result.floorTarget, 0.15, 0.82);
  result.roomMinSize = clamp(Math.floor(result.roomMinSize), 3, 15);
  result.roomMaxSize = clamp(Math.floor(result.roomMaxSize), result.roomMinSize, 24);
  result.corridorWidth = clamp(Math.floor(result.corridorWidth), 1, 5);
  result.loopChance = clamp(result.loopChance, 0, 1);
  result.hazardDensity = clamp(result.hazardDensity, 0, 0.25);
  result.treasureDensity = clamp(result.treasureDensity, 0, 0.15);
  result.enemyDensity = clamp(result.enemyDensity, 0, 0.2);
  result.decorationDensity = clamp(result.decorationDensity, 0, 0.3);
  result.smoothingPasses = clamp(Math.floor(result.smoothingPasses), 0, 12);
  return result;
}
`);

emit('core/Grid.ts', String.raw`
import { ALL_DIRECTIONS, CARDINAL_DIRECTIONS, Point, Rect, Region, pointKey } from './types';

export class Grid<T> {
  public readonly width: number;
  public readonly height: number;
  private readonly cells: T[];

  public constructor(width: number, height: number, factory: T | ((x: number, y: number) => T)) {
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) {
      throw new RangeError('grid dimensions must be positive integers');
    }
    this.width = width;
    this.height = height;
    this.cells = new Array<T>(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.cells[this.index(x, y)] = typeof factory === 'function'
          ? (factory as (x: number, y: number) => T)(x, y)
          : factory;
      }
    }
  }

  public static fromRows<T>(rows: readonly (readonly T[])[]): Grid<T> {
    if (rows.length === 0 || rows[0].length === 0) throw new RangeError('rows cannot be empty');
    const width = rows[0].length;
    if (rows.some((row) => row.length !== width)) throw new RangeError('rows must have equal length');
    const grid = new Grid<T>(width, rows.length, rows[0][0]);
    grid.forEach((_value, x, y) => grid.set(x, y, rows[y][x]));
    return grid;
  }

  public inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  public isBorder(x: number, y: number, thickness = 1): boolean {
    return x < thickness || y < thickness || x >= this.width - thickness || y >= this.height - thickness;
  }

  public get(x: number, y: number): T {
    this.assertBounds(x, y);
    return this.cells[this.index(x, y)];
  }

  public getOr(x: number, y: number, fallback: T): T {
    return this.inBounds(x, y) ? this.cells[this.index(x, y)] : fallback;
  }

  public set(x: number, y: number, value: T): this {
    this.assertBounds(x, y);
    this.cells[this.index(x, y)] = value;
    return this;
  }

  public trySet(x: number, y: number, value: T): boolean {
    if (!this.inBounds(x, y)) return false;
    this.cells[this.index(x, y)] = value;
    return true;
  }

  public update(x: number, y: number, updater: (value: T, point: Point) => T): this {
    const value = this.get(x, y);
    return this.set(x, y, updater(value, { x, y }));
  }

  public fill(value: T): this {
    this.cells.fill(value);
    return this;
  }

  public fillRect(rect: Rect, value: T): number {
    let changed = 0;
    const x0 = Math.max(0, Math.floor(rect.x));
    const y0 = Math.max(0, Math.floor(rect.y));
    const x1 = Math.min(this.width, Math.ceil(rect.x + rect.width));
    const y1 = Math.min(this.height, Math.ceil(rect.y + rect.height));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        if (this.get(x, y) !== value) changed++;
        this.set(x, y, value);
      }
    }
    return changed;
  }

  public drawBorder(value: T, thickness = 1): number {
    let changed = 0;
    this.forEach((current, x, y) => {
      if (this.isBorder(x, y, thickness) && current !== value) {
        this.set(x, y, value);
        changed++;
      }
    });
    return changed;
  }

  public forEach(visitor: (value: T, x: number, y: number) => void): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) visitor(this.cells[this.index(x, y)], x, y);
    }
  }

  public map<U>(mapper: (value: T, x: number, y: number) => U): Grid<U> {
    return new Grid<U>(this.width, this.height, (x, y) => mapper(this.cells[this.index(x, y)], x, y));
  }

  public clone(cloner: (value: T) => T = (value) => value): Grid<T> {
    return this.map((value) => cloner(value));
  }

  public count(predicate: (value: T, x: number, y: number) => boolean): number {
    let result = 0;
    this.forEach((value, x, y) => { if (predicate(value, x, y)) result++; });
    return result;
  }

  public find(predicate: (value: T, x: number, y: number) => boolean): Point | undefined {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (predicate(this.cells[this.index(x, y)], x, y)) return { x, y };
      }
    }
    return undefined;
  }

  public filter(predicate: (value: T, x: number, y: number) => boolean): Point[] {
    const result: Point[] = [];
    this.forEach((value, x, y) => { if (predicate(value, x, y)) result.push({ x, y }); });
    return result;
  }

  public neighbors4(x: number, y: number): Point[] {
    return CARDINAL_DIRECTIONS
      .map((offset) => ({ x: x + offset.x, y: y + offset.y }))
      .filter((point) => this.inBounds(point.x, point.y));
  }

  public neighbors8(x: number, y: number): Point[] {
    return ALL_DIRECTIONS
      .map((offset) => ({ x: x + offset.x, y: y + offset.y }))
      .filter((point) => this.inBounds(point.x, point.y));
  }

  public neighborhood(x: number, y: number, radius: number, includeCenter = false): Point[] {
    const result: Point[] = [];
    for (let py = y - radius; py <= y + radius; py++) {
      for (let px = x - radius; px <= x + radius; px++) {
        if (this.inBounds(px, py) && (includeCenter || px !== x || py !== y)) result.push({ x: px, y: py });
      }
    }
    return result;
  }

  public floodFill(start: Point, predicate: (value: T, point: Point) => boolean): Point[] {
    if (!this.inBounds(start.x, start.y) || !predicate(this.get(start.x, start.y), start)) return [];
    const queue: Point[] = [start];
    const visited = new Set<string>([pointKey(start)]);
    const result: Point[] = [];
    let cursor = 0;
    while (cursor < queue.length) {
      const point = queue[cursor++];
      result.push(point);
      for (const next of this.neighbors4(point.x, point.y)) {
        const key = pointKey(next);
        if (!visited.has(key) && predicate(this.get(next.x, next.y), next)) {
          visited.add(key);
          queue.push(next);
        }
      }
    }
    return result;
  }

  public regions(predicate: (value: T, point: Point) => boolean): Region[] {
    const unseen = new Set(this.filter((value, x, y) => predicate(value, { x, y })).map(pointKey));
    const result: Region[] = [];
    while (unseen.size > 0) {
      const first = unseen.values().next().value as string;
      const [x, y] = first.split(',').map(Number);
      const cells = this.floodFill({ x, y }, (value, point) => unseen.has(pointKey(point)) && predicate(value, point));
      for (const cell of cells) unseen.delete(pointKey(cell));
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      let sumX = 0;
      let sumY = 0;
      for (const cell of cells) {
        minX = Math.min(minX, cell.x);
        minY = Math.min(minY, cell.y);
        maxX = Math.max(maxX, cell.x);
        maxY = Math.max(maxY, cell.y);
        sumX += cell.x;
        sumY += cell.y;
      }
      result.push({
        id: result.length,
        cells,
        bounds: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 },
        centroid: { x: Math.round(sumX / cells.length), y: Math.round(sumY / cells.length) },
      });
    }
    return result;
  }

  public convolve(kernel: readonly (readonly number[])[], sample: (value: T) => number): Grid<number> {
    if (kernel.length === 0 || kernel[0].length === 0) throw new RangeError('kernel cannot be empty');
    const offsetY = Math.floor(kernel.length / 2);
    const offsetX = Math.floor(kernel[0].length / 2);
    return new Grid<number>(this.width, this.height, (x, y) => {
      let total = 0;
      for (let ky = 0; ky < kernel.length; ky++) {
        for (let kx = 0; kx < kernel[ky].length; kx++) {
          const px = x + kx - offsetX;
          const py = y + ky - offsetY;
          if (this.inBounds(px, py)) total += sample(this.get(px, py)) * kernel[ky][kx];
        }
      }
      return total;
    });
  }

  public rotateClockwise(): Grid<T> {
    return new Grid<T>(this.height, this.width, (x, y) => this.get(y, this.height - 1 - x));
  }

  public flipHorizontal(): Grid<T> {
    return new Grid<T>(this.width, this.height, (x, y) => this.get(this.width - 1 - x, y));
  }

  public flipVertical(): Grid<T> {
    return new Grid<T>(this.width, this.height, (x, y) => this.get(x, this.height - 1 - y));
  }

  public toRows(): T[][] {
    const rows: T[][] = [];
    for (let y = 0; y < this.height; y++) rows.push(this.cells.slice(y * this.width, (y + 1) * this.width));
    return rows;
  }

  public toFlatArray(): T[] {
    return [...this.cells];
  }

  public equals(other: Grid<T>, comparator: (left: T, right: T) => boolean = (a, b) => a === b): boolean {
    if (this.width !== other.width || this.height !== other.height) return false;
    for (let index = 0; index < this.cells.length; index++) {
      if (!comparator(this.cells[index], other.cells[index])) return false;
    }
    return true;
  }

  public hash(serializer: (value: T) => string = String): string {
    let hash = 2166136261;
    for (const cell of this.cells) {
      const text = serializer(cell);
      for (let index = 0; index < text.length; index++) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  private index(x: number, y: number): number {
    return y * this.width + x;
  }

  private assertBounds(x: number, y: number): void {
    if (!this.inBounds(x, y)) throw new RangeError('grid coordinate outside bounds: ' + x + ',' + y);
  }
}
`);

emit('core/Geometry.ts', String.raw`
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
`);

emit('core/DisjointSet.ts', String.raw`
export class DisjointSet<T> {
  private readonly parents = new Map<T, T>();
  private readonly ranks = new Map<T, number>();
  private readonly sizes = new Map<T, number>();

  public make(value: T): this {
    if (!this.parents.has(value)) {
      this.parents.set(value, value);
      this.ranks.set(value, 0);
      this.sizes.set(value, 1);
    }
    return this;
  }

  public find(value: T): T {
    const parent = this.parents.get(value);
    if (parent === undefined) throw new Error('value is not registered in disjoint set');
    if (parent !== value) {
      const root = this.find(parent);
      this.parents.set(value, root);
      return root;
    }
    return parent;
  }

  public union(left: T, right: T): boolean {
    this.make(left).make(right);
    let leftRoot = this.find(left);
    let rightRoot = this.find(right);
    if (leftRoot === rightRoot) return false;
    const leftRank = this.ranks.get(leftRoot) ?? 0;
    const rightRank = this.ranks.get(rightRoot) ?? 0;
    if (leftRank < rightRank) [leftRoot, rightRoot] = [rightRoot, leftRoot];
    this.parents.set(rightRoot, leftRoot);
    this.sizes.set(leftRoot, (this.sizes.get(leftRoot) ?? 1) + (this.sizes.get(rightRoot) ?? 1));
    this.sizes.delete(rightRoot);
    if (leftRank === rightRank) this.ranks.set(leftRoot, leftRank + 1);
    return true;
  }

  public connected(left: T, right: T): boolean {
    return this.parents.has(left) && this.parents.has(right) && this.find(left) === this.find(right);
  }

  public componentSize(value: T): number {
    return this.sizes.get(this.find(value)) ?? 0;
  }

  public components(): Map<T, T[]> {
    const result = new Map<T, T[]>();
    for (const value of this.parents.keys()) {
      const root = this.find(value);
      const values = result.get(root) ?? [];
      values.push(value);
      result.set(root, values);
    }
    return result;
  }

  public get size(): number {
    return this.parents.size;
  }

  public get componentCount(): number {
    return this.components().size;
  }
}
`);

emit('core/Noise.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';

export interface NoiseOptions {
  octaves: number;
  frequency: number;
  amplitude: number;
  lacunarity: number;
  persistence: number;
}

export class NoiseField {
  private readonly permutation: number[];

  public constructor(seed: string | number) {
    const random = new DeterministicRandom(seed);
    const source = Array.from({ length: 256 }, (_, index) => index);
    this.permutation = [...random.shuffle(source), ...random.shuffle(source)];
  }

  public value(x: number, y: number): number {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = this.fade(x - x0);
    const ty = this.fade(y - y0);
    const a = this.hashValue(x0, y0);
    const b = this.hashValue(x0 + 1, y0);
    const c = this.hashValue(x0, y0 + 1);
    const d = this.hashValue(x0 + 1, y0 + 1);
    return this.lerp(this.lerp(a, b, tx), this.lerp(c, d, tx), ty);
  }

  public perlin(x: number, y: number): number {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = x - x0;
    const ty = y - y0;
    const u = this.fade(tx);
    const v = this.fade(ty);
    const aa = this.gradient(this.hash(x0, y0), tx, ty);
    const ba = this.gradient(this.hash(x0 + 1, y0), tx - 1, ty);
    const ab = this.gradient(this.hash(x0, y0 + 1), tx, ty - 1);
    const bb = this.gradient(this.hash(x0 + 1, y0 + 1), tx - 1, ty - 1);
    return this.lerp(this.lerp(aa, ba, u), this.lerp(ab, bb, u), v) * 0.5 + 0.5;
  }

  public fractal(x: number, y: number, options: Partial<NoiseOptions> = {}): number {
    const settings: NoiseOptions = {
      octaves: options.octaves ?? 4,
      frequency: options.frequency ?? 0.04,
      amplitude: options.amplitude ?? 1,
      lacunarity: options.lacunarity ?? 2,
      persistence: options.persistence ?? 0.5,
    };
    let frequency = settings.frequency;
    let amplitude = settings.amplitude;
    let total = 0;
    let normalizer = 0;
    for (let octave = 0; octave < settings.octaves; octave++) {
      total += this.perlin(x * frequency, y * frequency) * amplitude;
      normalizer += amplitude;
      frequency *= settings.lacunarity;
      amplitude *= settings.persistence;
    }
    return normalizer === 0 ? 0 : total / normalizer;
  }

  public ridged(x: number, y: number, options: Partial<NoiseOptions> = {}): number {
    const base = this.fractal(x, y, options);
    return 1 - Math.abs(base * 2 - 1);
  }

  public billow(x: number, y: number, options: Partial<NoiseOptions> = {}): number {
    const base = this.fractal(x, y, options);
    return Math.abs(base * 2 - 1);
  }

  public domainWarp(x: number, y: number, strength = 8, frequency = 0.03): number {
    const offsetX = this.fractal(x + 31.7, y - 18.2, { frequency });
    const offsetY = this.fractal(x - 12.9, y + 47.1, { frequency });
    return this.fractal(x + (offsetX - 0.5) * strength, y + (offsetY - 0.5) * strength, { frequency });
  }

  public turbulence(x: number, y: number, octaves = 5): number {
    let value = 0;
    let size = 1;
    let weight = 1;
    let totalWeight = 0;
    for (let octave = 0; octave < octaves; octave++) {
      value += Math.abs(this.perlin(x / size, y / size) * 2 - 1) * weight;
      totalWeight += weight;
      size *= 0.5;
      weight *= 0.5;
    }
    return value / totalWeight;
  }

  public curl(x: number, y: number, epsilon = 0.01): { x: number; y: number } {
    const dy = (this.perlin(x, y + epsilon) - this.perlin(x, y - epsilon)) / (epsilon * 2);
    const dx = (this.perlin(x + epsilon, y) - this.perlin(x - epsilon, y)) / (epsilon * 2);
    return { x: dy, y: -dx };
  }

  private hash(x: number, y: number): number {
    return this.permutation[(this.permutation[x & 255] + y) & 255];
  }

  private hashValue(x: number, y: number): number {
    return this.hash(x, y) / 255;
  }

  private gradient(hash: number, x: number, y: number): number {
    switch (hash & 7) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      case 3: return -x - y;
      case 4: return x;
      case 5: return -x;
      case 6: return y;
      default: return -y;
    }
  }

  private fade(value: number): number {
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  private lerp(left: number, right: number, amount: number): number {
    return left + (right - left) * amount;
  }
}
`);

emit('core/GenerationSupport.ts', String.raw`
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
`);

emit('carving/CorridorCarver.ts', String.raw`
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
`);

emit('analysis/Pathfinder.ts', String.raw`
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
`);

emit('analysis/TopologyAnalyzer.ts', String.raw`
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
`);

emit('analysis/MapValidator.ts', String.raw`
import { Grid } from '../core/Grid';
import { GeneratedMap, TileKind, ValidationIssue, ValidationReport } from '../core/types';
import { tileIsPassable } from '../core/GenerationSupport';
import { Pathfinder } from './Pathfinder';
import { TopologyAnalyzer } from './TopologyAnalyzer';

export class MapValidator {
  private readonly pathfinder = new Pathfinder();
  private readonly analyzer = new TopologyAnalyzer();

  public validate(map: GeneratedMap): ValidationReport {
    const issues: ValidationIssue[] = [];
    if (map.tiles.length !== map.height || map.tiles.some((row) => row.length !== map.width)) {
      issues.push({ code: 'invalid-dimensions', severity: 'error', message: 'Tile matrix dimensions do not match map metadata.' });
      return { valid: false, issues, metrics: map.metrics };
    }
    const grid = Grid.fromRows(map.tiles);
    this.checkBorder(grid, issues);
    this.checkPoint(grid, map.spawn, TileKind.Spawn, 'spawn', issues);
    this.checkPoint(grid, map.exit, TileKind.Exit, 'exit', issues);
    const path = this.pathfinder.breadthFirst(grid, map.spawn, map.exit, tileIsPassable);
    if (path.length === 0) issues.push({ code: 'unreachable-exit', severity: 'error', message: 'Exit cannot be reached from spawn.' });
    const metrics = this.analyzer.analyze(map);
    if (metrics.openness < 0.12) issues.push({ code: 'too-dense', severity: 'warning', message: 'The map has very little traversable area.' });
    if (metrics.openness > 0.8) issues.push({ code: 'too-open', severity: 'warning', message: 'The map is excessively open.' });
    if (metrics.mainPathLength < Math.min(map.width, map.height)) {
      issues.push({ code: 'short-main-path', severity: 'warning', message: 'The main path is shorter than the target traversal length.' });
    }
    if (metrics.componentCount > 1) issues.push({ code: 'disconnected-regions', severity: 'warning', message: 'Optional floor regions are disconnected.' });
    this.checkPlacements(grid, map, issues);
    return { valid: !issues.some((issue) => issue.severity === 'error'), issues, metrics };
  }

  private checkBorder(grid: Grid<number>, issues: ValidationIssue[]): void {
    grid.forEach((tile, x, y) => {
      if (grid.isBorder(x, y) && tile !== TileKind.Wall) {
        issues.push({ code: 'open-border', severity: 'error', message: 'The map border must be sealed.', position: { x, y } });
      }
    });
  }

  private checkPoint(grid: Grid<number>, point: { x: number; y: number }, expected: TileKind, label: string, issues: ValidationIssue[]): void {
    if (!grid.inBounds(point.x, point.y)) {
      issues.push({ code: label + '-outside-map', severity: 'error', message: label + ' is outside map bounds.', position: point });
    } else if (grid.get(point.x, point.y) !== expected) {
      issues.push({ code: label + '-tile-mismatch', severity: 'error', message: label + ' metadata does not match its tile.', position: point });
    }
  }

  private checkPlacements(grid: Grid<number>, map: GeneratedMap, issues: ValidationIssue[]): void {
    const occupied = new Set<string>();
    const placements = [
      ...map.enemies.map((entry) => ({ id: entry.id, position: entry.position })),
      ...map.items.map((entry) => ({ id: entry.id, position: entry.position })),
    ];
    for (const placement of placements) {
      const key = placement.position.x + ',' + placement.position.y;
      if (!grid.inBounds(placement.position.x, placement.position.y) || !tileIsPassable(grid.get(placement.position.x, placement.position.y))) {
        issues.push({ code: 'placement-on-solid', severity: 'error', message: placement.id + ' is placed on a solid tile.', position: placement.position });
      }
      if (occupied.has(key)) issues.push({ code: 'placement-overlap', severity: 'warning', message: 'Multiple content entries occupy ' + key + '.', position: placement.position });
      occupied.add(key);
    }
  }
}
`);

emit('analysis/MapRepairer.ts', String.raw`
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
`);

emit('algorithms/BspDungeonGenerator.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { CorridorCarver } from '../carving/CorridorCarver';
import { AbstractGenerator, MutableLayout, carveRoom, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { rectsIntersect } from '../core/Geometry';
import { GeneratorContext, GeneratorOptions, Rect, Room, TileKind } from '../core/types';

interface PartitionNode extends Rect {
  depth: number;
  left?: PartitionNode;
  right?: PartitionNode;
  room?: Room;
}

export class BspDungeonGenerator extends AbstractGenerator {
  public readonly algorithm = 'bsp' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const root: PartitionNode = { x: 1, y: 1, width: options.width - 2, height: options.height - 2, depth: 0 };
    const leaves: PartitionNode[] = [];
    this.split(root, options, random, leaves);
    this.step(context, 'layout', 'partition-space', 'Split the map into ' + leaves.length + ' BSP leaves.', leaves.length);
    let roomSerial = 0;
    for (const leaf of leaves) {
      const maximumWidth = Math.max(3, Math.min(options.roomMaxSize, leaf.width - 2));
      const maximumHeight = Math.max(3, Math.min(options.roomMaxSize, leaf.height - 2));
      const minimumWidth = Math.min(options.roomMinSize, maximumWidth);
      const minimumHeight = Math.min(options.roomMinSize, maximumHeight);
      const width = random.integer(minimumWidth, maximumWidth);
      const height = random.integer(minimumHeight, maximumHeight);
      const x = leaf.x + random.integer(1, Math.max(1, leaf.width - width - 1));
      const y = leaf.y + random.integer(1, Math.max(1, leaf.height - height - 1));
      leaf.room = makeRoom('bsp-room-' + roomSerial++, x, y, width, height);
      layout.rooms.push(leaf.room);
      carveRoom(layout.grid, leaf.room);
    }
    this.step(context, 'layout', 'carve-rooms', 'Carved one room inside every terminal partition.', layout.rooms.reduce((sum, room) => sum + room.area, 0));
    const carver = new CorridorCarver();
    this.connectTree(root, layout, carver, random, options);
    this.addLoops(layout, carver, random, options);
    this.classifyRooms(layout.rooms);
    layout.spawn = layout.rooms[0]?.center;
    layout.exit = layout.rooms[layout.rooms.length - 1]?.center;
    layout.metadata.partitionCount = leaves.length;
    layout.metadata.treeDepth = Math.max(...leaves.map((leaf) => leaf.depth), 0);
    return layout;
  }

  private split(node: PartitionNode, options: GeneratorOptions, random: DeterministicRandom, leaves: PartitionNode[]): void {
    const minimumSpan = options.roomMinSize + 4;
    const canSplitHorizontal = node.height >= minimumSpan * 2;
    const canSplitVertical = node.width >= minimumSpan * 2;
    if ((!canSplitHorizontal && !canSplitVertical) || node.depth >= 7) {
      leaves.push(node);
      return;
    }
    const horizontal = canSplitHorizontal && (!canSplitVertical || node.height / node.width > 1.2 || random.boolean(0.5));
    if (horizontal) {
      const split = random.integer(minimumSpan, node.height - minimumSpan);
      node.left = { x: node.x, y: node.y, width: node.width, height: split, depth: node.depth + 1 };
      node.right = { x: node.x, y: node.y + split, width: node.width, height: node.height - split, depth: node.depth + 1 };
    } else {
      const split = random.integer(minimumSpan, node.width - minimumSpan);
      node.left = { x: node.x, y: node.y, width: split, height: node.height, depth: node.depth + 1 };
      node.right = { x: node.x + split, y: node.y, width: node.width - split, height: node.height, depth: node.depth + 1 };
    }
    this.split(node.left, options, random, leaves);
    this.split(node.right, options, random, leaves);
  }

  private connectTree(node: PartitionNode, layout: MutableLayout, carver: CorridorCarver, random: DeterministicRandom, options: GeneratorOptions): Room | undefined {
    if (node.room) return node.room;
    const leftRoom = node.left ? this.connectTree(node.left, layout, carver, random, options) : undefined;
    const rightRoom = node.right ? this.connectTree(node.right, layout, carver, random, options) : undefined;
    if (leftRoom && rightRoom) {
      layout.corridors.push(carver.carve(layout.grid, leftRoom.center, rightRoom.center, options.corridorWidth,
        random.boolean() ? 'horizontal-first' : 'vertical-first', random, leftRoom.id, rightRoom.id));
      return random.boolean() ? leftRoom : rightRoom;
    }
    return leftRoom ?? rightRoom;
  }

  private addLoops(layout: MutableLayout, carver: CorridorCarver, random: DeterministicRandom, options: GeneratorOptions): void {
    for (let index = 0; index < layout.rooms.length; index++) {
      if (!random.boolean(options.loopChance)) continue;
      const source = layout.rooms[index];
      const candidates = layout.rooms
        .filter((room) => room.id !== source.id && !rectsIntersect(source, room, 1))
        .sort((a, b) => Math.hypot(a.center.x - source.center.x, a.center.y - source.center.y) - Math.hypot(b.center.x - source.center.x, b.center.y - source.center.y));
      const target = candidates[0];
      if (target) layout.corridors.push(carver.carve(layout.grid, source.center, target.center, options.corridorWidth, 'straight', random, source.id, target.id));
    }
  }

  private classifyRooms(rooms: Room[]): void {
    if (rooms.length === 0) return;
    rooms[0].kind = 'start';
    rooms[rooms.length - 1].kind = 'exit';
    const largest = [...rooms].sort((a, b) => b.area - a.area)[0];
    if (largest.kind === 'combat') largest.kind = 'boss';
    for (let index = 1; index < rooms.length - 1; index++) {
      if (index % 5 === 0) rooms[index].kind = 'treasure';
      rooms[index].tags.push(rooms[index].width > rooms[index].height ? 'wide' : 'tall');
    }
  }
}
`);

emit('algorithms/DrunkardWalkGenerator.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { AbstractGenerator, MutableLayout, carvePoints, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { CARDINAL_DIRECTIONS, GeneratorContext, GeneratorOptions, Point, TileKind } from '../core/types';

interface Walker {
  position: Point;
  direction: Point;
  age: number;
  carved: number;
}

export class DrunkardWalkGenerator extends AbstractGenerator {
  public readonly algorithm = 'drunkard-walk' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const start = { x: Math.floor(options.width / 2), y: Math.floor(options.height / 2) };
    const target = Math.floor((options.width - 2) * (options.height - 2) * options.floorTarget);
    const walkers: Walker[] = [{ position: start, direction: { x: 1, y: 0 }, age: 0, carved: 0 }];
    let floors = 0;
    let iterations = 0;
    const maximumIterations = target * 40;
    while (floors < target && iterations++ < maximumIterations) {
      const walker = walkers[iterations % walkers.length];
      floors += this.carveBrush(layout, walker.position, random.boolean(0.08) ? 2 : 1);
      walker.carved++;
      walker.age++;
      if (random.boolean(0.28)) walker.direction = random.pick(CARDINAL_DIRECTIONS) as Point;
      if (random.boolean(0.04) && walkers.length < 8) walkers.push({ position: { ...walker.position }, direction: random.pick(CARDINAL_DIRECTIONS) as Point, age: 0, carved: 0 });
      if (random.boolean(0.015) && walkers.length > 1) walkers.splice(random.integer(0, walkers.length - 1), 1);
      const next = { x: walker.position.x + walker.direction.x, y: walker.position.y + walker.direction.y };
      if (next.x <= 1 || next.y <= 1 || next.x >= options.width - 2 || next.y >= options.height - 2) {
        walker.direction = { x: -walker.direction.x, y: -walker.direction.y };
      } else {
        walker.position = next;
      }
      if (walker.age > 80 && random.boolean(0.08)) {
        walker.position = { ...start };
        walker.age = 0;
      }
    }
    this.step(context, 'layout', 'random-walkers', 'Carved organic tunnels with splitting biased walkers.', floors);
    this.identifyChambers(layout);
    layout.spawn = start;
    layout.exit = this.pickDistantEndpoints(layout.grid).exit;
    layout.metadata.walkerCount = walkers.length;
    layout.metadata.iterations = iterations;
    layout.metadata.floorTargetReached = floors >= target;
    return layout;
  }

  private carveBrush(layout: MutableLayout, center: Point, radius: number): number {
    const points: Point[] = [];
    for (let y = center.y - radius; y <= center.y + radius; y++) {
      for (let x = center.x - radius; x <= center.x + radius; x++) {
        if (Math.abs(x - center.x) + Math.abs(y - center.y) <= radius + 1) points.push({ x, y });
      }
    }
    return carvePoints(layout.grid, points, TileKind.Floor);
  }

  private identifyChambers(layout: MutableLayout): void {
    let serial = 0;
    for (let y = 2; y < layout.grid.height - 2; y++) {
      for (let x = 2; x < layout.grid.width - 2; x++) {
        const floorNeighbors = layout.grid.neighborhood(x, y, 2, true).filter((point) => layout.grid.get(point.x, point.y) === TileKind.Floor).length;
        if (floorNeighbors >= 20 && !layout.rooms.some((room) => x >= room.x - 2 && x <= room.x + room.width + 2 && y >= room.y - 2 && y <= room.y + room.height + 2)) {
          const room = makeRoom('walker-chamber-' + serial++, x - 2, y - 2, 5, 5);
          room.tags.push('organic');
          layout.rooms.push(room);
        }
      }
    }
  }
}
`);

emit('algorithms/CellularAutomataGenerator.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { AbstractGenerator, MutableLayout, emptyLayout, tileIsPassable } from '../core/GenerationSupport';
import { GeneratorContext, GeneratorOptions, MapGenerator, TileKind } from '../core/types';

export class CellularAutomataGenerator extends AbstractGenerator {
  public readonly algorithm = 'cellular-automata' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    layout.grid.forEach((_tile, x, y) => {
      if (!layout.grid.isBorder(x, y)) layout.grid.set(x, y, random.boolean(0.46) ? TileKind.Wall : TileKind.Floor);
    });
    this.step(context, 'initialization', 'random-fill', 'Seeded cave cells with independent wall probability.', options.width * options.height);
    for (let pass = 0; pass < options.smoothingPasses; pass++) {
      const before = layout.grid.clone();
      let changed = 0;
      layout.grid.forEach((tile, x, y) => {
        if (layout.grid.isBorder(x, y)) return;
        const walls = before.neighborhood(x, y, 1).filter((point) => before.get(point.x, point.y) === TileKind.Wall).length;
        const distantWalls = before.neighborhood(x, y, 2).filter((point) => before.get(point.x, point.y) === TileKind.Wall).length;
        const next = walls >= 5 || distantWalls <= 2 ? TileKind.Wall : TileKind.Floor;
        if (next !== tile) { layout.grid.set(x, y, next); changed++; }
      });
      this.step(context, 'layout', 'smooth-' + pass, 'Applied cellular birth and survival rules.', changed);
    }
    this.keepLargestCave(layout);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
    layout.metadata.initialWallChance = 0.46;
    layout.metadata.smoothingPasses = options.smoothingPasses;
    return layout;
  }

  private keepLargestCave(layout: MutableLayout): void {
    const regions = layout.grid.regions((tile) => tileIsPassable(tile)).sort((a, b) => b.cells.length - a.cells.length);
    for (let index = 1; index < regions.length; index++) {
      for (const point of regions[index].cells) layout.grid.set(point.x, point.y, TileKind.Wall);
    }
    if (regions.length === 0) {
      layout.grid.fillRect({ x: 2, y: 2, width: layout.grid.width - 4, height: layout.grid.height - 4 }, TileKind.Floor);
    }
    layout.metadata.removedCaveRegions = Math.max(0, regions.length - 1);
  }
}
`);

emit('algorithms/MazeGenerators.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { DisjointSet } from '../core/DisjointSet';
import { AbstractGenerator, MutableLayout, emptyLayout } from '../core/GenerationSupport';
import { CARDINAL_DIRECTIONS, GeneratorContext, GeneratorOptions, Point, TileKind } from '../core/types';

interface MazeCell extends Point {
  id: number;
}

interface MazeEdge {
  from: MazeCell;
  to: MazeCell;
  wall: Point;
  weight: number;
}

abstract class MazeGeneratorBase extends AbstractGenerator {
  protected cells(options: GeneratorOptions): MazeCell[] {
    const result: MazeCell[] = [];
    let id = 0;
    for (let y = 1; y < options.height - 1; y += 2) {
      for (let x = 1; x < options.width - 1; x += 2) result.push({ x, y, id: id++ });
    }
    return result;
  }

  protected edges(cells: readonly MazeCell[], random: DeterministicRandom): MazeEdge[] {
    const lookup = new Map(cells.map((cell) => [cell.x + ',' + cell.y, cell]));
    const result: MazeEdge[] = [];
    for (const cell of cells) {
      for (const offset of [{ x: 2, y: 0 }, { x: 0, y: 2 }]) {
        const target = lookup.get(cell.x + offset.x + ',' + (cell.y + offset.y));
        if (target) result.push({ from: cell, to: target, wall: { x: cell.x + offset.x / 2, y: cell.y + offset.y / 2 }, weight: random.next() });
      }
    }
    return result;
  }

  protected open(layout: MutableLayout, point: Point): void {
    if (layout.grid.inBounds(point.x, point.y)) layout.grid.set(point.x, point.y, TileKind.Floor);
  }

  protected finish(layout: MutableLayout, cells: readonly MazeCell[], options: GeneratorOptions, random: DeterministicRandom): void {
    for (const cell of cells) this.open(layout, cell);
    const extraWalls = layout.grid.filter((tile, x, y) => tile === TileKind.Wall && !layout.grid.isBorder(x, y) &&
      layout.grid.neighbors4(x, y).filter((point) => layout.grid.get(point.x, point.y) === TileKind.Floor).length === 2);
    for (const wall of extraWalls) if (random.boolean(options.loopChance)) this.open(layout, wall);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
  }
}

export class DepthFirstMazeGenerator extends MazeGeneratorBase {
  public readonly algorithm = 'depth-first-maze' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const cells = this.cells(options);
    const lookup = new Map(cells.map((cell) => [cell.x + ',' + cell.y, cell]));
    const start = random.pick(cells);
    const stack: MazeCell[] = [start];
    const visited = new Set<number>([start.id]);
    this.open(layout, start);
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const candidates = random.shuffle(CARDINAL_DIRECTIONS)
        .map((offset) => lookup.get(current.x + offset.x * 2 + ',' + (current.y + offset.y * 2)))
        .filter((cell): cell is MazeCell => cell !== undefined && !visited.has(cell.id));
      if (candidates.length === 0) { stack.pop(); continue; }
      const next = candidates[0];
      this.open(layout, { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 });
      this.open(layout, next);
      visited.add(next.id);
      stack.push(next);
    }
    this.finish(layout, cells, options, random);
    this.step(context, 'layout', 'recursive-backtracker', 'Built a deep-corridor maze using randomized depth-first traversal.', visited.size * 2);
    layout.metadata.visitedCells = visited.size;
    return layout;
  }
}

export class PrimMazeGenerator extends MazeGeneratorBase {
  public readonly algorithm = 'prim-maze' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const cells = this.cells(options);
    const edges = this.edges(cells, random);
    const adjacency = new Map<number, MazeEdge[]>();
    for (const edge of edges) {
      adjacency.set(edge.from.id, [...(adjacency.get(edge.from.id) ?? []), edge]);
      adjacency.set(edge.to.id, [...(adjacency.get(edge.to.id) ?? []), { ...edge, from: edge.to, to: edge.from }]);
    }
    const start = random.pick(cells);
    const visited = new Set<number>([start.id]);
    const frontier = [...(adjacency.get(start.id) ?? [])];
    this.open(layout, start);
    while (frontier.length > 0) {
      const index = random.integer(0, frontier.length - 1);
      const edge = frontier.splice(index, 1)[0];
      if (visited.has(edge.to.id)) continue;
      visited.add(edge.to.id);
      this.open(layout, edge.wall);
      this.open(layout, edge.to);
      frontier.push(...(adjacency.get(edge.to.id) ?? []).filter((candidate) => !visited.has(candidate.to.id)));
    }
    this.finish(layout, cells, options, random);
    this.step(context, 'layout', 'randomized-prim', 'Expanded a randomized frontier to form short branching passages.', visited.size * 2);
    layout.metadata.frontierAlgorithm = true;
    return layout;
  }
}

export class KruskalMazeGenerator extends MazeGeneratorBase {
  public readonly algorithm = 'kruskal-maze' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const cells = this.cells(options);
    const edges = this.edges(cells, random).sort((a, b) => a.weight - b.weight);
    const sets = new DisjointSet<number>();
    for (const cell of cells) { sets.make(cell.id); this.open(layout, cell); }
    let accepted = 0;
    for (const edge of edges) {
      if (sets.union(edge.from.id, edge.to.id)) { this.open(layout, edge.wall); accepted++; }
    }
    this.finish(layout, cells, options, random);
    this.step(context, 'layout', 'randomized-kruskal', 'Joined disjoint maze sets in shuffled edge order.', accepted);
    layout.metadata.acceptedEdges = accepted;
    return layout;
  }
}

export class EllerMazeGenerator extends MazeGeneratorBase {
  public readonly algorithm = 'eller-maze' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const columns = Math.ceil((options.width - 2) / 2);
    const rows = Math.ceil((options.height - 2) / 2);
    let nextSet = 1;
    let sets = new Array<number>(columns).fill(0);
    for (let row = 0; row < rows; row++) {
      const y = 1 + row * 2;
      for (let column = 0; column < columns; column++) {
        if (sets[column] === 0) sets[column] = nextSet++;
        this.open(layout, { x: 1 + column * 2, y });
      }
      const lastRow = row === rows - 1;
      for (let column = 0; column < columns - 1; column++) {
        const shouldJoin = sets[column] !== sets[column + 1] && (lastRow || random.boolean(0.52));
        if (!shouldJoin) continue;
        const replaced = sets[column + 1];
        const kept = sets[column];
        for (let index = 0; index < sets.length; index++) if (sets[index] === replaced) sets[index] = kept;
        this.open(layout, { x: 2 + column * 2, y });
      }
      if (lastRow) break;
      const next = new Array<number>(columns).fill(0);
      for (const setId of new Set(sets)) {
        const members = sets.map((value, index) => value === setId ? index : -1).filter((index) => index >= 0);
        const downward = random.shuffle(members).slice(0, random.integer(1, members.length));
        for (const column of downward) {
          this.open(layout, { x: 1 + column * 2, y: y + 1 });
          next[column] = setId;
        }
      }
      sets = next;
    }
    this.finish(layout, this.cells(options), options, random);
    this.step(context, 'layout', 'eller-row-sets', 'Generated a perfect maze one row at a time with bounded memory.', rows * columns);
    layout.metadata.rowCount = rows;
    layout.metadata.setCount = nextSet - 1;
    return layout;
  }
}
`);

emit('algorithms/RoomGraphGenerator.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { CorridorCarver } from '../carving/CorridorCarver';
import { DisjointSet } from '../core/DisjointSet';
import { AbstractGenerator, MutableLayout, carveRoom, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { euclidean, rectsIntersect } from '../core/Geometry';
import { GeneratorContext, GeneratorOptions, GraphEdge, Room } from '../core/types';

export class RoomGraphGenerator extends AbstractGenerator {
  public readonly algorithm = 'room-graph' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const desiredRooms = Math.max(5, Math.floor(options.width * options.height / 95));
    this.placeRooms(layout, options, random, desiredRooms);
    this.step(context, 'layout', 'scatter-rooms', 'Placed non-overlapping room candidates with rejection sampling.', layout.rooms.length);
    const graph = this.buildProximityGraph(layout.rooms);
    const selected = this.minimumSpanningTree(layout.rooms, graph);
    for (const edge of graph) {
      if (!selected.includes(edge) && random.boolean(options.loopChance)) selected.push(edge);
    }
    const carver = new CorridorCarver();
    for (const edge of selected) {
      const from = layout.rooms[edge.from];
      const to = layout.rooms[edge.to];
      const style = random.weighted([
        { value: 'straight' as const, weight: 2 },
        { value: 'horizontal-first' as const, weight: 3 },
        { value: 'vertical-first' as const, weight: 3 },
        { value: 'zigzag' as const, weight: 1 },
      ]);
      layout.corridors.push(carver.carve(layout.grid, from.center, to.center, options.corridorWidth, style, random, from.id, to.id));
    }
    this.step(context, 'connectivity', 'minimum-spanning-tree', 'Connected rooms with an MST and optional cycle edges.', selected.length);
    this.classify(layout.rooms, selected);
    const endpoints = this.graphDiameter(layout.rooms, selected);
    layout.spawn = layout.rooms[endpoints[0]]?.center;
    layout.exit = layout.rooms[endpoints[1]]?.center;
    layout.metadata.proximityEdges = graph.length;
    layout.metadata.selectedEdges = selected.length;
    layout.metadata.roomPlacementTarget = desiredRooms;
    return layout;
  }

  private placeRooms(layout: MutableLayout, options: GeneratorOptions, random: DeterministicRandom, target: number): void {
    for (let attempt = 0; attempt < target * 35 && layout.rooms.length < target; attempt++) {
      const width = random.integer(options.roomMinSize, Math.min(options.roomMaxSize, options.width - 4));
      const height = random.integer(options.roomMinSize, Math.min(options.roomMaxSize, options.height - 4));
      const x = random.integer(2, Math.max(2, options.width - width - 2));
      const y = random.integer(2, Math.max(2, options.height - height - 2));
      const room = makeRoom('graph-room-' + layout.rooms.length, x, y, width, height);
      if (layout.rooms.some((existing) => rectsIntersect(existing, room, 2))) continue;
      layout.rooms.push(room);
      carveRoom(layout.grid, room);
    }
    if (layout.rooms.length < 2) {
      const left = makeRoom('graph-room-0', 2, 2, 5, 5);
      const right = makeRoom('graph-room-1', options.width - 8, options.height - 8, 5, 5);
      layout.rooms.push(left, right);
      carveRoom(layout.grid, left);
      carveRoom(layout.grid, right);
    }
  }

  private buildProximityGraph(rooms: readonly Room[]): GraphEdge[] {
    const result = new Map<string, GraphEdge>();
    for (let from = 0; from < rooms.length; from++) {
      const nearest = rooms
        .map((room, to) => ({ from, to, weight: euclidean(rooms[from].center, room.center) }))
        .filter((edge) => edge.to !== from)
        .sort((a, b) => a.weight - b.weight)
        .slice(0, Math.min(4, rooms.length - 1));
      for (const edge of nearest) {
        const key = Math.min(edge.from, edge.to) + ':' + Math.max(edge.from, edge.to);
        result.set(key, { from: Math.min(edge.from, edge.to), to: Math.max(edge.from, edge.to), weight: edge.weight });
      }
    }
    return [...result.values()];
  }

  private minimumSpanningTree(rooms: readonly Room[], edges: readonly GraphEdge[]): GraphEdge[] {
    const sets = new DisjointSet<number>();
    for (let index = 0; index < rooms.length; index++) sets.make(index);
    const result: GraphEdge[] = [];
    for (const edge of [...edges].sort((a, b) => a.weight - b.weight)) {
      if (sets.union(edge.from, edge.to)) result.push(edge);
    }
    return result;
  }

  private classify(rooms: Room[], edges: readonly GraphEdge[]): void {
    const degrees = new Array<number>(rooms.length).fill(0);
    for (const edge of edges) { degrees[edge.from]++; degrees[edge.to]++; }
    rooms.forEach((room, index) => {
      room.tags.push('degree-' + degrees[index]);
      if (degrees[index] === 1) room.kind = 'treasure';
      if (degrees[index] >= 4) room.kind = 'connector';
    });
  }

  private graphDiameter(rooms: readonly Room[], edges: readonly GraphEdge[]): [number, number] {
    if (rooms.length < 2) return [0, 0];
    const adjacency = new Map<number, number[]>();
    for (let index = 0; index < rooms.length; index++) adjacency.set(index, []);
    for (const edge of edges) {
      adjacency.get(edge.from)!.push(edge.to);
      adjacency.get(edge.to)!.push(edge.from);
    }
    const farthest = (start: number): number => {
      const queue = [start];
      const distances = new Map<number, number>([[start, 0]]);
      let result = start;
      for (let cursor = 0; cursor < queue.length; cursor++) {
        const current = queue[cursor];
        if (distances.get(current)! > distances.get(result)!) result = current;
        for (const next of adjacency.get(current) ?? []) {
          if (!distances.has(next)) { distances.set(next, distances.get(current)! + 1); queue.push(next); }
        }
      }
      return result;
    };
    const first = farthest(0);
    return [first, farthest(first)];
  }
}
`);

emit('algorithms/WaveFunctionCollapseGenerator.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { AbstractGenerator, MutableLayout, emptyLayout } from '../core/GenerationSupport';
import { GeneratorContext, GeneratorOptions, Point, TileKind } from '../core/types';

type Socket = 'open' | 'closed';
type Side = 'north' | 'east' | 'south' | 'west';

interface Pattern {
  id: string;
  weight: number;
  sockets: Record<Side, Socket>;
  open: Point[];
}

const PATTERNS: readonly Pattern[] = [
  { id: 'empty', weight: 0.3, sockets: { north: 'closed', east: 'closed', south: 'closed', west: 'closed' }, open: [] },
  { id: 'horizontal', weight: 4, sockets: { north: 'closed', east: 'open', south: 'closed', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { id: 'vertical', weight: 4, sockets: { north: 'open', east: 'closed', south: 'open', west: 'closed' }, open: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
  { id: 'corner-ne', weight: 2, sockets: { north: 'open', east: 'open', south: 'closed', west: 'closed' }, open: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { id: 'corner-es', weight: 2, sockets: { north: 'closed', east: 'open', south: 'open', west: 'closed' }, open: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }] },
  { id: 'corner-sw', weight: 2, sockets: { north: 'closed', east: 'closed', south: 'open', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
  { id: 'corner-wn', weight: 2, sockets: { north: 'open', east: 'closed', south: 'closed', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }] },
  { id: 'tee-n', weight: 1.5, sockets: { north: 'open', east: 'open', south: 'closed', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { id: 'tee-e', weight: 1.5, sockets: { north: 'open', east: 'open', south: 'open', west: 'closed' }, open: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }] },
  { id: 'tee-s', weight: 1.5, sockets: { north: 'closed', east: 'open', south: 'open', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }] },
  { id: 'tee-w', weight: 1.5, sockets: { north: 'open', east: 'closed', south: 'open', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
  { id: 'cross', weight: 0.8, sockets: { north: 'open', east: 'open', south: 'open', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }] },
  { id: 'room', weight: 1, sockets: { north: 'open', east: 'open', south: 'open', west: 'open' }, open: Array.from({ length: 9 }, (_, index) => ({ x: index % 3, y: Math.floor(index / 3) })) },
];

const OFFSETS: Record<Side, Point> = { north: { x: 0, y: -1 }, east: { x: 1, y: 0 }, south: { x: 0, y: 1 }, west: { x: -1, y: 0 } };
const OPPOSITE: Record<Side, Side> = { north: 'south', east: 'west', south: 'north', west: 'east' };
const SIDES = Object.keys(OFFSETS) as Side[];

export class WaveFunctionCollapseGenerator extends AbstractGenerator {
  public readonly algorithm = 'wave-function-collapse' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const cellWidth = Math.max(3, Math.floor((options.width - 2) / 3));
    const cellHeight = Math.max(3, Math.floor((options.height - 2) / 3));
    const wave = new Grid<Set<number>>(cellWidth, cellHeight, () => new Set(PATTERNS.map((_pattern, index) => index)));
    let contradictions = 0;
    let collapsed = 0;
    let safety = 0;
    const maximumCollapses = cellWidth * cellHeight * 40;
    while (safety++ < maximumCollapses) {
      const target = this.minimumEntropyCell(wave, random);
      if (!target) break;
      const choices = [...wave.get(target.x, target.y)];
      if (choices.length === 0) { contradictions++; this.resetCell(wave, target); continue; }
      const selected = random.weighted(choices.map((index) => ({ value: index, weight: PATTERNS[index].weight })));
      wave.set(target.x, target.y, new Set([selected]));
      collapsed++;
      if (!this.propagate(wave, target)) {
        contradictions++;
        this.relaxNeighborhood(wave, target);
      }
    }
    this.renderWave(layout, wave);
    this.ensureCentralSpine(layout);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
    this.step(context, 'layout', 'constraint-collapse', 'Collapsed socket-compatible modules by minimum entropy.', collapsed);
    layout.metadata.contradictions = contradictions;
    layout.metadata.collapsedCells = collapsed;
    layout.metadata.patternCount = PATTERNS.length;
    layout.metadata.collapseSafetyLimitReached = safety >= maximumCollapses;
    return layout;
  }

  private minimumEntropyCell(wave: Grid<Set<number>>, random: DeterministicRandom): Point | undefined {
    let best = Infinity;
    const candidates: Point[] = [];
    wave.forEach((options, x, y) => {
      if (options.size <= 1) return;
      const entropy = options.size + random.float(0, 0.01);
      if (entropy < best) { best = entropy; candidates.length = 0; candidates.push({ x, y }); }
      else if (Math.floor(entropy) === Math.floor(best)) candidates.push({ x, y });
    });
    return candidates.length === 0 ? undefined : random.pick(candidates);
  }

  private propagate(wave: Grid<Set<number>>, initial: Point): boolean {
    const queue: Point[] = [initial];
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const current = queue[cursor];
      for (const side of SIDES) {
        const offset = OFFSETS[side];
        const next = { x: current.x + offset.x, y: current.y + offset.y };
        if (!wave.inBounds(next.x, next.y)) continue;
        const allowed = new Set<number>();
        for (const candidate of wave.get(next.x, next.y)) {
          if ([...wave.get(current.x, current.y)].some((source) => PATTERNS[source].sockets[side] === PATTERNS[candidate].sockets[OPPOSITE[side]])) allowed.add(candidate);
        }
        if (allowed.size === 0) return false;
        if (allowed.size < wave.get(next.x, next.y).size) { wave.set(next.x, next.y, allowed); queue.push(next); }
      }
    }
    return true;
  }

  private resetCell(wave: Grid<Set<number>>, point: Point): void {
    wave.set(point.x, point.y, new Set(PATTERNS.map((_pattern, index) => index)));
  }

  private relaxNeighborhood(wave: Grid<Set<number>>, point: Point): void {
    this.resetCell(wave, point);
    for (const neighbor of wave.neighbors4(point.x, point.y)) this.resetCell(wave, neighbor);
  }

  private renderWave(layout: MutableLayout, wave: Grid<Set<number>>): void {
    wave.forEach((options, cellX, cellY) => {
      const selected = PATTERNS[[...options][0] ?? 0];
      for (const point of selected.open) {
        const x = 1 + cellX * 3 + point.x;
        const y = 1 + cellY * 3 + point.y;
        if (layout.grid.inBounds(x, y) && !layout.grid.isBorder(x, y)) layout.grid.set(x, y, TileKind.Floor);
      }
    });
  }

  private ensureCentralSpine(layout: MutableLayout): void {
    const y = Math.floor(layout.grid.height / 2);
    for (let x = 1; x < layout.grid.width - 1; x++) layout.grid.set(x, y, TileKind.Floor);
  }
}
`);

emit('algorithms/GrammarDungeonGenerator.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { CorridorCarver } from '../carving/CorridorCarver';
import { AbstractGenerator, MutableLayout, carveRoom, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { CARDINAL_DIRECTIONS, GeneratorContext, GeneratorOptions, Point, Room } from '../core/types';

type SymbolKind = 'start' | 'combat' | 'corridor' | 'treasure' | 'elite' | 'boss' | 'exit';

interface GrammarNode {
  id: string;
  symbol: SymbolKind;
  depth: number;
  parentId?: string;
  children: string[];
  position?: Point;
}

export class GrammarDungeonGenerator extends AbstractGenerator {
  public readonly algorithm = 'grammar' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const nodes = this.expandGrammar(options, random);
    this.step(context, 'layout', 'expand-grammar', 'Expanded encounter symbols into a directed progression graph.', nodes.length);
    this.embed(nodes, options, random);
    const roomByNode = new Map<string, Room>();
    for (const node of nodes) {
      if (!node.position || node.symbol === 'corridor') continue;
      const size = this.roomSize(node.symbol, options, random);
      const room = makeRoom('grammar-room-' + node.id,
        Math.max(1, Math.min(options.width - size.width - 1, node.position.x - Math.floor(size.width / 2))),
        Math.max(1, Math.min(options.height - size.height - 1, node.position.y - Math.floor(size.height / 2))),
        size.width, size.height);
      room.kind = node.symbol === 'elite' ? 'combat' : node.symbol === 'start' || node.symbol === 'treasure' || node.symbol === 'boss' || node.symbol === 'exit' ? node.symbol : 'combat';
      room.tags.push('grammar-' + node.symbol, 'depth-' + node.depth);
      layout.rooms.push(room);
      roomByNode.set(node.id, room);
      carveRoom(layout.grid, room);
    }
    const carver = new CorridorCarver();
    for (const node of nodes) {
      if (!node.parentId) continue;
      const source = roomByNode.get(node.parentId);
      const target = roomByNode.get(node.id);
      if (source && target) layout.corridors.push(carver.carve(layout.grid, source.center, target.center, options.corridorWidth, 'winding', random, source.id, target.id));
    }
    const start = nodes.find((node) => node.symbol === 'start');
    const exit = [...nodes].reverse().find((node) => node.symbol === 'exit' || node.symbol === 'boss');
    layout.spawn = start ? roomByNode.get(start.id)?.center : undefined;
    layout.exit = exit ? roomByNode.get(exit.id)?.center : undefined;
    layout.metadata.grammarNodes = nodes.length;
    layout.metadata.maximumDepth = Math.max(...nodes.map((node) => node.depth));
    return layout;
  }

  private expandGrammar(options: GeneratorOptions, random: DeterministicRandom): GrammarNode[] {
    const nodes: GrammarNode[] = [{ id: 'node-0', symbol: 'start', depth: 0, children: [] }];
    let frontier = nodes[0];
    const mainLength = 4 + options.difficulty;
    for (let index = 1; index <= mainLength; index++) {
      const symbol: SymbolKind = index === mainLength ? 'exit' : index === mainLength - 1 && options.difficulty >= 5 ? 'boss' : random.weighted([
        { value: 'combat' as const, weight: 5 },
        { value: 'elite' as const, weight: options.difficulty },
        { value: 'treasure' as const, weight: 1.5 },
      ]);
      const node: GrammarNode = { id: 'node-' + nodes.length, symbol, depth: index, parentId: frontier.id, children: [] };
      frontier.children.push(node.id);
      nodes.push(node);
      if (index < mainLength - 1 && random.boolean(0.4)) {
        const branch: GrammarNode = { id: 'node-' + nodes.length, symbol: random.boolean() ? 'treasure' : 'combat', depth: index + 1, parentId: node.id, children: [] };
        node.children.push(branch.id);
        nodes.push(branch);
      }
      frontier = node;
    }
    return nodes;
  }

  private embed(nodes: GrammarNode[], options: GeneratorOptions, random: DeterministicRandom): void {
    const lookup = new Map(nodes.map((node) => [node.id, node]));
    const root = nodes[0];
    root.position = { x: Math.floor(options.width / 2), y: Math.floor(options.height / 2) };
    const occupied = new Set<string>([root.position.x + ',' + root.position.y]);
    for (const node of nodes.slice(1)) {
      const parent = node.parentId ? lookup.get(node.parentId) : undefined;
      const origin = parent?.position ?? root.position;
      let position = { ...origin };
      for (let attempt = 0; attempt < 20; attempt++) {
        const direction = random.pick(CARDINAL_DIRECTIONS);
        const distance = random.integer(options.roomMinSize + 3, options.roomMaxSize + 5);
        const candidate = {
          x: Math.max(3, Math.min(options.width - 4, origin.x + direction.x * distance)),
          y: Math.max(3, Math.min(options.height - 4, origin.y + direction.y * distance)),
        };
        const key = Math.round(candidate.x / 3) + ',' + Math.round(candidate.y / 3);
        if (!occupied.has(key)) { position = candidate; occupied.add(key); break; }
      }
      node.position = position;
    }
  }

  private roomSize(symbol: SymbolKind, options: GeneratorOptions, random: DeterministicRandom): { width: number; height: number } {
    const bonus = symbol === 'boss' ? 4 : symbol === 'elite' ? 2 : symbol === 'treasure' ? -1 : 0;
    const minimum = Math.max(3, options.roomMinSize + bonus);
    const maximum = Math.max(minimum, Math.min(options.roomMaxSize + bonus, 12));
    return { width: random.integer(minimum, maximum), height: random.integer(minimum, maximum) };
  }
}
`);

emit('algorithms/VoronoiCaveGenerator.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { AbstractGenerator, MutableLayout, emptyLayout, tileIsPassable } from '../core/GenerationSupport';
import { euclideanSquared } from '../core/Geometry';
import { NoiseField } from '../core/Noise';
import { GeneratorContext, GeneratorOptions, Point, TileKind } from '../core/types';

interface Site extends Point {
  id: number;
  floor: boolean;
  elevation: number;
}

export class VoronoiCaveGenerator extends AbstractGenerator {
  public readonly algorithm = 'voronoi-caves' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const noise = new NoiseField(String(options.seed) + ':voronoi');
    const siteCount = Math.max(8, Math.floor(options.width * options.height / 70));
    const sites: Site[] = [];
    for (let index = 0; index < siteCount; index++) {
      sites.push({
        id: index,
        x: random.integer(1, options.width - 2),
        y: random.integer(1, options.height - 2),
        floor: random.boolean(options.floorTarget + 0.12),
        elevation: random.next(),
      });
    }
    layout.grid.forEach((_tile, x, y) => {
      if (layout.grid.isBorder(x, y)) return;
      const nearest = [...sites].sort((a, b) => euclideanSquared(a, { x, y }) - euclideanSquared(b, { x, y }))[0];
      const warped = noise.domainWarp(x, y, 6, 0.06);
      const floor = nearest.floor !== (warped > 0.72);
      layout.grid.set(x, y, floor ? TileKind.Floor : TileKind.Wall);
    });
    this.step(context, 'layout', 'voronoi-regions', 'Assigned tiles to seeded regions and warped their boundaries with noise.', options.width * options.height);
    this.erodeBoundaries(layout, noise);
    this.keepLargest(layout);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
    layout.metadata.siteCount = siteCount;
    layout.metadata.noiseWarp = 6;
    return layout;
  }

  private erodeBoundaries(layout: MutableLayout, noise: NoiseField): void {
    const before = layout.grid.clone();
    layout.grid.forEach((tile, x, y) => {
      if (layout.grid.isBorder(x, y)) return;
      const floorNeighbors = before.neighbors8(x, y).filter((point) => tileIsPassable(before.get(point.x, point.y))).length;
      if (tile === TileKind.Wall && floorNeighbors >= 6 && noise.ridged(x, y, { frequency: 0.08 }) > 0.45) layout.grid.set(x, y, TileKind.Floor);
      if (tile === TileKind.Floor && floorNeighbors <= 1) layout.grid.set(x, y, TileKind.Wall);
    });
  }

  private keepLargest(layout: MutableLayout): void {
    const regions = layout.grid.regions((tile) => tileIsPassable(tile)).sort((a, b) => b.cells.length - a.cells.length);
    if (regions.length === 0) {
      layout.grid.fillRect({ x: 2, y: 2, width: layout.grid.width - 4, height: layout.grid.height - 4 }, TileKind.Floor);
      return;
    }
    for (const region of regions.slice(1)) for (const point of region.cells) layout.grid.set(point.x, point.y, TileKind.Wall);
  }
}
`);

emit('algorithms/HybridDungeonGenerator.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { CorridorCarver } from '../carving/CorridorCarver';
import { Grid } from '../core/Grid';
import { AbstractGenerator, MutableLayout, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { NoiseField } from '../core/Noise';
import { GeneratorContext, GeneratorOptions, MapGenerator, TileKind } from '../core/types';
import { BspDungeonGenerator } from './BspDungeonGenerator';
import { CellularAutomataGenerator } from './CellularAutomataGenerator';
import { RoomGraphGenerator } from './RoomGraphGenerator';

export class HybridDungeonGenerator extends AbstractGenerator {
  public readonly algorithm = 'hybrid' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const baseAlgorithm = random.weighted<MapGenerator>([
      { value: new BspDungeonGenerator(), weight: 3 },
      { value: new RoomGraphGenerator(), weight: 4 },
      { value: new CellularAutomataGenerator(), weight: 2 },
    ]);
    const base = baseAlgorithm.generate({ ...options, seed: String(options.seed) + ':base', algorithm: baseAlgorithm.algorithm });
    layout.grid = Grid.fromRows(base.tiles).map((tile) => tile === TileKind.Spawn || tile === TileKind.Exit ? TileKind.Floor : tile);
    layout.rooms = base.rooms.map((room) => ({ ...room, center: { ...room.center }, tags: [...room.tags, 'hybrid-base'] }));
    layout.corridors = base.corridors.map((corridor) => ({ ...corridor, points: corridor.points.map((point) => ({ ...point })) }));
    this.step(context, 'layout', 'hybrid-base', 'Generated structural base with ' + baseAlgorithm.algorithm + '.', base.metrics.walkableCells);
    this.carveOrganicPockets(layout, options, random);
    this.overlayNoiseHazards(layout, options);
    this.addLandmark(layout, options, random);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
    layout.metadata.baseAlgorithm = baseAlgorithm.algorithm;
    layout.metadata.composedGenerators = 3;
    return layout;
  }

  private carveOrganicPockets(layout: MutableLayout, options: GeneratorOptions, random: DeterministicRandom): void {
    const carver = new CorridorCarver();
    const pockets = Math.max(2, Math.floor(options.width * options.height / 300));
    for (let index = 0; index < pockets; index++) {
      const center = { x: random.integer(3, options.width - 4), y: random.integer(3, options.height - 4) };
      const width = random.integer(3, 6);
      const height = random.integer(3, 6);
      const room = makeRoom('hybrid-pocket-' + index, center.x - Math.floor(width / 2), center.y - Math.floor(height / 2), width, height);
      room.tags.push('organic-pocket');
      layout.grid.fillRect(room, TileKind.Floor);
      const nearest = [...layout.rooms].sort((a, b) => Math.hypot(a.center.x - center.x, a.center.y - center.y) - Math.hypot(b.center.x - center.x, b.center.y - center.y))[0];
      if (nearest) layout.corridors.push(carver.carve(layout.grid, nearest.center, center, 1, 'winding', random, nearest.id, room.id));
      layout.rooms.push(room);
    }
  }

  private overlayNoiseHazards(layout: MutableLayout, options: GeneratorOptions): void {
    const noise = new NoiseField(String(options.seed) + ':hybrid-hazards');
    layout.grid.forEach((tile, x, y) => {
      if (tile !== TileKind.Floor) return;
      const value = noise.fractal(x, y, { frequency: 0.09, octaves: 3 });
      if (value > 0.8 && layout.grid.neighbors4(x, y).every((point) => layout.grid.get(point.x, point.y) === TileKind.Floor)) {
        layout.grid.set(x, y, options.biome === 'inferno' ? TileKind.Lava : TileKind.Pit);
      }
    });
  }

  private addLandmark(layout: MutableLayout, options: GeneratorOptions, random: DeterministicRandom): void {
    const candidates = layout.rooms.filter((room) => room.area >= 25);
    const room = random.pickOrUndefined(candidates);
    if (!room) return;
    const radius = Math.max(1, Math.floor(Math.min(room.width, room.height) / 4));
    for (let y = room.center.y - radius; y <= room.center.y + radius; y++) {
      for (let x = room.center.x - radius; x <= room.center.x + radius; x++) {
        if ((x + y) % 2 === 0 && layout.grid.inBounds(x, y) && layout.grid.get(x, y) === TileKind.Floor) layout.grid.set(x, y, TileKind.Pillar);
      }
    }
    room.tags.push('landmark');
  }
}
`);

emit('content/SpawnPlanner.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { euclidean, manhattan } from '../core/Geometry';
import { EnemySpawn, GeneratedMap, ItemSpawn, Point, Room, TileKind, pointKey } from '../core/types';
import { tileIsPassable } from '../core/GenerationSupport';
import { Pathfinder } from '../analysis/Pathfinder';

export interface PlacementConstraints {
  minimumFromSpawn: number;
  minimumFromExit: number;
  minimumSeparation: number;
  avoidLineOfSight: boolean;
  preferRooms: boolean;
  requireWallDistance: number;
}

export class SpawnPlanner {
  private readonly pathfinder = new Pathfinder();

  public enemyCandidates(map: GeneratedMap, constraints: PlacementConstraints): Point[] {
    const grid = Grid.fromRows(map.tiles);
    const spawnDistances = this.pathfinder.distanceField(grid, [map.spawn], tileIsPassable);
    const exitDistances = this.pathfinder.distanceField(grid, [map.exit], tileIsPassable);
    const roomCells = new Set<string>();
    for (const room of map.rooms) {
      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) roomCells.add(x + ',' + y);
      }
    }
    return grid.filter((tile, x, y) => {
      if (tile !== TileKind.Floor) return false;
      if (spawnDistances.get(x, y) < constraints.minimumFromSpawn) return false;
      if (exitDistances.get(x, y) < constraints.minimumFromExit) return false;
      if (constraints.preferRooms && roomCells.size > 0 && !roomCells.has(x + ',' + y)) return false;
      if (constraints.avoidLineOfSight && this.pathfinder.lineOfSight(grid, map.spawn, { x, y }, tileIsPassable)) return false;
      const wallDistance = this.wallDistance(grid, { x, y }, constraints.requireWallDistance);
      return wallDistance >= constraints.requireWallDistance;
    });
  }

  public chooseSeparated(
    candidates: readonly Point[],
    count: number,
    minimumSeparation: number,
    random: DeterministicRandom,
    anchors: readonly Point[] = [],
  ): Point[] {
    const remaining = random.shuffle(candidates);
    const selected: Point[] = [];
    while (remaining.length > 0 && selected.length < count) {
      const candidate = remaining.shift()!;
      if ([...anchors, ...selected].every((point) => euclidean(point, candidate) >= minimumSeparation)) selected.push(candidate);
    }
    if (selected.length < count) {
      for (const candidate of random.shuffle(candidates)) {
        if (selected.length >= count) break;
        if (!selected.some((point) => pointKey(point) === pointKey(candidate))) selected.push(candidate);
      }
    }
    return selected;
  }

  public patrolRoute(map: GeneratedMap, origin: Point, length: number, random: DeterministicRandom): Point[] {
    const grid = Grid.fromRows(map.tiles);
    const route: Point[] = [origin];
    let current = origin;
    for (let step = 0; step < length; step++) {
      const choices = grid.neighbors4(current.x, current.y)
        .filter((point) => tileIsPassable(grid.get(point.x, point.y)))
        .filter((point) => route.length < 2 || pointKey(point) !== pointKey(route[route.length - 2]));
      if (choices.length === 0) break;
      current = random.pick(choices);
      if (step % 3 === 2) route.push(current);
    }
    if (route.length > 1) route.push(origin);
    return route;
  }

  public roomCandidates(map: GeneratedMap, room: Room, inset = 1): Point[] {
    const grid = Grid.fromRows(map.tiles);
    const result: Point[] = [];
    for (let y = room.y + inset; y < room.y + room.height - inset; y++) {
      for (let x = room.x + inset; x < room.x + room.width - inset; x++) {
        if (grid.inBounds(x, y) && grid.get(x, y) === TileKind.Floor) result.push({ x, y });
      }
    }
    return result;
  }

  public reserveOccupied(enemies: readonly EnemySpawn[], items: readonly ItemSpawn[]): Set<string> {
    return new Set([...enemies.map((entry) => pointKey(entry.position)), ...items.map((entry) => pointKey(entry.position))]);
  }

  public scoreCandidate(point: Point, map: GeneratedMap, occupied: ReadonlySet<string>): number {
    if (occupied.has(pointKey(point))) return -Infinity;
    let score = Math.min(manhattan(point, map.spawn), 20) * 2;
    score += Math.min(manhattan(point, map.exit), 12);
    for (const enemy of map.enemies) score += Math.min(euclidean(point, enemy.position), 8) * 0.25;
    for (const item of map.items) score += Math.min(euclidean(point, item.position), 6) * 0.15;
    return score;
  }

  private wallDistance(grid: Grid<number>, point: Point, maximum: number): number {
    for (let radius = 1; radius <= maximum; radius++) {
      const ring = grid.neighborhood(point.x, point.y, radius).filter((candidate) =>
        Math.max(Math.abs(candidate.x - point.x), Math.abs(candidate.y - point.y)) === radius);
      if (ring.some((candidate) => !tileIsPassable(grid.get(candidate.x, candidate.y)))) return radius - 1;
    }
    return maximum;
  }
}
`);

emit('content/EncounterPlanner.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { EncounterPlan, EnemySpawn, GeneratedMap, Room } from '../core/types';
import { SpawnPlanner } from './SpawnPlanner';

interface EnemyArchetype {
  id: string;
  cost: number;
  minimumDifficulty: number;
  role: 'melee' | 'ranged' | 'tank' | 'support' | 'elite';
}

const ARCHETYPES: readonly EnemyArchetype[] = [
  { id: 'imp_melee', cost: 1, minimumDifficulty: 1, role: 'melee' },
  { id: 'cultist_archer', cost: 2, minimumDifficulty: 1, role: 'ranged' },
  { id: 'stone_guardian', cost: 4, minimumDifficulty: 3, role: 'tank' },
  { id: 'hex_weaver', cost: 4, minimumDifficulty: 4, role: 'support' },
  { id: 'winged_hunter', cost: 5, minimumDifficulty: 5, role: 'ranged' },
  { id: 'infernal_champion', cost: 8, minimumDifficulty: 7, role: 'elite' },
];

export class EncounterPlanner {
  private readonly spawns = new SpawnPlanner();

  public populate(map: GeneratedMap, random: DeterministicRandom): void {
    const difficulty = Number(map.metadata.difficulty ?? 3);
    const combatRooms = map.rooms.filter((room) => room.kind === 'combat' || room.kind === 'boss');
    const globalCandidates = this.spawns.enemyCandidates(map, {
      minimumFromSpawn: 7,
      minimumFromExit: 2,
      minimumSeparation: 3,
      avoidLineOfSight: false,
      preferRooms: combatRooms.length > 0,
      requireWallDistance: 0,
    });
    let serial = 0;
    const encounters: EncounterPlan[] = [];
    for (const room of combatRooms) {
      const roomCandidates = this.spawns.roomCandidates(map, room, 1);
      const budget = this.roomBudget(room, difficulty, random);
      const composition = this.compose(budget, difficulty, random);
      const positions = this.spawns.chooseSeparated(roomCandidates, composition.length, 2, random, [map.spawn]);
      const encounterId = 'encounter-' + encounters.length;
      const enemyIds: string[] = [];
      composition.forEach((archetype, index) => {
        const position = positions[index];
        if (!position) return;
        const id = 'enemy-' + serial++;
        enemyIds.push(id);
        map.enemies.push({
          id,
          archetype: archetype.id,
          position,
          level: Math.max(1, difficulty + random.integer(-1, 1)),
          patrol: archetype.role === 'ranged' ? [] : this.spawns.patrolRoute(map, position, 8, random),
          encounterId,
        });
      });
      if (enemyIds.length > 0) encounters.push({ id: encounterId, roomId: room.id, enemies: enemyIds, budget, trigger: 'enter-room' });
    }
    if (map.enemies.length === 0) {
      const count = Math.max(1, Math.floor(globalCandidates.length * 0.04));
      const positions = this.spawns.chooseSeparated(globalCandidates, count, 3, random, [map.spawn]);
      const encounterId = 'encounter-roaming';
      for (const position of positions) {
        const archetype = random.pick(this.available(difficulty));
        map.enemies.push({ id: 'enemy-' + serial++, archetype: archetype.id, position, level: difficulty, patrol: this.spawns.patrolRoute(map, position, 10, random), encounterId });
      }
      encounters.push({ id: encounterId, enemies: map.enemies.map((enemy) => enemy.id), budget: count * 2, trigger: 'cross-threshold' });
    }
    map.encounters = encounters;
  }

  private roomBudget(room: Room, difficulty: number, random: DeterministicRandom): number {
    const base = Math.max(2, Math.floor(room.area / 15));
    const kindMultiplier = room.kind === 'boss' ? 2.2 : room.kind === 'combat' ? 1 : 0.5;
    return Math.max(1, Math.round(base * kindMultiplier + difficulty * 0.8 + random.integer(-1, 2)));
  }

  private compose(budget: number, difficulty: number, random: DeterministicRandom): EnemyArchetype[] {
    const available = this.available(difficulty);
    const result: EnemyArchetype[] = [];
    let remaining = budget;
    let safety = 0;
    while (remaining > 0 && safety++ < 30) {
      const choices = available.filter((entry) => entry.cost <= remaining);
      if (choices.length === 0) break;
      const chosen = random.weighted(choices.map((entry) => ({ value: entry, weight: 1 / entry.cost })));
      result.push(chosen);
      remaining -= chosen.cost;
    }
    return result;
  }

  private available(difficulty: number): EnemyArchetype[] {
    return ARCHETYPES.filter((entry) => entry.minimumDifficulty <= difficulty);
  }
}
`);

emit('content/LootPlanner.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { GeneratedMap, Point, TileKind, pointKey } from '../core/types';
import { Grid } from '../core/Grid';
import { Pathfinder } from '../analysis/Pathfinder';
import { tileIsPassable } from '../core/GenerationSupport';
import { SpawnPlanner } from './SpawnPlanner';

export class LootPlanner {
  private readonly pathfinder = new Pathfinder();
  private readonly spawns = new SpawnPlanner();

  public populate(map: GeneratedMap, random: DeterministicRandom): void {
    const grid = Grid.fromRows(map.tiles);
    const distances = this.pathfinder.distanceField(grid, [map.spawn], tileIsPassable);
    const occupied = this.spawns.reserveOccupied(map.enemies, map.items);
    const deadEnds = grid.filter((tile, x, y) => tile === TileKind.Floor &&
      grid.neighbors4(x, y).filter((point) => tileIsPassable(grid.get(point.x, point.y))).length === 1);
    const roomTreasures = map.rooms.filter((room) => room.kind === 'treasure').flatMap((room) => this.spawns.roomCandidates(map, room, 1));
    const candidates = [...deadEnds, ...roomTreasures, ...grid.filter((tile, x, y) => tile === TileKind.Floor && distances.get(x, y) > 12)]
      .filter((point) => Number.isFinite(distances.get(point.x, point.y)))
      .filter((point, index, values) => values.findIndex((other) => pointKey(other) === pointKey(point)) === index)
      .sort((left, right) => distances.get(right.x, right.y) - distances.get(left.x, left.y));
    const desired = Math.max(1, Math.floor(map.metrics.walkableCells * Number(map.metadata.treasureDensity ?? 0.01)));
    const positions = this.spawns.chooseSeparated(candidates, desired, 5, random, [map.spawn, map.exit]);
    positions.forEach((position, index) => {
      if (occupied.has(pointKey(position))) return;
      const distance = distances.get(position.x, position.y);
      const itemType = this.itemForDistance(distance, Number(map.metadata.difficulty ?? 3), random);
      map.items.push({ id: 'item-' + index, itemType, position, quantity: itemType === 'halos' ? random.integer(25, 150) : 1, guarded: this.isGuarded(position, map) });
      if (random.boolean(0.55)) grid.set(position.x, position.y, TileKind.Chest);
    });
    map.tiles = grid.toRows();
  }

  private itemForDistance(distance: number, difficulty: number, random: DeterministicRandom): string {
    const safeDistance = Number.isFinite(distance) ? Math.max(0, distance) : 0;
    return random.weighted([
      { value: 'health_herb', weight: Math.max(1, 8 - difficulty) },
      { value: 'mana_shard', weight: 4 },
      { value: 'halos', weight: 6 },
      { value: 'witch_heart_fragment', weight: Math.max(0.2, safeDistance / 30) },
      { value: 'umbran_tears', weight: Math.max(0.1, difficulty / 10) },
    ]);
  }

  private isGuarded(position: Point, map: GeneratedMap): boolean {
    return map.enemies.some((enemy) => Math.hypot(enemy.position.x - position.x, enemy.position.y - position.y) <= 6);
  }
}
`);

emit('content/DecorationPlanner.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { GeneratedMap, Point, TileKind, pointKey } from '../core/types';
import { tileIsPassable } from '../core/GenerationSupport';

const DECORATIONS: Record<string, readonly string[]> = {
  cathedral: ['candelabra', 'broken_pew', 'stained_glass_shard', 'gargoyle_statue', 'torch_sconce'],
  inferno: ['bone_pile', 'burning_chain', 'obsidian_spike', 'infernal_rune', 'ash_vent'],
  celestial: ['celestial_pillar', 'divine_light_beam', 'golden_urn', 'angelic_banner', 'star_field'],
  streets: ['market_crate', 'street_lamp', 'broken_cart', 'fountain_fragment', 'hanging_banner'],
  ruins: ['fallen_column', 'mosaic_fragment', 'marble_bust', 'ivy_patch', 'cracked_urn'],
  garden: ['flower_bed', 'ancient_tree', 'marble_bench', 'butterfly_swarm', 'water_lily'],
  crypt: ['sarcophagus', 'skull_pile', 'ritual_candle', 'torn_tapestry', 'grave_marker'],
  clocktower: ['gear_cluster', 'pendulum', 'copper_pipe', 'clock_face', 'spring_coil'],
  colosseum: ['weapon_rack', 'spectator_banner', 'broken_shield', 'sand_mound', 'victory_statue'],
  void: ['void_crack', 'floating_debris', 'reality_distortion', 'distorted_clock', 'watching_eye'],
};

export class DecorationPlanner {
  public populate(map: GeneratedMap, random: DeterministicRandom): void {
    const grid = Grid.fromRows(map.tiles);
    const biome = String(map.metadata.biome ?? 'cathedral');
    const catalog = DECORATIONS[biome] ?? DECORATIONS.cathedral;
    const desired = Math.max(2, Math.floor(map.metrics.walkableCells * Number(map.metadata.decorationDensity ?? 0.04)));
    const occupied = new Set<string>([
      pointKey(map.spawn), pointKey(map.exit),
      ...map.enemies.map((entry) => pointKey(entry.position)),
      ...map.items.map((entry) => pointKey(entry.position)),
    ]);
    const wallAdjacent = grid.filter((tile, x, y) => tile === TileKind.Floor &&
      grid.neighbors4(x, y).some((point) => grid.get(point.x, point.y) === TileKind.Wall));
    const open = grid.filter((tile, x, y) => tileIsPassable(tile) &&
      grid.neighbors8(x, y).every((point) => tileIsPassable(grid.get(point.x, point.y))));
    const candidates = random.shuffle([...wallAdjacent, ...open]);
    let serial = 0;
    for (const position of candidates) {
      if (serial >= desired || occupied.has(pointKey(position))) continue;
      if (map.decorations.some((entry) => Math.hypot(entry.position.x - position.x, entry.position.y - position.y) < 2)) continue;
      const type = random.pick(catalog);
      map.decorations.push({
        id: 'decoration-' + serial++,
        decorationType: type,
        position,
        rotation: random.float(-0.18, 0.18),
        scale: random.float(0.8, 1.25),
        tint: biome === 'void' ? random.pick([0x9900ff, 0xcc33ff, 0x6600aa]) : undefined,
      });
    }
  }
}
`);

emit('terrain/BiomePainter.ts', String.raw`
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
`);

emit('rules/TerrainRule.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { GeneratedMap, BiomeId } from '../core/types';

export interface TerrainRuleResult {
  ruleId: string;
  inspectedCells: number;
  changedCells: number;
  skippedCells: number;
  notes: string[];
}

export interface TerrainRule {
  readonly id: string;
  readonly biome: BiomeId;
  readonly priority: number;
  readonly minimumDifficulty: number;
  readonly maximumDifficulty: number;
  apply(map: GeneratedMap, random: DeterministicRandom): TerrainRuleResult;
}

export abstract class BaseTerrainRule implements TerrainRule {
  public abstract readonly id: string;
  public abstract readonly biome: BiomeId;
  public abstract readonly priority: number;
  public abstract readonly minimumDifficulty: number;
  public abstract readonly maximumDifficulty: number;

  public abstract apply(map: GeneratedMap, random: DeterministicRandom): TerrainRuleResult;

  protected acceptsDifficulty(map: GeneratedMap): boolean {
    const difficulty = Number(map.metadata.difficulty ?? 1);
    return difficulty >= this.minimumDifficulty && difficulty <= this.maximumDifficulty;
  }

  protected protectedCell(map: GeneratedMap, x: number, y: number, radius = 2): boolean {
    const spawnDistance = Math.abs(map.spawn.x - x) + Math.abs(map.spawn.y - y);
    const exitDistance = Math.abs(map.exit.x - x) + Math.abs(map.exit.y - y);
    return spawnDistance <= radius || exitDistance <= radius;
  }

  protected result(changedCells: number, inspectedCells: number, skippedCells: number, notes: string[] = []): TerrainRuleResult {
    return { ruleId: this.id, changedCells, inspectedCells, skippedCells, notes };
  }
}
`);

const terrainRuleBiomes = [
  ['cathedral', 'Cathedral', 'TileKind.Pit', 0.58],
  ['inferno', 'Inferno', 'TileKind.Lava', 0.50],
  ['celestial', 'Celestial', 'TileKind.Pit', 0.62],
  ['streets', 'Streets', 'TileKind.Pit', 0.66],
  ['ruins', 'Ruins', 'TileKind.Pit', 0.54],
  ['garden', 'Garden', 'TileKind.Pit', 0.60],
  ['crypt', 'Crypt', 'TileKind.Pit', 0.52],
  ['clocktower', 'Clocktower', 'TileKind.Pit', 0.57],
  ['colosseum', 'Colosseum', 'TileKind.Pit', 0.68],
  ['void', 'Void', 'TileKind.Pit', 0.46],
];

const terrainRuleKinds = [
  'HazardVeins',
  'PillarClusters',
  'WallWeathering',
  'ChamberAccents',
  'CorridorButtresses',
  'FracturedEdges',
  'QuietZones',
  'JunctionLandmarks',
  'DeadEndShrines',
  'NoiseIslands',
];

const terrainRuleImports = [];
const terrainRuleInstances = [];

for (const [biome, biomeClass, hazard, baseThreshold] of terrainRuleBiomes) {
  for (let variant = 0; variant < terrainRuleKinds.length; variant++) {
    const kind = terrainRuleKinds[variant];
    const className = biomeClass + kind + 'Rule';
    const fileName = 'rules/biomes/' + biome + '/' + className + '.ts';
    const frequency = (0.035 + variant * 0.009).toFixed(3);
    const threshold = Math.min(0.91, Number(baseThreshold) + variant * 0.025).toFixed(3);
    const priority = 10 + variant * 10;
    const minimumDifficulty = 1 + (variant % 5);
    const operation = variant % 10;
    terrainRuleImports.push("import { " + className + " } from './biomes/" + biome + "/" + className + "';");
    terrainRuleInstances.push('new ' + className + '()');
    emit(fileName, String.raw`
import { DeterministicRandom } from '../../../../simulation/core/DeterministicRandom';
import { Grid } from '../../../core/Grid';
import { NoiseField } from '../../../core/Noise';
import { GeneratedMap, TileKind } from '../../../core/types';
import { tileIsPassable } from '../../../core/GenerationSupport';
import { BaseTerrainRule, TerrainRuleResult } from '../../TerrainRule';

export class ${className} extends BaseTerrainRule {
  public readonly id = '${biome}-${kind.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}';
  public readonly biome = '${biome}' as const;
  public readonly priority = ${priority};
  public readonly minimumDifficulty = ${minimumDifficulty};
  public readonly maximumDifficulty = 10;

  public apply(map: GeneratedMap, random: DeterministicRandom): TerrainRuleResult {
    if (!this.acceptsDifficulty(map)) return this.result(0, 0, 0, ['difficulty-outside-rule-range']);
    const grid = Grid.fromRows(map.tiles);
    const before = grid.clone();
    const noise = new NoiseField(map.seed + ':' + this.id);
    let inspected = 0;
    let changed = 0;
    let skipped = 0;
    grid.forEach((tile, x, y) => {
      if (grid.isBorder(x, y) || this.protectedCell(map, x, y, 3)) { skipped++; return; }
      inspected++;
      const field = noise.fractal(x, y, { frequency: ${frequency}, octaves: ${3 + variant % 3}, persistence: ${0.42 + (variant % 4) * 0.06} });
      const cardinalFloors = before.neighbors4(x, y).filter((point) => tileIsPassable(before.get(point.x, point.y))).length;
      const surroundingFloors = before.neighbors8(x, y).filter((point) => tileIsPassable(before.get(point.x, point.y))).length;
      let replacement = tile;
      const operation: number = ${operation};
      switch (operation) {
        case 0:
          if (tile === TileKind.Floor && field > ${threshold} && cardinalFloors >= 3 && random.boolean(0.24)) replacement = ${hazard};
          break;
        case 1:
          if (tile === TileKind.Floor && field > ${threshold} && surroundingFloors === 8 && random.boolean(0.18)) replacement = TileKind.Pillar;
          break;
        case 2:
          if (tile === TileKind.Wall && cardinalFloors >= 2 && field > ${threshold} && random.boolean(0.22)) replacement = TileKind.Floor;
          break;
        case 3:
          if (tile === TileKind.Floor && surroundingFloors >= 7 && field > ${threshold} && (x + y) % 3 === 0) replacement = TileKind.Pillar;
          break;
        case 4:
          if (tile === TileKind.Floor && cardinalFloors === 2 && surroundingFloors <= 5 && field > ${threshold}) replacement = TileKind.Pillar;
          break;
        case 5:
          if (tile === TileKind.Wall && surroundingFloors >= 5 && field > ${threshold}) replacement = TileKind.Floor;
          break;
        case 6:
          if ((tile === TileKind.Pillar || tile === ${hazard}) && field < ${Math.max(0.2, Number(baseThreshold) - 0.2).toFixed(3)}) replacement = TileKind.Floor;
          break;
        case 7:
          if (tile === TileKind.Floor && cardinalFloors >= 3 && field > ${threshold} && random.boolean(0.15)) replacement = TileKind.Pillar;
          break;
        case 8:
          if (tile === TileKind.Floor && cardinalFloors === 1 && field > ${threshold} && random.boolean(0.3)) replacement = TileKind.Chest;
          break;
        default:
          if (tile === TileKind.Floor && surroundingFloors === 8 && field > ${threshold} && random.boolean(0.12)) replacement = ${hazard};
          break;
      }
      if (replacement !== tile) { grid.set(x, y, replacement); changed++; }
    });
    grid.set(map.spawn.x, map.spawn.y, TileKind.Spawn);
    grid.set(map.exit.x, map.exit.y, TileKind.Exit);
    grid.drawBorder(TileKind.Wall);
    map.tiles = grid.toRows();
    return this.result(changed, inspected, skipped, ['frequency=${frequency}', 'threshold=${threshold}', 'biome=${biome}']);
  }
}
`);
  }
}

emit('rules/TerrainRuleRegistry.ts', terrainRuleImports.join('\n') + String.raw`
import { BiomeId, GeneratedMap } from '../core/types';
import { TerrainRule } from './TerrainRule';

export class TerrainRuleRegistry {
  private readonly rules = new Map<string, TerrainRule>();

  public constructor(registerDefaults = true) {
    if (registerDefaults) {
      for (const rule of this.defaultRules()) this.register(rule);
    }
  }

  public register(rule: TerrainRule, replace = false): this {
    if (this.rules.has(rule.id) && !replace) throw new Error('terrain rule already registered: ' + rule.id);
    this.rules.set(rule.id, rule);
    return this;
  }

  public unregister(id: string): boolean {
    return this.rules.delete(id);
  }

  public get(id: string): TerrainRule {
    const rule = this.rules.get(id);
    if (!rule) throw new Error('unknown terrain rule: ' + id);
    return rule;
  }

  public forBiome(biome: BiomeId): TerrainRule[] {
    return [...this.rules.values()].filter((rule) => rule.biome === biome).sort((left, right) => left.priority - right.priority);
  }

  public eligible(map: GeneratedMap): TerrainRule[] {
    const biome = (map.metadata.biome ?? 'cathedral') as BiomeId;
    const difficulty = Number(map.metadata.difficulty ?? 1);
    return this.forBiome(biome).filter((rule) => difficulty >= rule.minimumDifficulty && difficulty <= rule.maximumDifficulty);
  }

  public list(): TerrainRule[] {
    return [...this.rules.values()];
  }

  public get size(): number {
    return this.rules.size;
  }

  private defaultRules(): TerrainRule[] {
    return [${terrainRuleInstances.join(',\n      ')}];
  }
}
`);

emit('rules/TerrainComposer.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { GeneratedMap } from '../core/types';
import { TerrainRuleResult } from './TerrainRule';
import { TerrainRuleRegistry } from './TerrainRuleRegistry';

export interface TerrainCompositionReport {
  selectedRules: string[];
  results: TerrainRuleResult[];
  totalChangedCells: number;
  totalInspectedCells: number;
}

export class TerrainComposer {
  public constructor(private readonly registry = new TerrainRuleRegistry()) {}

  public compose(map: GeneratedMap, random: DeterministicRandom): TerrainCompositionReport {
    const eligible = this.registry.eligible(map);
    const difficulty = Number(map.metadata.difficulty ?? 1);
    const desired = Math.min(eligible.length, 2 + Math.floor(difficulty / 3));
    const selected = this.selectDiverse(eligible, desired, random);
    const results: TerrainRuleResult[] = [];
    for (const rule of selected) results.push(rule.apply(map, random.fork(rule.id)));
    const report = {
      selectedRules: selected.map((rule) => rule.id),
      results,
      totalChangedCells: results.reduce((sum, result) => sum + result.changedCells, 0),
      totalInspectedCells: results.reduce((sum, result) => sum + result.inspectedCells, 0),
    };
    map.metadata.terrainRuleCount = selected.length;
    map.metadata.terrainRules = report.selectedRules.join(',');
    map.metadata.terrainRuleChanges = report.totalChangedCells;
    return report;
  }

  private selectDiverse<T extends { priority: number; id: string }>(rules: readonly T[], count: number, random: DeterministicRandom): T[] {
    const buckets = new Map<number, T[]>();
    for (const rule of rules) {
      const bucket = Math.floor(rule.priority / 20);
      buckets.set(bucket, [...(buckets.get(bucket) ?? []), rule]);
    }
    const selected: T[] = [];
    for (const bucket of random.shuffle([...buckets.values()])) {
      if (selected.length >= count) break;
      selected.push(random.pick(bucket));
    }
    if (selected.length < count) {
      for (const rule of random.shuffle(rules)) {
        if (selected.length >= count) break;
        if (!selected.some((entry) => entry.id === rule.id)) selected.push(rule);
      }
    }
    return selected.sort((left, right) => left.priority - right.priority);
  }
}
`);

emit('pipeline/GeneratorRegistry.ts', String.raw`
import { MapGenerator, GeneratorAlgorithm } from '../core/types';
import { BspDungeonGenerator } from '../algorithms/BspDungeonGenerator';
import { CellularAutomataGenerator } from '../algorithms/CellularAutomataGenerator';
import { DrunkardWalkGenerator } from '../algorithms/DrunkardWalkGenerator';
import { GrammarDungeonGenerator } from '../algorithms/GrammarDungeonGenerator';
import { HybridDungeonGenerator } from '../algorithms/HybridDungeonGenerator';
import { DepthFirstMazeGenerator, EllerMazeGenerator, KruskalMazeGenerator, PrimMazeGenerator } from '../algorithms/MazeGenerators';
import { RoomGraphGenerator } from '../algorithms/RoomGraphGenerator';
import { VoronoiCaveGenerator } from '../algorithms/VoronoiCaveGenerator';
import { WaveFunctionCollapseGenerator } from '../algorithms/WaveFunctionCollapseGenerator';

export class GeneratorRegistry {
  private readonly generators = new Map<GeneratorAlgorithm, MapGenerator>();

  public constructor(registerDefaults = true) {
    if (registerDefaults) {
      this.register(new BspDungeonGenerator());
      this.register(new DrunkardWalkGenerator());
      this.register(new CellularAutomataGenerator());
      this.register(new DepthFirstMazeGenerator());
      this.register(new PrimMazeGenerator());
      this.register(new KruskalMazeGenerator());
      this.register(new EllerMazeGenerator());
      this.register(new RoomGraphGenerator());
      this.register(new WaveFunctionCollapseGenerator());
      this.register(new GrammarDungeonGenerator());
      this.register(new VoronoiCaveGenerator());
      this.register(new HybridDungeonGenerator());
    }
  }

  public register(generator: MapGenerator, replace = false): this {
    if (this.generators.has(generator.algorithm) && !replace) throw new Error('generator already registered: ' + generator.algorithm);
    this.generators.set(generator.algorithm, generator);
    return this;
  }

  public unregister(algorithm: GeneratorAlgorithm): boolean {
    return this.generators.delete(algorithm);
  }

  public get(algorithm: GeneratorAlgorithm): MapGenerator {
    const generator = this.generators.get(algorithm);
    if (!generator) throw new Error('unknown procedural generator: ' + algorithm);
    return generator;
  }

  public has(algorithm: GeneratorAlgorithm): boolean {
    return this.generators.has(algorithm);
  }

  public list(): GeneratorAlgorithm[] {
    return [...this.generators.keys()];
  }

  public get size(): number {
    return this.generators.size;
  }
}
`);

emit('pipeline/GenerationPresets.ts', String.raw`
import { BiomeId, GeneratorAlgorithm, GeneratorOptions, createDefaultOptions, normalizeOptions } from '../core/types';

export type PresetId =
  | 'cathedral-intro'
  | 'crypt-crawl'
  | 'inferno-caverns'
  | 'celestial-bridges'
  | 'clockwork-maze'
  | 'ruined-city'
  | 'garden-labyrinth'
  | 'colosseum-gauntlet'
  | 'void-fracture'
  | 'roguelike-mix';

export interface GenerationPreset {
  id: PresetId;
  name: string;
  description: string;
  algorithm: GeneratorAlgorithm;
  biome: BiomeId;
  overrides: Partial<GeneratorOptions>;
}

export const GENERATION_PRESETS: readonly GenerationPreset[] = [
  { id: 'cathedral-intro', name: 'Nave da Catedral', description: 'Salas legíveis, corredores largos e encontros graduais.', algorithm: 'bsp', biome: 'cathedral', overrides: { difficulty: 1, floorTarget: 0.5, corridorWidth: 2, loopChance: 0.14, hazardDensity: 0.01 } },
  { id: 'crypt-crawl', name: 'Cripta Labiríntica', description: 'Passagens estreitas, becos e tesouros escondidos.', algorithm: 'depth-first-maze', biome: 'crypt', overrides: { difficulty: 3, corridorWidth: 1, loopChance: 0.08, treasureDensity: 0.02 } },
  { id: 'inferno-caverns', name: 'Cavernas do Inferno', description: 'Cavernas orgânicas com rios e bolsões de lava.', algorithm: 'cellular-automata', biome: 'inferno', overrides: { difficulty: 5, floorTarget: 0.54, hazardDensity: 0.08, smoothingPasses: 5 } },
  { id: 'celestial-bridges', name: 'Pontes Celestiais', description: 'Módulos suspensos conectados por padrões compatíveis.', algorithm: 'wave-function-collapse', biome: 'celestial', overrides: { difficulty: 6, corridorWidth: 1, hazardDensity: 0.06 } },
  { id: 'clockwork-maze', name: 'Engrenagens do Tempo', description: 'Labirinto uniforme com muitas rotas alternativas.', algorithm: 'prim-maze', biome: 'clocktower', overrides: { difficulty: 4, loopChance: 0.22, enemyDensity: 0.03 } },
  { id: 'ruined-city', name: 'Cidade em Ruínas', description: 'Quarteirões irregulares ligados por uma malha de proximidade.', algorithm: 'room-graph', biome: 'ruins', overrides: { difficulty: 4, roomMinSize: 4, roomMaxSize: 9, loopChance: 0.3 } },
  { id: 'garden-labyrinth', name: 'Jardim de Paradiso', description: 'Labirinto construído em linhas com clareiras simétricas.', algorithm: 'eller-maze', biome: 'garden', overrides: { difficulty: 5, loopChance: 0.17, decorationDensity: 0.1 } },
  { id: 'colosseum-gauntlet', name: 'Prova do Coliseu', description: 'Progressão dirigida por encontros até uma arena final.', algorithm: 'grammar', biome: 'colosseum', overrides: { difficulty: 7, roomMinSize: 5, roomMaxSize: 11, enemyDensity: 0.05 } },
  { id: 'void-fracture', name: 'Fratura do Limbo', description: 'Regiões Voronoi deformadas, perigosas e imprevisíveis.', algorithm: 'voronoi-caves', biome: 'void', overrides: { difficulty: 9, floorTarget: 0.5, hazardDensity: 0.1, decorationDensity: 0.08 } },
  { id: 'roguelike-mix', name: 'Descida Procedural', description: 'Combinação de salas, cavernas, ruído e marcos.', algorithm: 'hybrid', biome: 'cathedral', overrides: { difficulty: 5, loopChance: 0.25, hazardDensity: 0.04, treasureDensity: 0.016 } },
];

export function getPreset(id: PresetId): GenerationPreset {
  const preset = GENERATION_PRESETS.find((entry) => entry.id === id);
  if (!preset) throw new Error('unknown generation preset: ' + id);
  return preset;
}

export function optionsFromPreset(id: PresetId, seed: string | number, overrides: Partial<GeneratorOptions> = {}): GeneratorOptions {
  const preset = getPreset(id);
  return normalizeOptions({ ...createDefaultOptions(seed, preset.algorithm), ...preset.overrides, ...overrides, seed, algorithm: overrides.algorithm ?? preset.algorithm, biome: overrides.biome ?? preset.biome });
}
`);

emit('pipeline/ProceduralPipeline.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { MapRepairer } from '../analysis/MapRepairer';
import { TopologyAnalyzer } from '../analysis/TopologyAnalyzer';
import { MapValidator } from '../analysis/MapValidator';
import { DecorationPlanner } from '../content/DecorationPlanner';
import { EncounterPlanner } from '../content/EncounterPlanner';
import { LootPlanner } from '../content/LootPlanner';
import { BiomePainter } from '../terrain/BiomePainter';
import { TerrainComposer } from '../rules/TerrainComposer';
import { GenerationResult, GeneratorOptions, normalizeOptions } from '../core/types';
import { GeneratorRegistry } from './GeneratorRegistry';

export interface PipelineHooks {
  afterLayout?: (map: GenerationResult['map']) => void;
  afterTerrain?: (map: GenerationResult['map']) => void;
  afterContent?: (map: GenerationResult['map']) => void;
  afterValidation?: (result: GenerationResult) => void;
}

export class ProceduralPipeline {
  private readonly analyzer = new TopologyAnalyzer();
  private readonly validator = new MapValidator();
  private readonly repairer = new MapRepairer();
  private readonly terrain = new BiomePainter();
  private readonly terrainComposer = new TerrainComposer();
  private readonly encounters = new EncounterPlanner();
  private readonly loot = new LootPlanner();
  private readonly decorations = new DecorationPlanner();

  public constructor(private readonly registry = new GeneratorRegistry()) {}

  public generate(rawOptions: GeneratorOptions, hooks: PipelineHooks = {}): GenerationResult {
    const options = normalizeOptions(rawOptions);
    const warnings: string[] = [];
    const generator = this.registry.get(options.algorithm);
    let map = generator.generate(options);
    map.metadata.difficulty = options.difficulty;
    map.metadata.biome = options.biome;
    map.metadata.hazardDensity = options.hazardDensity;
    map.metadata.treasureDensity = options.treasureDensity;
    map.metadata.enemyDensity = options.enemyDensity;
    map.metadata.decorationDensity = options.decorationDensity;
    map.metadata.pipelineVersion = 1;
    map.metrics = this.analyzer.analyze(map);
    hooks.afterLayout?.(map);

    const random = new DeterministicRandom(options.seed).fork('procedural-pipeline');
    this.terrain.paint(map, random.fork('terrain'));
    this.terrainComposer.compose(map, random.fork('terrain-rules'));
    map.metrics = this.analyzer.analyze(map);
    hooks.afterTerrain?.(map);

    if (options.ensureConnected) {
      const early = this.validator.validate(map);
      if (!early.valid) {
        const repaired = this.repairer.repair(map);
        map = repaired.map;
        warnings.push(...repaired.repairs.map((repair) => 'reparo: ' + repair));
      }
    }
    map.metrics = this.analyzer.analyze(map);
    this.encounters.populate(map, random.fork('encounters'));
    this.loot.populate(map, random.fork('loot'));
    this.decorations.populate(map, random.fork('decorations'));
    hooks.afterContent?.(map);

    const report = this.validator.validate(map);
    map.metrics = report.metrics;
    warnings.push(...report.issues.filter((issue) => issue.severity === 'warning').map((issue) => issue.code + ': ' + issue.message));
    const result: GenerationResult = {
      map,
      warnings,
      repaired: Boolean(map.metadata.repaired),
      attempts: 1,
    };
    if (!report.valid) {
      const repaired = this.repairer.repair(map);
      result.map = repaired.map;
      result.map.metrics = this.analyzer.analyze(result.map);
      result.repaired = true;
      result.warnings.push(...repaired.repairs.map((repair) => 'reparo-final: ' + repair));
    }
    hooks.afterValidation?.(result);
    return result;
  }

  public generateBatch(options: GeneratorOptions, count: number): GenerationResult[] {
    if (!Number.isSafeInteger(count) || count < 1 || count > 100) throw new RangeError('batch count must be between 1 and 100');
    return Array.from({ length: count }, (_, index) => this.generate({ ...options, seed: String(options.seed) + ':' + index }));
  }
}
`);

emit('integration/LevelDefinitionAdapter.ts', String.raw`
import type { DecorationPlacement, EnemyPlacement, ItemPlacement, LevelDefinition } from '../../data/LevelData';
import { GeneratedMap } from '../core/types';

type LevelTheme = LevelDefinition['theme'];

const THEME_BY_BIOME: Record<string, LevelTheme> = {
  cathedral: 'gothic_cathedral',
  inferno: 'inferno_pit',
  celestial: 'celestial_tower',
  streets: 'venetian_streets',
  ruins: 'roman_ruins',
  garden: 'paradiso_garden',
  crypt: 'witches_crypt',
  clocktower: 'clocktower',
  colosseum: 'colosseum',
  void: 'limbo_void',
};

const AMBIENCE: Record<string, { ambient: number; fog: number; density: number; light: number; music: string }> = {
  cathedral: { ambient: 0x332244, fog: 0x1a0a2e, density: 0.3, light: 0.6, music: 'ost_vestibule' },
  inferno: { ambient: 0x661100, fog: 0x220000, density: 0.45, light: 0.55, music: 'ost_inferno' },
  celestial: { ambient: 0xddeeff, fog: 0xffffff, density: 0.12, light: 1, music: 'ost_paradiso' },
  streets: { ambient: 0x445566, fog: 0x223344, density: 0.2, light: 0.8, music: 'ost_vigrid_streets' },
  ruins: { ambient: 0x776655, fog: 0x332d28, density: 0.25, light: 0.7, music: 'ost_ruins' },
  garden: { ambient: 0x88bb99, fog: 0xddeedd, density: 0.18, light: 0.9, music: 'ost_garden' },
  crypt: { ambient: 0x221733, fog: 0x0d0815, density: 0.5, light: 0.42, music: 'ost_crypt' },
  clocktower: { ambient: 0x554433, fog: 0x221a11, density: 0.3, light: 0.58, music: 'ost_clocktower' },
  colosseum: { ambient: 0xaa8866, fog: 0x554433, density: 0.12, light: 0.85, music: 'ost_colosseum' },
  void: { ambient: 0x220044, fog: 0x110022, density: 0.7, light: 0.35, music: 'ost_limbo' },
};

export interface LevelAdapterOptions {
  id?: string;
  name?: string;
  description?: string;
  parTime?: number;
}

export class LevelDefinitionAdapter {
  public adapt(map: GeneratedMap, options: LevelAdapterOptions = {}): LevelDefinition {
    const biome = String(map.metadata.biome ?? 'cathedral');
    const ambience = AMBIENCE[biome] ?? AMBIENCE.cathedral;
    const enemies: EnemyPlacement[] = map.enemies.map((enemy) => ({
      type: enemy.archetype,
      x: enemy.position.x,
      y: enemy.position.y,
      level: enemy.level,
      patrol: enemy.patrol.length > 0 ? enemy.patrol.map((point) => ({ ...point })) : undefined,
    }));
    const items: ItemPlacement[] = map.items.map((item) => ({
      type: item.itemType,
      x: item.position.x,
      y: item.position.y,
      quantity: item.quantity,
    }));
    const decorations: DecorationPlacement[] = map.decorations.map((decoration) => ({
      type: decoration.decorationType,
      x: decoration.position.x,
      y: decoration.position.y,
      scale: decoration.scale,
      rotation: decoration.rotation,
      tint: decoration.tint,
    }));
    return {
      id: options.id ?? 'procedural-' + map.algorithm + '-' + this.slug(map.seed),
      name: options.name ?? 'Descida ' + this.displayAlgorithm(map.algorithm),
      description: options.description ?? 'Fase procedural determinística gerada por ' + map.algorithm + ' com semente ' + map.seed + '.',
      theme: THEME_BY_BIOME[biome] ?? 'gothic_cathedral',
      music: ambience.music,
      ambientColor: ambience.ambient,
      fogColor: ambience.fog,
      fogDensity: ambience.density,
      lightIntensity: ambience.light,
      tileMap: map.tiles.map((row) => [...row]),
      enemies,
      items,
      decorations,
      parTime: options.parTime ?? Math.max(90, Math.round(map.metrics.mainPathLength * 2.5 + enemies.length * 10)),
      difficulty: Number(map.metadata.difficulty ?? 3),
    };
  }

  private slug(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32) || 'seed';
  }

  private displayAlgorithm(algorithm: string): string {
    return algorithm.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }
}
`);

emit('integration/ProceduralLevelFactory.ts', String.raw`
import type { LevelDefinition } from '../../data/LevelData';
import { GeneratorAlgorithm, GeneratorOptions } from '../core/types';
import { GenerationPreset, PresetId, getPreset, optionsFromPreset } from '../pipeline/GenerationPresets';
import { ProceduralPipeline } from '../pipeline/ProceduralPipeline';
import { LevelDefinitionAdapter, LevelAdapterOptions } from './LevelDefinitionAdapter';

export interface ProceduralLevelRequest {
  seed: string | number;
  preset?: PresetId;
  algorithm?: GeneratorAlgorithm;
  overrides?: Partial<GeneratorOptions>;
  level?: LevelAdapterOptions;
}

export class ProceduralLevelFactory {
  public constructor(
    private readonly pipeline = new ProceduralPipeline(),
    private readonly adapter = new LevelDefinitionAdapter(),
  ) {}

  public create(request: ProceduralLevelRequest): LevelDefinition {
    const preset = request.preset ?? 'roguelike-mix';
    const options = optionsFromPreset(preset, request.seed, {
      ...request.overrides,
      algorithm: request.algorithm ?? request.overrides?.algorithm,
    });
    const result = this.pipeline.generate(options);
    return this.adapter.adapt(result.map, request.level);
  }

  public createRun(seed: string | number, presets: readonly PresetId[]): LevelDefinition[] {
    return presets.map((preset, index) => this.create({
      seed: String(seed) + ':floor-' + index,
      preset,
      overrides: { difficulty: Math.min(10, index + 1) },
      level: { id: 'procedural-floor-' + (index + 1), name: 'Andar Procedural ' + (index + 1) },
    }));
  }

  public describePreset(id: PresetId): GenerationPreset {
    return getPreset(id);
  }
}
`);

emit('index.ts', String.raw`
export * from './core/types';
export * from './core/Grid';
export * from './core/Geometry';
export * from './core/DisjointSet';
export * from './core/Noise';
export * from './core/GenerationSupport';
export * from './carving/CorridorCarver';
export * from './analysis/Pathfinder';
export * from './analysis/TopologyAnalyzer';
export * from './analysis/MapValidator';
export * from './analysis/MapRepairer';
export * from './algorithms/BspDungeonGenerator';
export * from './algorithms/DrunkardWalkGenerator';
export * from './algorithms/CellularAutomataGenerator';
export * from './algorithms/MazeGenerators';
export * from './algorithms/RoomGraphGenerator';
export * from './algorithms/WaveFunctionCollapseGenerator';
export * from './algorithms/GrammarDungeonGenerator';
export * from './algorithms/VoronoiCaveGenerator';
export * from './algorithms/HybridDungeonGenerator';
export * from './content/SpawnPlanner';
export * from './content/EncounterPlanner';
export * from './content/LootPlanner';
export * from './content/DecorationPlanner';
export * from './terrain/BiomePainter';
export * from './rules/TerrainRule';
export * from './rules/TerrainRuleRegistry';
export * from './rules/TerrainComposer';
export * from './pipeline/GeneratorRegistry';
export * from './pipeline/GenerationPresets';
export * from './pipeline/ProceduralPipeline';
export * from './integration/LevelDefinitionAdapter';
export * from './integration/ProceduralLevelFactory';
`);

for (const [name, source] of files) {
  const target = join(root, name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, source, 'utf8');
}

console.log('Generated ' + files.size + ' procedural-generation source files.');
