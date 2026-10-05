import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerDefensiveStanceAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-defensive-stance',
    name: 'Ranger Defensive Stance',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'secondary',
    targeting: 'projectile',
    damageType: 'frost',
    baseDamage: 73,
    powerRatio: 0.940,
    range: 528,
    radius: 24,
    angle: 83,
    castTime: 240,
    recoveryTime: 400,
    cooldown: 4320,
    charges: 1,
    costs: [{ resource: 'mana', amount: 34 }],
    tags: ['ranger', 'secondary', 'projectile', 'frost', 'ability-15'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_secondary_3',
    visualEffect: 'fx_frost_7',
    soundEffect: 'sfx_ranger_1',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 34) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.18);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.168, ignoresResistance: 0.140, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-aura', sourceId: context.caster.id, targetId: target.id, duration: 3060, intensity: 1.6, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 58, duration: 162, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || true) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 732, lifetime: 1530, radius: 10, piercing: 2, bounces: 2, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 136, duration: 156, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 2, reason: this.definition.id });
    return impact;
  }
}
