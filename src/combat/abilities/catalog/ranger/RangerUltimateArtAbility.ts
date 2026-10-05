import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerUltimateArtAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-ultimate-art',
    name: 'Ranger Ultimate Art',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'ultimate',
    targeting: 'summon',
    damageType: 'frost',
    baseDamage: 198,
    powerRatio: 1.465,
    range: 528,
    radius: 35,
    angle: 83,
    castTime: 120,
    recoveryTime: 400,
    cooldown: 18000,
    charges: 1,
    costs: [{ resource: 'ultimate', amount: 49 }],
    tags: ['ranger', 'ultimate', 'summon', 'frost', 'ability-30'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_ultimate_6',
    visualEffect: 'fx_frost_6',
    soundEffect: 'sfx_ranger_2',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.ultimate < 49) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.18);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.348, ignoresResistance: 0.290, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'poison-cataclysm', sourceId: context.caster.id, targetId: target.id, duration: 4410, intensity: 1.6, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 88, duration: 207, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 852, lifetime: 2205, radius: 13, piercing: 1, bounces: 2, homingStrength: 0, gravity: 0, acceleration: 35, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 196, duration: 216, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 3, reason: this.definition.id });
    return impact;
  }
}
