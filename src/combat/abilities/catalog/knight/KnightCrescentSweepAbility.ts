import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class KnightCrescentSweepAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'knight-crescent-sweep',
    name: 'Knight Crescent Sweep',
    description: 'A complete knight technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'knight',
    category: 'primary',
    targeting: 'circle',
    damageType: 'physical',
    baseDamage: 43,
    powerRatio: 0.555,
    range: 151,
    radius: 57,
    angle: 71,
    castTime: 360,
    recoveryTime: 345,
    cooldown: 280,
    charges: 1,
    costs: [{ resource: 'stamina', amount: 4 }],
    tags: ['knight', 'primary', 'circle', 'physical', 'ability-4'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'knight_primary_4',
    visualEffect: 'fx_physical_4',
    soundEffect: 'sfx_knight_4',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.stamina < 4) return 'insufficient-resource';
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
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: false, ignoresArmor: 0.036, ignoresResistance: 0.030, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'holy-weakness', sourceId: context.caster.id, targetId: target.id, duration: 2070, intensity: 1.45, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 36, duration: 129, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 444, lifetime: 1035, radius: 11, piercing: 3, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 920, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 92, duration: 112, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 5, reason: this.definition.id });
    return impact;
  }
}
