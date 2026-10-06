import { DeterministicRandom } from '../simulation';
import {
  GENERATED_SIMULATION_SCENARIOS,
  ScenarioRunner,
  ScenarioSuite,
  ScenarioWorld,
  SimulationScenario,
  createDefaultScenarioState,
  createScenarioAction,
} from '../simulation/scenarios';

describe('ScenarioWorld', () => {
  test('applies movement, combat, resource and reward actions', () => {
    const world = new ScenarioWorld(createDefaultScenarioState());
    world.beginTick(1);
    expect(world.apply(createScenarioAction('move', { x: 3, y: 4 }), 0).accepted).toBe(true);
    expect(world.apply(createScenarioAction('spawnEnemy', { amount: 2 }), 1).accepted).toBe(true);
    expect(world.apply(createScenarioAction('advanceCombo', { amount: 3 }), 2).accepted).toBe(true);
    expect(world.apply(createScenarioAction('defeatEnemy', { amount: 1 }), 3).accepted).toBe(true);
    expect(world.apply(createScenarioAction('grantCurrency', { amount: 20 }), 4).accepted).toBe(true);
    expect(world.apply(createScenarioAction('grantExperience', { amount: 120 }), 5).accepted).toBe(true);

    expect(world.value.distanceTravelled).toBe(5);
    expect(world.value.enemiesAlive).toBe(1);
    expect(world.value.enemiesDefeated).toBe(1);
    expect(world.value.currency).toBe(20);
    expect(world.value.level).toBeGreaterThan(1);
    expect(world.value.score).toBeGreaterThan(100);
    expect(world.validate()).toEqual([]);
  });

  test('rejects unaffordable and structurally invalid actions without corrupting state', () => {
    const state = createDefaultScenarioState();
    state.mana = 2;
    state.currency = 1;
    const world = new ScenarioWorld(state);
    world.beginTick(1);

    expect(world.apply(createScenarioAction('spendMana', { amount: 20 }), 0).accepted).toBe(false);
    expect(world.apply(createScenarioAction('spendCurrency', { amount: 10 }), 1).accepted).toBe(false);
    expect(world.apply(createScenarioAction('defeatEnemy', { amount: 1 }), 2).accepted).toBe(false);
    expect(world.apply(createScenarioAction('addItem', { key: '', amount: 1 }), 3).accepted).toBe(false);
    expect(world.value.mana).toBe(2);
    expect(world.value.currency).toBe(1);
    expect(world.value.enemiesAlive).toBe(0);
    expect(world.runMetrics.actionsRejected).toBe(4);
    expect(world.validate()).toEqual([]);
  });

  test('caps bounded resources and records traces up to the configured limit', () => {
    const state = createDefaultScenarioState();
    state.health = 50;
    const world = new ScenarioWorld(state, 2);
    world.beginTick(1);
    world.apply(createScenarioAction('heal', { amount: 500 }), 0);
    world.apply(createScenarioAction('restoreMana', { amount: 500 }), 1);
    world.apply(createScenarioAction('restoreStamina', { amount: 500 }), 2);

    expect(world.value.health).toBe(world.value.maximumHealth);
    expect(world.value.mana).toBe(world.value.maximumMana);
    expect(world.value.stamina).toBe(world.value.maximumStamina);
    expect(world.traceEntries).toHaveLength(2);
    expect(world.runMetrics.actionsExecuted).toBe(3);
  });
});

