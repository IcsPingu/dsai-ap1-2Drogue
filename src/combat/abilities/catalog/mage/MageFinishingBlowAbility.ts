import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageFinishingBlowAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-finishing-blow',
    name: 'Mage Finishing Blow',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'special',
    targeting: 'summon',
    damageType: 'frost',
    baseDamage: 85,
    powerRatio: 1.115,
    range: 448,
    radius: 79,
    angle: 83,
    castTime: 360,
    recoveryTime: 400,
    cooldown: 5220,
    charges: 1,
    costs: [{ resource: 'mana', amount: 45 }],
    tags: ['mage', 'special', 'summon', 'frost', 'ability-20'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'mage_special_2',
    visualEffect: 'fx_frost_4',
    soundEffect: 'sfx_mage_6',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 45) return 'insufficient-resource';
    if (false && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.27);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.18);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: false, ignoresArmor: 0.228, ignoresResistance: 0.190, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'frost-cataclysm', sourceId: context.caster.id, targetId: target.id, duration: 3510, intensity: 1.6, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 68, duration: 177, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 672, lifetime: 1755, radius: 9, piercing: 3, bounces: 1, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 156, duration: 176, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 7, reason: this.definition.id });
    return impact;
  }
}
