import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageSignatureSpecialAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-signature-special',
    name: 'Mage Signature Special',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'reaction',
    targeting: 'dash',
    damageType: 'frost',
    baseDamage: 112,
    powerRatio: 1.430,
    range: 426,
    radius: 24,
    angle: 71,
    castTime: 0,
    recoveryTime: 345,
    cooldown: 6840,
    charges: 1,
    costs: [{ resource: 'mana', amount: 54 }],
    tags: ['mage', 'reaction', 'dash', 'frost', 'ability-29'],
    interruptible: false,
    canMoveWhileCasting: false,
    animation: 'mage_reaction_5',
    visualEffect: 'fx_frost_5',
    soundEffect: 'sfx_mage_1',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 54) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.15500000000000003);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.336, ignoresResistance: 0.280, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'arcane-mastery', sourceId: context.caster.id, targetId: target.id, duration: 4320, intensity: 1.45, stacks: 1, abilityId: this.definition.id });
      if (true) impact.displacement.push({ targetId: target.id, direction, distance: 86, duration: 204, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 744, lifetime: 2160, radius: 12, piercing: 0, bounces: 1, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (true) impact.displacement.push({ targetId: context.caster.id, direction, distance: 192, duration: 212, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 2, reason: this.definition.id });
    return impact;
  }
}
