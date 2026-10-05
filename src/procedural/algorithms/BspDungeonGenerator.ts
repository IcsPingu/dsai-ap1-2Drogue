import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { CorridorCarver } from '../carving/CorridorCarver';
import { AbstractGenerator, MutableLayout, carveRoom, emptyLayout, makeRoom } from '../core/GenerationSupport';
import { rectsIntersect } from '../core/Geometry';
import { GeneratorContext, GeneratorOptions, Rect, Room, TileKind } from '../core/types';

interface PartitionNode extends Rect {
  depth: number;
  left?: PartitionNode;
  right?: PartitionNode;
  room?: Room;
}

export class BspDungeonGenerator extends AbstractGenerator {
  public readonly algorithm = 'bsp' as const;

  protected createLayout(options: GeneratorOptions, random: DeterministicRandom, context: GeneratorContext): MutableLayout {
    const layout = emptyLayout(options);
    const root: PartitionNode = { x: 1, y: 1, width: options.width - 2, height: options.height - 2, depth: 0 };
    const leaves: PartitionNode[] = [];
    this.split(root, options, random, leaves);
    this.step(context, 'layout', 'partition-space', 'Split the map into ' + leaves.length + ' BSP leaves.', leaves.length);
    let roomSerial = 0;
    for (const leaf of leaves) {
      const maximumWidth = Math.max(3, Math.min(options.roomMaxSize, leaf.width - 2));
      const maximumHeight = Math.max(3, Math.min(options.roomMaxSize, leaf.height - 2));
      const minimumWidth = Math.min(options.roomMinSize, maximumWidth);
      const minimumHeight = Math.min(options.roomMinSize, maximumHeight);
      const width = random.integer(minimumWidth, maximumWidth);
      const height = random.integer(minimumHeight, maximumHeight);
      const x = leaf.x + random.integer(1, Math.max(1, leaf.width - width - 1));
      const y = leaf.y + random.integer(1, Math.max(1, leaf.height - height - 1));
      leaf.room = makeRoom('bsp-room-' + roomSerial++, x, y, width, height);
      layout.rooms.push(leaf.room);
      carveRoom(layout.grid, leaf.room);
    }
    this.step(context, 'layout', 'carve-rooms', 'Carved one room inside every terminal partition.', layout.rooms.reduce((sum, room) => sum + room.area, 0));
    const carver = new CorridorCarver();
    this.connectTree(root, layout, carver, random, options);
    this.addLoops(layout, carver, random, options);
    this.classifyRooms(layout.rooms);
    layout.spawn = layout.rooms[0]?.center;
    layout.exit = layout.rooms[layout.rooms.length - 1]?.center;
    layout.metadata.partitionCount = leaves.length;
    layout.metadata.treeDepth = Math.max(...leaves.map((leaf) => leaf.depth), 0);
    return layout;
  }

  private split(node: PartitionNode, options: GeneratorOptions, random: DeterministicRandom, leaves: PartitionNode[]): void {
    const minimumSpan = options.roomMinSize + 4;
    const canSplitHorizontal = node.height >= minimumSpan * 2;
    const canSplitVertical = node.width >= minimumSpan * 2;
    if ((!canSplitHorizontal && !canSplitVertical) || node.depth >= 7) {
      leaves.push(node);
      return;
    }
    const horizontal = canSplitHorizontal && (!canSplitVertical || node.height / node.width > 1.2 || random.boolean(0.5));
    if (horizontal) {
      const split = random.integer(minimumSpan, node.height - minimumSpan);
      node.left = { x: node.x, y: node.y, width: node.width, height: split, depth: node.depth + 1 };
      node.right = { x: node.x, y: node.y + split, width: node.width, height: node.height - split, depth: node.depth + 1 };
    } else {
      const split = random.integer(minimumSpan, node.width - minimumSpan);
      node.left = { x: node.x, y: node.y, width: split, height: node.height, depth: node.depth + 1 };
      node.right = { x: node.x + split, y: node.y, width: node.width - split, height: node.height, depth: node.depth + 1 };
    }
    this.split(node.left, options, random, leaves);
    this.split(node.right, options, random, leaves);
  }

  private connectTree(node: PartitionNode, layout: MutableLayout, carver: CorridorCarver, random: DeterministicRandom, options: GeneratorOptions): Room | undefined {
    if (node.room) return node.room;
    const leftRoom = node.left ? this.connectTree(node.left, layout, carver, random, options) : undefined;
    const rightRoom = node.right ? this.connectTree(node.right, layout, carver, random, options) : undefined;
    if (leftRoom && rightRoom) {
      layout.corridors.push(carver.carve(layout.grid, leftRoom.center, rightRoom.center, options.corridorWidth,
        random.boolean() ? 'horizontal-first' : 'vertical-first', random, leftRoom.id, rightRoom.id));
      return random.boolean() ? leftRoom : rightRoom;
    }
    return leftRoom ?? rightRoom;
  }

  private addLoops(layout: MutableLayout, carver: CorridorCarver, random: DeterministicRandom, options: GeneratorOptions): void {
    for (let index = 0; index < layout.rooms.length; index++) {
      if (!random.boolean(options.loopChance)) continue;
      const source = layout.rooms[index];
      const candidates = layout.rooms
        .filter((room) => room.id !== source.id && !rectsIntersect(source, room, 1))
        .sort((a, b) => Math.hypot(a.center.x - source.center.x, a.center.y - source.center.y) - Math.hypot(b.center.x - source.center.x, b.center.y - source.center.y));
      const target = candidates[0];
      if (target) layout.corridors.push(carver.carve(layout.grid, source.center, target.center, options.corridorWidth, 'straight', random, source.id, target.id));
    }
  }

  private classifyRooms(rooms: Room[]): void {
    if (rooms.length === 0) return;
    rooms[0].kind = 'start';
    rooms[rooms.length - 1].kind = 'exit';
    const largest = [...rooms].sort((a, b) => b.area - a.area)[0];
    if (largest.kind === 'combat') largest.kind = 'boss';
    for (let index = 1; index < rooms.length - 1; index++) {
      if (index % 5 === 0) rooms[index].kind = 'treasure';
      rooms[index].tags.push(rooms[index].width > rooms[index].height ? 'wide' : 'tall');
    }
  }
}
