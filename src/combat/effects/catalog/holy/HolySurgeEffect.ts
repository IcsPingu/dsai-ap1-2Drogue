import { BaseEffect } from '../../BaseEffect';
import { AbilityImpact, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../../../core/types';

export class HolySurgeEffect extends BaseEffect {
  public readonly definition: EffectDefinition = {
    id: 'holy-surge',
    name: 'Holy Surge',
    description: 'A holy combat effect that changes tempo, stats, and repeated impact behavior.',
    kind: 'damage-over-time',
    damageType: 'holy',
    duration: 3100,
    tickInterval: 1000,
    maximumStacks: 3,
    stackPolicy: 'stack-duration',
    dispellable: true,
    
    tags: ['holy', 'surge', 'grants:radiant'],
    statModifiers: [{
      id: 'holy-surge-modifier',
      stat: 'healingPower',
      operation: 'add',
      value: 4,
      priority: 22,
    }],
  };

  public override canApply(context: EffectExecutionContext): string | undefined {
    const base = super.canApply(context);
    if (base) return base;
    if (context.target.tags.includes('immune-holy')) return 'holy-immunity';
    if (context.instance.intensity <= 0) return 'zero-intensity';
    return undefined;
  }

  public override onApply(context: EffectExecutionContext): void {
    super.onApply(context);
    context.instance.state.school = 'holy';
    context.instance.state.variant = 2;
    context.instance.state.totalTicks = 0;
    context.instance.state.accumulatedPower = context.instance.intensity * context.instance.stacks;
  }

  public override onTick(context: EffectExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const tick = Number(context.instance.state.totalTicks ?? 0) + 1;
    context.instance.state.totalTicks = tick;
    context.instance.state.lastTickAt = context.now;
    const amount = 7 * context.instance.intensity * context.instance.stacks * (1 + Math.min(5, tick - 1) * 0.08);
    impact.damage.push({ sourceId: context.source.id, targetId: context.target.id, damageType: 'holy', baseAmount: amount, powerRatio: 0.04, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0.1, tags: ['effect-tick', 'holy'], hitIndex: tick });
    if (tick % 4 === 0) impact.resourceChanges.push({ targetId: context.source.id, resource: 'mana', amount: 3, reason: 'holy-surge-tick' });
    return impact;
  }

  public override onExpire(context: EffectExecutionContext): void {
    super.onExpire(context);
    context.instance.state.finalTicks = Number(context.instance.state.totalTicks ?? 0);
    context.instance.state.completedNaturally = context.now >= context.instance.expiresAt;
  }
}
