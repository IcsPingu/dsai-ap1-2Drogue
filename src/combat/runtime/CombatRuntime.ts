import { DeterministicRandom, RandomSnapshot } from '../../simulation/core/DeterministicRandom';
import { AbilityEngine, AbilityEngineSnapshot, CastRequestResult } from '../abilities/AbilityEngine';
import { AbilityRegistry } from '../abilities/AbilityRegistry';
import { createAbilityCatalog } from '../abilities/catalog';
import { ComboEngine, ComboInput, ComboState } from '../combo/ComboEngine';
import { createComboCatalog } from '../combo/catalog';
import { Combatant, CombatantOptions, CombatantState } from '../core/Combatant';
import {
  AbilityImpact, CastRequest, CombatEvent, CombatEventKind, CombatantId, DamagePacket,
  DamageResult, EffectApplication, HealResult, ProjectileSpawnRequest, ResourceChange, Vec2,
} from '../core/types';
import { DamagePipeline } from '../damage/DamagePipeline';
import { CombatEventStream } from '../events/CombatEventStream';
import { EffectEngine, EffectEngineSnapshot } from '../effects/EffectEngine';
import { EffectRegistry } from '../effects/EffectRegistry';
import { createCombatEffectCatalog } from '../effects/catalog';
import { ProjectileSystem, ProjectileSystemSnapshot } from '../projectiles/ProjectileSystem';
import { CombatZoneDefinition, CombatZoneSnapshot, CombatZoneSystem } from '../zones/CombatZoneSystem';
import { ElementalReactionEngine, ReactionResult } from '../reactions/ElementalReactionEngine';
import { CombatMetricsCollector } from '../telemetry/CombatMetrics';

export interface CombatRuntimeSnapshot {
  now: number;
  combatants: CombatantState[];
  effects: EffectEngineSnapshot;
  abilities: AbilityEngineSnapshot;
  projectiles: ProjectileSystemSnapshot;
  zones: { zones: CombatZoneSnapshot[]; serial: number };
  random: RandomSnapshot;
}

export interface RuntimeUpdateResult {
  damage: DamageResult[];
  healing: HealResult[];
  events: CombatEvent[];
  projectileCollisions: number;
}

export class CombatRuntime {
  public readonly events = new CombatEventStream();
  public readonly abilities = new AbilityRegistry();
  public readonly effects = new EffectRegistry();
  public readonly damage = new DamagePipeline();
  public readonly combo: ComboEngine;
  public readonly abilityEngine: AbilityEngine;
  public readonly effectEngine: EffectEngine;
  public readonly projectiles: ProjectileSystem;
  public readonly zones: CombatZoneSystem;
  public readonly reactions = new ElementalReactionEngine();
  public readonly metrics: CombatMetricsCollector;
  private readonly combatants = new Map<CombatantId, Combatant>();
  private readonly random: DeterministicRandom;
  private now = 0;

  public constructor(seed: string | number = 'combat-runtime') {
    this.random = new DeterministicRandom(seed);
    this.abilities.registerMany(createAbilityCatalog());
    this.effects.registerMany(createCombatEffectCatalog());
    this.combo = new ComboEngine(this.events);
    for (const move of createComboCatalog()) this.combo.register(move);
    this.abilityEngine = new AbilityEngine(this.abilities, this.events, this.random.fork('abilities'), this.combatants);
    this.effectEngine = new EffectEngine(this.effects, this.events, this.random.fork('effects'), this.combatants);
    this.projectiles = new ProjectileSystem(this.events, this.combatants);
    this.zones = new CombatZoneSystem(this.combatants, this.events);
    this.metrics = new CombatMetricsCollector(this.events);
    this.events.emit('combat-started', 0, { seed: String(seed) });
  }

  public addCombatant(options: CombatantOptions): Combatant {
    if (this.combatants.has(options.id)) throw new Error('combatant already exists: ' + options.id);
    const combatant = new Combatant(options);
    this.combatants.set(combatant.id, combatant);
    this.events.emit('combatant-added', this.now, { snapshot: combatant.snapshot() }, combatant.id);
    return combatant;
  }

