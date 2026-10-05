import { CombatantId } from '../core/types';

export interface ThreatEntry {
  combatantId: CombatantId;
  threat: number;
  lastChangedAt: number;
  tauntedUntil: number;
  modifiers: Record<string, number>;
}

export class ThreatTable {
  private readonly entries = new Map<CombatantId, ThreatEntry>();
  private forcedTarget?: CombatantId;
  private forcedUntil = 0;

  public add(combatantId: CombatantId, amount: number, now: number, source = 'generic'): number {
    const entry = this.getOrCreate(combatantId, now);
    const multiplier = Object.values(entry.modifiers).reduce((value, modifier) => value * modifier, 1);
    const applied = Math.max(0, amount) * multiplier;
    entry.threat += applied;
    entry.lastChangedAt = now;
    entry.modifiers[source] ??= 1;
    return applied;
  }

  public subtract(combatantId: CombatantId, amount: number, now: number): number {
    const entry = this.getOrCreate(combatantId, now);
    const removed = Math.min(entry.threat, Math.max(0, amount));
    entry.threat -= removed;
    entry.lastChangedAt = now;
    return removed;
  }

  public multiply(combatantId: CombatantId, multiplier: number, now: number): void {
    const entry = this.getOrCreate(combatantId, now);
    entry.threat = Math.max(0, entry.threat * Math.max(0, multiplier));
    entry.lastChangedAt = now;
  }

  public setModifier(combatantId: CombatantId, id: string, multiplier: number, now: number): void {
    const entry = this.getOrCreate(combatantId, now);
    entry.modifiers[id] = Math.max(0, multiplier);
  }

  public removeModifier(combatantId: CombatantId, id: string): boolean {
    return delete this.entries.get(combatantId)?.modifiers[id];
  }

  public taunt(combatantId: CombatantId, now: number, duration: number, bonus = 1): void {
    const entry = this.getOrCreate(combatantId, now);
    const maximum = Math.max(0, ...this.list().map((candidate) => candidate.threat));
    entry.threat = Math.max(entry.threat, maximum + bonus);
    entry.tauntedUntil = now + Math.max(0, duration);
    this.forcedTarget = combatantId;
    this.forcedUntil = entry.tauntedUntil;
  }

  public target(now: number, eligible?: (combatantId: CombatantId) => boolean): CombatantId | undefined {
    if (this.forcedTarget && now < this.forcedUntil && (!eligible || eligible(this.forcedTarget))) return this.forcedTarget;
    this.forcedTarget = undefined;
    return this.list().filter((entry) => !eligible || eligible(entry.combatantId))
      .sort((left, right) => right.threat - left.threat || right.lastChangedAt - left.lastChangedAt || left.combatantId.localeCompare(right.combatantId))[0]?.combatantId;
  }

  public decay(now: number, elapsedMilliseconds: number, percentagePerSecond: number, flatPerSecond = 0): void {
    const seconds = Math.max(0, elapsedMilliseconds) / 1000;
    const multiplier = Math.pow(Math.max(0, 1 - percentagePerSecond), seconds);
    for (const entry of this.entries.values()) {
      entry.threat = Math.max(0, entry.threat * multiplier - flatPerSecond * seconds);
      if (entry.threat === 0 && now - entry.lastChangedAt > 10000) this.entries.delete(entry.combatantId);
    }
  }

  public transfer(from: CombatantId, to: CombatantId, ratio: number, now: number): number {
    const source = this.getOrCreate(from, now);
    const amount = source.threat * Math.max(0, Math.min(1, ratio));
    source.threat -= amount;
    this.add(to, amount, now, 'transfer');
    return amount;
  }

  public remove(combatantId: CombatantId): boolean { if (this.forcedTarget === combatantId) this.forcedTarget = undefined; return this.entries.delete(combatantId); }
  public clear(): void { this.entries.clear(); this.forcedTarget = undefined; this.forcedUntil = 0; }
  public get(combatantId: CombatantId): ThreatEntry | undefined { const entry = this.entries.get(combatantId); return entry ? this.clone(entry) : undefined; }
  public list(): ThreatEntry[] { return [...this.entries.values()].map((entry) => this.clone(entry)); }
  public restore(entries: readonly ThreatEntry[]): void { this.entries.clear(); for (const entry of entries) this.entries.set(entry.combatantId, this.clone(entry)); }

  private getOrCreate(combatantId: CombatantId, now: number): ThreatEntry {
    const entry = this.entries.get(combatantId) ?? { combatantId, threat: 0, lastChangedAt: now, tauntedUntil: 0, modifiers: {} };
    this.entries.set(combatantId, entry);
    return entry;
  }

  private clone(entry: ThreatEntry): ThreatEntry { return { ...entry, modifiers: { ...entry.modifiers } }; }
}
