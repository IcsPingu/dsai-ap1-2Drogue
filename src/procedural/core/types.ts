export enum TileKind {
  Floor = 0,
  Wall = 1,
  Pillar = 2,
  Pit = 3,
  Lava = 4,
  Exit = 5,
  LockedDoor = 6,
  Chest = 7,
  Spawn = 8,
  Boss = 9,
}

export type GeneratorAlgorithm =
  | 'bsp'
  | 'drunkard-walk'
  | 'cellular-automata'
  | 'depth-first-maze'
  | 'prim-maze'
  | 'kruskal-maze'
  | 'eller-maze'
  | 'room-graph'
  | 'wave-function-collapse'
  | 'grammar'
  | 'voronoi-caves'
  | 'hybrid';

export type CardinalDirection = 'north' | 'east' | 'south' | 'west';
export type GenerationPhase =
  | 'initialization'
  | 'layout'
  | 'connectivity'
  | 'terrain'
  | 'content'
  | 'validation'
  | 'complete';

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export interface WeightedPoint extends Point {
  weight: number;
}

export interface Room extends Rect {
  id: string;
  center: Point;
  area: number;
  kind: 'start' | 'exit' | 'combat' | 'treasure' | 'boss' | 'connector' | 'secret';
  tags: string[];
}

export interface Corridor {
  id: string;
  fromRoomId?: string;
  toRoomId?: string;
  points: Point[];
  width: number;
  locked: boolean;
}

export interface Region {
  id: number;
  cells: Point[];
  bounds: Rect;
  centroid: Point;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface GenerationStep {
  phase: GenerationPhase;
  name: string;
  detail: string;
  changedCells: number;
  elapsedOperations: number;
}

export interface GeneratorOptions {
  width: number;
  height: number;
  seed: string | number;
  algorithm: GeneratorAlgorithm;
  difficulty: number;
  floorTarget: number;
  roomMinSize: number;
  roomMaxSize: number;
  corridorWidth: number;
  loopChance: number;
  hazardDensity: number;
  treasureDensity: number;
  enemyDensity: number;
  decorationDensity: number;
  smoothingPasses: number;
  biome: BiomeId;
  ensureConnected: boolean;
}

export type BiomeId =
  | 'cathedral'
  | 'inferno'
  | 'celestial'
  | 'streets'
  | 'ruins'
  | 'garden'
  | 'crypt'
  | 'clocktower'
  | 'colosseum'
  | 'void';

export interface GeneratorContext {
  options: GeneratorOptions;
  steps: GenerationStep[];
  operationCount: number;
}

export interface EnemySpawn {
  id: string;
  archetype: string;
  position: Point;
  level: number;
  patrol: Point[];
  encounterId: string;
}

export interface ItemSpawn {
  id: string;
  itemType: string;
  position: Point;
  quantity: number;
  guarded: boolean;
}

export interface DecorationSpawn {
  id: string;
  decorationType: string;
  position: Point;
  rotation: number;
  scale: number;
  tint?: number;
}

export interface EncounterPlan {
  id: string;
  roomId?: string;
  enemies: string[];
  budget: number;
  trigger: 'enter-room' | 'cross-threshold' | 'pickup' | 'boss-door';
  rewardItemId?: string;
}

export interface TopologyMetrics {
  walkableCells: number;
  wallCells: number;
  componentCount: number;
  deadEndCount: number;
  junctionCount: number;
  loopCount: number;
  chokepointCount: number;
  averageBranching: number;
  mainPathLength: number;
  openness: number;
  linearity: number;
}

export interface GeneratedMap {
  algorithm: GeneratorAlgorithm;
  seed: string;
  width: number;
  height: number;
  tiles: number[][];
  rooms: Room[];
  corridors: Corridor[];
  spawn: Point;
  exit: Point;
  enemies: EnemySpawn[];
  items: ItemSpawn[];
  decorations: DecorationSpawn[];
  encounters: EncounterPlan[];
  metrics: TopologyMetrics;
  steps: GenerationStep[];
  metadata: Record<string, string | number | boolean>;
}

export interface GenerationResult {
  map: GeneratedMap;
  warnings: string[];
  repaired: boolean;
  attempts: number;
}

export interface MapGenerator {
  readonly algorithm: GeneratorAlgorithm;
  generate(options: GeneratorOptions): GeneratedMap;
}

export interface ValidationIssue {
  code: string;
  severity: 'warning' | 'error';
  message: string;
  position?: Point;
}

export interface ValidationReport {
  valid: boolean;
  issues: ValidationIssue[];
  metrics: TopologyMetrics;
}

export const CARDINAL_DIRECTIONS: ReadonlyArray<Readonly<Point>> = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

export const DIAGONAL_DIRECTIONS: ReadonlyArray<Readonly<Point>> = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
];

export const ALL_DIRECTIONS: ReadonlyArray<Readonly<Point>> = [
  ...CARDINAL_DIRECTIONS,
  ...DIAGONAL_DIRECTIONS,
];

export function pointKey(point: Point): string {
  return point.x + ',' + point.y;
}

export function parsePointKey(key: string): Point {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
}

export function samePoint(left: Point, right: Point): boolean {
  return left.x === right.x && left.y === right.y;
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

export function isWalkableTile(tile: number): boolean {
  return tile === TileKind.Floor || tile === TileKind.Exit || tile === TileKind.Chest ||
    tile === TileKind.Spawn || tile === TileKind.Boss || tile === TileKind.LockedDoor;
}

export function createDefaultOptions(
  seed: string | number,
  algorithm: GeneratorAlgorithm = 'hybrid',
): GeneratorOptions {
  return {
    width: 40,
    height: 25,
    seed,
    algorithm,
    difficulty: 3,
    floorTarget: 0.48,
    roomMinSize: 4,
    roomMaxSize: 10,
    corridorWidth: 2,
    loopChance: 0.18,
    hazardDensity: 0.035,
    treasureDensity: 0.012,
    enemyDensity: 0.025,
    decorationDensity: 0.05,
    smoothingPasses: 4,
    biome: 'cathedral',
    ensureConnected: true,
  };
}

export function normalizeOptions(input: Partial<GeneratorOptions> & Pick<GeneratorOptions, 'seed'>): GeneratorOptions {
  const defaults = createDefaultOptions(input.seed, input.algorithm ?? 'hybrid');
  const result = { ...defaults, ...input };
  result.width = Math.max(15, Math.floor(result.width));
  result.height = Math.max(15, Math.floor(result.height));
  result.difficulty = clamp(Math.floor(result.difficulty), 1, 10);
  result.floorTarget = clamp(result.floorTarget, 0.15, 0.82);
  result.roomMinSize = clamp(Math.floor(result.roomMinSize), 3, 15);
  result.roomMaxSize = clamp(Math.floor(result.roomMaxSize), result.roomMinSize, 24);
  result.corridorWidth = clamp(Math.floor(result.corridorWidth), 1, 5);
  result.loopChance = clamp(result.loopChance, 0, 1);
  result.hazardDensity = clamp(result.hazardDensity, 0, 0.25);
  result.treasureDensity = clamp(result.treasureDensity, 0, 0.15);
  result.enemyDensity = clamp(result.enemyDensity, 0, 0.2);
  result.decorationDensity = clamp(result.decorationDensity, 0, 0.3);
  result.smoothingPasses = clamp(Math.floor(result.smoothingPasses), 0, 12);
  return result;
}