  public removeCombatant(id: CombatantId): boolean {
    const combatant = this.combatants.get(id);
    if (!combatant) return false;
    this.abilityEngine.interruptCombatant(id, this.now, 'combatant-removed');
    this.effectEngine.removeForCombatant(id, this.now);
    this.projectiles.removeBySource(id, this.now);
    this.zones.removeBySource(id, this.now);
    this.combatants.delete(id);
    this.events.emit('combatant-removed', this.now, { snapshot: combatant.snapshot() }, id);
    return true;
  }

  public getCombatant(id: CombatantId): Combatant | undefined { return this.combatants.get(id); }
  public listCombatants(): Combatant[] { return [...this.combatants.values()]; }

  public cast(request: CastRequest): CastRequestResult {
    this.events.emit('cast-requested', this.now, { request }, request.casterId, request.targetId);
    return this.abilityEngine.request(request, this.now);
  }

  public applyEffect(application: EffectApplication): void { this.effectEngine.apply(application, this.now); }

  public createZone(definition: CombatZoneDefinition): CombatZoneSnapshot { return this.zones.create(definition, this.now); }

  public triggerReaction(sourceId: CombatantId, targetId: CombatantId, triggeringTags: readonly string[]): ReactionResult | undefined {
    const result = this.reactions.resolve(sourceId, targetId, this.effectEngine.list(), triggeringTags);
    if (!result) return undefined;
    for (const instanceId of result.consumedInstances) this.effectEngine.expire(instanceId, this.now, 'elemental-reaction');
    this.resolveImpact(result.impact);
    return result;
  }

  public applyDamage(packet: DamagePacket): DamageResult | undefined {
    const source = this.combatants.get(packet.sourceId);
    const target = this.combatants.get(packet.targetId);
    if (!source || !target) return undefined;
    this.events.emit('damage-requested', this.now, { packet }, packet.sourceId, packet.targetId);
    const result = this.damage.resolve(packet, source, target, this.random.fork('damage:' + this.events.lastEventId));
    this.events.emit(result.applied > 0 ? 'damage-applied' : 'damage-blocked', this.now, { packet, result }, packet.sourceId, packet.targetId);
    if (result.critical) this.events.emit('critical-hit', this.now, { packet, result }, packet.sourceId, packet.targetId);
    if (result.absorbed > 0) this.events.emit('shield-absorbed', this.now, { amount: result.absorbed }, packet.sourceId, packet.targetId);
    if (result.defeated) this.events.emit('combatant-defeated', this.now, { by: packet.sourceId, abilityId: packet.abilityId }, packet.sourceId, packet.targetId);
    if (result.applied > 0) {
      this.combo.registerHit(packet.sourceId, this.now, result.applied, packet.tags[0]);
      source.gain('ultimate', Math.min(10, result.applied * 0.08));
    }
    return result;
  }

  public previewDamage(packet: DamagePacket): DamageResult | undefined {
    const source = this.combatants.get(packet.sourceId);
    const target = this.combatants.get(packet.targetId);
    if (!source || !target) return undefined;
    const sourceState = source.capture();
    const targetState = target.capture();
    const result = this.damage.resolve(packet, source, target, this.random.fork('preview:' + packet.sourceId + ':' + packet.targetId + ':' + packet.baseAmount + ':' + packet.hitIndex + ':' + (packet.abilityId ?? 'basic')));
    source.restore(sourceState);
    target.restore(targetState);
    return result;
  }

  public inputCombo(combatantId: CombatantId, input: ComboInput): void { this.combo.input(combatantId, input, this.now); }
  public comboState(combatantId: CombatantId): ComboState { return this.combo.get(combatantId); }

