import { NavigationService } from './NavigationService';
import {
  DEFAULT_AGENT_OPTIONS,
  NavPoint,
  NavigationAgentOptions,
  NavigationAgentStep,
  distance,
  normalize,
  squaredDistance,
} from './types';

export class NavigationAgent {
  private readonly options: NavigationAgentOptions;
  private path: NavPoint[] = [];
  private waypointIndex = 0;
  private goal?: NavPoint;
  private pathAge = Infinity;
  private repathCooldown = 0;
  private stuckElapsed = 0;
  private lastPosition?: NavPoint;
  private forceRepath = false;

  public constructor(
    private navigation: NavigationService,
    options: Partial<NavigationAgentOptions> = {},
  ) {
    this.options = { ...DEFAULT_AGENT_OPTIONS, ...options };
  }

  public setNavigation(navigation: NavigationService): void {
    this.navigation = navigation;
    this.clear();
  }

  public clear(): void {
    this.path = [];
    this.waypointIndex = 0;
    this.goal = undefined;
    this.pathAge = Infinity;
    this.repathCooldown = 0;
    this.stuckElapsed = 0;
    this.lastPosition = undefined;
    this.forceRepath = false;
  }

  public invalidate(): void {
    this.forceRepath = true;
    this.repathCooldown = 0;
  }

  public currentPath(): readonly NavPoint[] {
    return this.path;
  }

  public step(position: NavPoint, goal: NavPoint, speed: number, delta: number): NavigationAgentStep {
    const safeDelta = Math.max(0, Math.min(delta, 250));
    this.pathAge += safeDelta;
    this.repathCooldown = Math.max(0, this.repathCooldown - safeDelta);
    const reachedGoal = distance(position, goal) <= this.options.goalTolerance;
    if (reachedGoal) {
      this.goal = { ...goal };
      this.path = [];
      this.waypointIndex = 0;
      this.trackStuck(position, safeDelta, false);
      return this.result({ x: 0, y: 0 }, true, false, false);
    }

    const goalChanged = !this.goal || squaredDistance(this.goal, goal) > this.navigation.grid.tileSize ** 2 * 0.35;
    const pathExpired = this.pathAge >= this.options.maximumPathAge;
    const pathMissing = this.waypointIndex >= this.path.length;
    let repathed = false;
    if ((goalChanged || pathExpired || pathMissing || this.forceRepath) && this.repathCooldown <= 0) {
      this.rebuildPath(position, goal);
      repathed = true;
    }

    if (this.options.directPath && this.navigation.hasLineOfSight(position, goal)) {
      this.goal = { ...goal };
      this.path = [goal];
      this.waypointIndex = 0;
    }

    this.advanceWaypoints(position);
    const waypoint = this.path[this.waypointIndex] ?? goal;
    const direction = normalize({ x: waypoint.x - position.x, y: waypoint.y - position.y });
    const desiredSpeed = this.arrivalSpeed(position, goal, speed);
    const velocity = { x: direction.x * desiredSpeed, y: direction.y * desiredSpeed };
    const stuck = this.trackStuck(position, safeDelta, desiredSpeed > 0);
    if (stuck) this.invalidate();
    return this.result(velocity, false, repathed, stuck, waypoint);
  }

  private rebuildPath(position: NavPoint, goal: NavPoint): void {
    const path = this.navigation.findPath(position, goal, { acceptPartial: true, smooth: true });
    this.path = path.points;
    this.waypointIndex = this.path.length > 1 && distance(position, this.path[0]) <= this.navigation.grid.tileSize ? 1 : 0;
    this.goal = { ...goal };
    this.pathAge = 0;
    this.repathCooldown = this.options.repathInterval;
    this.forceRepath = false;
  }

  private advanceWaypoints(position: NavPoint): void {
    while (this.waypointIndex < this.path.length - 1) {
      const waypoint = this.path[this.waypointIndex];
      if (distance(position, waypoint) > this.options.waypointTolerance) break;
      this.waypointIndex++;
    }
  }

  private arrivalSpeed(position: NavPoint, goal: NavPoint, maximum: number): number {
    const remaining = distance(position, goal);
    const slowRadius = Math.max(this.options.goalTolerance * 4, this.navigation.grid.tileSize * 1.25);
    if (remaining >= slowRadius) return maximum;
    return maximum * Math.max(0.2, remaining / slowRadius);
  }

  private trackStuck(position: NavPoint, delta: number, intendsToMove: boolean): boolean {
    if (!this.lastPosition) {
      this.lastPosition = { ...position };
      return false;
    }
    const moved = distance(position, this.lastPosition);
    if (intendsToMove && moved < this.options.stuckDistance) this.stuckElapsed += delta;
    else this.stuckElapsed = Math.max(0, this.stuckElapsed - delta * 2);
    this.lastPosition = { ...position };
    if (this.stuckElapsed < this.options.stuckTimeout) return false;
    this.stuckElapsed = 0;
    return true;
  }

  private result(
    velocity: NavPoint,
    reachedGoal: boolean,
    repathed: boolean,
    stuck: boolean,
    waypoint?: NavPoint,
  ): NavigationAgentStep {
    return {
      velocity,
      waypoint,
      reachedGoal,
      hasPath: this.path.length > 0,
      repathed,
      stuck,
    };
  }
}
