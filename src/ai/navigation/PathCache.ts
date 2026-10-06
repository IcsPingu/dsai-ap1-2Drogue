import { NavigationPath } from './types';

interface CacheEntry {
  path: NavigationPath;
  touched: number;
}

export class PathCache {
  private readonly entries = new Map<string, CacheEntry>();
  private clock = 0;

  public constructor(private readonly capacity = 256) {
    if (!Number.isSafeInteger(capacity) || capacity <= 0) throw new RangeError('cache capacity must be positive');
  }

  public get size(): number {
    return this.entries.size;
  }

  public get(key: string): NavigationPath | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    entry.touched = ++this.clock;
    return this.clone(entry.path);
  }

  public set(key: string, path: NavigationPath): void {
    this.entries.set(key, { path: this.clone(path), touched: ++this.clock });
    if (this.entries.size > this.capacity) this.evictOldest();
  }

  public clear(): void {
    this.entries.clear();
    this.clock = 0;
  }

  private evictOldest(): void {
    let oldestKey: string | undefined;
    let oldestTouch = Infinity;
    for (const [key, entry] of this.entries) {
      if (entry.touched < oldestTouch) {
        oldestTouch = entry.touched;
        oldestKey = key;
      }
    }
    if (oldestKey !== undefined) this.entries.delete(oldestKey);
  }

  private clone(path: NavigationPath): NavigationPath {
    return { ...path, points: path.points.map((point) => ({ ...point })) };
  }
}
