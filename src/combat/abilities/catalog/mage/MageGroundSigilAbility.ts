import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageGroundSigilAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-ground-sigil',
    name: 'Mage Ground Sigil',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'secondary',
    targeting: 'dash',
    damageType: 'lightning',
    baseDamage: 52,
    powerRatio: 0.730,
    range: 426,
    radius: 35,
    angle: 71,
    castTime: 0,
    recoveryTime: 345,
    cooldown: 3240,
    charges: 1,
    costs: [{ resource: 'mana', amount: 34 }],
    tags: ['mage', 'secondary', 'dash', 'lightning', 'ability-9'],
    interruptible: false,
    canMoveWhileCasting: false,
    animation: 'mage_secondary_3',
    visualEffect: 'fx_lightning_1',
    soundEffect: 'sfx_mage_2',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.mana < 34) return 'insufficient-resource';
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
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.15500000000000003);
      impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: true, ignoresArmor: 0.096, ignoresResistance: 0.080, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });
      impact.effects.push({ effectId: 'arcane-mastery', sourceId: context.caster.id, targetId: target.id, duration: 2520, intensity: 1.45, stacks: 1, abilityId: this.definition.id });
      if (true) impact.displacement.push({ targetId: target.id, direction, distance: 46, duration: 144, kind: 'pull' });
    });
    if (this.definition.targeting === 'projectile' || true) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 584, lifetime: 1260, radius: 10, piercing: 0, bounces: 2, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (true) impact.displacement.push({ targetId: context.caster.id, direction, distance: 112, duration: 132, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'combo', amount: 3, reason: this.definition.id });
    return impact;
  }
}
