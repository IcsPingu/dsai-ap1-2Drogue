import { JsonObject, cloneJson } from '../core/types';
import { ScenarioAction, ScenarioInvariantViolation, ScenarioRunMetrics, ScenarioState, ScenarioTraceEntry } from './types';

export interface ScenarioActionOutcome { accepted: boolean; before: number; after: number; }

export class ScenarioWorld {
  private state: ScenarioState;
  private readonly traces: ScenarioTraceEntry[] = [];
  private readonly metrics: ScenarioRunMetrics;

  public constructor(initialState: ScenarioState, private readonly traceLimit = 2000) {
    this.state = cloneJson(initialState);
    this.metrics = {
      ticksExecuted: 0, actionsScheduled: 0, actionsExecuted: 0, actionsRejected: 0,
      snapshotsCaptured: 0, invariantChecks: 0, distanceTravelled: 0, damageTaken: 0,
      healingReceived: 0, manaSpent: 0, staminaSpent: 0, currencyEarned: 0,
      currencySpent: 0, experienceEarned: 0, enemiesDefeated: 0, itemsAdded: 0,
      finalScore: initialState.score,
    };
  }

  public get value(): ScenarioState { return cloneJson(this.state); }
  public get runMetrics(): ScenarioRunMetrics { return cloneJson(this.metrics); }
  public get traceEntries(): ScenarioTraceEntry[] { return cloneJson(this.traces); }
  public setScheduledActions(count: number): void { this.metrics.actionsScheduled = count; }
  public recordSnapshot(): void { this.metrics.snapshotsCaptured += 1; }
  public recordInvariantChecks(count: number): void { this.metrics.invariantChecks += count; }

  public beginTick(tick: number): void {
    if (!Number.isSafeInteger(tick) || tick < this.state.tick) throw new RangeError('Scenario tick must be monotonic');
    this.state.tick = tick;
    this.metrics.ticksExecuted += 1;
  }

  public apply(action: ScenarioAction, order: number): ScenarioActionOutcome {
    const outcome = this.applyAction(action);
    this.metrics.actionsExecuted += 1;
    if (!outcome.accepted) this.metrics.actionsRejected += 1;
    this.metrics.finalScore = this.state.score;
    if (this.traces.length < this.traceLimit) {
      this.traces.push({ tick: this.state.tick, order, kind: action.kind, label: action.label,
        accepted: outcome.accepted, before: outcome.before, after: outcome.after });
    }
    return outcome;
  }

  public validate(): ScenarioInvariantViolation[] {
    const violations: ScenarioInvariantViolation[] = [];
    const bounded = (id: string, path: string, value: number, minimum: number, maximum: number): void => {
      if (!Number.isFinite(value) || value < minimum || value > maximum) {
        violations.push({ id, tick: this.state.tick, severity: 'error',
          message: `${path} saiu do intervalo permitido`, path, actual: value,
          expected: value < minimum ? minimum : maximum });
      }
    };
    bounded('health-range', 'health', this.state.health, 0, this.state.maximumHealth);
    bounded('mana-range', 'mana', this.state.mana, 0, this.state.maximumMana);
    bounded('stamina-range', 'stamina', this.state.stamina, 0, this.state.maximumStamina);
    bounded('currency-range', 'currency', this.state.currency, 0, Number.MAX_SAFE_INTEGER);
    bounded('experience-range', 'experience', this.state.experience, 0, Number.MAX_SAFE_INTEGER);
    bounded('enemy-range', 'enemiesAlive', this.state.enemiesAlive, 0, Number.MAX_SAFE_INTEGER);
    bounded('combo-range', 'combo', this.state.combo, 0, Number.MAX_SAFE_INTEGER);
    if (!Number.isFinite(this.state.position.x) || !Number.isFinite(this.state.position.y)) {
      violations.push({ id: 'position-finite', tick: this.state.tick, severity: 'error',
        message: 'Posição da simulação deve permanecer finita', path: 'position', actual: Number.NaN, expected: 0 });
    }
    return violations;
  }

