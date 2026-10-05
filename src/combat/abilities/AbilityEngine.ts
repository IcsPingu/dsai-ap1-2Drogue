import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Combatant } from '../core/Combatant';
import { AbilityImpact, CastContext, CastId, CastRequest, CombatantId, Vec2, normalize } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';
import { TargetResolver } from '../targeting/TargetResolver';
import { AbilityRegistry } from './AbilityRegistry';

export interface CastRequestResult { accepted: boolean; reason?: string; cast?: CastContext; }
export interface AbilityEngineSnapshot { casts: CastContext[]; serial: number; }

export class AbilityEngine {
  private readonly casts = new Map<CastId, CastContext>();
  private readonly targets = new TargetResolver();
  private serial = 0;

  public constructor(
    private readonly registry: AbilityRegistry,
    private readonly events: CombatEventStream,
    private readonly random: DeterministicRandom,
    private readonly combatants: Map<CombatantId, Combatant>,
  ) {}

  public request(request: CastRequest, now: number): CastRequestResult {
    const caster = this.combatants.get(request.casterId);
    if (!caster) return { accepted: false, reason: 'unknown-caster' };
    const ability = this.registry.get(request.abilityId);
    const definition = ability.definition;
    if (!caster.cooldowns.isReady(definition.id, now)) return { accepted: false, reason: 'cooldown' };
    if (!caster.resources.canAfford(definition.costs)) return { accepted: false, reason: 'insufficient-resource' };
    const casterSnapshot = caster.snapshot();
    const direction = normalize(request.direction ?? casterSnapshot.facing);
    const targetPosition = request.targetPosition ?? this.combatants.get(request.targetId ?? '')?.snapshot().position ?? {
      x: casterSnapshot.position.x + direction.x * definition.range,
      y: casterSnapshot.position.y + direction.y * definition.range,
    };
    const targetSnapshots = this.targets.resolve({
      caster: casterSnapshot,
      candidates: [...this.combatants.values()].map((entry) => entry.snapshot()),
      mode: definition.targeting,
      targetId: request.targetId,
      targetPosition,
      direction,
      range: definition.range,
      radius: definition.radius,
      angle: definition.angle,
      maximumTargets: definition.targeting === 'single' ? 1 : 12,
      includeAllies: definition.targeting === 'self',
      includeSelf: definition.targeting === 'self',
    });
    const cast: CastContext = {
      id: 'cast-' + ++this.serial,
      request: { ...request, targetPosition: { ...targetPosition }, direction: { ...direction } },
      definition,
      startedAt: now,
      completesAt: now + definition.castTime,
      recoveryEndsAt: now + definition.castTime + definition.recoveryTime,
      targets: targetSnapshots.map((entry) => entry.id),
      interrupted: false,
      completed: false,
    };
    const execution = { now, caster: casterSnapshot, targets: targetSnapshots, targetPosition, direction, random: this.random.fork(cast.id), cast };
    const rejection = ability.canCast(execution);
    if (rejection) return { accepted: false, reason: rejection };
    const haste = casterSnapshot.stats.haste;
    cast.completesAt = now + definition.castTime / Math.max(0.1, 1 + haste);
    cast.recoveryEndsAt = cast.completesAt + definition.recoveryTime / Math.max(0.1, 1 + haste);
    caster.resources.spend(definition.costs);
    const cooldown = definition.cooldown * (1 - casterSnapshot.stats.cooldownReduction);
    caster.cooldowns.consume(definition.id, now, cooldown, definition.charges);
    this.casts.set(cast.id, cast);
    this.events.emit('cast-started', now, { cast: this.clone(cast) }, caster.id, request.targetId);
    return { accepted: true, cast: this.clone(cast) };
  }

  public update(now: number): AbilityImpact[] {
    const impacts: AbilityImpact[] = [];
    for (const cast of this.casts.values()) {
      if (!cast.completed && !cast.interrupted && now >= cast.completesAt) {
        const impact = this.complete(cast.id, now);
        if (impact) impacts.push(impact);
      }
      if ((cast.completed || cast.interrupted) && now >= cast.recoveryEndsAt) this.casts.delete(cast.id);
    }
    for (const combatant of this.combatants.values()) combatant.cooldowns.update(now);
    return impacts;
  }

  public complete(castId: CastId, now: number): AbilityImpact | undefined {
    const cast = this.casts.get(castId);
    if (!cast || cast.completed || cast.interrupted) return undefined;
    const caster = this.combatants.get(cast.request.casterId);
    if (!caster?.isAlive()) { this.interrupt(castId, now, 'caster-defeated'); return undefined; }
    const ability = this.registry.get(cast.definition.id);
    const direction = normalize(cast.request.direction ?? caster.snapshot().facing);
    const targetPosition = cast.request.targetPosition ?? caster.snapshot().position;
    const targets = cast.targets.map((id) => this.combatants.get(id)?.snapshot()).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry?.alive));
    const impact = ability.createImpact({ now, caster: caster.snapshot(), targets, targetPosition, direction, random: this.random.fork(cast.id + ':complete'), cast });
    cast.completed = true;
    this.events.emit('cast-completed', now, { cast: this.clone(cast), impact }, caster.id, cast.request.targetId);
    return impact;
  }

  public interrupt(castId: CastId, now: number, reason: string): boolean {
    const cast = this.casts.get(castId);
    if (!cast || cast.completed || cast.interrupted || !cast.definition.interruptible) return false;
    cast.interrupted = true;
    cast.recoveryEndsAt = now + Math.min(300, cast.definition.recoveryTime);
    this.events.emit('cast-interrupted', now, { castId, abilityId: cast.definition.id, reason }, cast.request.casterId, cast.request.targetId);
    return true;
  }

  public interruptCombatant(combatantId: CombatantId, now: number, reason: string): number {
    let interrupted = 0;
    for (const cast of this.casts.values()) if (cast.request.casterId === combatantId && this.interrupt(cast.id, now, reason)) interrupted++;
    return interrupted;
  }

  public activeCasts(): CastContext[] { return [...this.casts.values()].map((cast) => this.clone(cast)); }
  public capture(): AbilityEngineSnapshot { return { casts: this.activeCasts(), serial: this.serial }; }
  public restore(snapshot: AbilityEngineSnapshot): void { this.casts.clear(); for (const cast of snapshot.casts) this.casts.set(cast.id, this.clone(cast)); this.serial = snapshot.serial; }

  private clone(cast: CastContext): CastContext {
    return { ...cast, request: { ...cast.request, targetPosition: cast.request.targetPosition ? { ...cast.request.targetPosition } : undefined, direction: cast.request.direction ? { ...cast.request.direction } : undefined }, definition: { ...cast.definition, costs: cast.definition.costs.map((cost) => ({ ...cost })), tags: [...cast.definition.tags] }, targets: [...cast.targets] };
  }
}
