import { CombatEffect, EffectId } from '../core/types';

export class EffectRegistry {
  private readonly effects = new Map<EffectId, CombatEffect>();

  public register(effect: CombatEffect, replace = false): this {
    if (this.effects.has(effect.definition.id) && !replace) throw new Error('effect already registered: ' + effect.definition.id);
    this.effects.set(effect.definition.id, effect);
    return this;
  }

  public registerMany(effects: Iterable<CombatEffect>, replace = false): this { for (const effect of effects) this.register(effect, replace); return this; }
  public unregister(id: EffectId): boolean { return this.effects.delete(id); }
  public has(id: EffectId): boolean { return this.effects.has(id); }
  public get(id: EffectId): CombatEffect { const effect = this.effects.get(id); if (!effect) throw new Error('unknown effect: ' + id); return effect; }
  public list(): CombatEffect[] { return [...this.effects.values()]; }
  public byTag(tag: string): CombatEffect[] { return this.list().filter((effect) => effect.definition.tags.includes(tag)); }
  public byKind(kind: CombatEffect['definition']['kind']): CombatEffect[] { return this.list().filter((effect) => effect.definition.kind === kind); }
  public clear(): void { this.effects.clear(); }
  public get size(): number { return this.effects.size; }
}