  public update(deltaMilliseconds: number, obstacleTest?: (from: Vec2, to: Vec2) => Vec2 | undefined): RuntimeUpdateResult {
    const previousEvent = this.events.lastEventId;
    const delta = Math.max(0, Math.min(250, deltaMilliseconds));
    this.now += delta;
    const damage: DamageResult[] = [];
    const healing: HealResult[] = [];
    for (const impact of this.abilityEngine.update(this.now)) this.resolveImpact(impact, damage, healing);
    for (const impact of this.effectEngine.update(this.now)) this.resolveImpact(impact, damage, healing);
    for (const impact of this.zones.update(this.now)) this.resolveImpact(impact, damage, healing);
    const projectileUpdate = this.projectiles.update(this.now, delta, obstacleTest);
    for (const collision of projectileUpdate.collisions) {
      const ability = this.abilities.get(collision.projectile.abilityId).definition;
      const result = this.applyDamage({
        sourceId: collision.projectile.sourceId,
        targetId: collision.targetId,
        abilityId: ability.id,
        damageType: ability.damageType,
        baseAmount: ability.baseDamage,
        powerRatio: ability.powerRatio,
        canCrit: true,
        canBlock: true,
        ignoresArmor: 0,
        ignoresResistance: 0,
        tags: [...ability.tags, 'projectile-hit'],
        hitIndex: collision.projectile.hitTargets.length - 1,
      });
      if (result) damage.push(result);
    }
    this.combo.update(this.now);
    return { damage, healing, events: this.events.eventsSince(previousEvent), projectileCollisions: projectileUpdate.collisions.length };
  }

  public resolveImpact(impact: AbilityImpact, damageResults: DamageResult[] = [], healResults: HealResult[] = []): void {
    for (const packet of impact.damage) { const result = this.applyDamage(packet); if (result) damageResults.push(result); }
    for (const packet of impact.healing) {
      const source = this.combatants.get(packet.sourceId);
      const target = this.combatants.get(packet.targetId);
      if (!source || !target) continue;
      const result = this.damage.heal(packet, source, target, this.random.fork('heal:' + this.events.lastEventId));
      healResults.push(result);
      this.events.emit('healing-applied', this.now, { packet, result }, packet.sourceId, packet.targetId);
    }
    for (const effect of impact.effects) this.effectEngine.apply(effect, this.now);
    for (const projectile of impact.projectiles) this.projectiles.spawn(this.correctProjectileTeams(projectile), this.now);
    for (const displacement of impact.displacement) {
      const target = this.combatants.get(displacement.targetId);
      if (!target) continue;
      const factor = displacement.kind === 'pull' ? -1 : 1;
      target.translate({ x: displacement.direction.x * displacement.distance * factor, y: displacement.direction.y * displacement.distance * factor });
    }
    for (const change of impact.resourceChanges) this.applyResourceChange(change);
  }

  public capture(): CombatRuntimeSnapshot {
    return { now: this.now, combatants: this.listCombatants().map((entry) => entry.capture()), effects: this.effectEngine.capture(), abilities: this.abilityEngine.capture(), projectiles: this.projectiles.capture(), zones: this.zones.capture(), random: this.random.capture() };
  }

  public restore(snapshot: CombatRuntimeSnapshot): void {
    this.now = snapshot.now;
    for (const state of snapshot.combatants) {
      const combatant = this.combatants.get(state.snapshot.id);
      if (combatant) combatant.restore(state);
      else {
        const created = this.addCombatant({ id: state.snapshot.id, name: state.snapshot.name, classId: state.snapshot.classId, team: state.snapshot.team });
        created.restore(state);
      }
    }
    for (const id of [...this.combatants.keys()]) if (!snapshot.combatants.some((state) => state.snapshot.id === id)) this.combatants.delete(id);
    this.effectEngine.restore(snapshot.effects);
    this.abilityEngine.restore(snapshot.abilities);
    this.projectiles.restore(snapshot.projectiles);
    this.zones.restore(snapshot.zones);
    this.random.restore(snapshot.random);
  }

  public time(): number { return this.now; }
  public dispose(): void { this.events.emit('combat-ended', this.now, { combatants: this.combatants.size }); this.metrics.dispose(); this.events.clearListeners(); }

  private applyResourceChange(change: ResourceChange): void {
    const target = this.combatants.get(change.targetId);
    if (!target) return;
    const applied = change.amount >= 0 ? target.gain(change.resource, change.amount) : -target.lose(change.resource, -change.amount);
    this.events.emit(applied >= 0 ? 'resource-gained' : 'resource-spent', this.now, { ...change, applied }, change.targetId);
  }

  private correctProjectileTeams(request: ProjectileSpawnRequest): ProjectileSpawnRequest {
    const source = this.combatants.get(request.sourceId)?.snapshot();
    if (!source) return request;
    return { ...request, definition: { ...request.definition, collisionTeams: source.team === 'player' ? ['enemy'] : ['player'] } };
  }
}
