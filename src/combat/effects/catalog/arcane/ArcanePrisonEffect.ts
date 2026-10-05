import { BaseEffect } from '../../BaseEffect';
import { AbilityImpact, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../../../core/types';

export class ArcanePrisonEffect extends BaseEffect {
  public readonly definition: EffectDefinition = {
    id: 'arcane-prison',
    name: 'Arcane Prison',
    description: 'A arcane combat effect that changes tempo, stats, and repeated impact behavior.',
    kind: 'control',
    damageType: 'arcane',
    duration: 5350,
    tickInterval: 0,
    maximumStacks: 3,
    stackPolicy: 'replace',
    dispellable: true,
    control: 'slow',
    tags: ['arcane', 'prison', 'grants:unstable'],
    statModifiers: [{
      id: 'arcane-prison-modifier',
      stat: 'resistance',
      operation: 'multiply',
      value: 1.12,
      priority: 27,
    }],
  };

  public override canApply(context: EffectExecutionContext): string | undefined {
    const base = super.canApply(context);
    if (base) return base;
    if (context.target.tags.includes('immune-arcane')) return 'arcane-immunity';
    if (context.instance.intensity <= 0) return 'zero-intensity';
    return undefined;
  }

  public override onApply(context: EffectExecutionContext): void {
    super.onApply(context);
    context.instance.state.school = 'arcane';
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
    impact.damage.push({ sourceId: context.source.id, targetId: context.target.id, damageType: 'arcane', baseAmount: amount, powerRatio: 0.04, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0.35, tags: ['effect-tick', 'arcane'], hitIndex: tick });
    if (tick % 3 === 0) impact.resourceChanges.push({ targetId: context.source.id, resource: 'stamina', amount: 4, reason: 'arcane-prison-tick' });
    return impact;
  }

  public override onExpire(context: EffectExecutionContext): void {
    super.onExpire(context);
    context.instance.state.finalTicks = Number(context.instance.state.totalTicks ?? 0);
    context.instance.state.completedNaturally = context.now >= context.instance.expiresAt;
  }
}
