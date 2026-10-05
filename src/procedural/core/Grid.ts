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
