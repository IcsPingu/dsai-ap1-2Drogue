import { Ability, AbilityExecutionContext, AbilityImpact, AbilityDefinition, distance } from '../core/types';

export abstract class BaseAbility implements Ability {
  public abstract readonly definition: AbilityDefinition;

  public canCast(context: AbilityExecutionContext): string | undefined {
    if (!context.caster.alive) return 'caster-defeated';
    if (context.caster.tags.includes('silenced') && this.definition.category !== 'primary') return 'silenced';
    if (context.caster.tags.includes('disarmed') && this.definition.damageType === 'physical') return 'disarmed';
    if (this.definition.classId !== context.caster.classId && this.definition.classId !== 'enemy') return 'wrong-class';
    if (this.definition.targeting !== 'self' && this.definition.targeting !== 'summon' && distance(context.caster.position, context.targetPosition) > this.definition.range + this.definition.radius) return 'out-of-range';
    return undefined;
  }

  public abstract createImpact(context: AbilityExecutionContext): AbilityImpact;

  protected falloff(index: number, amount: number, rate = 0.12): number { return amount * Math.max(0.35, 1 - index * rate); }
  protected levelScale(level: number): number { return 1 + Math.max(0, level - 1) * 0.08; }
  protected executeBonus(health: number, maximumHealth: number, threshold = 0.25): number { return maximumHealth > 0 && health / maximumHealth <= threshold ? 1.5 : 1; }
}
