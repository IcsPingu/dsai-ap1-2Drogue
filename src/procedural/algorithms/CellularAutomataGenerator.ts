import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { AbstractGenerator, MutableLayout, emptyLayout, tileIsPassable } from '../core/GenerationSupport';
import { GeneratorContext, GeneratorOptions, MapGenerator, TileKind } from '../core/types';

export class CellularAutomataGenerator extends AbstractGenerator {
  public readonly algorithm = 'cellular-automata' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    layout.grid.forEach((_tile, x, y) => {
      if (!layout.grid.isBorder(x, y)) layout.grid.set(x, y, random.boolean(0.46) ? TileKind.Wall : TileKind.Floor);
    });
    this.step(context, 'initialization', 'random-fill', 'Seeded cave cells with independent wall probability.', options.width * options.height);
    for (let pass = 0; pass < options.smoothingPasses; pass++) {
      const before = layout.grid.clone();
      let changed = 0;
      layout.grid.forEach((tile, x, y) => {
        if (layout.grid.isBorder(x, y)) return;
        const walls = before.neighborhood(x, y, 1).filter((point) => before.get(point.x, point.y) === TileKind.Wall).length;
        const distantWalls = before.neighborhood(x, y, 2).filter((point) => before.get(point.x, point.y) === TileKind.Wall).length;
        const next = walls >= 5 || distantWalls <= 2 ? TileKind.Wall : TileKind.Floor;
        if (next !== tile) { layout.grid.set(x, y, next); changed++; }
      });
      this.step(context, 'layout', 'smooth-' + pass, 'Applied cellular birth and survival rules.', changed);
    }
    this.keepLargestCave(layout);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
    layout.metadata.initialWallChance = 0.46;
    layout.metadata.smoothingPasses = options.smoothingPasses;
    return layout;
  }

  private keepLargestCave(layout: MutableLayout): void {
    const regions = layout.grid.regions((tile) => tileIsPassable(tile)).sort((a, b) => b.cells.length - a.cells.length);
    for (let index = 1; index < regions.length; index++) {
      for (const point of regions[index].cells) layout.grid.set(point.x, point.y, TileKind.Wall);
    }
    if (regions.length === 0) {
      layout.grid.fillRect({ x: 2, y: 2, width: layout.grid.width - 4, height: layout.grid.height - 4 }, TileKind.Floor);
    }
    layout.metadata.removedCaveRegions = Math.max(0, regions.length - 1);
  }
}
