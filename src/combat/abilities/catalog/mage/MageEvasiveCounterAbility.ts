import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageEvasiveCounterAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-evasive-counter',
    name: 'Mage Evasive Counter',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'secondary',
    targeting: 'single',
    damageType: 'frost',
    baseDamage: 58,
    powerRatio: 0.800,
    range: 360,
    radius: 57,
    angle: 35,
    castTime: 240,
    recoveryTime: 180,
    cooldown: 3600,
    charges: 1,
    costs: [{ resource: 'mana', amount: 36 }],
    tags: ['mage', 'secondary', 'single', 'frost', 'ability-11'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'mage_secondary_5',
    visualEffect: 'fx_frost_3',
    soundEffect: 'sfx_mage_4',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 36) return 'insufficient-resource';
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
      impact.effects.push({ effectId: 'arcane-brand', sourceId: context.caster.id, targetId: target.id, duration: 2700, intensity: 1, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 50, duration: 150, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 600, lifetime: 1350, radius: 12, piercing: 2, bounces: 1, homingStrength: 0.08, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 120, duration: 140, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 5, reason: this.definition.id });
    return impact;
  }
}
