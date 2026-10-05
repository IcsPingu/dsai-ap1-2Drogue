import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { GeneratedMap, Point, TileKind, pointKey } from '../core/types';
import { tileIsPassable } from '../core/GenerationSupport';

const DECORATIONS: Record<string, readonly string[]> = {
  cathedral: ['candelabra', 'broken_pew', 'stained_glass_shard', 'gargoyle_statue', 'torch_sconce'],
  inferno: ['bone_pile', 'burning_chain', 'obsidian_spike', 'infernal_rune', 'ash_vent'],
  celestial: ['celestial_pillar', 'divine_light_beam', 'golden_urn', 'angelic_banner', 'star_field'],
  streets: ['market_crate', 'street_lamp', 'broken_cart', 'fountain_fragment', 'hanging_banner'],
  ruins: ['fallen_column', 'mosaic_fragment', 'marble_bust', 'ivy_patch', 'cracked_urn'],
  garden: ['flower_bed', 'ancient_tree', 'marble_bench', 'butterfly_swarm', 'water_lily'],
  crypt: ['sarcophagus', 'skull_pile', 'ritual_candle', 'torn_tapestry', 'grave_marker'],
  clocktower: ['gear_cluster', 'pendulum', 'copper_pipe', 'clock_face', 'spring_coil'],
  colosseum: ['weapon_rack', 'spectator_banner', 'broken_shield', 'sand_mound', 'victory_statue'],
  void: ['void_crack', 'floating_debris', 'reality_distortion', 'distorted_clock', 'watching_eye'],
};

export class DecorationPlanner {
  public populate(map: GeneratedMap, random: DeterministicRandom): void {
    const grid = Grid.fromRows(map.tiles);
    const biome = String(map.metadata.biome ?? 'cathedral');
    const catalog = DECORATIONS[biome] ?? DECORATIONS.cathedral;
    const desired = Math.max(2, Math.floor(map.metrics.walkableCells * Number(map.metadata.decorationDensity ?? 0.04)));
    const occupied = new Set<string>([
      pointKey(map.spawn), pointKey(map.exit),
      ...map.enemies.map((entry) => pointKey(entry.position)),
      ...map.items.map((entry) => pointKey(entry.position)),
    ]);
    const wallAdjacent = grid.filter((tile, x, y) => tile === TileKind.Floor &&
      grid.neighbors4(x, y).some((point) => grid.get(point.x, point.y) === TileKind.Wall));
    const open = grid.filter((tile, x, y) => tileIsPassable(tile) &&
      grid.neighbors8(x, y).every((point) => tileIsPassable(grid.get(point.x, point.y))));
    const candidates = random.shuffle([...wallAdjacent, ...open]);
    let serial = 0;
    for (const position of candidates) {
      if (serial >= desired || occupied.has(pointKey(position))) continue;
      if (map.decorations.some((entry) => Math.hypot(entry.position.x - position.x, entry.position.y - position.y) < 2)) continue;
      const type = random.pick(catalog);
      map.decorations.push({
        id: 'decoration-' + serial++,
        decorationType: type,
        position,
        rotation: random.float(-0.18, 0.18),
        scale: random.float(0.8, 1.25),
        tint: biome === 'void' ? random.pick([0x9900ff, 0xcc33ff, 0x6600aa]) : undefined,
      });
    }
  }
}
