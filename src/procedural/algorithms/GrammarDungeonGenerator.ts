import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { CorridorCarver } from '../carving/CorridorCarver';
import { AbstractGenerator, MutableLayout, carveRoom, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { CARDINAL_DIRECTIONS, GeneratorContext, GeneratorOptions, Point, Room } from '../core/types';

type SymbolKind = 'start' | 'combat' | 'corridor' | 'treasure' | 'elite' | 'boss' | 'exit';

interface GrammarNode {
  id: string;
  symbol: SymbolKind;
  depth: number;
  parentId?: string;
  children: string[];
  position?: Point;
}

export class GrammarDungeonGenerator extends AbstractGenerator {
  public readonly algorithm = 'grammar' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const nodes = this.expandGrammar(options, random);
    this.step(context, 'layout', 'expand-grammar', 'Expanded encounter symbols into a directed progression graph.', nodes.length);
    this.embed(nodes, options, random);
    const roomByNode = new Map<string, Room>();
    for (const node of nodes) {
      if (!node.position || node.symbol === 'corridor') continue;
      const size = this.roomSize(node.symbol, options, random);
      const room = makeRoom('grammar-room-' + node.id,
        Math.max(1, Math.min(options.width - size.width - 1, node.position.x - Math.floor(size.width / 2))),
        Math.max(1, Math.min(options.height - size.height - 1, node.position.y - Math.floor(size.height / 2))),
        size.width, size.height);
      room.kind = node.symbol === 'elite' ? 'combat' : node.symbol === 'start' || node.symbol === 'treasure' || node.symbol === 'boss' || node.symbol === 'exit' ? node.symbol : 'combat';
      room.tags.push('grammar-' + node.symbol, 'depth-' + node.depth);
      layout.rooms.push(room);
      roomByNode.set(node.id, room);
      carveRoom(layout.grid, room);
    }
    const carver = new CorridorCarver();
    for (const node of nodes) {
      if (!node.parentId) continue;
      const source = roomByNode.get(node.parentId);
      const target = roomByNode.get(node.id);
      if (source && target) layout.corridors.push(carver.carve(layout.grid, source.center, target.center, options.corridorWidth, 'winding', random, source.id, target.id));
    }
    const start = nodes.find((node) => node.symbol === 'start');
    const exit = [...nodes].reverse().find((node) => node.symbol === 'exit' || node.symbol === 'boss');
    layout.spawn = start ? roomByNode.get(start.id)?.center : undefined;
    layout.exit = exit ? roomByNode.get(exit.id)?.center : undefined;
    layout.metadata.grammarNodes = nodes.length;
    layout.metadata.maximumDepth = Math.max(...nodes.map((node) => node.depth));
    return layout;
  }

  private expandGrammar(options: GeneratorOptions, random: DeterministicRandom): GrammarNode[] {
    const nodes: GrammarNode[] = [{ id: 'node-0', symbol: 'start', depth: 0, children: [] }];
    let frontier = nodes[0];
    const mainLength = 4 + options.difficulty;
    for (let index = 1; index <= mainLength; index++) {
      const symbol: SymbolKind = index === mainLength ? 'exit' : index === mainLength - 1 && options.difficulty >= 5 ? 'boss' : random.weighted([
        { value: 'combat' as const, weight: 5 },
        { value: 'elite' as const, weight: options.difficulty },
        { value: 'treasure' as const, weight: 1.5 },
      ]);
      const node: GrammarNode = { id: 'node-' + nodes.length, symbol, depth: index, parentId: frontier.id, children: [] };
      frontier.children.push(node.id);
      nodes.push(node);
      if (index < mainLength - 1 && random.boolean(0.4)) {
        const branch: GrammarNode = { id: 'node-' + nodes.length, symbol: random.boolean() ? 'treasure' : 'combat', depth: index + 1, parentId: node.id, children: [] };
        node.children.push(branch.id);
        nodes.push(branch);
      }
      frontier = node;
    }
    return nodes;
  }

  private embed(nodes: GrammarNode[], options: GeneratorOptions, random: DeterministicRandom): void {
    const lookup = new Map(nodes.map((node) => [node.id, node]));
    const root = nodes[0];
    root.position = { x: Math.floor(options.width / 2), y: Math.floor(options.height / 2) };
    const occupied = new Set<string>([root.position.x + ',' + root.position.y]);
    for (const node of nodes.slice(1)) {
      const parent = node.parentId ? lookup.get(node.parentId) : undefined;
      const origin = parent?.position ?? root.position;
      let position = { ...origin };
      for (let attempt = 0; attempt < 20; attempt++) {
        const direction = random.pick(CARDINAL_DIRECTIONS);
        const distance = random.integer(options.roomMinSize + 3, options.roomMaxSize + 5);
        const candidate = {
          x: Math.max(3, Math.min(options.width - 4, origin.x + direction.x * distance)),
          y: Math.max(3, Math.min(options.height - 4, origin.y + direction.y * distance)),
        };
        const key = Math.round(candidate.x / 3) + ',' + Math.round(candidate.y / 3);
        if (!occupied.has(key)) { position = candidate; occupied.add(key); break; }
      }
      node.position = position;
    }
  }

  private roomSize(symbol: SymbolKind, options: GeneratorOptions, random: DeterministicRandom): { width: number; height: number } {
    const bonus = symbol === 'boss' ? 4 : symbol === 'elite' ? 2 : symbol === 'treasure' ? -1 : 0;
    const minimum = Math.max(3, options.roomMinSize + bonus);
    const maximum = Math.max(minimum, Math.min(options.roomMaxSize + bonus, 12));
    return { width: random.integer(minimum, maximum), height: random.integer(minimum, maximum) };
  }
}
