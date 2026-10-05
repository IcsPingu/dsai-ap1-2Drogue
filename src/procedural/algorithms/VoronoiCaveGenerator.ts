import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { AbstractGenerator, MutableLayout, emptyLayout, tileIsPassable } from '../core/GenerationSupport';
import { euclideanSquared } from '../core/Geometry';
import { NoiseField } from '../core/Noise';
import { GeneratorContext, GeneratorOptions, Point, TileKind } from '../core/types';

interface Site extends Point {
  id: number;
  floor: boolean;
  elevation: number;
}

export class VoronoiCaveGenerator extends AbstractGenerator {
  public readonly algorithm = 'voronoi-caves' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const noise = new NoiseField(String(options.seed) + ':voronoi');
    const siteCount = Math.max(8, Math.floor(options.width * options.height / 70));
    const sites: Site[] = [];
    for (let index = 0; index < siteCount; index++) {
      sites.push({
        id: index,
        x: random.integer(1, options.width - 2),
        y: random.integer(1, options.height - 2),
        floor: random.boolean(options.floorTarget + 0.12),
        elevation: random.next(),
      });
    }
    layout.grid.forEach((_tile, x, y) => {
      if (layout.grid.isBorder(x, y)) return;
      const nearest = [...sites].sort((a, b) => euclideanSquared(a, { x, y }) - euclideanSquared(b, { x, y }))[0];
      const warped = noise.domainWarp(x, y, 6, 0.06);
      const floor = nearest.floor !== (warped > 0.72);
      layout.grid.set(x, y, floor ? TileKind.Floor : TileKind.Wall);
    });
    this.step(context, 'layout', 'voronoi-regions', 'Assigned tiles to seeded regions and warped their boundaries with noise.', options.width * options.height);
    this.erodeBoundaries(layout, noise);
    this.keepLargest(layout);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
    layout.metadata.siteCount = siteCount;
    layout.metadata.noiseWarp = 6;
    return layout;
  }

  private erodeBoundaries(layout: MutableLayout, noise: NoiseField): void {
    const before = layout.grid.clone();
    layout.grid.forEach((tile, x, y) => {
      if (layout.grid.isBorder(x, y)) return;
      const floorNeighbors = before.neighbors8(x, y).filter((point) => tileIsPassable(before.get(point.x, point.y))).length;
      if (tile === TileKind.Wall && floorNeighbors >= 6 && noise.ridged(x, y, { frequency: 0.08 }) > 0.45) layout.grid.set(x, y, TileKind.Floor);
      if (tile === TileKind.Floor && floorNeighbors <= 1) layout.grid.set(x, y, TileKind.Wall);
    });
  }

  private keepLargest(layout: MutableLayout): void {
    const regions = layout.grid.regions((tile) => tileIsPassable(tile)).sort((a, b) => b.cells.length - a.cells.length);
    if (regions.length === 0) {
      layout.grid.fillRect({ x: 2, y: 2, width: layout.grid.width - 4, height: layout.grid.height - 4 }, TileKind.Floor);
      return;
    }
    for (const region of regions.slice(1)) for (const point of region.cells) layout.grid.set(point.x, point.y, TileKind.Wall);
  }
}
