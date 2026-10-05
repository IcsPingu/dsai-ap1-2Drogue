import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerRapidSequenceAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-rapid-sequence',
    name: 'Ranger Rapid Sequence',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'special',
    targeting: 'circle',
    damageType: 'frost',
    baseDamage: 100,
    powerRatio: 1.255,
    range: 506,
    radius: 46,
    angle: 71,
    castTime: 360,
    recoveryTime: 345,
    cooldown: 5940,
    charges: 1,
    costs: [{ resource: 'mana', amount: 43 }],
    tags: ['ranger', 'special', 'circle', 'frost', 'ability-24'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_special_6',
    visualEffect: 'fx_frost_8',
    soundEffect: 'sfx_ranger_3',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 43) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.15500000000000003);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: false, ignoresArmor: 0.276, ignoresResistance: 0.230, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'poison-weakness', sourceId: context.caster.id, targetId: target.id, duration: 3870, intensity: 1.45, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 76, duration: 189, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 804, lifetime: 1935, radius: 13, piercing: 3, bounces: 2, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 172, duration: 192, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 4, reason: this.definition.id });
    return impact;
  }
}
