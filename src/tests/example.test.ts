import { CORRIDOR_LEVEL } from '../data/CorridorLevelData';
import { CLASS_DATABASE, PLAYER_CLASS_ORDER } from '../data/ClassDatabase';

function findTile(value: number): [number, number] | undefined {
  for (let y = 0; y < CORRIDOR_LEVEL.tileMap.length; y++) {
    const x = CORRIDOR_LEVEL.tileMap[y].indexOf(value);
    if (x >= 0) return [x, y];
  }
  return undefined;
}

test('corridor level has the expected dimensions and landmarks', () => {
  expect(CORRIDOR_LEVEL.tileMap).toHaveLength(25);
  CORRIDOR_LEVEL.tileMap.forEach(row => expect(row).toHaveLength(40));
  expect(findTile(8)).toBeDefined();
  expect(findTile(5)).toBeDefined();
});

test('the exit can be reached from the player spawn', () => {
  const start = findTile(8)!;
  const exit = findTile(5)!;
  const queue: Array<[number, number]> = [start];
  const visited = new Set([start.join(',')]);

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (x === exit[0] && y === exit[1]) break;
    for (const [nextX, nextY] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      const tile = CORRIDOR_LEVEL.tileMap[nextY]?.[nextX];
      const key = `${nextX},${nextY}`;
      if (tile !== undefined && tile !== 1 && tile !== 2 && !visited.has(key)) {
        visited.add(key);
        queue.push([nextX, nextY]);
      }
    }
  }

  expect(visited.has(exit.join(','))).toBe(true);
});

test('every playable class has its own weapon, special and valid combat stats', () => {
  expect(PLAYER_CLASS_ORDER).toHaveLength(4);
  const classes = PLAYER_CLASS_ORDER.map(id => CLASS_DATABASE[id]);
  expect(new Set(classes.map(heroClass => heroClass.weaponName)).size).toBe(classes.length);
  expect(new Set(classes.map(heroClass => heroClass.specialStyle)).size).toBe(classes.length);
  classes.forEach(heroClass => {
    expect(heroClass.maxHp).toBeGreaterThan(0);
    expect(heroClass.baseDamage).toBeGreaterThan(0);
    expect(heroClass.magicCost).toBeLessThanOrEqual(heroClass.maxMagic);
    expect(heroClass.attackCooldown).toBeGreaterThan(0);
  });
});

test('archer movement speed matches the mage', () => {
  expect(CLASS_DATABASE.ranger.speed).toBe(CLASS_DATABASE.mage.speed);
});
