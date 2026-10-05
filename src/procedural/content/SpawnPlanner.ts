import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { euclidean, manhattan } from '../core/Geometry';
import { EnemySpawn, GeneratedMap, ItemSpawn, Point, Room, TileKind, pointKey } from '../core/types';
import { tileIsPassable } from '../core/GenerationSupport';
import { Pathfinder } from '../analysis/Pathfinder';

export interface PlacementConstraints {
  minimumFromSpawn: number;
  minimumFromExit: number;
  minimumSeparation: number;
  avoidLineOfSight: boolean;
  preferRooms: boolean;
  requireWallDistance: number;
}

export class SpawnPlanner {
  private readonly pathfinder = new Pathfinder();

  public enemyCandidates(map: GeneratedMap, constraints: PlacementConstraints): Point[] {
    const grid = Grid.fromRows(map.tiles);
    const spawnDistances = this.pathfinder.distanceField(grid, [map.spawn], tileIsPassable);
    const exitDistances = this.pathfinder.distanceField(grid, [map.exit], tileIsPassable);
    const roomCells = new Set<string>();
    for (const room of map.rooms) {
      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) roomCells.add(x + ',' + y);
      }
    }
    return grid.filter((tile, x, y) => {
      if (tile !== TileKind.Floor) return false;
      if (spawnDistances.get(x, y) < constraints.minimumFromSpawn) return false;
      if (exitDistances.get(x, y) < constraints.minimumFromExit) return false;
      if (constraints.preferRooms && roomCells.size > 0 && !roomCells.has(x + ',' + y)) return false;
      if (constraints.avoidLineOfSight && this.pathfinder.lineOfSight(grid, map.spawn, { x, y }, tileIsPassable)) return false;
      const wallDistance = this.wallDistance(grid, { x, y }, constraints.requireWallDistance);
      return wallDistance >= constraints.requireWallDistance;
    });
  }

  public chooseSeparated(
    candidates: readonly Point[],
    count: number,
    minimumSeparation: number,
    random: DeterministicRandom,
    anchors: readonly Point[] = [],
  ): Point[] {
    const remaining = random.shuffle(candidates);
    const selected: Point[] = [];
    while (remaining.length > 0 && selected.length < count) {
      const candidate = remaining.shift()!;
      if ([...anchors, ...selected].every((point) => euclidean(point, candidate) >= minimumSeparation)) selected.push(candidate);
    }
    if (selected.length < count) {
      for (const candidate of random.shuffle(candidates)) {
        if (selected.length >= count) break;
        if (!selected.some((point) => pointKey(point) === pointKey(candidate))) selected.push(candidate);
      }
    }
    return selected;
  }

  public patrolRoute(map: GeneratedMap, origin: Point, length: number, random: DeterministicRandom): Point[] {
    const grid = Grid.fromRows(map.tiles);
    const route: Point[] = [origin];
    let current = origin;
    for (let step = 0; step < length; step++) {
      const choices = grid.neighbors4(current.x, current.y)
        .filter((point) => tileIsPassable(grid.get(point.x, point.y)))
        .filter((point) => route.length < 2 || pointKey(point) !== pointKey(route[route.length - 2]));
      if (choices.length === 0) break;
      current = random.pick(choices);
      if (step % 3 === 2) route.push(current);
    }
    if (route.length > 1) route.push(origin);
    return route;
  }

  public roomCandidates(map: GeneratedMap, room: Room, inset = 1): Point[] {
    const grid = Grid.fromRows(map.tiles);
    const result: Point[] = [];
    for (let y = room.y + inset; y < room.y + room.height - inset; y++) {
      for (let x = room.x + inset; x < room.x + room.width - inset; x++) {
        if (grid.inBounds(x, y) && grid.get(x, y) === TileKind.Floor) result.push({ x, y });
      }
    }
    return result;
  }

  public reserveOccupied(enemies: readonly EnemySpawn[], items: readonly ItemSpawn[]): Set<string> {
    return new Set([...enemies.map((entry) => pointKey(entry.position)), ...items.map((entry) => pointKey(entry.position))]);
  }

  public scoreCandidate(point: Point, map: GeneratedMap, occupied: ReadonlySet<string>): number {
    if (occupied.has(pointKey(point))) return -Infinity;
    let score = Math.min(manhattan(point, map.spawn), 20) * 2;
    score += Math.min(manhattan(point, map.exit), 12);
    for (const enemy of map.enemies) score += Math.min(euclidean(point, enemy.position), 8) * 0.25;
    for (const item of map.items) score += Math.min(euclidean(point, item.position), 6) * 0.15;
    return score;
  }

  private wallDistance(grid: Grid<number>, point: Point, maximum: number): number {
    for (let radius = 1; radius <= maximum; radius++) {
      const ring = grid.neighborhood(point.x, point.y, radius).filter((candidate) =>
        Math.max(Math.abs(candidate.x - point.x), Math.abs(candidate.y - point.y)) === radius);
      if (ring.some((candidate) => !tileIsPassable(grid.get(candidate.x, candidate.y)))) return radius - 1;
    }
    return maximum;
  }
}
