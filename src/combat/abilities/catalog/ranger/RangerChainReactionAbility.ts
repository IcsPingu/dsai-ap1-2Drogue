import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerChainReactionAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-chain-reaction',
    name: 'Ranger Chain Reaction',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'special',
    targeting: 'chain',
    damageType: 'poison',
    baseDamage: 79,
    powerRatio: 1.010,
    range: 462,
    radius: 46,
    angle: 47,
    castTime: 0,
    recoveryTime: 235,
    cooldown: 4680,
    charges: 1,
    costs: [{ resource: 'mana', amount: 36 }],
    tags: ['ranger', 'special', 'chain', 'poison', 'ability-17'],
    interruptible: false,
    canMoveWhileCasting: true,
    animation: 'ranger_special_5',
    visualEffect: 'fx_poison_1',
    soundEffect: 'sfx_ranger_3',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 36) return 'insufficient-resource';
    if (false && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.18);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.10500000000000001);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.192, ignoresResistance: 0.160, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-echo', sourceId: context.caster.id, targetId: target.id, duration: 3240, intensity: 1.15, stacks: 1, abilityId: this.definition.id });
      if (true) impact.displacement.push({ targetId: target.id, direction, distance: 62, duration: 168, kind: 'pull' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 748, lifetime: 1620, radius: 12, piercing: 0, bounces: 1, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 144, duration: 164, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 4, reason: this.definition.id });
    return impact;
  }
}
