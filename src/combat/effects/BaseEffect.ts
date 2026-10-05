import { AbilityImpact, CombatEffect, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../core/types';

export abstract class BaseEffect implements CombatEffect {
  public abstract readonly definition: EffectDefinition;

  public canApply(context: EffectExecutionContext): string | undefined {
    if (!context.target.alive) return 'target-defeated';
    if (context.target.tags.includes('effect-immune')) return 'effect-immune';
    if (context.target.tags.includes('immune-' + this.definition.id)) return 'specific-immunity';
    if (this.definition.control && context.target.tags.includes('control-immune')) return 'control-immune';
    return undefined;
  }

  public onApply(context: EffectExecutionContext): void {
    context.instance.state.applied = true;
    context.instance.state.applicationTime = context.now;
  }

  public onTick(_context: EffectExecutionContext): AbilityImpact { return createEmptyImpact(); }

  public onExpire(context: EffectExecutionContext): void {
    context.instance.state.expired = true;
    context.instance.state.expirationTime = context.now;
  }
}
