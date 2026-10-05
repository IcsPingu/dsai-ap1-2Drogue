import { BaseEffect } from '../../BaseEffect';
import { AbilityImpact, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../../../core/types';

export class FireCataclysmEffect extends BaseEffect {
  public readonly definition: EffectDefinition = {
    id: 'fire-cataclysm',
    name: 'Fire Cataclysm',
    description: 'A fire combat effect that changes tempo, stats, and repeated impact behavior.',
    kind: 'debuff',
    damageType: 'fire',
    duration: 6250,
    tickInterval: 750,
    maximumStacks: 5,
    stackPolicy: 'stack-intensity',
    dispellable: false,
    
    tags: ['fire', 'cataclysm', 'grants:burning'],
    statModifiers: [{
      id: 'fire-cataclysm-modifier',
      stat: 'spellPower',
      operation: 'multiply',
      value: 0.85,
      priority: 29,
    }],
  };

  public override canApply(context: EffectExecutionContext): string | undefined {
    const base = super.canApply(context);
    if (base) return base;
    if (context.target.tags.includes('immune-fire')) return 'fire-immunity';
    if (context.instance.intensity <= 0) return 'zero-intensity';
    return undefined;
  }

  public override onApply(context: EffectExecutionContext): void {
    super.onApply(context);
    context.instance.state.school = 'fire';
    context.instance.state.variant = 9;
    context.instance.state.totalTicks = 0;
    context.instance.state.accumulatedPower = context.instance.intensity * context.instance.stacks;
  }

  public override onTick(context: EffectExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const tick = Number(context.instance.state.totalTicks ?? 0) + 1;
    context.instance.state.totalTicks = tick;
    context.instance.state.lastTickAt = context.now;
    const amount = 21 * context.instance.intensity * context.instance.stacks * (1 + Math.min(5, tick - 1) * 0.08);
    impact.damage.push({ sourceId: context.source.id, targetId: context.target.id, damageType: 'fire', baseAmount: amount, powerRatio: 0.04, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0.45, tags: ['effect-tick', 'fire'], hitIndex: tick });
    if (tick % 2 === 0) impact.resourceChanges.push({ targetId: context.source.id, resource: 'stamina', amount: 2, reason: 'fire-cataclysm-tick' });
    return impact;
  }

  public override onExpire(context: EffectExecutionContext): void {
    super.onExpire(context);
    context.instance.state.finalTicks = Number(context.instance.state.totalTicks ?? 0);
    context.instance.state.completedNaturally = context.now >= context.instance.expiresAt;
  }
}
