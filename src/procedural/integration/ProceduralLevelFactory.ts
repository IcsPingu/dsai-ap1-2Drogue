import type { LevelDefinition } from '../../data/LevelData';
import { GeneratorAlgorithm, GeneratorOptions } from '../core/types';
import { GenerationPreset, PresetId, getPreset, optionsFromPreset } from '../pipeline/GenerationPresets';
import { ProceduralPipeline } from '../pipeline/ProceduralPipeline';
import { LevelDefinitionAdapter, LevelAdapterOptions } from './LevelDefinitionAdapter';

export interface ProceduralLevelRequest {
  seed: string | number;
  preset?: PresetId;
  algorithm?: GeneratorAlgorithm;
  overrides?: Partial<GeneratorOptions>;
  level?: LevelAdapterOptions;
}

export class ProceduralLevelFactory {
  public constructor(
    private readonly pipeline = new ProceduralPipeline(),
    private readonly adapter = new LevelDefinitionAdapter(),
  ) {}

  public create(request: ProceduralLevelRequest): LevelDefinition {
    const preset = request.preset ?? 'roguelike-mix';
    const options = optionsFromPreset(preset, request.seed, {
      ...request.overrides,
      algorithm: request.algorithm ?? request.overrides?.algorithm,
    });
    const result = this.pipeline.generate(options);
    return this.adapter.adapt(result.map, request.level);
  }

  public createRun(seed: string | number, presets: readonly PresetId[]): LevelDefinition[] {
    return presets.map((preset, index) => this.create({
      seed: String(seed) + ':floor-' + index,
      preset,
      overrides: { difficulty: Math.min(10, index + 1) },
      level: { id: 'procedural-floor-' + (index + 1), name: 'Andar Procedural ' + (index + 1) },
    }));
  }

  public describePreset(id: PresetId): GenerationPreset {
    return getPreset(id);
  }
}
