import { JsonObject } from '../core/types';
import { ScenarioRunner } from './ScenarioRunner';
import { ScenarioBatchResult, ScenarioCategory, ScenarioRunResult, SimulationScenario } from './types';

export interface ScenarioFilter {
  category?: ScenarioCategory;
  tags?: readonly string[];
  minimumDifficulty?: number;
  maximumDifficulty?: number;
  text?: string;
}

export class ScenarioSuite {
  private readonly scenarios = new Map<string, SimulationScenario>();

  public constructor(public readonly name: string, initialScenarios: readonly SimulationScenario[] = []) {
    initialScenarios.forEach(scenario => this.register(scenario));
  }

  public register(scenario: SimulationScenario): this {
    const id = scenario.descriptor.id;
    if (this.scenarios.has(id)) throw new Error(`Scenario already registered: ${id}`);
    this.scenarios.set(id, scenario);
    return this;
  }

  public unregister(id: string): boolean { return this.scenarios.delete(id); }
  public get(id: string): SimulationScenario | undefined { return this.scenarios.get(id); }
  public get size(): number { return this.scenarios.size; }

  public list(filter: ScenarioFilter = {}): SimulationScenario[] {
    const text = filter.text?.trim().toLowerCase();
    return [...this.scenarios.values()].filter(scenario => {
      const descriptor = scenario.descriptor;
      if (filter.category && descriptor.category !== filter.category) return false;
      if (filter.minimumDifficulty !== undefined && descriptor.difficulty < filter.minimumDifficulty) return false;
      if (filter.maximumDifficulty !== undefined && descriptor.difficulty > filter.maximumDifficulty) return false;
      if (filter.tags?.some(tag => !descriptor.tags.includes(tag))) return false;
      if (text) {
        const haystack = [descriptor.id, descriptor.title, descriptor.description, ...descriptor.tags].join(' ').toLowerCase();
        if (!haystack.includes(text)) return false;
      }
      return true;
    }).sort((left, right) => left.descriptor.id.localeCompare(right.descriptor.id));
  }

  public runAll(runner = new ScenarioRunner(), baseSeed = 1, filter: ScenarioFilter = {}): ScenarioBatchResult {
    const selected = this.list(filter);
    const results = selected.map((scenario, index) => runner.run(scenario, baseSeed + index * 7919));
    return this.summarize(results, selected);
  }

  public runOne(id: string, seed = 1, runner = new ScenarioRunner()): ScenarioRunResult {
    const scenario = this.scenarios.get(id);
    if (!scenario) throw new Error(`Unknown scenario: ${id}`);
    return runner.run(scenario, seed);
  }

  private summarize(results: ScenarioRunResult[], scenarios: SimulationScenario[]): ScenarioBatchResult {
    const categoryCounts: JsonObject = {};
    scenarios.forEach(scenario => {
      const category = scenario.descriptor.category;
      categoryCounts[category] = Number(categoryCounts[category] ?? 0) + 1;
    });
    let aggregateChecksum = 2166136261;
    results.forEach(result => {
      aggregateChecksum ^= result.checksum;
      aggregateChecksum = Math.imul(aggregateChecksum, 16777619);
    });
    return {
      name: this.name, total: results.length,
      passed: results.filter(result => result.passed).length,
      failed: results.filter(result => !result.passed).length,
      aggregateChecksum: aggregateChecksum >>> 0,
      totalTicks: results.reduce((sum, result) => sum + result.metrics.ticksExecuted, 0),
      totalActions: results.reduce((sum, result) => sum + result.metrics.actionsExecuted, 0),
      totalViolations: results.reduce((sum, result) => sum + result.violations.length, 0),
      categoryCounts, results,
    };
  }
}
