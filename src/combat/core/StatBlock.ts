import { CombatStats, StatModifier, clamp } from './types';

export class StatBlock {
  private base: CombatStats;
  private readonly modifiers = new Map<string, StatModifier>();
  private cache?: CombatStats;

  public constructor(stats: CombatStats) { this.base = { ...stats }; }

  public get<K extends keyof CombatStats>(stat: K): CombatStats[K] { return this.evaluate()[stat]; }
  public getBase<K extends keyof CombatStats>(stat: K): CombatStats[K] { return this.base[stat]; }

  public setBase<K extends keyof CombatStats>(stat: K, value: CombatStats[K]): void {
    this.base[stat] = value;
    this.cache = undefined;
  }

  public replaceBase(stats: CombatStats): void { this.base = { ...stats }; this.cache = undefined; }

  public addModifier(modifier: StatModifier): void {
    if (!modifier.id) throw new Error('stat modifier id cannot be empty');
    if (!Number.isFinite(modifier.value)) throw new RangeError('stat modifier value must be finite');
    this.modifiers.set(modifier.id, { ...modifier });
    this.cache = undefined;
  }

  public removeModifier(id: string): boolean {
    const removed = this.modifiers.delete(id);
    if (removed) this.cache = undefined;
    return removed;
  }

  public removeByPrefix(prefix: string): number {
    let removed = 0;
    for (const id of this.modifiers.keys()) if (id.startsWith(prefix) && this.removeModifier(id)) removed++;
    return removed;
  }

  public hasModifier(id: string): boolean { return this.modifiers.has(id); }
  public listModifiers(): StatModifier[] { return [...this.modifiers.values()].map((modifier) => ({ ...modifier })); }

  public evaluate(): CombatStats {
    if (this.cache) return { ...this.cache };
    const result = { ...this.base };
    const grouped = new Map<keyof CombatStats, StatModifier[]>();
    for (const modifier of this.modifiers.values()) grouped.set(modifier.stat, [...(grouped.get(modifier.stat) ?? []), modifier]);
    for (const [stat, modifiers] of grouped) {
      let value = result[stat];
      for (const modifier of modifiers.filter((entry) => entry.operation === 'add').sort((a, b) => a.priority - b.priority)) value += modifier.value;
      for (const modifier of modifiers.filter((entry) => entry.operation === 'multiply').sort((a, b) => a.priority - b.priority)) value *= modifier.value;
      const overrides = modifiers.filter((entry) => entry.operation === 'override').sort((a, b) => a.priority - b.priority);
      if (overrides.length > 0) value = overrides[overrides.length - 1].value;
      result[stat] = this.sanitize(stat, value);
    }
    this.cache = result;
    return { ...result };
  }

  public snapshot(): { base: CombatStats; modifiers: StatModifier[] } {
    return { base: { ...this.base }, modifiers: this.listModifiers() };
  }

  public restore(snapshot: { base: CombatStats; modifiers: StatModifier[] }): void {
    this.base = { ...snapshot.base };
    this.modifiers.clear();
    for (const modifier of snapshot.modifiers) this.modifiers.set(modifier.id, { ...modifier });
    this.cache = undefined;
  }

  private sanitize(stat: keyof CombatStats, value: number): number {
    if (stat === 'criticalChance' || stat === 'lifeSteal' || stat === 'manaSteal' || stat === 'cooldownReduction' || stat === 'dodgeChance' || stat === 'blockChance') return clamp(value, 0, 0.95);
    if (stat === 'criticalMultiplier') return Math.max(1, value);
    if (stat === 'blockPower') return clamp(value, 0, 1);
    if (stat === 'tenacity') return clamp(value, 0, 0.9);
    return Math.max(0, value);
  }
}
