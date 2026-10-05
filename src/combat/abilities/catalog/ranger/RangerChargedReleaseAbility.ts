import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerChargedReleaseAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-charged-release',
    name: 'Ranger Charged Release',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'secondary',
    targeting: 'cone',
    damageType: 'frost',
    baseDamage: 64,
    powerRatio: 0.835,
    range: 462,
    radius: 68,
    angle: 47,
    castTime: 360,
    recoveryTime: 235,
    cooldown: 3780,
    charges: 1,
    costs: [{ resource: 'mana', amount: 31 }],
    tags: ['ranger', 'secondary', 'cone', 'frost', 'ability-12'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_secondary_6',
    visualEffect: 'fx_frost_4',
    soundEffect: 'sfx_ranger_5',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 31) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.10500000000000001);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: false, ignoresArmor: 0.132, ignoresResistance: 0.110, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'poison-exposure', sourceId: context.caster.id, targetId: target.id, duration: 2790, intensity: 1.15, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 52, duration: 153, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 708, lifetime: 1395, radius: 13, piercing: 3, bounces: 2, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 124, duration: 144, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 6, reason: this.definition.id });
    return impact;
  }
}
