import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { EncounterPlan, EnemySpawn, GeneratedMap, Room } from '../core/types';
import { SpawnPlanner } from './SpawnPlanner';

interface EnemyArchetype {
  id: string;
  cost: number;
  minimumDifficulty: number;
  role: 'melee' | 'ranged' | 'tank' | 'support' | 'elite';
}

const ARCHETYPES: readonly EnemyArchetype[] = [
  { id: 'imp_melee', cost: 1, minimumDifficulty: 1, role: 'melee' },
  { id: 'cultist_archer', cost: 2, minimumDifficulty: 1, role: 'ranged' },
  { id: 'stone_guardian', cost: 4, minimumDifficulty: 3, role: 'tank' },
  { id: 'hex_weaver', cost: 4, minimumDifficulty: 4, role: 'support' },
  { id: 'winged_hunter', cost: 5, minimumDifficulty: 5, role: 'ranged' },
  { id: 'infernal_champion', cost: 8, minimumDifficulty: 7, role: 'elite' },
];

export class EncounterPlanner {
  private readonly spawns = new SpawnPlanner();

  public populate(map: GeneratedMap, random: DeterministicRandom): void {
    const difficulty = Number(map.metadata.difficulty ?? 3);
    const combatRooms = map.rooms.filter((room) => room.kind === 'combat' || room.kind === 'boss');
    const globalCandidates = this.spawns.enemyCandidates(map, {
      minimumFromSpawn: 7,
      minimumFromExit: 2,
      minimumSeparation: 3,
      avoidLineOfSight: false,
      preferRooms: combatRooms.length > 0,
      requireWallDistance: 0,
    });
    let serial = 0;
    const encounters: EncounterPlan[] = [];
    for (const room of combatRooms) {
      const roomCandidates = this.spawns.roomCandidates(map, room, 1);
      const budget = this.roomBudget(room, difficulty, random);
      const composition = this.compose(budget, difficulty, random);
      const positions = this.spawns.chooseSeparated(roomCandidates, composition.length, 2, random, [map.spawn]);
      const encounterId = 'encounter-' + encounters.length;
      const enemyIds: string[] = [];
      composition.forEach((archetype, index) => {
        const position = positions[index];
        if (!position) return;
        const id = 'enemy-' + serial++;
        enemyIds.push(id);
        map.enemies.push({
          id,
          archetype: archetype.id,
          position,
          level: Math.max(1, difficulty + random.integer(-1, 1)),
          patrol: archetype.role === 'ranged' ? [] : this.spawns.patrolRoute(map, position, 8, random),
          encounterId,
        });
      });
      if (enemyIds.length > 0) encounters.push({ id: encounterId, roomId: room.id, enemies: enemyIds, budget, trigger: 'enter-room' });
    }
    if (map.enemies.length === 0) {
      const count = Math.max(1, Math.floor(globalCandidates.length * 0.04));
      const positions = this.spawns.chooseSeparated(globalCandidates, count, 3, random, [map.spawn]);
      const encounterId = 'encounter-roaming';
      for (const position of positions) {
        const archetype = random.pick(this.available(difficulty));
        map.enemies.push({ id: 'enemy-' + serial++, archetype: archetype.id, position, level: difficulty, patrol: this.spawns.patrolRoute(map, position, 10, random), encounterId });
      }
      encounters.push({ id: encounterId, enemies: map.enemies.map((enemy) => enemy.id), budget: count * 2, trigger: 'cross-threshold' });
    }
    map.encounters = encounters;
  }

  private roomBudget(room: Room, difficulty: number, random: DeterministicRandom): number {
    const base = Math.max(2, Math.floor(room.area / 15));
    const kindMultiplier = room.kind === 'boss' ? 2.2 : room.kind === 'combat' ? 1 : 0.5;
    return Math.max(1, Math.round(base * kindMultiplier + difficulty * 0.8 + random.integer(-1, 2)));
  }

  private compose(budget: number, difficulty: number, random: DeterministicRandom): EnemyArchetype[] {
    const available = this.available(difficulty);
    const result: EnemyArchetype[] = [];
    let remaining = budget;
    let safety = 0;
    while (remaining > 0 && safety++ < 30) {
      const choices = available.filter((entry) => entry.cost <= remaining);
      if (choices.length === 0) break;
      const chosen = random.weighted(choices.map((entry) => ({ value: entry, weight: 1 / entry.cost })));
      result.push(chosen);
      remaining -= chosen.cost;
    }
    return result;
  }

  private available(difficulty: number): EnemyArchetype[] {
    return ARCHETYPES.filter((entry) => entry.minimumDifficulty <= difficulty);
  }
}
