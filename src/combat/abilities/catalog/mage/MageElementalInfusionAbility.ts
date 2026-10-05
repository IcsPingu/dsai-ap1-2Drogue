import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageElementalInfusionAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-elemental-infusion',
    name: 'Mage Elemental Infusion',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'special',
    targeting: 'line',
    damageType: 'frost',
    baseDamage: 94,
    powerRatio: 1.220,
    range: 404,
    radius: 35,
    angle: 59,
    castTime: 240,
    recoveryTime: 290,
    cooldown: 5760,
    charges: 1,
    costs: [{ resource: 'mana', amount: 48 }],
    tags: ['mage', 'special', 'line', 'frost', 'ability-23'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'mage_special_5',
    visualEffect: 'fx_frost_7',
    soundEffect: 'sfx_mage_2',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 48) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.13);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.264, ignoresResistance: 0.220, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'arcane-surge', sourceId: context.caster.id, targetId: target.id, duration: 3780, intensity: 1.3, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 74, duration: 186, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 696, lifetime: 1890, radius: 12, piercing: 2, bounces: 1, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 168, duration: 188, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 3, reason: this.definition.id });
    return impact;
  }
}
