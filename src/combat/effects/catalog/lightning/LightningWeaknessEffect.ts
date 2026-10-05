import { BaseEffect } from '../../BaseEffect';
import { AbilityImpact, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../../../core/types';

export class LightningWeaknessEffect extends BaseEffect {
  public readonly definition: EffectDefinition = {
    id: 'lightning-weakness',
    name: 'Lightning Weakness',
    description: 'A lightning combat effect that changes tempo, stats, and repeated impact behavior.',
    kind: 'control',
    damageType: 'lightning',
    duration: 3550,
    tickInterval: 1250,
    maximumStacks: 4,
    stackPolicy: 'replace',
    dispellable: true,
    control: 'slow',
    tags: ['lightning', 'weakness', 'grants:shocked'],
    statModifiers: [{
      id: 'lightning-weakness-modifier',
      stat: 'haste',
      operation: 'multiply',
      value: 1.12,
      priority: 23,
    }],
  };

  public override canApply(context: EffectExecutionContext): string | undefined {
    const base = super.canApply(context);
    if (base) return base;
    if (context.target.tags.includes('immune-lightning')) return 'lightning-immunity';
    if (context.instance.intensity <= 0) return 'zero-intensity';
    return undefined;
  }

  public override onApply(context: EffectExecutionContext): void {
    super.onApply(context);
    context.instance.state.school = 'lightning';
    context.instance.state.variant = 3;
    context.instance.state.totalTicks = 0;
    context.instance.state.accumulatedPower = context.instance.intensity * context.instance.stacks;
  }

  public override onTick(context: EffectExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const tick = Number(context.instance.state.totalTicks ?? 0) + 1;
    context.instance.state.totalTicks = tick;
    context.instance.state.lastTickAt = context.now;
    const amount = 9 * context.instance.intensity * context.instance.stacks * (1 + Math.min(5, tick - 1) * 0.08);
    impact.damage.push({ sourceId: context.source.id, targetId: context.target.id, damageType: 'lightning', baseAmount: amount, powerRatio: 0.04, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0.15, tags: ['effect-tick', 'lightning'], hitIndex: tick });
    if (tick % 2 === 0) impact.resourceChanges.push({ targetId: context.source.id, resource: 'stamina', amount: 4, reason: 'lightning-weakness-tick' });
    return impact;
  }

  public override onExpire(context: EffectExecutionContext): void {
    super.onExpire(context);
    context.instance.state.finalTicks = Number(context.instance.state.totalTicks ?? 0);
    context.instance.state.completedNaturally = context.now >= context.instance.expiresAt;
  }
}
