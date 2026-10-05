export interface PriorityQueueNode<T> {
  readonly value: T;
  readonly priority: number;
  readonly sequence: number;
}

export interface PriorityQueueSnapshot<T> {
  readonly sequence: number;
  readonly nodes: readonly PriorityQueueNode<T>[];
}

export class PriorityQueue<T> implements Iterable<T> {
  private readonly heap: PriorityQueueNode<T>[] = [];
  private sequence = 0;

  public constructor(private readonly highestFirst = false) {}

  public get size(): number {
    return this.heap.length;
  }

  public get empty(): boolean {
    return this.heap.length === 0;
  }

  public enqueue(value: T, priority: number): PriorityQueueNode<T> {
    if (!Number.isFinite(priority)) {
      throw new RangeError('priority must be finite');
    }
    const node: PriorityQueueNode<T> = {
      value,
      priority,
      sequence: this.sequence++,
    };
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
    return node;
  }

  public dequeue(): T | undefined {
    return this.dequeueNode()?.value;
  }

  public dequeueNode(): PriorityQueueNode<T> | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }
    if (this.heap.length === 1) {
      return this.heap.pop();
    }
    const root = this.heap[0];
    const tail = this.heap.pop()!;
    this.heap[0] = tail;
    this.sinkDown(0);
    return root;
  }

  public peek(): T | undefined {
    return this.heap[0]?.value;
  }

  public peekNode(): PriorityQueueNode<T> | undefined {
    return this.heap[0];
  }

  public clear(): void {
    this.heap.length = 0;
  }

  public remove(predicate: (value: T) => boolean): number {
    let removed = 0;
    for (let index = this.heap.length - 1; index >= 0; index--) {
      if (!predicate(this.heap[index].value)) {
        continue;
      }
      removed++;
      const tail = this.heap.pop()!;
      if (index >= this.heap.length) {
        continue;
      }
      this.heap[index] = tail;
      const parent = Math.floor((index - 1) / 2);
      if (index > 0 && this.compare(this.heap[index], this.heap[parent]) < 0) {
        this.bubbleUp(index);
      } else {
        this.sinkDown(index);
      }
    }
    return removed;
  }

  public updatePriority(predicate: (value: T) => boolean, priority: number): number {
    if (!Number.isFinite(priority)) {
      throw new RangeError('priority must be finite');
    }
    let updated = 0;
    for (const node of this.heap) {
      if (predicate(node.value)) {
        (node as { priority: number }).priority = priority;
        updated++;
      }
    }
    if (updated > 0) {
      this.heapify();
    }
    return updated;
  }

  public toArray(): T[] {
    return this.sortedNodes().map(node => node.value);
  }

  public toNodeArray(): PriorityQueueNode<T>[] {
    return this.sortedNodes();
  }

  public capture(): PriorityQueueSnapshot<T> {
    return {
      sequence: this.sequence,
      nodes: this.heap.map(node => ({ ...node })),
    };
  }

  public restore(snapshot: PriorityQueueSnapshot<T>): void {
    this.sequence = snapshot.sequence;
    this.heap.length = 0;
    this.heap.push(...snapshot.nodes.map(node => ({ ...node })));
    this.heapify();
  }

  public clone(): PriorityQueue<T> {
    const queue = new PriorityQueue<T>(this.highestFirst);
    queue.restore(this.capture());
    return queue;
  }

  public *[Symbol.iterator](): Iterator<T> {
    for (const node of this.sortedNodes()) {
      yield node.value;
    }
  }

  private sortedNodes(): PriorityQueueNode<T>[] {
    const copy = this.cloneWithoutRecursion();
    const nodes: PriorityQueueNode<T>[] = [];
    while (!copy.empty) {
      nodes.push(copy.dequeueNode()!);
    }
    return nodes;
  }

  private cloneWithoutRecursion(): PriorityQueue<T> {
    const queue = new PriorityQueue<T>(this.highestFirst);
    queue.sequence = this.sequence;
    queue.heap.push(...this.heap.map(node => ({ ...node })));
    return queue;
  }

  private compare(left: PriorityQueueNode<T>, right: PriorityQueueNode<T>): number {
    const priorityComparison = this.highestFirst
      ? right.priority - left.priority
      : left.priority - right.priority;
    if (priorityComparison !== 0) {
      return priorityComparison;
    }
    return left.sequence - right.sequence;
  }

  private bubbleUp(startIndex: number): void {
    let index = startIndex;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parent]) >= 0) {
        break;
      }
      this.swap(index, parent);
      index = parent;
    }
  }

  private sinkDown(startIndex: number): void {
    let index = startIndex;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let best = index;
      if (left < this.heap.length && this.compare(this.heap[left], this.heap[best]) < 0) {
        best = left;
      }
      if (right < this.heap.length && this.compare(this.heap[right], this.heap[best]) < 0) {
        best = right;
      }
      if (best === index) {
        break;
      }
      this.swap(index, best);
      index = best;
    }
  }

  private heapify(): void {
    for (let index = Math.floor(this.heap.length / 2) - 1; index >= 0; index--) {
      this.sinkDown(index);
    }
  }

  private swap(left: number, right: number): void {
    const temporary = this.heap[left];
    this.heap[left] = this.heap[right];
    this.heap[right] = temporary;
  }
}
