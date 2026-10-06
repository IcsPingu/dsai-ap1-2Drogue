import { DeterministicRandom } from '../core/DeterministicRandom';
import { JsonValue, cloneJson, stableStringify } from '../core/types';
import { ScenarioWorld } from './ScenarioWorld';
import {
  ScenarioComparison, ScenarioExpectation, ScenarioInvariantViolation, ScenarioRunResult,
  ScenarioRunnerOptions, ScenarioSnapshot, ScenarioState, SimulationScenario,
} from './types';

const DEFAULT_OPTIONS: Required<ScenarioRunnerOptions> = {
  traceLimit: 2000, snapshotLimit: 100, stopOnInvariantError: false, strictSchedule: true,
};

export class ScenarioRunner {
  private readonly options: Required<ScenarioRunnerOptions>;

  public constructor(options: ScenarioRunnerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    if (this.options.traceLimit < 0 || this.options.snapshotLimit < 0) throw new RangeError('Scenario limits cannot be negative');
  }

  public run(scenario: SimulationScenario, seed = 1): ScenarioRunResult {
    this.validateDescriptor(scenario);
    const random = new DeterministicRandom(`${scenario.descriptor.id}:${seed}`);
    const initialState = this.normalizeInitialState(scenario.createInitialState());
    const world = new ScenarioWorld(initialState, this.options.traceLimit);
    const schedule = scenario.createSchedule(random).map(item => cloneJson(item));
    this.validateSchedule(scenario, schedule);
    schedule.sort((left, right) => left.tick - right.tick || left.order - right.order);
    world.setScheduledActions(schedule.length);
    const violations: ScenarioInvariantViolation[] = [];
    const snapshots: ScenarioSnapshot[] = [];
    let cursor = 0;

    for (let tick = 1; tick <= scenario.descriptor.durationTicks; tick += 1) {
      world.beginTick(tick);
      while (cursor < schedule.length && schedule[cursor].tick === tick) {
        world.apply(schedule[cursor].action, schedule[cursor].order);
        cursor += 1;
      }
      const tickViolations = world.validate();
      world.recordInvariantChecks(8);
      violations.push(...tickViolations);
      if (tick % scenario.descriptor.snapshotInterval === 0 || tick === scenario.descriptor.durationTicks) {
        if (snapshots.length < this.options.snapshotLimit) {
          snapshots.push(this.captureSnapshot(world.value));
          world.recordSnapshot();
        }
      }
      if (this.options.stopOnInvariantError && tickViolations.some(item => item.severity === 'error')) break;
    }

    const finalState = world.value;
    violations.push(...this.verifyExpectation(finalState, world.runMetrics.actionsRejected, scenario.expectation()));
    const partial: ScenarioRunResult = {
      scenarioId: scenario.descriptor.id, seed,
      passed: violations.every(item => item.severity !== 'error'), checksum: 0,
      initialState, finalState, metrics: world.runMetrics, violations,
      traces: world.traceEntries, snapshots,
    };
    return { ...partial, checksum: this.checksum(partial) };
  }

  public replay(scenario: SimulationScenario, result: ScenarioRunResult): ScenarioRunResult {
    return this.run(scenario, result.seed);
  }

  public compare(left: ScenarioRunResult, right: ScenarioRunResult): ScenarioComparison {
    return {
      equal: left.checksum === right.checksum,
      leftChecksum: left.checksum, rightChecksum: right.checksum,
      scoreDelta: right.finalState.score - left.finalState.score,
      healthDelta: right.finalState.health - left.finalState.health,
      experienceDelta: right.finalState.experience - left.finalState.experience,
      distanceDelta: right.finalState.distanceTravelled - left.finalState.distanceTravelled,
      violationDelta: right.violations.length - left.violations.length,
    };
  }

  private normalizeInitialState(state: ScenarioState): ScenarioState {
    const copy = cloneJson(state);
    copy.tick = 0;
    copy.health = Math.max(0, Math.min(copy.maximumHealth, copy.health));
    copy.mana = Math.max(0, Math.min(copy.maximumMana, copy.mana));
    copy.stamina = Math.max(0, Math.min(copy.maximumStamina, copy.stamina));
    copy.currency = Math.max(0, Math.trunc(copy.currency));
    copy.experience = Math.max(0, Math.trunc(copy.experience));
    copy.enemiesAlive = Math.max(0, Math.trunc(copy.enemiesAlive));
    return copy;
  }

  private validateDescriptor(scenario: SimulationScenario): void {
    const descriptor = scenario.descriptor;
    if (!descriptor.id || !descriptor.title) throw new Error('Scenario descriptor requires id and title');
    if (!Number.isSafeInteger(descriptor.durationTicks) || descriptor.durationTicks < 1) throw new RangeError(`Invalid duration for scenario ${descriptor.id}`);
    if (!Number.isSafeInteger(descriptor.snapshotInterval) || descriptor.snapshotInterval < 1) throw new RangeError(`Invalid snapshot interval for scenario ${descriptor.id}`);
  }

  private validateSchedule(scenario: SimulationScenario, schedule: ReturnType<SimulationScenario['createSchedule']>): void {
    if (!this.options.strictSchedule) return;
    const seen = new Set<string>();
    for (const item of schedule) {
      if (!Number.isSafeInteger(item.tick) || item.tick < 1 || item.tick > scenario.descriptor.durationTicks) {
        throw new RangeError(`Scheduled tick outside scenario: ${item.tick}`);
      }
      if (!Number.isSafeInteger(item.order) || item.order < 0) throw new RangeError('Scenario action order must be non-negative');
      const key = `${item.tick}:${item.order}`;
      if (seen.has(key)) throw new Error(`Duplicate scheduled action order: ${key}`);
      seen.add(key);
    }
  }

  private verifyExpectation(state: ScenarioState, rejected: number, expectation: ScenarioExpectation): ScenarioInvariantViolation[] {
    const violations: ScenarioInvariantViolation[] = [];
    const minimum = (id: string, path: string, actual: number, expected: number): void => {
      if (actual < expected) violations.push(this.expectationViolation(id, path, actual, expected));
    };
    minimum('expect-score', 'score', state.score, expectation.minimumScore);
    minimum('expect-distance', 'distanceTravelled', state.distanceTravelled, expectation.minimumDistance);
    minimum('expect-defeats', 'enemiesDefeated', state.enemiesDefeated, expectation.minimumDefeats);
    minimum('expect-experience', 'experience', state.experience, expectation.minimumExperience);
    if (rejected > expectation.maximumRejectedActions) violations.push(this.expectationViolation('expect-rejections', 'actionsRejected', rejected, expectation.maximumRejectedActions));
    if (expectation.requireAlive && state.health <= 0) violations.push(this.expectationViolation('expect-alive', 'health', state.health, 1));
    if (expectation.requiredFlag && state.flags[expectation.requiredFlag] !== true) violations.push(this.expectationViolation('expect-flag', `flags.${expectation.requiredFlag}`, 0, 1));
    return violations;
  }

  private expectationViolation(id: string, path: string, actual: number, expected: number): ScenarioInvariantViolation {
    return { id, tick: 0, severity: 'error', message: `Expectativa ${path} não foi atingida`, path, actual, expected };
  }

  private captureSnapshot(state: ScenarioState): ScenarioSnapshot {
    return { tick: state.tick, checksum: this.checksum(state), state: cloneJson(state) };
  }

  private checksum(value: JsonValue): number {
    const source = stableStringify(value);
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
}
