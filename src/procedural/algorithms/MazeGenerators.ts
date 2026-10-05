import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { DisjointSet } from '../core/DisjointSet';
import { AbstractGenerator, MutableLayout, emptyLayout } from '../core/GenerationSupport';
import { CARDINAL_DIRECTIONS, GeneratorContext, GeneratorOptions, Point, TileKind } from '../core/types';

interface MazeCell extends Point {
  id: number;
}

interface MazeEdge {
  from: MazeCell;
  to: MazeCell;
  wall: Point;
  weight: number;
}

abstract class MazeGeneratorBase extends AbstractGenerator {
  protected cells(options: GeneratorOptions): MazeCell[] {
    const result: MazeCell[] = [];
    let id = 0;
    for (let y = 1; y < options.height - 1; y += 2) {
      for (let x = 1; x < options.width - 1; x += 2) result.push({ x, y, id: id++ });
    }
    return result;
  }

  protected edges(cells: readonly MazeCell[], random: DeterministicRandom): MazeEdge[] {
    const lookup = new Map(cells.map((cell) => [cell.x + ',' + cell.y, cell]));
    const result: MazeEdge[] = [];
    for (const cell of cells) {
      for (const offset of [{ x: 2, y: 0 }, { x: 0, y: 2 }]) {
        const target = lookup.get(cell.x + offset.x + ',' + (cell.y + offset.y));
        if (target) result.push({ from: cell, to: target, wall: { x: cell.x + offset.x / 2, y: cell.y + offset.y / 2 }, weight: random.next() });
      }
    }
    return result;
  }

  protected open(layout: MutableLayout, point: Point): void {
    if (layout.grid.inBounds(point.x, point.y)) layout.grid.set(point.x, point.y, TileKind.Floor);
  }

  protected finish(layout: MutableLayout, cells: readonly MazeCell[], options: GeneratorOptions, random: DeterministicRandom): void {
    for (const cell of cells) this.open(layout, cell);
    const extraWalls = layout.grid.filter((tile, x, y) => tile === TileKind.Wall && !layout.grid.isBorder(x, y) &&
      layout.grid.neighbors4(x, y).filter((point) => layout.grid.get(point.x, point.y) === TileKind.Floor).length === 2);
    for (const wall of extraWalls) if (random.boolean(options.loopChance)) this.open(layout, wall);
    const endpoints = this.pickDistantEndpoints(layout.grid);
    layout.spawn = endpoints.spawn;
    layout.exit = endpoints.exit;
  }
}

export class DepthFirstMazeGenerator extends MazeGeneratorBase {
  public readonly algorithm = 'depth-first-maze' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const cells = this.cells(options);
    const lookup = new Map(cells.map((cell) => [cell.x + ',' + cell.y, cell]));
    const start = random.pick(cells);
    const stack: MazeCell[] = [start];
    const visited = new Set<number>([start.id]);
    this.open(layout, start);
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const candidates = random.shuffle(CARDINAL_DIRECTIONS)
        .map((offset) => lookup.get(current.x + offset.x * 2 + ',' + (current.y + offset.y * 2)))
        .filter((cell): cell is MazeCell => cell !== undefined && !visited.has(cell.id));
      if (candidates.length === 0) { stack.pop(); continue; }
      const next = candidates[0];
      this.open(layout, { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 });
      this.open(layout, next);
      visited.add(next.id);
      stack.push(next);
    }
    this.finish(layout, cells, options, random);
    this.step(context, 'layout', 'recursive-backtracker', 'Built a deep-corridor maze using randomized depth-first traversal.', visited.size * 2);
    layout.metadata.visitedCells = visited.size;
    return layout;
  }
}

export class PrimMazeGenerator extends MazeGeneratorBase {
  public readonly algorithm = 'prim-maze' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const cells = this.cells(options);
    const edges = this.edges(cells, random);
    const adjacency = new Map<number, MazeEdge[]>();
    for (const edge of edges) {
      adjacency.set(edge.from.id, [...(adjacency.get(edge.from.id) ?? []), edge]);
      adjacency.set(edge.to.id, [...(adjacency.get(edge.to.id) ?? []), { ...edge, from: edge.to, to: edge.from }]);
    }
    const start = random.pick(cells);
    const visited = new Set<number>([start.id]);
    const frontier = [...(adjacency.get(start.id) ?? [])];
    this.open(layout, start);
    while (frontier.length > 0) {
      const index = random.integer(0, frontier.length - 1);
      const edge = frontier.splice(index, 1)[0];
      if (visited.has(edge.to.id)) continue;
      visited.add(edge.to.id);
      this.open(layout, edge.wall);
      this.open(layout, edge.to);
      frontier.push(...(adjacency.get(edge.to.id) ?? []).filter((candidate) => !visited.has(candidate.to.id)));
    }
    this.finish(layout, cells, options, random);
    this.step(context, 'layout', 'randomized-prim', 'Expanded a randomized frontier to form short branching passages.', visited.size * 2);
    layout.metadata.frontierAlgorithm = true;
    return layout;
  }
}

export class KruskalMazeGenerator extends MazeGeneratorBase {
  public readonly algorithm = 'kruskal-maze' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const cells = this.cells(options);
    const edges = this.edges(cells, random).sort((a, b) => a.weight - b.weight);
    const sets = new DisjointSet<number>();
    for (const cell of cells) { sets.make(cell.id); this.open(layout, cell); }
    let accepted = 0;
    for (const edge of edges) {
      if (sets.union(edge.from.id, edge.to.id)) { this.open(layout, edge.wall); accepted++; }
    }
    this.finish(layout, cells, options, random);
    this.step(context, 'layout', 'randomized-kruskal', 'Joined disjoint maze sets in shuffled edge order.', accepted);
    layout.metadata.acceptedEdges = accepted;
    return layout;
  }
}

export class EllerMazeGenerator extends MazeGeneratorBase {
  public readonly algorithm = 'eller-maze' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const columns = Math.ceil((options.width - 2) / 2);
    const rows = Math.ceil((options.height - 2) / 2);
    let nextSet = 1;
    let sets = new Array<number>(columns).fill(0);
    for (let row = 0; row < rows; row++) {
      const y = 1 + row * 2;
      for (let column = 0; column < columns; column++) {
        if (sets[column] === 0) sets[column] = nextSet++;
        this.open(layout, { x: 1 + column * 2, y });
      }
      const lastRow = row === rows - 1;
      for (let column = 0; column < columns - 1; column++) {
        const shouldJoin = sets[column] !== sets[column + 1] && (lastRow || random.boolean(0.52));
        if (!shouldJoin) continue;
        const replaced = sets[column + 1];
        const kept = sets[column];
        for (let index = 0; index < sets.length; index++) if (sets[index] === replaced) sets[index] = kept;
        this.open(layout, { x: 2 + column * 2, y });
      }
      if (lastRow) break;
      const next = new Array<number>(columns).fill(0);
      for (const setId of new Set(sets)) {
        const members = sets.map((value, index) => value === setId ? index : -1).filter((index) => index >= 0);
        const downward = random.shuffle(members).slice(0, random.integer(1, members.length));
        for (const column of downward) {
          this.open(layout, { x: 1 + column * 2, y: y + 1 });
          next[column] = setId;
        }
      }
      sets = next;
    }
    this.finish(layout, this.cells(options), options, random);
    this.step(context, 'layout', 'eller-row-sets', 'Generated a perfect maze one row at a time with bounded memory.', rows * columns);
    layout.metadata.rowCount = rows;
    layout.metadata.setCount = nextSet - 1;
    return layout;
  }
}
