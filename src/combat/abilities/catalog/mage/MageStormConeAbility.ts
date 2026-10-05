import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageStormConeAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-storm-cone',
    name: 'Mage Storm Cone',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'primary',
    targeting: 'ring',
    damageType: 'frost',
    baseDamage: 49,
    powerRatio: 0.695,
    range: 404,
    radius: 24,
    angle: 59,
    castTime: 360,
    recoveryTime: 290,
    cooldown: 320,
    charges: 1,
    costs: [{ resource: 'stamina', amount: 12 }],
    tags: ['mage', 'primary', 'ring', 'frost', 'ability-8'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'mage_primary_2',
    visualEffect: 'fx_frost_8',
    soundEffect: 'sfx_mage_1',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.stamina < 12) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.13);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: false, ignoresArmor: 0.084, ignoresResistance: 0.070, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'frost-prison', sourceId: context.caster.id, targetId: target.id, duration: 2430, intensity: 1.3, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 44, duration: 141, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 576, lifetime: 1215, radius: 9, piercing: 3, bounces: 1, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 108, duration: 128, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 2, reason: this.definition.id });
    return impact;
  }
}
