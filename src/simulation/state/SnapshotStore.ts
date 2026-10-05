import { JsonObject, KernelSnapshot, Tick, cloneJson, stableStringify } from '../core/types';

export interface StoredSnapshot {
  readonly tick: Tick;
  readonly label: string;
  readonly checksum: number;
  readonly snapshot: KernelSnapshot;
}

export interface SnapshotDifference extends JsonObject {
  path: string;
  before: string;
  after: string;
}

export class SnapshotStore {
  private readonly snapshots: StoredSnapshot[] = [];

  public constructor(public readonly capacity = 120) {
    if (!Number.isSafeInteger(capacity) || capacity <= 0) {
      throw new RangeError('snapshot capacity must be a positive integer');
    }
  }

  public get size(): number {
    return this.snapshots.length;
  }

  public save(tick: Tick, snapshot: KernelSnapshot, label = ''): StoredSnapshot {
    const stored: StoredSnapshot = {
      tick,
      label,
      checksum: this.checksum(snapshot),
      snapshot: cloneJson(snapshot),
    };
    const existingIndex = this.snapshots.findIndex(candidate => candidate.tick === tick);
    if (existingIndex >= 0) {
      this.snapshots.splice(existingIndex, 1, stored);
    } else {
      this.snapshots.push(stored);
      this.snapshots.sort((left, right) => left.tick - right.tick);
    }
    while (this.snapshots.length > this.capacity) {
      this.snapshots.shift();
    }
    return this.clone(stored);
  }

  public exact(tick: Tick): StoredSnapshot | undefined {
    const snapshot = this.snapshots.find(candidate => candidate.tick === tick);
    return snapshot ? this.clone(snapshot) : undefined;
  }

  public nearestAtOrBefore(tick: Tick): StoredSnapshot | undefined {
    for (let index = this.snapshots.length - 1; index >= 0; index--) {
      if (this.snapshots[index].tick <= tick) {
        return this.clone(this.snapshots[index]);
      }
    }
    return undefined;
  }

  public nearestAtOrAfter(tick: Tick): StoredSnapshot | undefined {
    for (const snapshot of this.snapshots) {
      if (snapshot.tick >= tick) {
        return this.clone(snapshot);
      }
    }
    return undefined;
  }

  public oldest(): StoredSnapshot | undefined {
    const snapshot = this.snapshots[0];
    return snapshot ? this.clone(snapshot) : undefined;
  }

  public newest(): StoredSnapshot | undefined {
    const snapshot = this.snapshots[this.snapshots.length - 1];
    return snapshot ? this.clone(snapshot) : undefined;
  }

  public list(): StoredSnapshot[] {
    return this.snapshots.map(snapshot => this.clone(snapshot));
  }

  public remove(tick: Tick): boolean {
    const index = this.snapshots.findIndex(snapshot => snapshot.tick === tick);
    if (index < 0) return false;
    this.snapshots.splice(index, 1);
    return true;
  }

  public removeBefore(tick: Tick): number {
    let removed = 0;
    while (this.snapshots.length > 0 && this.snapshots[0].tick < tick) {
      this.snapshots.shift();
      removed++;
    }
    return removed;
  }

  public removeAfter(tick: Tick): number {
    let removed = 0;
    while (this.snapshots.length > 0 && this.snapshots[this.snapshots.length - 1].tick > tick) {
      this.snapshots.pop();
      removed++;
    }
    return removed;
  }

  public clear(): void {
    this.snapshots.length = 0;
  }

  public verify(stored: StoredSnapshot): boolean {
    return stored.checksum === this.checksum(stored.snapshot);
  }

  public compare(leftTick: Tick, rightTick: Tick): SnapshotDifference[] {
    const left = this.exact(leftTick);
    const right = this.exact(rightTick);
    if (!left || !right) {
      throw new Error('both snapshots must exist before they can be compared');
    }
    const differences: SnapshotDifference[] = [];
    this.diffValue(left.snapshot, right.snapshot, '', differences);
    return differences;
  }

  private diffValue(
    before: unknown,
    after: unknown,
    path: string,
    differences: SnapshotDifference[],
  ): void {
    if (Object.is(before, after)) {
      return;
    }
    if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object') {
      differences.push({ path: path || '/', before: String(before), after: String(after) });
      return;
    }
    if (Array.isArray(before) || Array.isArray(after)) {
      if (!Array.isArray(before) || !Array.isArray(after)) {
        differences.push({ path: path || '/', before: JSON.stringify(before), after: JSON.stringify(after) });
        return;
      }
      const length = Math.max(before.length, after.length);
      for (let index = 0; index < length; index++) {
        this.diffValue(before[index], after[index], path + '/' + index, differences);
      }
      return;
    }
    const beforeObject = before as Record<string, unknown>;
    const afterObject = after as Record<string, unknown>;
    const keys = new Set([...Object.keys(beforeObject), ...Object.keys(afterObject)]);
    for (const key of [...keys].sort()) {
      this.diffValue(beforeObject[key], afterObject[key], path + '/' + key, differences);
    }
  }

  private checksum(snapshot: KernelSnapshot): number {
    const text = stableStringify(snapshot);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  private clone(snapshot: StoredSnapshot): StoredSnapshot {
    return {
      tick: snapshot.tick,
      label: snapshot.label,
      checksum: snapshot.checksum,
      snapshot: cloneJson(snapshot.snapshot),
    };
  }
}
