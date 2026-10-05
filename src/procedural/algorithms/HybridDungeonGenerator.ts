import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { CorridorCarver } from '../carving/CorridorCarver';
import { Grid } from '../core/Grid';
import { AbstractGenerator, MutableLayout, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { NoiseField } from '../core/Noise';
import { GeneratorContext, GeneratorOptions, MapGenerator, TileKind } from '../core/types';
import { BspDungeonGenerator } from './BspDungeonGenerator';
import { CellularAutomataGenerator } from './CellularAutomataGenerator';
import { RoomGraphGenerator } from './RoomGraphGenerator';

export class HybridDungeonGenerator extends AbstractGenerator {
  public readonly algorithm = 'hybrid' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const baseAlgorithm = random.weighted<MapGenerator>([
      { value: new BspDungeonGenerator(), weight: 3 },
      { value: new RoomGraphGenerator(), weight: 4 },
      { value: new CellularAutomataGenerator(), weight: 2 },
    ]);
    const base = baseAlgorithm.generate({ ...options, seed: String(options.seed) + ':base', algorithm: baseAlgorithm.algorithm });
    layout.grid = Grid.fromRows(base.tiles).map((tile) => tile === TileKind.Spawn || tile === TileKind.Exit ? TileKind.Floor : tile);
    layout.rooms = base.rooms.map((room) => ({ ...room, center: { ...room.center }, tags: [...room.tags, 'hybrid-base'] }));
    layout.corridors = base.corridors.map((corridor) => ({ ...corridor, points: corridor.points.map((point) => ({ ...point })) }));
    this.step(context, 'layout', 'hybrid-base', 'Generated structural base with ' + baseAlgorithm.algorithm + '.', base.metrics.walkableCells);
    this.carveOrganicPockets(layout, options, random);
    this.overlayNoiseHazards(layout, options);
    this.addLandmark(layout, options, random);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
    layout.metadata.baseAlgorithm = baseAlgorithm.algorithm;
    layout.metadata.composedGenerators = 3;
    return layout;
  }

  private carveOrganicPockets(layout: MutableLayout, options: GeneratorOptions, random: DeterministicRandom): void {
    const carver = new CorridorCarver();
    const pockets = Math.max(2, Math.floor(options.width * options.height / 300));
    for (let index = 0; index < pockets; index++) {
      const center = { x: random.integer(3, options.width - 4), y: random.integer(3, options.height - 4) };
      const width = random.integer(3, 6);
      const height = random.integer(3, 6);
      const room = makeRoom('hybrid-pocket-' + index, center.x - Math.floor(width / 2), center.y - Math.floor(height / 2), width, height);
      room.tags.push('organic-pocket');
      layout.grid.fillRect(room, TileKind.Floor);
      const nearest = [...layout.rooms].sort((a, b) => Math.hypot(a.center.x - center.x, a.center.y - center.y) - Math.hypot(b.center.x - center.x, b.center.y - center.y))[0];
      if (nearest) layout.corridors.push(carver.carve(layout.grid, nearest.center, center, 1, 'winding', random, nearest.id, room.id));
      layout.rooms.push(room);
    }
  }

  private overlayNoiseHazards(layout: MutableLayout, options: GeneratorOptions): void {
    const noise = new NoiseField(String(options.seed) + ':hybrid-hazards');
    layout.grid.forEach((tile, x, y) => {
      if (tile !== TileKind.Floor) return;
      const value = noise.fractal(x, y, { frequency: 0.09, octaves: 3 });
      if (value > 0.8 && layout.grid.neighbors4(x, y).every((point) => layout.grid.get(point.x, point.y) === TileKind.Floor)) {
        layout.grid.set(x, y, options.biome === 'inferno' ? TileKind.Lava : TileKind.Pit);
      }
    });
  }

  private addLandmark(layout: MutableLayout, options: GeneratorOptions, random: DeterministicRandom): void {
    const candidates = layout.rooms.filter((room) => room.area >= 25);
    const room = random.pickOrUndefined(candidates);
    if (!room) return;
    const radius = Math.max(1, Math.floor(Math.min(room.width, room.height) / 4));
    for (let y = room.center.y - radius; y <= room.center.y + radius; y++) {
      for (let x = room.center.x - radius; x <= room.center.x + radius; x++) {
        if ((x + y) % 2 === 0 && layout.grid.inBounds(x, y) && layout.grid.get(x, y) === TileKind.Floor) layout.grid.set(x, y, TileKind.Pillar);
      }
    }
    room.tags.push('landmark');
  }
}
