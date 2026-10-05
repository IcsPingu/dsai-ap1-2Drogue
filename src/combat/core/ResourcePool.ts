import { CombatResources, ResourceCost, ResourceType, clamp } from './types';

export class ResourcePool {
  private readonly values: CombatResources;
  private readonly maximums: CombatResources;

  public constructor(initial: CombatResources, maximums: CombatResources) {
    this.maximums = { ...maximums };
    this.values = { ...initial };
    for (const type of this.types()) this.values[type] = clamp(this.values[type], 0, this.maximums[type]);
  }

  public get(type: ResourceType): number { return this.values[type]; }
  public maximum(type: ResourceType): number { return this.maximums[type]; }
  public ratio(type: ResourceType): number { return this.maximums[type] <= 0 ? 0 : this.values[type] / this.maximums[type]; }

  public set(type: ResourceType, value: number): number {
    const before = this.values[type];
    this.values[type] = clamp(value, 0, this.maximums[type]);
    return this.values[type] - before;
  }

  public setMaximum(type: ResourceType, value: number, preserveRatio = false): void {
    const ratio = this.ratio(type);
    this.maximums[type] = Math.max(0, value);
    this.values[type] = preserveRatio ? this.maximums[type] * ratio : clamp(this.values[type], 0, this.maximums[type]);
  }

  public gain(type: ResourceType, amount: number): number { return this.set(type, this.values[type] + Math.max(0, amount)); }
  public lose(type: ResourceType, amount: number): number { return -this.set(type, this.values[type] - Math.max(0, amount)); }
  public empty(type: ResourceType): number { return this.lose(type, this.values[type]); }
  public fill(type: ResourceType): number { return this.gain(type, this.maximums[type] - this.values[type]); }

  public canAfford(costs: readonly ResourceCost[]): boolean {
    return costs.every((cost) => this.values[cost.resource] >= this.resolveCost(cost));
  }

  public spend(costs: readonly ResourceCost[]): Record<ResourceType, number> | undefined {
    if (!this.canAfford(costs)) return undefined;
    const spent = this.zeroRecord();
    for (const cost of costs) {
      const amount = this.resolveCost(cost);
      this.lose(cost.resource, amount);
      spent[cost.resource] += amount;
    }
    return spent;
  }

  public refund(spent: Partial<Record<ResourceType, number>>, ratio = 1): void {
    for (const type of this.types()) this.gain(type, (spent[type] ?? 0) * clamp(ratio, 0, 1));
  }

  public snapshot(): CombatResources { return { ...this.values }; }
  public maximumSnapshot(): CombatResources { return { ...this.maximums }; }

  public restore(values: CombatResources, maximums?: CombatResources): void {
    if (maximums) Object.assign(this.maximums, maximums);
    for (const type of this.types()) this.values[type] = clamp(values[type], 0, this.maximums[type]);
  }

  private resolveCost(cost: ResourceCost): number {
    const raw = cost.percentage ? this.maximums[cost.resource] * cost.amount : cost.amount;
    return Math.max(0, raw);
  }

  private types(): ResourceType[] { return ['health', 'mana', 'stamina', 'guard', 'combo', 'ultimate']; }

  private zeroRecord(): Record<ResourceType, number> {
    return { health: 0, mana: 0, stamina: 0, guard: 0, combo: 0, ultimate: 0 };
  }
}
