import { BiomeId, GeneratorAlgorithm, GeneratorOptions, createDefaultOptions, normalizeOptions } from '../core/types';

export type PresetId =
  | 'cathedral-intro'
  | 'crypt-crawl'
  | 'inferno-caverns'
  | 'celestial-bridges'
  | 'clockwork-maze'
  | 'ruined-city'
  | 'garden-labyrinth'
  | 'colosseum-gauntlet'
  | 'void-fracture'
  | 'roguelike-mix';

export interface GenerationPreset {
  id: PresetId;
  name: string;
  description: string;
  algorithm: GeneratorAlgorithm;
  biome: BiomeId;
  overrides: Partial<GeneratorOptions>;
}

export const GENERATION_PRESETS: readonly GenerationPreset[] = [
  { id: 'cathedral-intro', name: 'Nave da Catedral', description: 'Salas legíveis, corredores largos e encontros graduais.', algorithm: 'bsp', biome: 'cathedral', overrides: { difficulty: 1, floorTarget: 0.5, corridorWidth: 2, loopChance: 0.14, hazardDensity: 0.01 } },
  { id: 'crypt-crawl', name: 'Cripta Labiríntica', description: 'Passagens estreitas, becos e tesouros escondidos.', algorithm: 'depth-first-maze', biome: 'crypt', overrides: { difficulty: 3, corridorWidth: 1, loopChance: 0.08, treasureDensity: 0.02 } },
  { id: 'inferno-caverns', name: 'Cavernas do Inferno', description: 'Cavernas orgânicas com rios e bolsões de lava.', algorithm: 'cellular-automata', biome: 'inferno', overrides: { difficulty: 5, floorTarget: 0.54, hazardDensity: 0.08, smoothingPasses: 5 } },
  { id: 'celestial-bridges', name: 'Pontes Celestiais', description: 'Módulos suspensos conectados por padrões compatíveis.', algorithm: 'wave-function-collapse', biome: 'celestial', overrides: { difficulty: 6, corridorWidth: 1, hazardDensity: 0.06 } },
  { id: 'clockwork-maze', name: 'Engrenagens do Tempo', description: 'Labirinto uniforme com muitas rotas alternativas.', algorithm: 'prim-maze', biome: 'clocktower', overrides: { difficulty: 4, loopChance: 0.22, enemyDensity: 0.03 } },
  { id: 'ruined-city', name: 'Cidade em Ruínas', description: 'Quarteirões irregulares ligados por uma malha de proximidade.', algorithm: 'room-graph', biome: 'ruins', overrides: { difficulty: 4, roomMinSize: 4, roomMaxSize: 9, loopChance: 0.3 } },
  { id: 'garden-labyrinth', name: 'Jardim de Paradiso', description: 'Labirinto construído em linhas com clareiras simétricas.', algorithm: 'eller-maze', biome: 'garden', overrides: { difficulty: 5, loopChance: 0.17, decorationDensity: 0.1 } },
  { id: 'colosseum-gauntlet', name: 'Prova do Coliseu', description: 'Progressão dirigida por encontros até uma arena final.', algorithm: 'grammar', biome: 'colosseum', overrides: { difficulty: 7, roomMinSize: 5, roomMaxSize: 11, enemyDensity: 0.05 } },
  { id: 'void-fracture', name: 'Fratura do Limbo', description: 'Regiões Voronoi deformadas, perigosas e imprevisíveis.', algorithm: 'voronoi-caves', biome: 'void', overrides: { difficulty: 9, floorTarget: 0.5, hazardDensity: 0.1, decorationDensity: 0.08 } },
  { id: 'roguelike-mix', name: 'Descida Procedural', description: 'Combinação de salas, cavernas, ruído e marcos.', algorithm: 'hybrid', biome: 'cathedral', overrides: { difficulty: 5, loopChance: 0.25, hazardDensity: 0.04, treasureDensity: 0.016 } },
];

export function getPreset(id: PresetId): GenerationPreset {
  const preset = GENERATION_PRESETS.find((entry) => entry.id === id);
  if (!preset) throw new Error('unknown generation preset: ' + id);
  return preset;
}

export function optionsFromPreset(id: PresetId, seed: string | number, overrides: Partial<GeneratorOptions> = {}): GeneratorOptions {
  const preset = getPreset(id);
  return normalizeOptions({ ...createDefaultOptions(seed, preset.algorithm), ...preset.overrides, ...overrides, seed, algorithm: overrides.algorithm ?? preset.algorithm, biome: overrides.biome ?? preset.biome });
}
