import { BaseEffect } from '../../BaseEffect';
import { AbilityImpact, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../../../core/types';

export class PhysicalPrisonEffect extends BaseEffect {
  public readonly definition: EffectDefinition = {
    id: 'physical-prison',
    name: 'Physical Prison',
    description: 'A physical combat effect that changes tempo, stats, and repeated impact behavior.',
    kind: 'control',
    damageType: 'physical',
    duration: 5350,
    tickInterval: 0,
    maximumStacks: 3,
    stackPolicy: 'replace',
    dispellable: true,
    control: 'slow',
    tags: ['physical', 'prison', 'grants:bleeding'],
    statModifiers: [{
      id: 'physical-prison-modifier',
      stat: 'blockChance',
      operation: 'multiply',
      value: 1.12,
      priority: 27,
    }],
  };

  public override canApply(context: EffectExecutionContext): string | undefined {
    const base = super.canApply(context);
    if (base) return base;
    if (context.target.tags.includes('immune-physical')) return 'physical-immunity';
    if (context.instance.intensity <= 0) return 'zero-intensity';
    return undefined;
  }

  public override onApply(context: EffectExecutionContext): void {
    super.onApply(context);
    context.instance.state.school = 'physical';
    context.instance.state.variant = 7;
    context.instance.state.totalTicks = 0;
    context.instance.state.accumulatedPower = context.instance.intensity * context.instance.stacks;
  }

  public override onTick(context: EffectExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const tick = Number(context.instance.state.totalTicks ?? 0) + 1;
    context.instance.state.totalTicks = tick;
    context.instance.state.lastTickAt = context.now;
    const amount = 17 * context.instance.intensity * context.instance.stacks * (1 + Math.min(5, tick - 1) * 0.08);
    impact.damage.push({ sourceId: context.source.id, targetId: context.target.id, damageType: 'physical', baseAmount: amount, powerRatio: 0.04, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0.35, tags: ['effect-tick', 'physical'], hitIndex: tick });
    if (tick % 3 === 0) impact.resourceChanges.push({ targetId: context.source.id, resource: 'stamina', amount: 4, reason: 'physical-prison-tick' });
    return impact;
  }

  public override onExpire(context: EffectExecutionContext): void {
    super.onExpire(context);
    context.instance.state.finalTicks = Number(context.instance.state.totalTicks ?? 0);
    context.instance.state.completedNaturally = context.now >= context.instance.expiresAt;
  }
}
