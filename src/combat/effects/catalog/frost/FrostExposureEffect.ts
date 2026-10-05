import { BaseEffect } from '../../BaseEffect';
import { AbilityImpact, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../../../core/types';

export class FrostExposureEffect extends BaseEffect {
  public readonly definition: EffectDefinition = {
    id: 'frost-exposure',
    name: 'Frost Exposure',
    description: 'A frost combat effect that changes tempo, stats, and repeated impact behavior.',
    kind: 'debuff',
    damageType: 'frost',
    duration: 2650,
    tickInterval: 0,
    maximumStacks: 2,
    stackPolicy: 'stack-intensity',
    dispellable: true,
    
    tags: ['frost', 'exposure', 'grants:chilled'],
    statModifiers: [{
      id: 'frost-exposure-modifier',
      stat: 'movementSpeed',
      operation: 'multiply',
      value: 0.85,
      priority: 21,
    }],
  };

  public override canApply(context: EffectExecutionContext): string | undefined {
    const base = super.canApply(context);
    if (base) return base;
    if (context.target.tags.includes('immune-frost')) return 'frost-immunity';
    if (context.instance.intensity <= 0) return 'zero-intensity';
    return undefined;
  }

  public override onApply(context: EffectExecutionContext): void {
    super.onApply(context);
    context.instance.state.school = 'frost';
    context.instance.state.variant = 1;
    context.instance.state.totalTicks = 0;
    context.instance.state.accumulatedPower = context.instance.intensity * context.instance.stacks;
  }

  public override onTick(context: EffectExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const tick = Number(context.instance.state.totalTicks ?? 0) + 1;
    context.instance.state.totalTicks = tick;
    context.instance.state.lastTickAt = context.now;
    const amount = 5 * context.instance.intensity * context.instance.stacks * (1 + Math.min(5, tick - 1) * 0.08);
    impact.damage.push({ sourceId: context.source.id, targetId: context.target.id, damageType: 'frost', baseAmount: amount, powerRatio: 0.04, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0.05, tags: ['effect-tick', 'frost'], hitIndex: tick });
    if (tick % 3 === 0) impact.resourceChanges.push({ targetId: context.source.id, resource: 'stamina', amount: 2, reason: 'frost-exposure-tick' });
    return impact;
  }

  public override onExpire(context: EffectExecutionContext): void {
    super.onExpire(context);
    context.instance.state.finalTicks = Number(context.instance.state.totalTicks ?? 0);
    context.instance.state.completedNaturally = context.now >= context.instance.expiresAt;
  }
}
