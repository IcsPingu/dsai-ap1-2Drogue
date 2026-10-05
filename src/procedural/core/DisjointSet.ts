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
