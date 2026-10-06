interface HeapEntry<T> {
  value: T;
  priority: number;
  order: number;
}

/** Stable minimum heap used by path searches and navigation jobs. */
export class BinaryHeap<T> {
  private readonly entries: HeapEntry<T>[] = [];
  private sequence = 0;

  public get size(): number {
    return this.entries.length;
  }

  public get empty(): boolean {
    return this.entries.length === 0;
  }

  public clear(): void {
    this.entries.length = 0;
    this.sequence = 0;
  }

  public push(value: T, priority: number): void {
    if (!Number.isFinite(priority)) throw new RangeError('heap priority must be finite');
    const entry: HeapEntry<T> = { value, priority, order: this.sequence++ };
    this.entries.push(entry);
    this.bubbleUp(this.entries.length - 1);
  }

  public peek(): T | undefined {
    return this.entries[0]?.value;
  }

  public pop(): T | undefined {
    if (this.entries.length === 0) return undefined;
    const root = this.entries[0];
    const tail = this.entries.pop()!;
    if (this.entries.length > 0) {
      this.entries[0] = tail;
      this.sinkDown(0);
    }
    return root.value;
  }

  private compare(left: HeapEntry<T>, right: HeapEntry<T>): number {
    return left.priority - right.priority || left.order - right.order;
  }

  private bubbleUp(start: number): void {
    let index = start;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.entries[index], this.entries[parent]) >= 0) break;
      [this.entries[index], this.entries[parent]] = [this.entries[parent], this.entries[index]];
      index = parent;
    }
  }

  private sinkDown(start: number): void {
    let index = start;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      if (left < this.entries.length && this.compare(this.entries[left], this.entries[smallest]) < 0) smallest = left;
      if (right < this.entries.length && this.compare(this.entries[right], this.entries[smallest]) < 0) smallest = right;
      if (smallest === index) return;
      [this.entries[index], this.entries[smallest]] = [this.entries[smallest], this.entries[index]];
      index = smallest;
    }
  }
}
