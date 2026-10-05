import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class KnightPiercingLineAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'knight-piercing-line',
    name: 'Knight Piercing Line',
    description: 'A complete knight technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'knight',
    category: 'primary',
    targeting: 'projectile',
    damageType: 'holy',
    baseDamage: 46,
    powerRatio: 0.590,
    range: 173,
    radius: 68,
    angle: 83,
    castTime: 0,
    recoveryTime: 400,
    cooldown: 290,
    charges: 1,
    costs: [{ resource: 'stamina', amount: 4 }],
    tags: ['knight', 'primary', 'projectile', 'holy', 'ability-5'],
    interruptible: false,
    canMoveWhileCasting: false,
    animation: 'knight_primary_5',
    visualEffect: 'fx_holy_5',
    soundEffect: 'sfx_knight_5',
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
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.18);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.18);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.048, ignoresResistance: 0.040, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-aura', sourceId: context.caster.id, targetId: target.id, duration: 2160, intensity: 1.6, stacks: 1, abilityId: this.definition.id });
      if (true) impact.displacement.push({ targetId: target.id, direction, distance: 38, duration: 132, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 452, lifetime: 1080, radius: 12, piercing: 0, bounces: 1, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 920, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 96, duration: 116, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 6, reason: this.definition.id });
    return impact;
  }
}
