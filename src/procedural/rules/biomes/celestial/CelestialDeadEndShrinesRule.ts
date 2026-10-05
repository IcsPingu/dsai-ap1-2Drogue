import { DeterministicRandom } from '../../../../simulation/core/DeterministicRandom';
import { Grid } from '../../../core/Grid';
import { NoiseField } from '../../../core/Noise';
import { GeneratedMap, TileKind } from '../../../core/types';
import { tileIsPassable } from '../../../core/GenerationSupport';
import { BaseTerrainRule, TerrainRuleResult } from '../../TerrainRule';

export class CelestialDeadEndShrinesRule extends BaseTerrainRule {
  public readonly id = 'celestial-dead-end-shrines';
  public readonly biome = 'celestial' as const;
  public readonly priority = 90;
  public readonly minimumDifficulty = 4;
  public readonly maximumDifficulty = 10;

  public apply(map: GeneratedMap, random: DeterministicRandom): TerrainRuleResult {
    if (!this.acceptsDifficulty(map)) return this.result(0, 0, 0, ['difficulty-outside-rule-range']);
    const grid = Grid.fromRows(map.tiles);
    const before = grid.clone();
    const noise = new NoiseField(map.seed + ':' + this.id);
    let inspected = 0;
    let changed = 0;
    let skipped = 0;
    grid.forEach((tile, x, y) => {
      if (grid.isBorder(x, y) || this.protectedCell(map, x, y, 3)) { skipped++; return; }
      inspected++;
      const field = noise.fractal(x, y, { frequency: 0.107, octaves: 5, persistence: 0.42 });
      const cardinalFloors = before.neighbors4(x, y).filter((point) => tileIsPassable(before.get(point.x, point.y))).length;
      const surroundingFloors = before.neighbors8(x, y).filter((point) => tileIsPassable(before.get(point.x, point.y))).length;
      let replacement = tile;
      const operation: number = 8;
      switch (operation) {
        case 0:
          if (tile === TileKind.Floor && field > 0.820 && cardinalFloors >= 3 && random.boolean(0.24)) replacement = TileKind.Pit;
          break;
        case 1:
          if (tile === TileKind.Floor && field > 0.820 && surroundingFloors === 8 && random.boolean(0.18)) replacement = TileKind.Pillar;
          break;
        case 2:
          if (tile === TileKind.Wall && cardinalFloors >= 2 && field > 0.820 && random.boolean(0.22)) replacement = TileKind.Floor;
          break;
        case 3:
          if (tile === TileKind.Floor && surroundingFloors >= 7 && field > 0.820 && (x + y) % 3 === 0) replacement = TileKind.Pillar;
          break;
        case 4:
          if (tile === TileKind.Floor && cardinalFloors === 2 && surroundingFloors <= 5 && field > 0.820) replacement = TileKind.Pillar;
          break;
        case 5:
          if (tile === TileKind.Wall && surroundingFloors >= 5 && field > 0.820) replacement = TileKind.Floor;
          break;
        case 6:
          if ((tile === TileKind.Pillar || tile === TileKind.Pit) && field < 0.420) replacement = TileKind.Floor;
          break;
        case 7:
          if (tile === TileKind.Floor && cardinalFloors >= 3 && field > 0.820 && random.boolean(0.15)) replacement = TileKind.Pillar;
          break;
        case 8:
          if (tile === TileKind.Floor && cardinalFloors === 1 && field > 0.820 && random.boolean(0.3)) replacement = TileKind.Chest;
          break;
        default:
          if (tile === TileKind.Floor && surroundingFloors === 8 && field > 0.820 && random.boolean(0.12)) replacement = TileKind.Pit;
          break;
      }
      if (replacement !== tile) { grid.set(x, y, replacement); changed++; }
    });
    grid.set(map.spawn.x, map.spawn.y, TileKind.Spawn);
    grid.set(map.exit.x, map.exit.y, TileKind.Exit);
    grid.drawBorder(TileKind.Wall);
    map.tiles = grid.toRows();
    return this.result(changed, inspected, skipped, ['frequency=0.107', 'threshold=0.820', 'biome=celestial']);
  }
}
