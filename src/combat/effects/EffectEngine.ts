import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Combatant } from '../core/Combatant';
import { AbilityImpact, ActiveEffectSnapshot, CombatantId, EffectApplication, EffectExecutionContext } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';
import { EffectRegistry } from './EffectRegistry';

export interface EffectEngineSnapshot { active: ActiveEffectSnapshot[]; serial: number; }

export class EffectEngine {
  private readonly active = new Map<string, ActiveEffectSnapshot>();
  private serial = 0;

  public constructor(
    private readonly registry: EffectRegistry,
    private readonly events: CombatEventStream,
    private readonly random: DeterministicRandom,
    private readonly combatants: Map<CombatantId, Combatant>,
  ) {}

  public apply(application: EffectApplication, now: number): ActiveEffectSnapshot | undefined {
    const effect = this.registry.get(application.effectId);
    const source = this.combatants.get(application.sourceId);
    const target = this.combatants.get(application.targetId);
    if (!source || !target) return undefined;
    const existing = this.findMatching(effect.definition.id, application.sourceId, application.targetId);
    if (existing && effect.definition.stackPolicy !== 'independent') {
      const updated = this.stack(existing, application, now);
      this.events.emit('effect-stacked', now, { effectId: effect.definition.id, stacks: updated.stacks, policy: effect.definition.stackPolicy }, application.sourceId, application.targetId);
      return updated;
    }
    const duration = this.adjustDuration(application.duration ?? effect.definition.duration, target);
    const instance: ActiveEffectSnapshot = {
      instanceId: 'effect-instance-' + ++this.serial,
      effectId: effect.definition.id,
      sourceId: application.sourceId,
      targetId: application.targetId,
      kind: effect.definition.kind,
      stacks: Math.max(1, Math.min(effect.definition.maximumStacks, application.stacks ?? 1)),
      intensity: Math.max(0, application.intensity ?? 1),
      appliedAt: now,
      expiresAt: duration <= 0 ? Infinity : now + duration,
      nextTickAt: effect.definition.tickInterval > 0 ? now + effect.definition.tickInterval : Infinity,
      tags: [...effect.definition.tags],
      state: {},
    };
    const context = this.context(instance, now);
    const rejection = effect.canApply(context);
    if (rejection) return undefined;
    this.active.set(instance.instanceId, instance);
    for (const modifier of effect.definition.statModifiers) target.addStatModifier({ ...modifier, id: instance.instanceId + ':' + modifier.id });
    for (const tag of effect.definition.tags.filter((tag) => tag.startsWith('grants:'))) target.tags.add(tag.slice(7));
    effect.onApply(context);
    this.events.emit('effect-applied', now, { instance: { ...instance }, abilityId: application.abilityId }, application.sourceId, application.targetId);
    return instance;
  }

  public update(now: number): AbilityImpact[] {
    const impacts: AbilityImpact[] = [];
    for (const instance of [...this.active.values()]) {
      const effect = this.registry.get(instance.effectId);
      while (effect.definition.tickInterval > 0 && instance.nextTickAt <= now && instance.nextTickAt < instance.expiresAt) {
        const impact = effect.onTick(this.context(instance, instance.nextTickAt));
        impacts.push(impact);
        this.events.emit('effect-ticked', instance.nextTickAt, { instanceId: instance.instanceId, impact }, instance.sourceId, instance.targetId);
        instance.nextTickAt += effect.definition.tickInterval;
      }
      if (instance.expiresAt <= now) this.expire(instance.instanceId, now, 'duration');
    }
    return impacts;
  }

  public expire(instanceId: string, now: number, reason = 'manual'): boolean {
    const instance = this.active.get(instanceId);
    if (!instance) return false;
    const target = this.combatants.get(instance.targetId);
    const effect = this.registry.get(instance.effectId);
    if (target) {
      target.removeStatModifiersByPrefix(instance.instanceId + ':');
      for (const tag of effect.definition.tags.filter((entry) => entry.startsWith('grants:'))) target.tags.remove(tag.slice(7));
      effect.onExpire(this.context(instance, now));
    }
    this.active.delete(instanceId);
    this.events.emit('effect-expired', now, { instanceId, effectId: instance.effectId, reason }, instance.sourceId, instance.targetId);
    return true;
  }

