import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RangerEvasiveCounterAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'ranger-evasive-counter',
    name: 'Ranger Evasive Counter',
    description: 'A complete ranger technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'ranger',
    category: 'secondary',
    targeting: 'single',
    damageType: 'poison',
    baseDamage: 61,
    powerRatio: 0.800,
    range: 440,
    radius: 57,
    angle: 35,
    castTime: 240,
    recoveryTime: 180,
    cooldown: 3600,
    charges: 1,
    costs: [{ resource: 'mana', amount: 30 }],
    tags: ['ranger', 'secondary', 'single', 'poison', 'ability-11'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'ranger_secondary_5',
    visualEffect: 'fx_poison_3',
    soundEffect: 'sfx_ranger_4',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 30) return 'insufficient-resource';
    if (true && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.24);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.08);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.120, ignoresResistance: 0.100, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-brand', sourceId: context.caster.id, targetId: target.id, duration: 2700, intensity: 1, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 50, duration: 150, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 700, lifetime: 1350, radius: 12, piercing: 2, bounces: 1, homingStrength: 0.08, gravity: 0, acceleration: 0, maximumSpeed: 1120, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 120, duration: 140, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 5, reason: this.definition.id });
    return impact;
  }
}
