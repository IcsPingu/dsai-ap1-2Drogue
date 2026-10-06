import { NavPoint, NavigationService, distance, normalize } from '../navigation';

export class TacticalPositioning {
  public constructor(private readonly navigation: NavigationService) {}

  public retreatFrom(self: NavPoint, threat: NavPoint, distanceToCreate: number): NavPoint {
    const away = normalize({ x: self.x - threat.x, y: self.y - threat.y });
    const candidates = this.arcCandidates(self, away, distanceToCreate);
    return this.bestReachable(self, candidates, threat, true) ?? self;
  }

  public flankAround(self: NavPoint, target: NavPoint, radius: number, side: -1 | 1): NavPoint {
    const toward = normalize({ x: target.x - self.x, y: target.y - self.y });
    const lateral = { x: -toward.y * side, y: toward.x * side };
    const candidate = {
      x: target.x - toward.x * radius + lateral.x * radius * 0.55,
      y: target.y - toward.y * radius + lateral.y * radius * 0.55,
    };
    return this.navigation.closestWalkableWorld(candidate) ?? self;
  }

  public orbitPoint(self: NavPoint, target: NavPoint, radius: number, clockwise: boolean): NavPoint {
    const radial = normalize({ x: self.x - target.x, y: self.y - target.y });
    const tangent = clockwise ? { x: -radial.y, y: radial.x } : { x: radial.y, y: -radial.x };
    const candidate = {
      x: target.x + radial.x * radius + tangent.x * radius * 0.45,
      y: target.y + radial.y * radius + tangent.y * radius * 0.45,
    };
    return this.navigation.closestWalkableWorld(candidate) ?? self;
  }

  private arcCandidates(origin: NavPoint, baseDirection: NavPoint, radius: number): NavPoint[] {
    const angles = [0, Math.PI / 6, -Math.PI / 6, Math.PI / 3, -Math.PI / 3, Math.PI / 2, -Math.PI / 2];
    const base = Math.atan2(baseDirection.y, baseDirection.x);
    return angles.map((offset) => ({
      x: origin.x + Math.cos(base + offset) * radius,
      y: origin.y + Math.sin(base + offset) * radius,
    }));
  }

  private bestReachable(
    origin: NavPoint,
    candidates: readonly NavPoint[],
    threat: NavPoint,
    maximizeThreatDistance: boolean,
  ): NavPoint | undefined {
    let best: NavPoint | undefined;
    let bestScore = -Infinity;
    for (const raw of candidates) {
      const candidate = this.navigation.closestWalkableWorld(raw);
      if (!candidate) continue;
      const path = this.navigation.findPath(origin, candidate, { acceptPartial: false });
      if (!path.reachedGoal || path.points.length === 0) continue;
      const threatScore = distance(candidate, threat) * (maximizeThreatDistance ? 1 : -1);
      const routePenalty = path.cost * this.navigation.grid.tileSize * 0.08;
      const score = threatScore - routePenalty;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
    return best;
  }
}
