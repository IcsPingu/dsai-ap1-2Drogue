import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RogueOrbitingBladesAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'rogue-orbiting-blades',
    name: 'Rogue Orbiting Blades',
    description: 'A complete rogue technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'rogue',
    category: 'secondary',
    targeting: 'summon',
    damageType: 'shadow',
    baseDamage: 49,
    powerRatio: 0.765,
    range: 308,
    radius: 46,
    angle: 83,
    castTime: 120,
    recoveryTime: 400,
    cooldown: 3420,
    charges: 2,
    costs: [{ resource: 'mana', amount: 25 }],
    tags: ['rogue', 'secondary', 'summon', 'shadow', 'ability-10'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'rogue_secondary_4',
    visualEffect: 'fx_shadow_2',
    soundEffect: 'sfx_rogue_3',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 25) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.18);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.108, ignoresResistance: 0.090, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-cataclysm', sourceId: context.caster.id, targetId: target.id, duration: 2610, intensity: 1.6, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 48, duration: 147, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 632, lifetime: 1305, radius: 11, piercing: 1, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 35, maximumSpeed: 1060, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 116, duration: 136, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 4, reason: this.definition.id });
    return impact;
  }
}
