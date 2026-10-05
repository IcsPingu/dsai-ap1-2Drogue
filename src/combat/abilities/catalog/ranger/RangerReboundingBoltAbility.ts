import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerReboundingBoltAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-rebounding-bolt',
    name: 'Ranger Rebounding Bolt',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'primary',
    targeting: 'chain',
    damageType: 'physical',
    baseDamage: 49,
    powerRatio: 0.660,
    range: 462,
    radius: 90,
    angle: 47,
    castTime: 240,
    recoveryTime: 235,
    cooldown: 310,
    charges: 1,
    costs: [{ resource: 'stamina', amount: 6 }],
    tags: ['ranger', 'primary', 'chain', 'physical', 'ability-7'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_primary_1',
    visualEffect: 'fx_physical_7',
    soundEffect: 'sfx_ranger_7',
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.10500000000000001);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.072, ignoresResistance: 0.060, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-echo', sourceId: context.caster.id, targetId: target.id, duration: 2340, intensity: 1.15, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 42, duration: 138, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 668, lifetime: 1170, radius: 8, piercing: 2, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 104, duration: 124, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 8, reason: this.definition.id });
    return impact;
  }
}
