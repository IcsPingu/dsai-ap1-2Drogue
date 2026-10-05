import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class KnightMobilityCutAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'knight-mobility-cut',
    name: 'Knight Mobility Cut',
    description: 'A complete knight technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'knight',
    category: 'special',
    targeting: 'single',
    damageType: 'holy',
    baseDamage: 94,
    powerRatio: 1.150,
    range: 85,
    radius: 90,
    angle: 35,
    castTime: 0,
    recoveryTime: 180,
    cooldown: 5400,
    charges: 1,
    costs: [{ resource: 'mana', amount: 38 }],
    tags: ['knight', 'special', 'single', 'holy', 'ability-21'],
    interruptible: false,
    canMoveWhileCasting: false,
    animation: 'knight_special_3',
    visualEffect: 'fx_holy_5',
    soundEffect: 'sfx_knight_7',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 38) return 'insufficient-resource';
    if (true && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : ([]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.18);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.08);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.240, ignoresResistance: 0.200, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-brand', sourceId: context.caster.id, targetId: target.id, duration: 3600, intensity: 1, stacks: 1, abilityId: this.definition.id });
      if (true) impact.displacement.push({ targetId: target.id, direction, distance: 70, duration: 180, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || true) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 580, lifetime: 1800, radius: 10, piercing: 0, bounces: 2, homingStrength: 0.08, gravity: 0, acceleration: 0, maximumSpeed: 920, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 160, duration: 180, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 8, reason: this.definition.id });
    return impact;
  }
}
