import {
  DEFAULT_TILE_POLICY,
  NavCell,
  NavPoint,
  NavigationTilePolicy,
  cellKey,
  sameCell,
} from './types';

export interface NeighborCell {
  cell: NavCell;
  cost: number;
}

/** Immutable navigation view over a level tile map. */
export class NavigationGrid {
  public readonly width: number;
  public readonly height: number;
  public readonly tileSize: number;
  private readonly tiles: number[][];
  private readonly policy: NavigationTilePolicy;

  public constructor(
    rows: readonly (readonly number[])[],
    tileSize = 32,
    policy: NavigationTilePolicy = DEFAULT_TILE_POLICY,
  ) {
    if (rows.length === 0 || rows[0].length === 0) throw new RangeError('navigation rows cannot be empty');
    const width = rows[0].length;
    if (rows.some((row) => row.length !== width)) throw new RangeError('navigation rows must have equal width');
    if (!Number.isFinite(tileSize) || tileSize <= 0) throw new RangeError('tile size must be positive');
    this.width = width;
    this.height = rows.length;
    this.tileSize = tileSize;
    this.tiles = rows.map((row) => [...row]);
    this.policy = policy;
  }

  public inBounds(cell: NavCell): boolean {
    return cell.x >= 0 && cell.y >= 0 && cell.x < this.width && cell.y < this.height;
  }

  public tileAt(cell: NavCell): number | undefined {
    return this.inBounds(cell) ? this.tiles[cell.y][cell.x] : undefined;
  }

  public isWalkable(cell: NavCell): boolean {
    const tile = this.tileAt(cell);
    return tile !== undefined && !this.policy.blocked.has(tile);
  }

  public traversalCost(cell: NavCell): number {
    const tile = this.tileAt(cell);
    if (tile === undefined || this.policy.blocked.has(tile)) return Infinity;
    return this.policy.costs[tile] ?? this.policy.defaultCost;
  }

  public worldToCell(point: NavPoint): NavCell {
    return {
      x: Math.floor(point.x / this.tileSize),
      y: Math.floor(point.y / this.tileSize),
    };
  }

  public cellToWorld(cell: NavCell): NavPoint {
    return {
      x: cell.x * this.tileSize + this.tileSize / 2,
      y: cell.y * this.tileSize + this.tileSize / 2,
    };
  }

  public clampCell(cell: NavCell): NavCell {
    return {
      x: Math.max(0, Math.min(this.width - 1, cell.x)),
      y: Math.max(0, Math.min(this.height - 1, cell.y)),
    };
  }

  public neighbors(cell: NavCell, diagonal = true, preventCornerCutting = true): NeighborCell[] {
    const result: NeighborCell[] = [];
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        if (ox === 0 && oy === 0) continue;
        if (!diagonal && ox !== 0 && oy !== 0) continue;
        const next = { x: cell.x + ox, y: cell.y + oy };
        if (!this.isWalkable(next)) continue;
        const isDiagonal = ox !== 0 && oy !== 0;
        if (isDiagonal && preventCornerCutting) {
          if (!this.isWalkable({ x: cell.x + ox, y: cell.y }) || !this.isWalkable({ x: cell.x, y: cell.y + oy })) continue;
        }
        result.push({
          cell: next,
          cost: this.traversalCost(next) * (isDiagonal ? Math.SQRT2 : 1),
        });
      }
    }
    return result;
  }

  /** Returns the closest walkable cell using expanding square rings. */
  public closestWalkable(origin: NavCell, maximumRadius = 12): NavCell | undefined {
    const clamped = this.clampCell(origin);
    if (this.isWalkable(clamped)) return clamped;
    for (let radius = 1; radius <= maximumRadius; radius++) {
      let best: NavCell | undefined;
      let bestDistance = Infinity;
      for (let y = clamped.y - radius; y <= clamped.y + radius; y++) {
        for (let x = clamped.x - radius; x <= clamped.x + radius; x++) {
          if (Math.max(Math.abs(x - clamped.x), Math.abs(y - clamped.y)) !== radius) continue;
          const candidate = { x, y };
          if (!this.isWalkable(candidate)) continue;
          const candidateDistance = Math.hypot(x - origin.x, y - origin.y);
          if (candidateDistance < bestDistance) {
            best = candidate;
            bestDistance = candidateDistance;
          }
        }
      }
      if (best) return best;
    }
    return undefined;
  }

  /** Supercover traversal: every grid cell touched by the segment is checked. */
  public hasLineOfSight(start: NavCell, end: NavCell): boolean {
    if (!this.isWalkable(start) || !this.isWalkable(end)) return false;
    let x = start.x;
    let y = start.y;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const nx = Math.abs(dx);
    const ny = Math.abs(dy);
    const signX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const signY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
    let ix = 0;
    let iy = 0;
    while (ix < nx || iy < ny) {
      const horizontalDecision = (1 + 2 * ix) * ny;
      const verticalDecision = (1 + 2 * iy) * nx;
      if (horizontalDecision === verticalDecision) {
        // A diagonal crossing touches both orthogonal cells; blocking either
        // prevents agents from slipping through a closed corner.
        if (!this.isWalkable({ x: x + signX, y }) || !this.isWalkable({ x, y: y + signY })) return false;
        x += signX;
        y += signY;
        ix++;
        iy++;
      } else if (horizontalDecision < verticalDecision) {
        x += signX;
        ix++;
      } else {
        y += signY;
        iy++;
      }
      if (!this.isWalkable({ x, y })) return false;
    }
    return true;
  }

  public worldLineOfSight(start: NavPoint, end: NavPoint): boolean {
    return this.hasLineOfSight(this.worldToCell(start), this.worldToCell(end));
  }

  public smoothPath(path: readonly NavCell[]): NavCell[] {
    if (path.length <= 2) return path.map((cell) => ({ ...cell }));
    const result: NavCell[] = [{ ...path[0] }];
    let anchor = 0;
    while (anchor < path.length - 1) {
      let furthest = anchor + 1;
      for (let candidate = path.length - 1; candidate > anchor + 1; candidate--) {
        if (this.hasLineOfSight(path[anchor], path[candidate])) {
          furthest = candidate;
          break;
        }
      }
      result.push({ ...path[furthest] });
      anchor = furthest;
    }
    return result;
  }

  public pathIsValid(path: readonly NavCell[]): boolean {
    if (path.length === 0) return false;
    for (let index = 0; index < path.length; index++) {
      if (!this.isWalkable(path[index])) return false;
      if (index > 0 && !sameCell(path[index - 1], path[index]) && !this.hasLineOfSight(path[index - 1], path[index])) return false;
    }
    return true;
  }

  public signature(): string {
    let hash = 2166136261;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        hash ^= this.tiles[y][x] + x * 17 + y * 31;
        hash = Math.imul(hash, 16777619);
      }
    }
    return `${this.width}x${this.height}:${(hash >>> 0).toString(36)}`;
  }

  public debugCells(): string[] {
    const result: string[] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isWalkable({ x, y })) result.push(cellKey({ x, y }));
      }
    }
    return result;
  }
}
