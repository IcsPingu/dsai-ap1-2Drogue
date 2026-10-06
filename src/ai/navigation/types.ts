export interface NavPoint {
  x: number;
  y: number;
}

export interface NavCell extends NavPoint {}

export interface NavigationTilePolicy {
  blocked: ReadonlySet<number>;
  costs: Readonly<Record<number, number>>;
  defaultCost: number;
}

export interface PathSearchOptions {
  allowDiagonal?: boolean;
  preventCornerCutting?: boolean;
  heuristicWeight?: number;
  maximumVisited?: number;
  acceptPartial?: boolean;
  smooth?: boolean;
}

export interface PathSearchResult {
  cells: NavCell[];
  reachedGoal: boolean;
  visited: number;
  cost: number;
}

export interface NavigationPath {
  points: NavPoint[];
  reachedGoal: boolean;
  visited: number;
  cost: number;
}

export interface NavigationAgentOptions {
  repathInterval: number;
  goalTolerance: number;
  waypointTolerance: number;
  stuckDistance: number;
  stuckTimeout: number;
  maximumPathAge: number;
  directPath: boolean;
}

export interface NavigationAgentStep {
  velocity: NavPoint;
  waypoint?: NavPoint;
  reachedGoal: boolean;
  hasPath: boolean;
  repathed: boolean;
  stuck: boolean;
}

export const DEFAULT_TILE_POLICY: NavigationTilePolicy = {
  // Wall, pillar, water/pit and locked door.
  blocked: new Set([1, 2, 3, 6]),
  // Lava remains traversable as a last resort, but is deliberately expensive.
  costs: { 4: 7 },
  defaultCost: 1,
};

export const DEFAULT_SEARCH_OPTIONS: Required<PathSearchOptions> = {
  allowDiagonal: true,
  preventCornerCutting: true,
  heuristicWeight: 1,
  maximumVisited: 8000,
  acceptPartial: true,
  smooth: true,
};

export const DEFAULT_AGENT_OPTIONS: NavigationAgentOptions = {
  repathInterval: 280,
  goalTolerance: 14,
  waypointTolerance: 10,
  stuckDistance: 3,
  stuckTimeout: 700,
  maximumPathAge: 1800,
  directPath: true,
};

export function squaredDistance(a: NavPoint, b: NavPoint): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}

export function distance(a: NavPoint, b: NavPoint): number {
  return Math.sqrt(squaredDistance(a, b));
}

export function sameCell(a: NavCell, b: NavCell): boolean {
  return a.x === b.x && a.y === b.y;
}

export function cellKey(cell: NavCell): string {
  return `${cell.x},${cell.y}`;
}

export function normalize(vector: NavPoint): NavPoint {
  const length = Math.hypot(vector.x, vector.y);
  if (length <= Number.EPSILON) return { x: 0, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
}

export function clampMagnitude(vector: NavPoint, maximum: number): NavPoint {
  const length = Math.hypot(vector.x, vector.y);
  if (length <= maximum || length <= Number.EPSILON) return { ...vector };
  const scale = maximum / length;
  return { x: vector.x * scale, y: vector.y * scale };
}

export function lerpPoint(a: NavPoint, b: NavPoint, amount: number): NavPoint {
  return {
    x: a.x + (b.x - a.x) * amount,
    y: a.y + (b.y - a.y) * amount,
  };
}
