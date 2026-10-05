import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { MapRepairer } from '../analysis/MapRepairer';
import { TopologyAnalyzer } from '../analysis/TopologyAnalyzer';
import { MapValidator } from '../analysis/MapValidator';
import { DecorationPlanner } from '../content/DecorationPlanner';
import { EncounterPlanner } from '../content/EncounterPlanner';
import { LootPlanner } from '../content/LootPlanner';
import { BiomePainter } from '../terrain/BiomePainter';
import { TerrainComposer } from '../rules/TerrainComposer';
import { GenerationResult, GeneratorOptions, normalizeOptions } from '../core/types';
import { GeneratorRegistry } from './GeneratorRegistry';

export interface PipelineHooks {
  afterLayout?: (map: GenerationResult['map']) => void;
  afterTerrain?: (map: GenerationResult['map']) => void;
  afterContent?: (map: GenerationResult['map']) => void;
  afterValidation?: (result: GenerationResult) => void;
}

export class ProceduralPipeline {
  private readonly analyzer = new TopologyAnalyzer();
  private readonly validator = new MapValidator();
  private readonly repairer = new MapRepairer();
  private readonly terrain = new BiomePainter();
  private readonly terrainComposer = new TerrainComposer();
  private readonly encounters = new EncounterPlanner();
  private readonly loot = new LootPlanner();
  private readonly decorations = new DecorationPlanner();

  public constructor(private readonly registry = new GeneratorRegistry()) {}

  public generate(rawOptions: GeneratorOptions, hooks: PipelineHooks = {}): GenerationResult {
    const options = normalizeOptions(rawOptions);
    const warnings: string[] = [];
    const generator = this.registry.get(options.algorithm);
    let map = generator.generate(options);
    map.metadata.difficulty = options.difficulty;
    map.metadata.biome = options.biome;
    map.metadata.hazardDensity = options.hazardDensity;
    map.metadata.treasureDensity = options.treasureDensity;
    map.metadata.enemyDensity = options.enemyDensity;
    map.metadata.decorationDensity = options.decorationDensity;
    map.metadata.pipelineVersion = 1;
    map.metrics = this.analyzer.analyze(map);
    hooks.afterLayout?.(map);

    const random = new DeterministicRandom(options.seed).fork('procedural-pipeline');
    this.terrain.paint(map, random.fork('terrain'));
    this.terrainComposer.compose(map, random.fork('terrain-rules'));
    map.metrics = this.analyzer.analyze(map);
    hooks.afterTerrain?.(map);

    if (options.ensureConnected) {
      const early = this.validator.validate(map);
      if (!early.valid) {
        const repaired = this.repairer.repair(map);
        map = repaired.map;
        warnings.push(...repaired.repairs.map((repair) => 'reparo: ' + repair));
      }
    }
    map.metrics = this.analyzer.analyze(map);
    this.encounters.populate(map, random.fork('encounters'));
    this.loot.populate(map, random.fork('loot'));
    this.decorations.populate(map, random.fork('decorations'));
    hooks.afterContent?.(map);

    const report = this.validator.validate(map);
    map.metrics = report.metrics;
    warnings.push(...report.issues.filter((issue) => issue.severity === 'warning').map((issue) => issue.code + ': ' + issue.message));
    const result: GenerationResult = {
      map,
      warnings,
      repaired: Boolean(map.metadata.repaired),
      attempts: 1,
    };
    if (!report.valid) {
      const repaired = this.repairer.repair(map);
      result.map = repaired.map;
      result.map.metrics = this.analyzer.analyze(result.map);
      result.repaired = true;
      result.warnings.push(...repaired.repairs.map((repair) => 'reparo-final: ' + repair));
    }
    hooks.afterValidation?.(result);
    return result;
  }

  public generateBatch(options: GeneratorOptions, count: number): GenerationResult[] {
    if (!Number.isSafeInteger(count) || count < 1 || count > 100) throw new RangeError('batch count must be between 1 and 100');
    return Array.from({ length: count }, (_, index) => this.generate({ ...options, seed: String(options.seed) + ':' + index }));
  }
}
