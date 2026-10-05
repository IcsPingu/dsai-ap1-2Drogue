import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageAreaDenialAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-area-denial',
    name: 'Mage Area Denial',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'reaction',
    targeting: 'self',
    damageType: 'frost',
    baseDamage: 103,
    powerRatio: 1.325,
    range: 360,
    radius: 68,
    angle: 35,
    castTime: 120,
    recoveryTime: 180,
    cooldown: 6300,
    charges: 1,
    costs: [{ resource: 'mana', amount: 51 }],
    tags: ['mage', 'reaction', 'self', 'frost', 'ability-26'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'mage_reaction_2',
    visualEffect: 'fx_frost_2',
    soundEffect: 'sfx_mage_5',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 51) return 'insufficient-resource';
    if (true && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([context.caster]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.21);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.08);
      impact.healing.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, baseAmount: amount * 0.55, powerRatio: this.definition.powerRatio, canCrit: true, tags: [...this.definition.tags, 'self-heal'] });
      impact.effects.push({ effectId: 'frost-wound', sourceId: context.caster.id, targetId: target.id, duration: 4050, intensity: 1, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 80, duration: 195, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 720, lifetime: 2025, radius: 9, piercing: 1, bounces: 1, homingStrength: 0.08, gravity: 0, acceleration: 35, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 180, duration: 200, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 6, reason: this.definition.id });
    return impact;
  }
}
