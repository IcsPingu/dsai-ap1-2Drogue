import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MagePerfectReactionAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-perfect-reaction',
    name: 'Mage Perfect Reaction',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'special',
    targeting: 'projectile',
    damageType: 'arcane',
    baseDamage: 100,
    powerRatio: 1.290,
    range: 448,
    radius: 57,
    angle: 83,
    castTime: 0,
    recoveryTime: 400,
    cooldown: 6120,
    charges: 1,
    costs: [{ resource: 'mana', amount: 50 }],
    tags: ['mage', 'special', 'projectile', 'arcane', 'ability-25'],
    interruptible: false,
    canMoveWhileCasting: false,
    animation: 'mage_special_1',
    visualEffect: 'fx_arcane_1',
    soundEffect: 'sfx_mage_4',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 50) return 'insufficient-resource';
    if (false && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.18);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.18);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.288, ignoresResistance: 0.240, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'arcane-aura', sourceId: context.caster.id, targetId: target.id, duration: 3960, intensity: 1.6, stacks: 1, abilityId: this.definition.id });
      if (true) impact.displacement.push({ targetId: target.id, direction, distance: 78, duration: 192, kind: 'pull' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 712, lifetime: 1980, radius: 8, piercing: 0, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 176, duration: 196, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 5, reason: this.definition.id });
    return impact;
  }
}
