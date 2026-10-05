import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { AbstractGenerator, MutableLayout, carvePoints, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { CARDINAL_DIRECTIONS, GeneratorContext, GeneratorOptions, Point, TileKind } from '../core/types';

interface Walker {
  position: Point;
  direction: Point;
  age: number;
  carved: number;
}

export class DrunkardWalkGenerator extends AbstractGenerator {
  public readonly algorithm = 'drunkard-walk' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const start = { x: Math.floor(options.width / 2), y: Math.floor(options.height / 2) };
    const target = Math.floor((options.width - 2) * (options.height - 2) * options.floorTarget);
    const walkers: Walker[] = [{ position: start, direction: { x: 1, y: 0 }, age: 0, carved: 0 }];
    let floors = 0;
    let iterations = 0;
    const maximumIterations = target * 40;
    while (floors < target && iterations++ < maximumIterations) {
      const walker = walkers[iterations % walkers.length];
      floors += this.carveBrush(layout, walker.position, random.boolean(0.08) ? 2 : 1);
      walker.carved++;
      walker.age++;
      if (random.boolean(0.28)) walker.direction = random.pick(CARDINAL_DIRECTIONS) as Point;
      if (random.boolean(0.04) && walkers.length < 8) walkers.push({ position: { ...walker.position }, direction: random.pick(CARDINAL_DIRECTIONS) as Point, age: 0, carved: 0 });
      if (random.boolean(0.015) && walkers.length > 1) walkers.splice(random.integer(0, walkers.length - 1), 1);
      const next = { x: walker.position.x + walker.direction.x, y: walker.position.y + walker.direction.y };
      if (next.x <= 1 || next.y <= 1 || next.x >= options.width - 2 || next.y >= options.height - 2) {
        walker.direction = { x: -walker.direction.x, y: -walker.direction.y };
      } else {
        walker.position = next;
      }
      if (walker.age > 80 && random.boolean(0.08)) {
        walker.position = { ...start };
        walker.age = 0;
      }
    }
    this.step(context, 'layout', 'random-walkers', 'Carved organic tunnels with splitting biased walkers.', floors);
    this.identifyChambers(layout);
    layout.spawn = start;
    layout.exit = this.pickDistantEndpoints(layout.grid).exit;
    layout.metadata.walkerCount = walkers.length;
    layout.metadata.iterations = iterations;
    layout.metadata.floorTargetReached = floors >= target;
    return layout;
  }

  private carveBrush(layout: MutableLayout, center: Point, radius: number): number {
    const points: Point[] = [];
    for (let y = center.y - radius; y <= center.y + radius; y++) {
      for (let x = center.x - radius; x <= center.x + radius; x++) {
        if (Math.abs(x - center.x) + Math.abs(y - center.y) <= radius + 1) points.push({ x, y });
      }
    }
    return carvePoints(layout.grid, points, TileKind.Floor);
  }

  private identifyChambers(layout: MutableLayout): void {
    let serial = 0;
    for (let y = 2; y < layout.grid.height - 2; y++) {
      for (let x = 2; x < layout.grid.width - 2; x++) {
        const floorNeighbors = layout.grid.neighborhood(x, y, 2, true).filter((point) => layout.grid.get(point.x, point.y) === TileKind.Floor).length;
        if (floorNeighbors >= 20 && !layout.rooms.some((room) => x >= room.x - 2 && x <= room.x + room.width + 2 && y >= room.y - 2 && y <= room.y + room.height + 2)) {
          const room = makeRoom('walker-chamber-' + serial++, x - 2, y - 2, 5, 5);
          room.tags.push('organic');
          layout.rooms.push(room);
        }
      }
    }
  }
}
