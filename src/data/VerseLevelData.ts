// src/data/VerseLevelData.ts
// Multi-section "verses": three chambers connected by doors. Players move
// between sections through doors (tile 5) and can come back. Keys trigger
// ambush waves.

import { LevelDefinition } from './LevelData';

function baseMap(width = 40, height = 25): number[][] {
  return Array.from({ length: height }, () => Array<number>(width).fill(1));
}
function carve(map: number[][], x1: number, y1: number, x2: number, y2: number): void {
  for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) map[y][x] = 0;
}

function sectionA(): number[][] {
  const map = baseMap();
  carve(map, 2, 3, 12, 12);
  carve(map, 12, 7, 20, 9);
  carve(map, 20, 4, 30, 12);
  map[8][29] = 5; // door east -> B
  map[7][4] = 8;   // spawn
  return map;
}

function sectionB(): number[][] {
  const map = baseMap();
  carve(map, 2, 3, 14, 14);
  carve(map, 14, 8, 24, 10);
  carve(map, 24, 4, 37, 14);
  map[8][2] = 5;   // door west -> A
  map[9][36] = 5;  // door east -> C
  map[8][3] = 8;   // arrival spawn
  return map;
}

function sectionC(): number[][] {
  const map = baseMap();
  carve(map, 2, 3, 16, 14);
  carve(map, 16, 9, 30, 11);
  carve(map, 30, 4, 38, 14);
  map[10][2] = 5;  // door west -> B
  map[9][3] = 8;   // arrival spawn
  return map;
}

export const VERSE_SECTIONS: LevelDefinition[] = [
  {
    id: 'verse_01_atrium',
    name: 'Átrio dos Ecos',
    description: 'A primeira câmara selada.',
    theme: 'witches_crypt',
    music: 'ost_vestibule',
    ambientColor: 0x332244,
    fogColor: 0x120d1b,
    fogDensity: 0.35,
    lightIntensity: 0.65,
    tileMap: sectionA(),
    enemies: [
      { type: 'affinity', x: 8, y: 7, level: 1 },
      { type: 'affinity', x: 5, y: 5, level: 1 },
      { type: 'applaud', x: 22, y: 8, level: 1 },
      { type: 'affinity', x: 27, y: 6, level: 2 },
      { type: 'affinity', x: 25, y: 10, level: 2 },
      { type: 'applaud', x: 28, y: 9, level: 2 },
    ],
    items: [
      { type: 'health_herb', x: 6, y: 10 },
      { type: 'mana_shard', x: 23, y: 5 },
    ],
    decorations: [],
    exits: [{ x: 29, y: 8, to: 1, spawnX: 4, spawnY: 9 }],
    ambush: [],
    parTime: 120,
    difficulty: 2,
  },
  {
    id: 'verse_02_galeria',
    name: 'Galeria Sombria',
    description: 'Um corredor longo guardado por anjos.',
    theme: 'witches_crypt',
    music: 'ost_vestibule',
    ambientColor: 0x2a1a33,
    fogColor: 0x100a18,
    fogDensity: 0.4,
    lightIntensity: 0.55,
    tileMap: sectionB(),
    enemies: [
      { type: 'affinity', x: 8, y: 8, level: 2 },
      { type: 'affinity', x: 6, y: 12, level: 2 },
      { type: 'applaud', x: 26, y: 8, level: 3 },
      { type: 'affinity', x: 30, y: 6, level: 3 },
      { type: 'affinity', x: 33, y: 11, level: 3 },
      { type: 'applaud', x: 24, y: 13, level: 3 },
    ],
    items: [
      { type: 'key', x: 31, y: 9 },
      { type: 'health_herb', x: 10, y: 5 },
    ],
    decorations: [],
    exits: [
      { x: 2, y: 8, to: 0, spawnX: 27, spawnY: 9 },
      { x: 36, y: 9, to: 2, spawnX: 4, spawnY: 10 },
    ],
    ambush: [
      { type: 'affinity', x: 7, y: 9, level: 3 },
      { type: 'affinity', x: 9, y: 11, level: 3 },
      { type: 'applaud', x: 32, y: 10, level: 3 },
      { type: 'affinity', x: 29, y: 12, level: 3 },
      { type: 'affinity', x: 11, y: 7, level: 3 },
    ],
    parTime: 150,
    difficulty: 3,
  },
  {
    id: 'verse_03_santuario',
    name: 'Santuário Proibido',
    description: 'O último altar antes do portal.',
    theme: 'witches_crypt',
    music: 'ost_vestibule',
    ambientColor: 0x1f1028,
    fogColor: 0x0c0714,
    fogDensity: 0.45,
    lightIntensity: 0.5,
    tileMap: sectionC(),
    enemies: [
      { type: 'affinity', x: 7, y: 8, level: 3 },
      { type: 'applaud', x: 10, y: 6, level: 3 },
      { type: 'affinity', x: 33, y: 8, level: 4 },
      { type: 'applaud', x: 35, y: 11, level: 4 },
      { type: 'affinity', x: 30, y: 10, level: 4 },
    ],
    items: [
      { type: 'key', x: 34, y: 6 },
      { type: 'mana_shard', x: 5, y: 12 },
    ],
    decorations: [],
    exits: [{ x: 2, y: 10, to: 1, spawnX: 34, spawnY: 10 }],
    ambush: [
      { type: 'affinity', x: 8, y: 10, level: 4 },
      { type: 'applaud', x: 12, y: 7, level: 4 },
      { type: 'affinity', x: 32, y: 9, level: 4 },
      { type: 'affinity', x: 36, y: 7, level: 4 },
      { type: 'applaud', x: 28, y: 10, level: 4 },
    ],
    parTime: 180,
    difficulty: 4,
  },
];
