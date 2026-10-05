import type { DecorationPlacement, EnemyPlacement, ItemPlacement, LevelDefinition } from '../../data/LevelData';
import { GeneratedMap } from '../core/types';

type LevelTheme = LevelDefinition['theme'];

const THEME_BY_BIOME: Record<string, LevelTheme> = {
  cathedral: 'gothic_cathedral',
  inferno: 'inferno_pit',
  celestial: 'celestial_tower',
  streets: 'venetian_streets',
  ruins: 'roman_ruins',
  garden: 'paradiso_garden',
  crypt: 'witches_crypt',
  clocktower: 'clocktower',
  colosseum: 'colosseum',
  void: 'limbo_void',
};

const AMBIENCE: Record<string, { ambient: number; fog: number; density: number; light: number; music: string }> = {
  cathedral: { ambient: 0x332244, fog: 0x1a0a2e, density: 0.3, light: 0.6, music: 'ost_vestibule' },
  inferno: { ambient: 0x661100, fog: 0x220000, density: 0.45, light: 0.55, music: 'ost_inferno' },
  celestial: { ambient: 0xddeeff, fog: 0xffffff, density: 0.12, light: 1, music: 'ost_paradiso' },
  streets: { ambient: 0x445566, fog: 0x223344, density: 0.2, light: 0.8, music: 'ost_vigrid_streets' },
  ruins: { ambient: 0x776655, fog: 0x332d28, density: 0.25, light: 0.7, music: 'ost_ruins' },
  garden: { ambient: 0x88bb99, fog: 0xddeedd, density: 0.18, light: 0.9, music: 'ost_garden' },
  crypt: { ambient: 0x221733, fog: 0x0d0815, density: 0.5, light: 0.42, music: 'ost_crypt' },
  clocktower: { ambient: 0x554433, fog: 0x221a11, density: 0.3, light: 0.58, music: 'ost_clocktower' },
  colosseum: { ambient: 0xaa8866, fog: 0x554433, density: 0.12, light: 0.85, music: 'ost_colosseum' },
  void: { ambient: 0x220044, fog: 0x110022, density: 0.7, light: 0.35, music: 'ost_limbo' },
};

export interface LevelAdapterOptions {
  id?: string;
  name?: string;
  description?: string;
  parTime?: number;
}

export class LevelDefinitionAdapter {
  public adapt(map: GeneratedMap, options: LevelAdapterOptions = {}): LevelDefinition {
    const biome = String(map.metadata.biome ?? 'cathedral');
    const ambience = AMBIENCE[biome] ?? AMBIENCE.cathedral;
    const enemies: EnemyPlacement[] = map.enemies.map((enemy) => ({
      type: enemy.archetype,
      x: enemy.position.x,
      y: enemy.position.y,
      level: enemy.level,
      patrol: enemy.patrol.length > 0 ? enemy.patrol.map((point) => ({ ...point })) : undefined,
    }));
    const items: ItemPlacement[] = map.items.map((item) => ({
      type: item.itemType,
      x: item.position.x,
      y: item.position.y,
      quantity: item.quantity,
    }));
    const decorations: DecorationPlacement[] = map.decorations.map((decoration) => ({
      type: decoration.decorationType,
      x: decoration.position.x,
      y: decoration.position.y,
      scale: decoration.scale,
      rotation: decoration.rotation,
      tint: decoration.tint,
    }));
    return {
      id: options.id ?? 'procedural-' + map.algorithm + '-' + this.slug(map.seed),
      name: options.name ?? 'Descida ' + this.displayAlgorithm(map.algorithm),
      description: options.description ?? 'Fase procedural determinística gerada por ' + map.algorithm + ' com semente ' + map.seed + '.',
      theme: THEME_BY_BIOME[biome] ?? 'gothic_cathedral',
      music: ambience.music,
      ambientColor: ambience.ambient,
      fogColor: ambience.fog,
      fogDensity: ambience.density,
      lightIntensity: ambience.light,
      tileMap: map.tiles.map((row) => [...row]),
      enemies,
      items,
      decorations,
      parTime: options.parTime ?? Math.max(90, Math.round(map.metrics.mainPathLength * 2.5 + enemies.length * 10)),
      difficulty: Number(map.metadata.difficulty ?? 3),
    };
  }

  private slug(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32) || 'seed';
  }

  private displayAlgorithm(algorithm: string): string {
    return algorithm.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }
}
