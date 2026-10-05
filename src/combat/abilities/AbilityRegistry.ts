import { Ability, AbilityId, CombatClass } from '../core/types';

export class AbilityRegistry {
  private readonly abilities = new Map<AbilityId, Ability>();

  public register(ability: Ability, replace = false): this {
    if (this.abilities.has(ability.definition.id) && !replace) throw new Error('ability already registered: ' + ability.definition.id);
    this.abilities.set(ability.definition.id, ability);
    return this;
  }
  public registerMany(abilities: Iterable<Ability>, replace = false): this { for (const ability of abilities) this.register(ability, replace); return this; }
  public unregister(id: AbilityId): boolean { return this.abilities.delete(id); }
  public has(id: AbilityId): boolean { return this.abilities.has(id); }
  public get(id: AbilityId): Ability { const ability = this.abilities.get(id); if (!ability) throw new Error('unknown ability: ' + id); return ability; }
  public list(): Ability[] { return [...this.abilities.values()]; }
  public forClass(classId: CombatClass): Ability[] { return this.list().filter((ability) => ability.definition.classId === classId); }
  public byTag(tag: string): Ability[] { return this.list().filter((ability) => ability.definition.tags.includes(tag)); }
  public clear(): void { this.abilities.clear(); }
  public get size(): number { return this.abilities.size; }
}
