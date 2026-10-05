import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageRisingEdgeAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-rising-edge',
    name: 'Mage Rising Edge',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'primary',
    targeting: 'cone',
    damageType: 'frost',
    baseDamage: 31,
    powerRatio: 0.485,
    range: 382,
    radius: 35,
    angle: 47,
    castTime: 120,
    recoveryTime: 235,
    cooldown: 260,
    charges: 1,
    costs: [{ resource: 'stamina', amount: 12 }],
    tags: ['mage', 'primary', 'cone', 'frost', 'ability-2'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'mage_primary_2',
    visualEffect: 'fx_frost_2',
    soundEffect: 'sfx_mage_2',
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
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.21);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.10500000000000001);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.012, ignoresResistance: 0.010, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'frost-exposure', sourceId: context.caster.id, targetId: target.id, duration: 1890, intensity: 1.15, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 32, duration: 123, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 528, lifetime: 945, radius: 9, piercing: 1, bounces: 1, homingStrength: 0, gravity: 0, acceleration: 35, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 84, duration: 104, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 3, reason: this.definition.id });
    return impact;
  }
}
