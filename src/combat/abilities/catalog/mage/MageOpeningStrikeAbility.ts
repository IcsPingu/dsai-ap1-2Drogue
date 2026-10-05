import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageOpeningStrikeAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-opening-strike',
    name: 'Mage Opening Strike',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'primary',
    targeting: 'single',
    damageType: 'arcane',
    baseDamage: 28,
    powerRatio: 0.450,
    range: 360,
    radius: 24,
    angle: 35,
    castTime: 0,
    recoveryTime: 180,
    cooldown: 250,
    charges: 2,
    costs: [{ resource: 'stamina', amount: 12 }],
    tags: ['mage', 'primary', 'single', 'arcane', 'ability-1'],
    interruptible: false,
    canMoveWhileCasting: false,
    animation: 'mage_primary_1',
    visualEffect: 'fx_arcane_1',
    soundEffect: 'sfx_mage_1',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.stamina < 12) return 'insufficient-resource';
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
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.000, ignoresResistance: 0.000, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'arcane-brand', sourceId: context.caster.id, targetId: target.id, duration: 1800, intensity: 1, stacks: 1, abilityId: this.definition.id });
      if (true) impact.displacement.push({ targetId: target.id, direction, distance: 30, duration: 120, kind: 'pull' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 520, lifetime: 900, radius: 8, piercing: 0, bounces: 0, homingStrength: 0.08, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 80, duration: 100, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 2, reason: this.definition.id });
    return impact;
  }
}
