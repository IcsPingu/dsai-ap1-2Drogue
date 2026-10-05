export interface CooldownSnapshot {
  id: string;
  startedAt: number;
  duration: number;
  charges: number;
  maximumCharges: number;
  rechargeStartedAt: number;
}

export class CooldownBook {
  private readonly entries = new Map<string, CooldownSnapshot>();

  public configure(id: string, maximumCharges = 1): void {
    if (maximumCharges < 1 || !Number.isSafeInteger(maximumCharges)) throw new RangeError('charges must be a positive integer');
    const current = this.entries.get(id);
    this.entries.set(id, current ? { ...current, maximumCharges, charges: Math.min(current.charges, maximumCharges) } : {
      id, startedAt: 0, duration: 0, charges: maximumCharges, maximumCharges, rechargeStartedAt: 0,
    });
  }

  public isReady(id: string, now: number): boolean { this.updateEntry(id, now); return (this.entries.get(id)?.charges ?? 1) > 0; }

  public consume(id: string, now: number, duration: number, maximumCharges = 1): boolean {
    if (!this.entries.has(id)) this.configure(id, maximumCharges);
    this.updateEntry(id, now);
    const entry = this.entries.get(id)!;
    if (entry.charges <= 0) return false;
    entry.charges--;
    entry.duration = Math.max(0, duration);
    entry.startedAt = now;
    if (entry.charges === entry.maximumCharges - 1) entry.rechargeStartedAt = now;
    return true;
  }

  public reset(id: string): void {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.charges = entry.maximumCharges;
    entry.startedAt = 0;
    entry.rechargeStartedAt = 0;
  }

  public reduce(id: string, milliseconds: number, now: number): void {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.rechargeStartedAt -= Math.max(0, milliseconds);
    this.updateEntry(id, now);
  }

  public remaining(id: string, now: number): number {
    this.updateEntry(id, now);
    const entry = this.entries.get(id);
    if (!entry || entry.charges > 0) return 0;
    return Math.max(0, entry.duration - (now - entry.rechargeStartedAt));
  }

  public charges(id: string, now: number): number { this.updateEntry(id, now); return this.entries.get(id)?.charges ?? 1; }
  public remove(id: string): boolean { return this.entries.delete(id); }
  public clear(): void { this.entries.clear(); }
  public snapshot(): CooldownSnapshot[] { return [...this.entries.values()].map((entry) => ({ ...entry })); }
  public restore(entries: readonly CooldownSnapshot[]): void { this.entries.clear(); for (const entry of entries) this.entries.set(entry.id, { ...entry }); }

  public update(now: number): string[] {
    const recharged: string[] = [];
    for (const id of this.entries.keys()) if (this.updateEntry(id, now)) recharged.push(id);
    return recharged;
  }

  private updateEntry(id: string, now: number): boolean {
    const entry = this.entries.get(id);
    if (!entry || entry.charges >= entry.maximumCharges || entry.duration <= 0) return false;
    let changed = false;
    while (entry.charges < entry.maximumCharges && now - entry.rechargeStartedAt >= entry.duration) {
      entry.charges++;
      entry.rechargeStartedAt += entry.duration;
      changed = true;
    }
    if (entry.charges >= entry.maximumCharges) entry.rechargeStartedAt = 0;
    return changed;
  }
}
