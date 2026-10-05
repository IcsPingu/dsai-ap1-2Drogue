import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Grid } from '../core/Grid';
import { AbstractGenerator, MutableLayout, emptyLayout } from '../core/GenerationSupport';
import { GeneratorContext, GeneratorOptions, Point, TileKind } from '../core/types';

type Socket = 'open' | 'closed';
type Side = 'north' | 'east' | 'south' | 'west';

interface Pattern {
  id: string;
  weight: number;
  sockets: Record<Side, Socket>;
  open: Point[];
}

const PATTERNS: readonly Pattern[] = [
  { id: 'empty', weight: 0.3, sockets: { north: 'closed', east: 'closed', south: 'closed', west: 'closed' }, open: [] },
  { id: 'horizontal', weight: 4, sockets: { north: 'closed', east: 'open', south: 'closed', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { id: 'vertical', weight: 4, sockets: { north: 'open', east: 'closed', south: 'open', west: 'closed' }, open: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
  { id: 'corner-ne', weight: 2, sockets: { north: 'open', east: 'open', south: 'closed', west: 'closed' }, open: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { id: 'corner-es', weight: 2, sockets: { north: 'closed', east: 'open', south: 'open', west: 'closed' }, open: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }] },
  { id: 'corner-sw', weight: 2, sockets: { north: 'closed', east: 'closed', south: 'open', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
  { id: 'corner-wn', weight: 2, sockets: { north: 'open', east: 'closed', south: 'closed', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }] },
  { id: 'tee-n', weight: 1.5, sockets: { north: 'open', east: 'open', south: 'closed', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }] },
  { id: 'tee-e', weight: 1.5, sockets: { north: 'open', east: 'open', south: 'open', west: 'closed' }, open: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }] },
  { id: 'tee-s', weight: 1.5, sockets: { north: 'closed', east: 'open', south: 'open', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }] },
  { id: 'tee-w', weight: 1.5, sockets: { north: 'open', east: 'closed', south: 'open', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }] },
  { id: 'cross', weight: 0.8, sockets: { north: 'open', east: 'open', south: 'open', west: 'open' }, open: [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }] },
  { id: 'room', weight: 1, sockets: { north: 'open', east: 'open', south: 'open', west: 'open' }, open: Array.from({ length: 9 }, (_, index) => ({ x: index % 3, y: Math.floor(index / 3) })) },
];

const OFFSETS: Record<Side, Point> = { north: { x: 0, y: -1 }, east: { x: 1, y: 0 }, south: { x: 0, y: 1 }, west: { x: -1, y: 0 } };
const OPPOSITE: Record<Side, Side> = { north: 'south', east: 'west', south: 'north', west: 'east' };
const SIDES = Object.keys(OFFSETS) as Side[];

export class WaveFunctionCollapseGenerator extends AbstractGenerator {
  public readonly algorithm = 'wave-function-collapse' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const cellWidth = Math.max(3, Math.floor((options.width - 2) / 3));
    const cellHeight = Math.max(3, Math.floor((options.height - 2) / 3));
    const wave = new Grid<Set<number>>(cellWidth, cellHeight, () => new Set(PATTERNS.map((_pattern, index) => index)));
    let contradictions = 0;
    let collapsed = 0;
    let safety = 0;
    const maximumCollapses = cellWidth * cellHeight * 40;
    while (safety++ < maximumCollapses) {
      const target = this.minimumEntropyCell(wave, random);
      if (!target) break;
      const choices = [...wave.get(target.x, target.y)];
      if (choices.length === 0) { contradictions++; this.resetCell(wave, target); continue; }
      const selected = random.weighted(choices.map((index) => ({ value: index, weight: PATTERNS[index].weight })));
      wave.set(target.x, target.y, new Set([selected]));
      collapsed++;
      if (!this.propagate(wave, target)) {
        contradictions++;
        this.relaxNeighborhood(wave, target);
      }
    }
    this.renderWave(layout, wave);
    this.ensureCentralSpine(layout);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
    this.step(context, 'layout', 'constraint-collapse', 'Collapsed socket-compatible modules by minimum entropy.', collapsed);
    layout.metadata.contradictions = contradictions;
    layout.metadata.collapsedCells = collapsed;
    layout.metadata.patternCount = PATTERNS.length;
    layout.metadata.collapseSafetyLimitReached = safety >= maximumCollapses;
    return layout;
  }

  private minimumEntropyCell(wave: Grid<Set<number>>, random: DeterministicRandom): Point | undefined {
    let best = Infinity;
    const candidates: Point[] = [];
    wave.forEach((options, x, y) => {
      if (options.size <= 1) return;
      const entropy = options.size + random.float(0, 0.01);
      if (entropy < best) { best = entropy; candidates.length = 0; candidates.push({ x, y }); }
      else if (Math.floor(entropy) === Math.floor(best)) candidates.push({ x, y });
    });
    return candidates.length === 0 ? undefined : random.pick(candidates);
  }

  private propagate(wave: Grid<Set<number>>, initial: Point): boolean {
    const queue: Point[] = [initial];
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const current = queue[cursor];
      for (const side of SIDES) {
        const offset = OFFSETS[side];
        const next = { x: current.x + offset.x, y: current.y + offset.y };
        if (!wave.inBounds(next.x, next.y)) continue;
        const allowed = new Set<number>();
        for (const candidate of wave.get(next.x, next.y)) {
          if ([...wave.get(current.x, current.y)].some((source) => PATTERNS[source].sockets[side] === PATTERNS[candidate].sockets[OPPOSITE[side]])) allowed.add(candidate);
        }
        if (allowed.size === 0) return false;
        if (allowed.size < wave.get(next.x, next.y).size) { wave.set(next.x, next.y, allowed); queue.push(next); }
      }
    }
    return true;
  }

  private resetCell(wave: Grid<Set<number>>, point: Point): void {
    wave.set(point.x, point.y, new Set(PATTERNS.map((_pattern, index) => index)));
  }

  private relaxNeighborhood(wave: Grid<Set<number>>, point: Point): void {
    this.resetCell(wave, point);
    for (const neighbor of wave.neighbors4(point.x, point.y)) this.resetCell(wave, neighbor);
  }

  private renderWave(layout: MutableLayout, wave: Grid<Set<number>>): void {
    wave.forEach((options, cellX, cellY) => {
      const selected = PATTERNS[[...options][0] ?? 0];
      for (const point of selected.open) {
        const x = 1 + cellX * 3 + point.x;
        const y = 1 + cellY * 3 + point.y;
        if (layout.grid.inBounds(x, y) && !layout.grid.isBorder(x, y)) layout.grid.set(x, y, TileKind.Floor);
      }
    });
  }

  private ensureCentralSpine(layout: MutableLayout): void {
    const y = Math.floor(layout.grid.height / 2);
    for (let x = 1; x < layout.grid.width - 1; x++) layout.grid.set(x, y, TileKind.Floor);
  }
}
