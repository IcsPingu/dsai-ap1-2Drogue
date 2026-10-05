import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerSummonedAllyAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-summoned-ally',
    name: 'Ranger Summoned Ally',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'special',
    targeting: 'self',
    damageType: 'physical',
    baseDamage: 76,
    powerRatio: 0.975,
    range: 440,
    radius: 35,
    angle: 35,
    castTime: 360,
    recoveryTime: 180,
    cooldown: 4500,
    charges: 1,
    costs: [{ resource: 'mana', amount: 35 }],
    tags: ['ranger', 'special', 'self', 'physical', 'ability-16'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_special_4',
    visualEffect: 'fx_physical_8',
    soundEffect: 'sfx_ranger_2',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 35) return 'insufficient-resource';
    if (true && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([context.caster]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.27);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.08);
      impact.healing.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, baseAmount: amount * 0.55, powerRatio: this.definition.powerRatio, canCrit: true, tags: [...this.definition.tags, 'self-heal'] });
      impact.effects.push({ effectId: 'poison-wound', sourceId: context.caster.id, targetId: target.id, duration: 3150, intensity: 1, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 60, duration: 165, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 740, lifetime: 1575, radius: 11, piercing: 3, bounces: 0, homingStrength: 0.08, gravity: 0, acceleration: 0, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 140, duration: 160, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 3, reason: this.definition.id });
    return impact;
  }
}