  private applyAction(action: ScenarioAction): ScenarioActionOutcome {
    switch (action.kind) {
      case 'move': return this.move(action.x, action.y);
      case 'damage': return this.damage(action.amount);
      case 'heal': return this.heal(action.amount);
      case 'spendMana': return this.spendResource('mana', action.amount);
      case 'restoreMana': return this.restoreResource('mana', 'maximumMana', action.amount);
      case 'spendStamina': return this.spendResource('stamina', action.amount);
      case 'restoreStamina': return this.restoreResource('stamina', 'maximumStamina', action.amount);
      case 'spawnEnemy': return this.spawnEnemy(action.amount);
      case 'defeatEnemy': return this.defeatEnemy(action.amount);
      case 'grantCurrency': return this.grantCurrency(action.amount);
      case 'spendCurrency': return this.spendCurrency(action.amount);
      case 'grantExperience': return this.grantExperience(action.amount);
      case 'advanceCombo': return this.advanceCombo(action.amount);
      case 'breakCombo': return this.breakCombo();
      case 'addItem': return this.changeInventory(action.key, action.amount);
      case 'removeItem': return this.changeInventory(action.key, -action.amount);
      case 'setFlag': return this.setFlag(action.key, action.value !== 0);
      case 'sampleMetric': return this.sampleMetric(action.key, action.value);
    }
  }

  private move(dx: number, dy: number): ScenarioActionOutcome {
    const before = this.state.distanceTravelled;
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return { accepted: false, before, after: before };
    const distance = Math.hypot(dx, dy);
    this.state.position.x += dx;
    this.state.position.y += dy;
    this.state.distanceTravelled += distance;
    this.metrics.distanceTravelled += distance;
    this.state.score += Math.round(distance * 2);
    return { accepted: true, before, after: this.state.distanceTravelled };
  }

  private damage(amount: number): ScenarioActionOutcome {
    const before = this.state.health;
    if (!this.validAmount(amount)) return { accepted: false, before, after: before };
    const applied = Math.min(before, amount);
    this.state.health = Math.max(0, before - amount);
    this.metrics.damageTaken += applied;
    if (this.state.health === 0) this.state.combo = 0;
    return { accepted: true, before, after: this.state.health };
  }

  private heal(amount: number): ScenarioActionOutcome {
    const before = this.state.health;
    if (!this.validAmount(amount) || before === 0) return { accepted: false, before, after: before };
    this.state.health = Math.min(this.state.maximumHealth, before + amount);
    this.metrics.healingReceived += this.state.health - before;
    return { accepted: true, before, after: this.state.health };
  }

  private spendResource(resource: 'mana' | 'stamina', amount: number): ScenarioActionOutcome {
    const before = this.state[resource];
    if (!this.validAmount(amount) || before < amount) return { accepted: false, before, after: before };
    this.state[resource] -= amount;
    if (resource === 'mana') this.metrics.manaSpent += amount;
    else this.metrics.staminaSpent += amount;
    return { accepted: true, before, after: this.state[resource] };
  }

  private restoreResource(resource: 'mana' | 'stamina', maximum: 'maximumMana' | 'maximumStamina', amount: number): ScenarioActionOutcome {
    const before = this.state[resource];
    if (!this.validAmount(amount)) return { accepted: false, before, after: before };
    this.state[resource] = Math.min(this.state[maximum], before + amount);
    return { accepted: true, before, after: this.state[resource] };
  }

  private spawnEnemy(amount: number): ScenarioActionOutcome {
    const before = this.state.enemiesAlive;
    if (!this.validIntegerAmount(amount)) return { accepted: false, before, after: before };
    this.state.enemiesAlive += amount;
    return { accepted: true, before, after: this.state.enemiesAlive };
  }

