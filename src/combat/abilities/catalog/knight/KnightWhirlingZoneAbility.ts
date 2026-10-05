import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class KnightWhirlingZoneAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'knight-whirling-zone',
    name: 'Knight Whirling Zone',
    description: 'A complete knight technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'knight',
    category: 'special',
    targeting: 'dash',
    damageType: 'physical',
    baseDamage: 88,
    powerRatio: 1.080,
    range: 151,
    radius: 68,
    angle: 71,
    castTime: 240,
    recoveryTime: 345,
    cooldown: 5040,
    charges: 2,
    costs: [{ resource: 'mana', amount: 36 }],
    tags: ['knight', 'special', 'dash', 'physical', 'ability-19'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'knight_special_1',
    visualEffect: 'fx_physical_3',
    soundEffect: 'sfx_knight_5',
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
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.24);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.15500000000000003);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.216, ignoresResistance: 0.180, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-mastery', sourceId: context.caster.id, targetId: target.id, duration: 3420, intensity: 1.45, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 66, duration: 174, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 564, lifetime: 1710, radius: 8, piercing: 2, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 920, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (true) impact.displacement.push({ targetId: context.caster.id, direction, distance: 152, duration: 172, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 6, reason: this.definition.id });
    return impact;
  }
}
