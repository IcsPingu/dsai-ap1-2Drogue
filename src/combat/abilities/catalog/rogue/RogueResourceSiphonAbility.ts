import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class RogueResourceSiphonAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'rogue-resource-siphon',
    name: 'Rogue Resource Siphon',
    description: 'A complete rogue technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'rogue',
    category: 'secondary',
    targeting: 'circle',
    damageType: 'physical',
    baseDamage: 61,
    powerRatio: 0.905,
    range: 286,
    radius: 90,
    angle: 71,
    castTime: 120,
    recoveryTime: 345,
    cooldown: 4140,
    charges: 1,
    costs: [{ resource: 'mana', amount: 29 }],
    tags: ['rogue', 'secondary', 'circle', 'physical', 'ability-14'],
    interruptible: true,
    canMoveWhileCasting: true,
    animation: 'rogue_secondary_2',
    visualEffect: 'fx_physical_6',
    soundEffect: 'sfx_rogue_7',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 29) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.15500000000000003);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.156, ignoresResistance: 0.130, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'physical-weakness', sourceId: context.caster.id, targetId: target.id, duration: 2970, intensity: 1.45, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 56, duration: 159, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 664, lifetime: 1485, radius: 9, piercing: 1, bounces: 1, homingStrength: 0, gravity: 0, acceleration: 35, maximumSpeed: 1060, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 132, duration: 152, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 8, reason: this.definition.id });
    return impact;
  }
}