describe('ScenarioRunner', () => {
  const scenario = GENERATED_SIMULATION_SCENARIOS[0];

  test('repeats the exact run for the same scenario and seed', () => {
    const runner = new ScenarioRunner();
    const first = runner.run(scenario, 777);
    const second = runner.run(scenario, 777);

    expect(first.checksum).toBe(second.checksum);
    expect(first.finalState).toEqual(second.finalState);
    expect(first.traces).toEqual(second.traces);
    expect(runner.compare(first, second).equal).toBe(true);
  });

  test('uses the seed to produce a different deterministic route', () => {
    const runner = new ScenarioRunner();
    const first = runner.run(scenario, 101);
    const second = runner.run(scenario, 202);
    const comparison = runner.compare(first, second);

    expect(comparison.equal).toBe(false);
    expect(first.finalState.position).not.toEqual(second.finalState.position);
    expect(first.passed).toBe(true);
    expect(second.passed).toBe(true);
  });

  test('honors trace and snapshot limits', () => {
    const runner = new ScenarioRunner({ traceLimit: 5, snapshotLimit: 2 });
    const result = runner.run(scenario, 4);

    expect(result.traces).toHaveLength(5);
    expect(result.snapshots).toHaveLength(2);
    expect(result.metrics.actionsExecuted).toBeGreaterThan(result.traces.length);
    expect(result.metrics.snapshotsCaptured).toBe(2);
  });

  test('rejects invalid schedules in strict mode', () => {
    const invalid: SimulationScenario = {
      descriptor: {
        id: 'invalid-schedule', title: 'Invalid', description: 'Invalid tick', category: 'stress',
        difficulty: 1, durationTicks: 5, snapshotInterval: 1, tags: [], version: 1,
      },
      createInitialState: createDefaultScenarioState,
      createSchedule: () => [{ tick: 10, order: 0, action: createScenarioAction('move', { x: 1 }) }],
      expectation: () => ({
        minimumScore: 0, minimumDistance: 0, minimumDefeats: 0, minimumExperience: 0,
        maximumRejectedActions: 0, requireAlive: true, requiredFlag: '',
      }),
    };
    expect(() => new ScenarioRunner().run(invalid)).toThrow('outside scenario');
    expect(() => new ScenarioRunner({ strictSchedule: false }).run(invalid)).not.toThrow();
  });

  test('exposes deterministic schedules from the existing random source', () => {
    const first = scenario.createSchedule(new DeterministicRandom('schedule'));
    const second = scenario.createSchedule(new DeterministicRandom('schedule'));
    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(scenario.descriptor.durationTicks);
  });
});

describe('ScenarioSuite', () => {
  const suite = new ScenarioSuite('generated', GENERATED_SIMULATION_SCENARIOS);

  test('registers all generated scenarios with unique identifiers', () => {
    const ids = suite.list().map(scenario => scenario.descriptor.id);
    expect(suite.size).toBe(300);
    expect(new Set(ids).size).toBe(300);
    expect(() => suite.register(GENERATED_SIMULATION_SCENARIOS[0])).toThrow('already registered');
  });

  test('filters by category, tag, difficulty and text', () => {
    expect(suite.list({ category: 'combat' })).toHaveLength(50);
    expect(suite.list({ category: 'navigation' })).toHaveLength(50);
    expect(suite.list({ tags: ['generated', 'mage'] }).length).toBeGreaterThan(0);
    expect(suite.list({ minimumDifficulty: 10 })).toHaveLength(30);
    expect(suite.list({ maximumDifficulty: 1 })).toHaveLength(30);
    expect(suite.list({ text: 'cathedral' }).length).toBeGreaterThan(0);
  });

  test('runs a filtered batch and aggregates its metrics', () => {
    const result = suite.runAll(new ScenarioRunner({ traceLimit: 0 }), 90, { category: 'economy' });
    expect(result.total).toBe(50);
    expect(result.passed).toBe(50);
    expect(result.failed).toBe(0);
    expect(result.totalTicks).toBeGreaterThan(2000);
    expect(result.totalActions).toBeGreaterThan(result.totalTicks);
    expect(result.totalViolations).toBe(0);
    expect(result.categoryCounts.economy).toBe(50);
  });

  test('can execute and unregister one scenario by identifier', () => {
    const local = new ScenarioSuite('local', [GENERATED_SIMULATION_SCENARIOS[0]]);
    const id = GENERATED_SIMULATION_SCENARIOS[0].descriptor.id;
    expect(local.runOne(id, 44).passed).toBe(true);
    expect(local.unregister(id)).toBe(true);
    expect(local.size).toBe(0);
    expect(() => local.runOne(id)).toThrow('Unknown scenario');
  });
});
