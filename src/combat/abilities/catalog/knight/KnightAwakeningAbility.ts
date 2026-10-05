import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class KnightAwakeningAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'knight-awakening',
    name: 'Knight Awakening',
    description: 'A complete knight technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'knight',
    category: 'reaction',
    targeting: 'ring',
    damageType: 'physical',
    baseDamage: 115,
    powerRatio: 1.395,
    range: 129,
    radius: 90,
    angle: 59,
    castTime: 360,
    recoveryTime: 290,
    cooldown: 6660,
    charges: 2,
    costs: [{ resource: 'mana', amount: 45 }],
    tags: ['knight', 'reaction', 'ring', 'physical', 'ability-28'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'knight_reaction_4',
    visualEffect: 'fx_physical_4',
    soundEffect: 'sfx_knight_7',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 45) return 'insufficient-resource';
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
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: false, ignoresArmor: 0.324, ignoresResistance: 0.270, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'holy-prison', sourceId: context.caster.id, targetId: target.id, duration: 4230, intensity: 1.3, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 84, duration: 201, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 636, lifetime: 2115, radius: 11, piercing: 3, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 920, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 188, duration: 208, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 8, reason: this.definition.id });
    return impact;
  }
}
