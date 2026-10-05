import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerGuardBreakerAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-guard-breaker',
    name: 'Ranger Guard Breaker',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'primary',
    targeting: 'line',
    damageType: 'frost',
    baseDamage: 37,
    powerRatio: 0.520,
    range: 484,
    radius: 46,
    angle: 59,
    castTime: 240,
    recoveryTime: 290,
    cooldown: 270,
    charges: 1,
    costs: [{ resource: 'stamina', amount: 6 }],
    tags: ['ranger', 'primary', 'line', 'frost', 'ability-3'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_primary_3',
    visualEffect: 'fx_frost_3',
    soundEffect: 'sfx_ranger_3',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.stamina < 6) return 'insufficient-resource';
    if (false && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.24);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.13);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.024, ignoresResistance: 0.020, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-surge', sourceId: context.caster.id, targetId: target.id, duration: 1980, intensity: 1.3, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 34, duration: 126, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || true) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 636, lifetime: 990, radius: 10, piercing: 2, bounces: 2, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 88, duration: 108, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 4, reason: this.definition.id });
    return impact;
  }
}