  public cleanse(targetId: CombatantId, now: number, predicate: (effect: ActiveEffectSnapshot) => boolean): string[] {
    const removed: string[] = [];
    for (const instance of this.forTarget(targetId)) {
      const definition = this.registry.get(instance.effectId).definition;
      if (definition.dispellable && predicate(instance) && this.expire(instance.instanceId, now, 'cleanse')) removed.push(instance.instanceId);
    }
    if (removed.length > 0) this.events.emit('effect-cleansed', now, { removed }, undefined, targetId);
    return removed;
  }

  public removeForCombatant(id: CombatantId, now: number): void {
    for (const instance of this.list()) if (instance.sourceId === id || instance.targetId === id) this.expire(instance.instanceId, now, 'combatant-removed');
  }

  public forTarget(targetId: CombatantId): ActiveEffectSnapshot[] { return this.list().filter((instance) => instance.targetId === targetId); }
  public forSource(sourceId: CombatantId): ActiveEffectSnapshot[] { return this.list().filter((instance) => instance.sourceId === sourceId); }
  public has(targetId: CombatantId, effectId: string): boolean { return this.forTarget(targetId).some((instance) => instance.effectId === effectId); }
  public stacks(targetId: CombatantId, effectId: string): number { return this.forTarget(targetId).filter((instance) => instance.effectId === effectId).reduce((sum, instance) => sum + instance.stacks, 0); }
  public list(): ActiveEffectSnapshot[] { return [...this.active.values()].map((instance) => ({ ...instance, tags: [...instance.tags], state: { ...instance.state } })); }
  public capture(): EffectEngineSnapshot { return { active: this.list(), serial: this.serial }; }
  public restore(snapshot: EffectEngineSnapshot): void { this.active.clear(); for (const instance of snapshot.active) this.active.set(instance.instanceId, { ...instance, tags: [...instance.tags], state: { ...instance.state } }); this.serial = snapshot.serial; }

  private stack(existing: ActiveEffectSnapshot, application: EffectApplication, now: number): ActiveEffectSnapshot {
    const definition = this.registry.get(existing.effectId).definition;
    const duration = this.adjustDuration(application.duration ?? definition.duration, this.combatants.get(existing.targetId)!);
    if (definition.stackPolicy === 'ignore') return existing;
    if (definition.stackPolicy === 'replace') { existing.stacks = application.stacks ?? 1; existing.intensity = application.intensity ?? 1; existing.appliedAt = now; existing.expiresAt = now + duration; }
    if (definition.stackPolicy === 'refresh') existing.expiresAt = now + duration;
    if (definition.stackPolicy === 'stack-duration') existing.expiresAt += duration;
    if (definition.stackPolicy === 'stack-intensity') { existing.stacks = Math.min(definition.maximumStacks, existing.stacks + (application.stacks ?? 1)); existing.intensity = Math.max(existing.intensity, application.intensity ?? 1); existing.expiresAt = now + duration; }
    return existing;
  }

  private findMatching(effectId: string, sourceId: string, targetId: string): ActiveEffectSnapshot | undefined {
    return [...this.active.values()].find((instance) => instance.effectId === effectId && instance.sourceId === sourceId && instance.targetId === targetId);
  }

  private adjustDuration(duration: number, target: Combatant): number {
    const definitionIsControl = duration > 0;
    return definitionIsControl ? duration * (1 - target.stats.get('tenacity')) : duration;
  }

  private context(instance: ActiveEffectSnapshot, now: number): EffectExecutionContext {
    const source = this.combatants.get(instance.sourceId);
    const target = this.combatants.get(instance.targetId);
    if (!source || !target) throw new Error('effect references missing combatant');
    return { now, source: source.snapshot(), target: target.snapshot(), instance, random: this.random.fork(instance.instanceId + ':' + now) };
  }
}
