import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { GeneratedMap, Point, TileKind, pointKey } from '../core/types';
import { Grid } from '../core/Grid';
import { Pathfinder } from '../analysis/Pathfinder';
import { tileIsPassable } from '../core/GenerationSupport';
import { SpawnPlanner } from './SpawnPlanner';

export class LootPlanner {
  private readonly pathfinder = new Pathfinder();
  private readonly spawns = new SpawnPlanner();

  public populate(map: GeneratedMap, random: DeterministicRandom): void {
    const grid = Grid.fromRows(map.tiles);
    const distances = this.pathfinder.distanceField(grid, [map.spawn], tileIsPassable);
    const occupied = this.spawns.reserveOccupied(map.enemies, map.items);
    const deadEnds = grid.filter((tile, x, y) => tile === TileKind.Floor &&
      grid.neighbors4(x, y).filter((point) => tileIsPassable(grid.get(point.x, point.y))).length === 1);
    const roomTreasures = map.rooms.filter((room) => room.kind === 'treasure').flatMap((room) => this.spawns.roomCandidates(map, room, 1));
    const candidates = [...deadEnds, ...roomTreasures, ...grid.filter((tile, x, y) => tile === TileKind.Floor && distances.get(x, y) > 12)]
      .filter((point) => Number.isFinite(distances.get(point.x, point.y)))
      .filter((point, index, values) => values.findIndex((other) => pointKey(other) === pointKey(point)) === index)
      .sort((left, right) => distances.get(right.x, right.y) - distances.get(left.x, left.y));
    const desired = Math.max(1, Math.floor(map.metrics.walkableCells * Number(map.metadata.treasureDensity ?? 0.01)));
    const positions = this.spawns.chooseSeparated(candidates, desired, 5, random, [map.spawn, map.exit]);
    positions.forEach((position, index) => {
      if (occupied.has(pointKey(position))) return;
      const distance = distances.get(position.x, position.y);
      const itemType = this.itemForDistance(distance, Number(map.metadata.difficulty ?? 3), random);
      map.items.push({ id: 'item-' + index, itemType, position, quantity: itemType === 'halos' ? random.integer(25, 150) : 1, guarded: this.isGuarded(position, map) });
      if (random.boolean(0.55)) grid.set(position.x, position.y, TileKind.Chest);
    });
    map.tiles = grid.toRows();
  }

  private itemForDistance(distance: number, difficulty: number, random: DeterministicRandom): string {
    const safeDistance = Number.isFinite(distance) ? Math.max(0, distance) : 0;
    return random.weighted([
      { value: 'health_herb', weight: Math.max(1, 8 - difficulty) },
      { value: 'mana_shard', weight: 4 },
      { value: 'halos', weight: 6 },
      { value: 'witch_heart_fragment', weight: Math.max(0.2, safeDistance / 30) },
      { value: 'umbran_tears', weight: Math.max(0.1, difficulty / 10) },
    ]);
  }

  private isGuarded(position: Point, map: GeneratedMap): boolean {
    return map.enemies.some((enemy) => Math.hypot(enemy.position.x - position.x, enemy.position.y - position.y) <= 6);
  }
}
