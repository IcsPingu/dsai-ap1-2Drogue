import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RogueReboundingBoltAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'rogue-rebounding-bolt',
    name: 'Rogue Rebounding Bolt',
    description: 'A complete rogue technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'rogue',
    category: 'primary',
    targeting: 'chain',
    damageType: 'shadow',
    baseDamage: 40,
    powerRatio: 0.660,
    range: 242,
    radius: 90,
    angle: 47,
    castTime: 240,
    recoveryTime: 235,
    cooldown: 310,
    charges: 1,
    costs: [{ resource: 'stamina', amount: 2 }],
    tags: ['rogue', 'primary', 'chain', 'shadow', 'ability-7'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'rogue_primary_1',
    visualEffect: 'fx_shadow_7',
    soundEffect: 'sfx_rogue_7',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.stamina < 2) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.10500000000000001);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.072, ignoresResistance: 0.060, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'shadow-echo', sourceId: context.caster.id, targetId: target.id, duration: 2340, intensity: 1.15, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 42, duration: 138, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 608, lifetime: 1170, radius: 8, piercing: 2, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1060, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 104, duration: 124, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 8, reason: this.definition.id });
    return impact;
  }
}
