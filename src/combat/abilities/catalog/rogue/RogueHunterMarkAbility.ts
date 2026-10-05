import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RogueHunterMarkAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'rogue-hunter-mark',
    name: 'Rogue Hunter Mark',
    description: 'A complete rogue technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'rogue',
    category: 'reaction',
    targeting: 'chain',
    damageType: 'poison',
    baseDamage: 100,
    powerRatio: 1.360,
    range: 242,
    radius: 79,
    angle: 47,
    castTime: 240,
    recoveryTime: 235,
    cooldown: 6480,
    charges: 1,
    costs: [{ resource: 'mana', amount: 42 }],
    tags: ['rogue', 'reaction', 'chain', 'poison', 'ability-27'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'rogue_reaction_3',
    visualEffect: 'fx_poison_3',
    soundEffect: 'sfx_rogue_6',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 42) return 'insufficient-resource';
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
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.312, ignoresResistance: 0.260, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'shadow-echo', sourceId: context.caster.id, targetId: target.id, duration: 4140, intensity: 1.15, stacks: 1, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 82, duration: 198, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || true) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 768, lifetime: 2070, radius: 10, piercing: 2, bounces: 2, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1060, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 184, duration: 204, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 7, reason: this.definition.id });
    return impact;
  }
}
