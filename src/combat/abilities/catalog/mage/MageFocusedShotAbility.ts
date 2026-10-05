import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class MageFocusedShotAbility extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: 'mage-focused-shot',
    name: 'Mage Focused Shot',
    description: 'A complete mage technique with targeting, damage, resource, effect and movement behavior.',
    classId: 'mage',
    category: 'primary',
    targeting: 'self',
    damageType: 'lightning',
    baseDamage: 43,
    powerRatio: 0.625,
    range: 360,
    radius: 79,
    angle: 35,
    castTime: 120,
    recoveryTime: 180,
    cooldown: 300,
    charges: 1,
    costs: [{ resource: 'stamina', amount: 12 }],
    tags: ['mage', 'primary', 'self', 'lightning', 'ability-6'],
    interruptible: true,
    canMoveWhileCasting: false,
    animation: 'mage_primary_6',
    visualEffect: 'fx_lightning_6',
    soundEffect: 'sfx_mage_6',
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
    const targets = context.targets.length > 0 ? context.targets : ([context.caster]);
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, 0.21);
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, 0.08);
      impact.healing.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, baseAmount: amount * 0.55, powerRatio: this.definition.powerRatio, canCrit: true, tags: [...this.definition.tags, 'self-heal'] });
      impact.effects.push({ effectId: 'frost-wound', sourceId: context.caster.id, targetId: target.id, duration: 2250, intensity: 1, stacks: 2, abilityId: this.definition.id });
      if (false) impact.displacement.push({ targetId: target.id, direction, distance: 40, duration: 135, kind: 'knockback' });
    });
    if (this.definition.targeting === 'projectile' || false) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: 560, lifetime: 1125, radius: 13, piercing: 1, bounces: 2, homingStrength: 0.08, gravity: 0, acceleration: 35, maximumSpeed: 1020, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (false) impact.displacement.push({ targetId: context.caster.id, direction, distance: 100, duration: 120, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: 'ultimate', amount: 7, reason: this.definition.id });
    return impact;
  }
}
