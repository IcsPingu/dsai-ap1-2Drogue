import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerDelayedBurstAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-delayed-burst',
    name: 'Ranger Delayed Burst',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'special',
    targeting: 'ring',
    damageType: 'frost',
    baseDamage: 82,
    powerRatio: 1.045,
    range: 484,
    radius: 57,
    angle: 59,
    castTime: 120,
    recoveryTime: 290,
    cooldown: 4860,
    charges: 1,
    costs: [{ resource: 'mana', amount: 37 }],
    tags: ['ranger', 'special', 'ring', 'frost', 'ability-18'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_special_6',
    visualEffect: 'fx_frost_2',
    soundEffect: 'sfx_ranger_4',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 37) return 'insufficient-resource';
    if (false && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.21);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.13);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.204, ignoresResistance: 0.170, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'poison-prison', sourceId: context.caster.id, targetId: target.id, duration: 3330, intensity: 1.3, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 64, duration: 171, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 756, lifetime: 1665, radius: 13, piercing: 1, bounces: 2, homingStrength: 0, gravity: 0, acceleration: 35, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 148, duration: 168, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 5, reason: this.definition.id });
    return impact;
  }
}