  private defeatEnemy(amount: number): ScenarioActionOutcome {
    const before = this.state.enemiesAlive;
    if (!this.validIntegerAmount(amount) || before < amount) return { accepted: false, before, after: before };
    this.state.enemiesAlive -= amount;
    this.state.enemiesDefeated += amount;
    this.metrics.enemiesDefeated += amount;
    this.state.score += amount * (100 + this.state.combo * 5);
    return { accepted: true, before, after: this.state.enemiesAlive };
  }

  private grantCurrency(amount: number): ScenarioActionOutcome {
    const before = this.state.currency;
    if (!this.validIntegerAmount(amount)) return { accepted: false, before, after: before };
    this.state.currency += amount;
    this.metrics.currencyEarned += amount;
    return { accepted: true, before, after: this.state.currency };
  }

  private spendCurrency(amount: number): ScenarioActionOutcome {
    const before = this.state.currency;
    if (!this.validIntegerAmount(amount) || before < amount) return { accepted: false, before, after: before };
    this.state.currency -= amount;
    this.metrics.currencySpent += amount;
    return { accepted: true, before, after: this.state.currency };
  }

  private grantExperience(amount: number): ScenarioActionOutcome {
    const before = this.state.experience;
    if (!this.validIntegerAmount(amount)) return { accepted: false, before, after: before };
    this.state.experience += amount;
    this.metrics.experienceEarned += amount;
    while (this.state.experience >= this.experienceForNextLevel()) {
      this.state.level += 1;
      this.state.maximumHealth += 4;
      this.state.maximumMana += 2;
      this.state.health = Math.min(this.state.maximumHealth, this.state.health + 4);
      this.state.mana = Math.min(this.state.maximumMana, this.state.mana + 2);
    }
    return { accepted: true, before, after: this.state.experience };
  }

  private advanceCombo(amount: number): ScenarioActionOutcome {
    const before = this.state.combo;
    if (!this.validIntegerAmount(amount)) return { accepted: false, before, after: before };
    this.state.combo += amount;
    this.state.maximumCombo = Math.max(this.state.maximumCombo, this.state.combo);
    this.state.score += amount * 15;
    return { accepted: true, before, after: this.state.combo };
  }

  private breakCombo(): ScenarioActionOutcome {
    const before = this.state.combo;
    this.state.combo = 0;
    return { accepted: true, before, after: 0 };
  }

  private changeInventory(key: string, delta: number): ScenarioActionOutcome {
    const before = Number(this.state.inventory[key] ?? 0);
    if (!key || !this.validIntegerAmount(Math.abs(delta)) || before + delta < 0) return { accepted: false, before, after: before };
    const after = before + delta;
    this.state.inventory[key] = after;
    if (delta > 0) this.metrics.itemsAdded += delta;
    return { accepted: true, before, after };
  }

  private setFlag(key: string, value: boolean): ScenarioActionOutcome {
    const before = this.state.flags[key] === true ? 1 : 0;
    if (!key) return { accepted: false, before, after: before };
    this.state.flags[key] = value;
    return { accepted: true, before, after: value ? 1 : 0 };
  }

  private sampleMetric(key: string, value: number): ScenarioActionOutcome {
    const before = Number(this.state.metrics[key] ?? 0);
    if (!key || !Number.isFinite(value)) return { accepted: false, before, after: before };
    this.state.metrics[key] = value;
    return { accepted: true, before, after: value };
  }

  private experienceForNextLevel(): number { return Math.round(100 * Math.pow(this.state.level, 1.45)); }
  private validAmount(amount: number): boolean { return Number.isFinite(amount) && amount > 0; }
  private validIntegerAmount(amount: number): boolean { return Number.isSafeInteger(amount) && amount > 0; }
}

export function scenarioStateNumber(record: JsonObject, key: string): number {
  const value = record[key];
  return typeof value === 'number' ? value : 0;
}
