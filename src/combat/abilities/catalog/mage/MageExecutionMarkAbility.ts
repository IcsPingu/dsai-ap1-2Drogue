import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageExecutionMarkAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-execution-mark',
    name: 'Mage Execution Mark',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'secondary',
    targeting: 'line',
    damageType: 'arcane',
    baseDamage: 64,
    powerRatio: 0.870,
    range: 404,
    radius: 79,
    angle: 59,
    castTime: 0,
    recoveryTime: 290,
    cooldown: 3960,
    charges: 1,
    costs: [{ resource: 'mana', amount: 38 }],
    tags: ['mage', 'secondary', 'line', 'arcane', 'ability-13'],
    interruptible: false,
    canMoveWhileCasting: false,
    animation: 'mage_secondary_1',
    visualEffect: 'fx_arcane_5',
    soundEffect: 'sfx_mage_6',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 38) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.13);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.144, ignoresResistance: 0.120, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'arcane-surge', sourceId: context.caster.id, targetId: target.id, duration: 2880, intensity: 1.3, stacks: 1, abilityId: this.definition.id });
      if (true) impact.displacement.push({ targetId: target.id, direction, distance: 54, duration: 156, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 616, lifetime: 1440, radius: 8, piercing: 0, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 128, duration: 148, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 7, reason: this.definition.id });
    return impact;
  }
}
