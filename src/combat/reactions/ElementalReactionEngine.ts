import { AbilityImpact, ActiveEffectSnapshot, CombatantId, DamageType, createEmptyImpact } from '../core/types';

export interface ElementalReaction {
  id: string;
  name: string;
  requiredTags: string[];
  consumedTags: string[];
  damageType: DamageType;
  baseDamage: number;
  powerRatio: number;
  bonusPerStack: number;
  effectId?: string;
  effectDuration?: number;
  resourceReward: number;
  priority: number;
}

export interface ReactionResult {
  reaction: ElementalReaction;
  sourceId: CombatantId;
  targetId: CombatantId;
  consumedInstances: string[];
  impact: AbilityImpact;
}

export class ElementalReactionEngine {
  private readonly reactions = new Map<string, ElementalReaction>();

  public constructor(registerDefaults = true) {
    if (registerDefaults) this.registerDefaults();
  }

  public register(reaction: ElementalReaction): void {
    if (this.reactions.has(reaction.id)) throw new Error('reaction already registered: ' + reaction.id);
    if (reaction.requiredTags.length < 2) throw new Error('reaction requires at least two elemental tags');
    this.reactions.set(reaction.id, { ...reaction, requiredTags: [...reaction.requiredTags], consumedTags: [...reaction.consumedTags] });
  }

  public resolve(sourceId: CombatantId, targetId: CombatantId, activeEffects: readonly ActiveEffectSnapshot[], triggeringTags: readonly string[]): ReactionResult | undefined {
    const targetEffects = activeEffects.filter((effect) => effect.targetId === targetId);
    const availableTags = new Set([...triggeringTags, ...targetEffects.flatMap((effect) => effect.tags)]);
    const reaction = [...this.reactions.values()]
      .filter((candidate) => candidate.requiredTags.every((tag) => availableTags.has(tag)))
      .sort((left, right) => right.priority - left.priority || right.baseDamage - left.baseDamage)[0];
    if (!reaction) return undefined;
    const consumed = targetEffects.filter((effect) => effect.tags.some((tag) => reaction.consumedTags.includes(tag)));
    const stacks = consumed.reduce((sum, effect) => sum + effect.stacks, 0);
    const impact = createEmptyImpact();
    impact.damage.push({
      sourceId,
      targetId,
      abilityId: 'reaction-' + reaction.id,
      damageType: reaction.damageType,
      baseAmount: reaction.baseDamage + stacks * reaction.bonusPerStack,
      powerRatio: reaction.powerRatio,
      canCrit: false,
      canBlock: false,
      ignoresArmor: 0.25,
      ignoresResistance: 0.25,
      tags: ['elemental-reaction', reaction.id, ...reaction.requiredTags],
      hitIndex: 0,
    });
    if (reaction.effectId) impact.effects.push({ effectId: reaction.effectId, sourceId, targetId, duration: reaction.effectDuration, intensity: 1 + stacks * 0.1, abilityId: 'reaction-' + reaction.id });
    impact.resourceChanges.push({ targetId: sourceId, resource: 'ultimate', amount: reaction.resourceReward, reason: 'elemental-reaction-' + reaction.id });
    return { reaction: { ...reaction, requiredTags: [...reaction.requiredTags], consumedTags: [...reaction.consumedTags] }, sourceId, targetId, consumedInstances: consumed.map((effect) => effect.instanceId), impact };
  }

  public list(): ElementalReaction[] { return [...this.reactions.values()].map((reaction) => ({ ...reaction, requiredTags: [...reaction.requiredTags], consumedTags: [...reaction.consumedTags] })); }

  private registerDefaults(): void {
    const defaults: ElementalReaction[] = [
      { id: 'melt', name: 'Melt', requiredTags: ['fire', 'frost'], consumedTags: ['fire', 'frost'], damageType: 'true', baseDamage: 35, powerRatio: 0.45, bonusPerStack: 8, effectId: 'fire-exposure', effectDuration: 2200, resourceReward: 8, priority: 80 },
      { id: 'overload', name: 'Overload', requiredTags: ['fire', 'lightning'], consumedTags: ['fire', 'lightning'], damageType: 'fire', baseDamage: 42, powerRatio: 0.5, bonusPerStack: 6, effectId: 'lightning-weakness', effectDuration: 1800, resourceReward: 10, priority: 75 },
      { id: 'superconduct', name: 'Superconduct', requiredTags: ['frost', 'lightning'], consumedTags: ['frost'], damageType: 'lightning', baseDamage: 24, powerRatio: 0.32, bonusPerStack: 5, effectId: 'physical-exposure', effectDuration: 3500, resourceReward: 7, priority: 65 },
      { id: 'purge', name: 'Radiant Purge', requiredTags: ['holy', 'shadow'], consumedTags: ['shadow'], damageType: 'holy', baseDamage: 50, powerRatio: 0.6, bonusPerStack: 10, effectId: 'holy-surge', effectDuration: 2000, resourceReward: 12, priority: 90 },
      { id: 'decay', name: 'Arcane Decay', requiredTags: ['arcane', 'poison'], consumedTags: ['poison'], damageType: 'poison', baseDamage: 30, powerRatio: 0.4, bonusPerStack: 7, effectId: 'arcane-weakness', effectDuration: 3200, resourceReward: 9, priority: 70 },
      { id: 'hemorrhage', name: 'Hemorrhage', requiredTags: ['physical', 'poison'], consumedTags: ['physical'], damageType: 'physical', baseDamage: 38, powerRatio: 0.55, bonusPerStack: 9, effectId: 'physical-wound', effectDuration: 2600, resourceReward: 8, priority: 72 },
      { id: 'eclipse', name: 'Eclipse', requiredTags: ['arcane', 'shadow'], consumedTags: ['arcane', 'shadow'], damageType: 'shadow', baseDamage: 46, powerRatio: 0.58, bonusPerStack: 8, effectId: 'shadow-prison', effectDuration: 1400, resourceReward: 11, priority: 85 },
      { id: 'consecration', name: 'Consecration', requiredTags: ['holy', 'fire'], consumedTags: ['fire'], damageType: 'holy', baseDamage: 32, powerRatio: 0.42, bonusPerStack: 6, effectId: 'holy-aura', effectDuration: 4000, resourceReward: 9, priority: 68 },
    ];
    for (const reaction of defaults) this.register(reaction);
  }
}
