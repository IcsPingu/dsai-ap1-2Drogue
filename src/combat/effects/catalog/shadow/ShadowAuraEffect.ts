import { BaseEffect } from '../../BaseEffect';
import { AbilityImpact, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../../../core/types';

export class ShadowAuraEffect extends BaseEffect {
  public readonly definition: EffectDefinition = {
    id: 'shadow-aura',
    name: 'Shadow Aura',
    description: 'A shadow combat effect that changes tempo, stats, and repeated impact behavior.',
    kind: 'buff',
    damageType: 'shadow',
    duration: 4000,
    tickInterval: 0,
    maximumStacks: 5,
    stackPolicy: 'refresh',
    dispellable: true,
    
    tags: ['shadow', 'aura', 'grants:cursed'],
    statModifiers: [{
      id: 'shadow-aura-modifier',
      stat: 'armor',
      operation: 'add',
      value: 6,
      priority: 24,
    }],
  };

  public override canApply(context: EffectExecutionContext): string | undefined {
    const base = super.canApply(context);
    if (base) return base;
    if (context.target.tags.includes('immune-shadow')) return 'shadow-immunity';
    if (context.instance.intensity <= 0) return 'zero-intensity';
    return undefined;
  }

  public override onApply(context: EffectExecutionContext): void {
    super.onApply(context);
    context.instance.state.school = 'shadow';
    context.instance.state.variant = 4;
    context.instance.state.totalTicks = 0;
    context.instance.state.accumulatedPower = context.instance.intensity * context.instance.stacks;
  }

  public override onTick(context: EffectExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const tick = Number(context.instance.state.totalTicks ?? 0) + 1;
    context.instance.state.totalTicks = tick;
    context.instance.state.lastTickAt = context.now;
    const amount = 11 * context.instance.intensity * context.instance.stacks * (1 + Math.min(5, tick - 1) * 0.08);
    impact.healing.push({ sourceId: context.source.id, targetId: context.target.id, baseAmount: amount, powerRatio: 0.05, canCrit: false, tags: ['effect-tick', 'shadow'] });
    if (tick % 3 === 0) impact.resourceChanges.push({ targetId: context.source.id, resource: 'mana', amount: 1, reason: 'shadow-aura-tick' });
    return impact;
  }

  public override onExpire(context: EffectExecutionContext): void {
    super.onExpire(context);
    context.instance.state.finalTicks = Number(context.instance.state.totalTicks ?? 0);
    context.instance.state.completedNaturally = context.now >= context.instance.expiresAt;
  }
}
