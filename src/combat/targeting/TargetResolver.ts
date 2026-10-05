import { CombatantSnapshot, TargetingMode, Vec2, distance, normalize } from '../core/types';

export interface TargetQuery {
  caster: CombatantSnapshot;
  candidates: CombatantSnapshot[];
  mode: TargetingMode;
  targetId?: string;
  targetPosition: Vec2;
  direction: Vec2;
  range: number;
  radius: number;
  angle: number;
  maximumTargets?: number;
  includeAllies?: boolean;
  includeSelf?: boolean;
  requireLineOfSight?: (from: Vec2, to: Vec2) => boolean;
}

export class TargetResolver {
  public resolve(query: TargetQuery): CombatantSnapshot[] {
    const candidates = query.candidates.filter((candidate) => this.eligible(candidate, query));
    let selected: CombatantSnapshot[];
    switch (query.mode) {
      case 'self': selected = [query.caster]; break;
      case 'single': selected = this.single(candidates, query); break;
      case 'cone': selected = this.cone(candidates, query); break;
      case 'line': selected = this.line(candidates, query); break;
      case 'circle': selected = this.circle(candidates, query); break;
      case 'ring': selected = this.ring(candidates, query); break;
      case 'chain': selected = this.chain(candidates, query); break;
      case 'dash': selected = this.line(candidates, query); break;
      case 'projectile': selected = this.line(candidates, { ...query, radius: Math.max(8, query.radius) }); break;
      case 'summon': selected = []; break;
      default: selected = [];
    }
    return selected.slice(0, query.maximumTargets ?? Infinity);
  }

  public nearest(origin: Vec2, candidates: readonly CombatantSnapshot[], maximumRange = Infinity): CombatantSnapshot | undefined {
    return [...candidates].filter((candidate) => candidate.alive && distance(origin, candidate.position) <= maximumRange)
      .sort((left, right) => distance(origin, left.position) - distance(origin, right.position) || left.id.localeCompare(right.id))[0];
  }

  public farthest(origin: Vec2, candidates: readonly CombatantSnapshot[], maximumRange = Infinity): CombatantSnapshot | undefined {
    return [...candidates].filter((candidate) => candidate.alive && distance(origin, candidate.position) <= maximumRange)
      .sort((left, right) => distance(origin, right.position) - distance(origin, left.position) || left.id.localeCompare(right.id))[0];
  }

  private eligible(candidate: CombatantSnapshot, query: TargetQuery): boolean {
    if (!candidate.alive) return false;
    if (!query.includeSelf && candidate.id === query.caster.id) return false;
    if (!query.includeAllies && candidate.team === query.caster.team) return false;
    if (query.requireLineOfSight && !query.requireLineOfSight(query.caster.position, candidate.position)) return false;
    return true;
  }

  private single(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const explicit = query.targetId ? candidates.find((candidate) => candidate.id === query.targetId) : undefined;
    const target = explicit ?? this.nearest(query.targetPosition, candidates, query.radius || query.range);
    return target && distance(query.caster.position, target.position) <= query.range ? [target] : [];
  }

  private cone(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const direction = normalize(query.direction);
    const minimumDot = Math.cos((query.angle * Math.PI / 180) / 2);
    return candidates.filter((candidate) => {
      const delta = { x: candidate.position.x - query.caster.position.x, y: candidate.position.y - query.caster.position.y };
      const length = Math.hypot(delta.x, delta.y);
      if (length > query.range || length <= Number.EPSILON) return false;
      const unit = { x: delta.x / length, y: delta.y / length };
      return unit.x * direction.x + unit.y * direction.y >= minimumDot;
    }).sort((left, right) => distance(query.caster.position, left.position) - distance(query.caster.position, right.position));
  }

  private line(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const direction = normalize(query.direction);
    return candidates.filter((candidate) => {
      const deltaX = candidate.position.x - query.caster.position.x;
      const deltaY = candidate.position.y - query.caster.position.y;
      const projection = deltaX * direction.x + deltaY * direction.y;
      if (projection < 0 || projection > query.range) return false;
      const perpendicular = Math.abs(deltaX * direction.y - deltaY * direction.x);
      return perpendicular <= Math.max(1, query.radius);
    }).sort((left, right) => distance(query.caster.position, left.position) - distance(query.caster.position, right.position));
  }

  private circle(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    return candidates.filter((candidate) => distance(query.targetPosition, candidate.position) <= query.radius)
      .sort((left, right) => distance(query.targetPosition, left.position) - distance(query.targetPosition, right.position));
  }

  private ring(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const inner = Math.max(0, query.radius * 0.55);
    return candidates.filter((candidate) => {
      const value = distance(query.targetPosition, candidate.position);
      return value >= inner && value <= query.radius;
    }).sort((left, right) => distance(query.targetPosition, left.position) - distance(query.targetPosition, right.position));
  }

  private chain(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const result: CombatantSnapshot[] = [];
    let origin = query.targetPosition;
    const remaining = [...candidates];
    while (remaining.length > 0 && result.length < (query.maximumTargets ?? 4)) {
      const next = this.nearest(origin, remaining, result.length === 0 ? query.range : query.radius);
      if (!next) break;
      result.push(next);
      origin = next.position;
      remaining.splice(remaining.findIndex((entry) => entry.id === next.id), 1);
    }
    return result;
  }
}
