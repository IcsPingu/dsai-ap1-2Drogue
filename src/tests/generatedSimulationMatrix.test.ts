import {
  GENERATED_SIMULATION_SCENARIO_COUNT,
  GENERATED_SIMULATION_SCENARIOS,
  ScenarioRunner,
} from '../simulation/scenarios';

describe('generated deterministic simulation matrix', () => {
  const runner = new ScenarioRunner({ traceLimit: 25, snapshotLimit: 20 });

  test('catalog has the declared size and balanced categories', () => {
    expect(GENERATED_SIMULATION_SCENARIO_COUNT).toBe(300);
    const categories = new Map<string, number>();
    GENERATED_SIMULATION_SCENARIOS.forEach(scenario => {
      categories.set(scenario.descriptor.category, (categories.get(scenario.descriptor.category) ?? 0) + 1);
    });
    expect([...categories.values()]).toEqual([50, 50, 50, 50, 50, 50]);
  });

  test.each(GENERATED_SIMULATION_SCENARIOS.map((scenario, index) => [
    scenario.descriptor.id,
    scenario,
    1000 + index * 37,
  ] as const))('%s satisfies invariants and replays exactly', (_id, scenario, seed) => {
    const result = runner.run(scenario, seed);
    const replay = runner.replay(scenario, result);

    expect(result.passed).toBe(true);
    expect(result.violations).toEqual([]);
    expect(result.metrics.ticksExecuted).toBe(scenario.descriptor.durationTicks);
    expect(result.metrics.actionsExecuted).toBe(result.metrics.actionsScheduled);
    expect(result.metrics.invariantChecks).toBe(scenario.descriptor.durationTicks * 8);
    expect(result.metrics.distanceTravelled).toBeGreaterThan(0);
    expect(result.metrics.enemiesDefeated).toBeGreaterThan(0);
    expect(result.metrics.experienceEarned).toBeGreaterThan(0);
    expect(result.snapshots.length).toBeGreaterThan(0);
    expect(result.finalState.health).toBeGreaterThan(0);
    expect(result.finalState.enemiesAlive).toBe(0);
    expect(result.checksum).toBe(replay.checksum);
    expect(result.finalState).toEqual(replay.finalState);
  });
});
