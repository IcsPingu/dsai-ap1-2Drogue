import { CombatEvent, CombatEventKind, CombatantId, DamageResult, HealResult } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';

export interface CombatantMetrics {
  combatantId: CombatantId;
  damageDealt: number;
  damageTaken: number;
  healingDone: number;
  healingReceived: number;
  effectiveHealing: number;
  overhealing: number;
  criticalHits: number;
  blockedHits: number;
  dodgedHits: number;
  absorbedDamage: number;
  castsStarted: number;
  castsCompleted: number;
  castsInterrupted: number;
  effectsApplied: number;
  targetsDefeated: number;
  deaths: number;
  comboPeak: number;
  comboScorePeak: number;
}

export interface CombatMetricsSnapshot {
  startedAt: number;
  endedAt?: number;
  eventCount: number;
  byCombatant: CombatantMetrics[];
  byAbility: Array<{ abilityId: string; casts: number; hits: number; damage: number; healing: number }>;
  byDamageType: Array<{ damageType: string; amount: number; hits: number }>;
}

export class CombatMetricsCollector {
  private readonly combatants = new Map<CombatantId, CombatantMetrics>();
  private readonly abilities = new Map<string, { abilityId: string; casts: number; hits: number; damage: number; healing: number }>();
  private readonly damageTypes = new Map<string, { damageType: string; amount: number; hits: number }>();
  private readonly unsubscribe: () => void;
  private eventCount = 0;
  private endedAt?: number;

  public constructor(events: CombatEventStream, private readonly startedAt = 0) {
    this.unsubscribe = events.on('*', (event) => this.consume(event));
  }

  public consume(event: CombatEvent): void {
    this.eventCount++;
    if (event.kind === 'combat-ended') this.endedAt = event.time;
    if (event.sourceId) this.ensure(event.sourceId);
    if (event.targetId) this.ensure(event.targetId);
    switch (event.kind) {
      case 'damage-applied': this.consumeDamage(event); break;
      case 'healing-applied': this.consumeHealing(event); break;
      case 'cast-started': if (event.sourceId) this.ensure(event.sourceId).castsStarted++; this.abilityFromEvent(event).casts++; break;
      case 'cast-completed': if (event.sourceId) this.ensure(event.sourceId).castsCompleted++; break;
      case 'cast-interrupted': if (event.sourceId) this.ensure(event.sourceId).castsInterrupted++; break;
      case 'effect-applied': if (event.sourceId) this.ensure(event.sourceId).effectsApplied++; break;
      case 'combatant-defeated': if (event.sourceId) this.ensure(event.sourceId).targetsDefeated++; if (event.targetId) this.ensure(event.targetId).deaths++; break;
      case 'combo-advanced': this.consumeCombo(event); break;
    }
  }

  public snapshot(): CombatMetricsSnapshot {
    return {
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      eventCount: this.eventCount,
      byCombatant: [...this.combatants.values()].map((entry) => ({ ...entry })),
      byAbility: [...this.abilities.values()].map((entry) => ({ ...entry })),
      byDamageType: [...this.damageTypes.values()].map((entry) => ({ ...entry })),
    };
  }

  public reset(): void { this.combatants.clear(); this.abilities.clear(); this.damageTypes.clear(); this.eventCount = 0; this.endedAt = undefined; }
  public dispose(): void { this.unsubscribe(); }

  private consumeDamage(event: CombatEvent): void {
    const payload = event.payload as { packet?: { abilityId?: string; damageType?: string }; result?: DamageResult };
    const result = payload.result;
    if (!result) return;
    if (event.sourceId) { const source = this.ensure(event.sourceId); source.damageDealt += result.applied; source.criticalHits += result.critical ? 1 : 0; }
    if (event.targetId) { const target = this.ensure(event.targetId); target.damageTaken += result.applied; target.blockedHits += result.blocked ? 1 : 0; target.dodgedHits += result.dodged ? 1 : 0; target.absorbedDamage += result.absorbed; }
    const ability = this.ability(payload.packet?.abilityId ?? 'basic-attack');
    ability.hits++;
    ability.damage += result.applied;
    const type = payload.packet?.damageType ?? 'unknown';
    const damageType = this.damageTypes.get(type) ?? { damageType: type, amount: 0, hits: 0 };
    damageType.amount += result.applied;
    damageType.hits++;
    this.damageTypes.set(type, damageType);
  }

  private consumeHealing(event: CombatEvent): void {
    const payload = event.payload as { packet?: { abilityId?: string }; result?: HealResult };
    const result = payload.result;
    if (!result) return;
    if (event.sourceId) { const source = this.ensure(event.sourceId); source.healingDone += result.requested; source.effectiveHealing += result.applied; source.overhealing += result.overheal; }
    if (event.targetId) this.ensure(event.targetId).healingReceived += result.applied;
    this.ability(payload.packet?.abilityId ?? 'basic-heal').healing += result.applied;
  }

  private consumeCombo(event: CombatEvent): void {
    if (!event.sourceId) return;
    const payload = event.payload as { hitCount?: number; score?: number };
    const metrics = this.ensure(event.sourceId);
    metrics.comboPeak = Math.max(metrics.comboPeak, payload.hitCount ?? 0);
    metrics.comboScorePeak = Math.max(metrics.comboScorePeak, payload.score ?? 0);
  }

  private abilityFromEvent(event: CombatEvent): { abilityId: string; casts: number; hits: number; damage: number; healing: number } {
    const payload = event.payload as { cast?: { definition?: { id?: string } }; abilityId?: string };
    return this.ability(payload.cast?.definition?.id ?? payload.abilityId ?? 'unknown');
  }

  private ability(id: string): { abilityId: string; casts: number; hits: number; damage: number; healing: number } {
    const entry = this.abilities.get(id) ?? { abilityId: id, casts: 0, hits: 0, damage: 0, healing: 0 };
    this.abilities.set(id, entry);
    return entry;
  }

  private ensure(id: CombatantId): CombatantMetrics {
    const current = this.combatants.get(id) ?? { combatantId: id, damageDealt: 0, damageTaken: 0, healingDone: 0, healingReceived: 0, effectiveHealing: 0, overhealing: 0, criticalHits: 0, blockedHits: 0, dodgedHits: 0, absorbedDamage: 0, castsStarted: 0, castsCompleted: 0, castsInterrupted: 0, effectsApplied: 0, targetsDefeated: 0, deaths: 0, comboPeak: 0, comboScorePeak: 0 };
    this.combatants.set(id, current);
    return current;
  }
}
