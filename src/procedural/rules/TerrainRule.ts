import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { GeneratedMap, BiomeId } from '../core/types';

export interface TerrainRuleResult {
  ruleId: string;
  inspectedCells: number;
  changedCells: number;
  skippedCells: number;
  notes: string[];
}

export interface TerrainRule {
  readonly id: string;
  readonly biome: BiomeId;
  readonly priority: number;
  readonly minimumDifficulty: number;
  readonly maximumDifficulty: number;
  apply(map: GeneratedMap, random: DeterministicRandom): TerrainRuleResult;
}

export abstract class BaseTerrainRule implements TerrainRule {
  public abstract readonly id: string;
  public abstract readonly biome: BiomeId;
  public abstract readonly priority: number;
  public abstract readonly minimumDifficulty: number;
  public abstract readonly maximumDifficulty: number;

  public abstract apply(map: GeneratedMap, random: DeterministicRandom): TerrainRuleResult;

  protected acceptsDifficulty(map: GeneratedMap): boolean {
    const difficulty = Number(map.metadata.difficulty ?? 1);
    return difficulty >= this.minimumDifficulty && difficulty <= this.maximumDifficulty;
  }

  protected protectedCell(map: GeneratedMap, x: number, y: number, radius = 2): boolean {
    const spawnDistance = Math.abs(map.spawn.x - x) + Math.abs(map.spawn.y - y);
    const exitDistance = Math.abs(map.exit.x - x) + Math.abs(map.exit.y - y);
    return spawnDistance <= radius || exitDistance <= radius;
  }

  protected result(changedCells: number, inspectedCells: number, skippedCells: number, notes: string[] = []): TerrainRuleResult {
    return { ruleId: this.id, changedCells, inspectedCells, skippedCells, notes };
  }
}
