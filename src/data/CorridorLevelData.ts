import { LevelDefinition } from './LevelData';

function createMap(): number[][] {
  const map = Array.from({ length: 25 }, () => Array<number>(40).fill(1));
  const carve = (x1: number, y1: number, x2: number, y2: number) => {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) map[y][x] = 0;
    }
  };

  carve(2, 3, 10, 10);
  carve(10, 6, 18, 8);
  carve(17, 3, 28, 12);
  carve(22, 12, 24, 18);
  carve(15, 17, 31, 23);
  carve(31, 19, 36, 21);
  carve(35, 15, 38, 23);

  map[6][4] = 8;
  map[19][37] = 5;
  map[5][21] = 2;
  map[10][25] = 2;
  map[19][19] = 2;
  map[21][27] = 2;
  return map;
}

export const CORRIDOR_LEVEL: LevelDefinition = {
  id: 'level_01_forgotten_passage',
  name: 'A Passagem Esquecida',
  description: 'Abra caminho pelas câmaras seladas e alcance o portal.',
  theme: 'witches_crypt',
  music: 'ost_vestibule',
  ambientColor: 0x332244,
  fogColor: 0x120d1b,
  fogDensity: 0.35,
  lightIntensity: 0.65,
  tileMap: createMap(),
  enemies: [
    { type: 'affinity', x: 7, y: 7, level: 1 },
    { type: 'affinity', x: 19, y: 6, level: 1 },
    { type: 'applaud', x: 26, y: 9, level: 2 },
    { type: 'affinity', x: 20, y: 20, level: 2 },
    { type: 'applaud', x: 29, y: 20, level: 2 },
    { type: 'affinity', x: 36, y: 17, level: 3 },
  ],
  items: [
    { type: 'health_herb', x: 18, y: 10 },
    { type: 'mana_shard', x: 17, y: 21 },
    { type: 'halos_medium', x: 36, y: 22 },
  ],
  decorations: [],
  parTime: 180,
  difficulty: 2,
};
