import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { CorridorCarver } from '../carving/CorridorCarver';
import { DisjointSet } from '../core/DisjointSet';
import { AbstractGenerator, MutableLayout, carveRoom, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { euclidean, rectsIntersect } from '../core/Geometry';
import { GeneratorContext, GeneratorOptions, GraphEdge, Room } from '../core/types';

export class RoomGraphGenerator extends AbstractGenerator {
  public readonly algorithm = 'room-graph' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const desiredRooms = Math.max(5, Math.floor(options.width * options.height / 95));
    this.placeRooms(layout, options, random, desiredRooms);
    this.step(context, 'layout', 'scatter-rooms', 'Placed non-overlapping room candidates with rejection sampling.', layout.rooms.length);
    const graph = this.buildProximityGraph(layout.rooms);
    const selected = this.minimumSpanningTree(layout.rooms, graph);
    for (const edge of graph) {
      if (!selected.includes(edge) && random.boolean(options.loopChance)) selected.push(edge);
    }
    const carver = new CorridorCarver();
    for (const edge of selected) {
      const from = layout.rooms[edge.from];
      const to = layout.rooms[edge.to];
      const style = random.weighted([
        { value: 'straight' as const, weight: 2 },
        { value: 'horizontal-first' as const, weight: 3 },
        { value: 'vertical-first' as const, weight: 3 },
        { value: 'zigzag' as const, weight: 1 },
      ]);
      layout.corridors.push(carver.carve(layout.grid, from.center, to.center, options.corridorWidth, style, random, from.id, to.id));
    }
    this.step(context, 'connectivity', 'minimum-spanning-tree', 'Connected rooms with an MST and optional cycle edges.', selected.length);
    this.classify(layout.rooms, selected);
    const endpoints = this.graphDiameter(layout.rooms, selected);
    layout.spawn = layout.rooms[endpoints[0]]?.center;
    layout.exit = layout.rooms[endpoints[1]]?.center;
    layout.metadata.proximityEdges = graph.length;
    layout.metadata.selectedEdges = selected.length;
    layout.metadata.roomPlacementTarget = desiredRooms;
    return layout;
  }

  private placeRooms(layout: MutableLayout, options: GeneratorOptions, random: DeterministicRandom, target: number): void {
    for (let attempt = 0; attempt < target * 35 && layout.rooms.length < target; attempt++) {
      const width = random.integer(options.roomMinSize, Math.min(options.roomMaxSize, options.width - 4));
      const height = random.integer(options.roomMinSize, Math.min(options.roomMaxSize, options.height - 4));
      const x = random.integer(2, Math.max(2, options.width - width - 2));
      const y = random.integer(2, Math.max(2, options.height - height - 2));
      const room = makeRoom('graph-room-' + layout.rooms.length, x, y, width, height);
      if (layout.rooms.some((existing) => rectsIntersect(existing, room, 2))) continue;
      layout.rooms.push(room);
      carveRoom(layout.grid, room);
    }
    if (layout.rooms.length < 2) {
      const left = makeRoom('graph-room-0', 2, 2, 5, 5);
      const right = makeRoom('graph-room-1', options.width - 8, options.height - 8, 5, 5);
      layout.rooms.push(left, right);
      carveRoom(layout.grid, left);
      carveRoom(layout.grid, right);
    }
  }

  private buildProximityGraph(rooms: readonly Room[]): GraphEdge[] {
    const result = new Map<string, GraphEdge>();
    for (let from = 0; from < rooms.length; from++) {
      const nearest = rooms
        .map((room, to) => ({ from, to, weight: euclidean(rooms[from].center, room.center) }))
        .filter((edge) => edge.to !== from)
        .sort((a, b) => a.weight - b.weight)
        .slice(0, Math.min(4, rooms.length - 1));
      for (const edge of nearest) {
        const key = Math.min(edge.from, edge.to) + ':' + Math.max(edge.from, edge.to);
        result.set(key, { from: Math.min(edge.from, edge.to), to: Math.max(edge.from, edge.to), weight: edge.weight });
      }
    }
    return [...result.values()];
  }

  private minimumSpanningTree(rooms: readonly Room[], edges: readonly GraphEdge[]): GraphEdge[] {
    const sets = new DisjointSet<number>();
    for (let index = 0; index < rooms.length; index++) sets.make(index);
    const result: GraphEdge[] = [];
    for (const edge of [...edges].sort((a, b) => a.weight - b.weight)) {
      if (sets.union(edge.from, edge.to)) result.push(edge);
    }
    return result;
  }

  private classify(rooms: Room[], edges: readonly GraphEdge[]): void {
    const degrees = new Array<number>(rooms.length).fill(0);
    for (const edge of edges) { degrees[edge.from]++; degrees[edge.to]++; }
    rooms.forEach((room, index) => {
      room.tags.push('degree-' + degrees[index]);
      if (degrees[index] === 1) room.kind = 'treasure';
      if (degrees[index] >= 4) room.kind = 'connector';
    });
  }

  private graphDiameter(rooms: readonly Room[], edges: readonly GraphEdge[]): [number, number] {
    if (rooms.length < 2) return [0, 0];
    const adjacency = new Map<number, number[]>();
    for (let index = 0; index < rooms.length; index++) adjacency.set(index, []);
    for (const edge of edges) {
      adjacency.get(edge.from)!.push(edge.to);
      adjacency.get(edge.to)!.push(edge.from);
    }
    const farthest = (start: number): number => {
      const queue = [start];
      const distances = new Map<number, number>([[start, 0]]);
      let result = start;
      for (let cursor = 0; cursor < queue.length; cursor++) {
        const current = queue[cursor];
        if (distances.get(current)! > distances.get(result)!) result = current;
        for (const next of adjacency.get(current) ?? []) {
          if (!distances.has(next)) { distances.set(next, distances.get(current)! + 1); queue.push(next); }
        }
      }
      return result;
    };
    const first = farthest(0);
    return [first, farthest(first)];
  }
}
