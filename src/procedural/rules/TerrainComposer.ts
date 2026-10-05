import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { GeneratedMap } from '../core/types';
import { TerrainRuleResult } from './TerrainRule';
import { TerrainRuleRegistry } from './TerrainRuleRegistry';

export interface TerrainCompositionReport {
  selectedRules: string[];
  results: TerrainRuleResult[];
  totalChangedCells: number;
  totalInspectedCells: number;
}

export class TerrainComposer {
  public constructor(private readonly registry = new TerrainRuleRegistry()) {}

  public compose(map: GeneratedMap, random: DeterministicRandom): TerrainCompositionReport {
    const eligible = this.registry.eligible(map);
    const difficulty = Number(map.metadata.difficulty ?? 1);
    const desired = Math.min(eligible.length, 2 + Math.floor(difficulty / 3));
    const selected = this.selectDiverse(eligible, desired, random);
    const results: TerrainRuleResult[] = [];
    for (const rule of selected) results.push(rule.apply(map, random.fork(rule.id)));
    const report = {
      selectedRules: selected.map((rule) => rule.id),
      results,
      totalChangedCells: results.reduce((sum, result) => sum + result.changedCells, 0),
      totalInspectedCells: results.reduce((sum, result) => sum + result.inspectedCells, 0),
    };
    map.metadata.terrainRuleCount = selected.length;
    map.metadata.terrainRules = report.selectedRules.join(',');
    map.metadata.terrainRuleChanges = report.totalChangedCells;
    return report;
  }

  private selectDiverse<T extends { priority: number; id: string }>(rules: readonly T[], count: number, random: DeterministicRandom): T[] {
    const buckets = new Map<number, T[]>();
    for (const rule of rules) {
      const bucket = Math.floor(rule.priority / 20);
      buckets.set(bucket, [...(buckets.get(bucket) ?? []), rule]);
    }
    const selected: T[] = [];
    for (const bucket of random.shuffle([...buckets.values()])) {
      if (selected.length >= count) break;
      selected.push(random.pick(bucket));
    }
    if (selected.length < count) {
      for (const rule of random.shuffle(rules)) {
        if (selected.length >= count) break;
        if (!selected.some((entry) => entry.id === rule.id)) selected.push(rule);
      }
    }
    return selected.sort((left, right) => left.priority - right.priority);
  }
}
