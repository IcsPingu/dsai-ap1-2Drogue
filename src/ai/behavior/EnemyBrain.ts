import { NavPoint, distance, squaredDistance } from '../navigation';
import { behaviorProfile } from './profiles';
import {
  AwarenessState,
  BrainDecision,
  BrainObservation,
  BrainSnapshot,
  EnemyBehaviorProfile,
  EnemyRole,
  copyPoint,
} from './types';

export class EnemyBrain {
  private profile: EnemyBehaviorProfile;
  private state: AwarenessState;
  private timeInState = 0;
  private alertness = 0;
  private unseenElapsed = Infinity;
  private memoryElapsed = Infinity;
  private patrolWaitElapsed = 0;
  private searchElapsed = 0;
  private patrolIndex = 0;
  private lastKnownTarget?: NavPoint;
  private readonly home: NavPoint;
  private patrol: NavPoint[];
  private damaged = false;
  private searchStep = 0;

  public constructor(
    role: EnemyRole,
    home: NavPoint,
    patrol: readonly NavPoint[] = [],
    overrides: Partial<EnemyBehaviorProfile> = {},
  ) {
    this.profile = behaviorProfile(role, overrides);
    this.home = { ...home };
    this.patrol = patrol.length > 0 ? patrol.map((point) => ({ ...point })) : [{ ...home }];
    this.state = this.patrol.length > 1 ? 'patrol' : 'idle';
  }

  public setPatrol(points: readonly NavPoint[]): void {
    this.patrol = points.length > 0 ? points.map((point) => ({ ...point })) : [{ ...this.home }];
    this.patrolIndex = Math.min(this.patrolIndex, this.patrol.length - 1);
  }

  public notifyDamaged(targetPosition?: NavPoint): void {
    this.damaged = true;
    this.alertness = 1;
    if (targetPosition) {
      this.lastKnownTarget = { ...targetPosition };
      this.memoryElapsed = 0;
    }
  }

  public update(observation: BrainObservation): BrainDecision {
    const delta = Math.max(0, Math.min(observation.delta, 250));
    this.timeInState += delta;
    this.memoryElapsed += delta;
    this.unseenElapsed += delta;
    this.alertness = Math.max(0, this.alertness - delta / Math.max(1, this.profile.memoryDuration));

    if (observation.targetVisible) {
      this.lastKnownTarget = { ...observation.target };
      this.memoryElapsed = 0;
      this.unseenElapsed = 0;
      this.alertness = Math.min(1, this.alertness + this.profile.aggression * 0.35 + 0.2);
    } else if (observation.targetAudible) {
      this.lastKnownTarget = { ...observation.target };
      this.memoryElapsed = 0;
      this.alertness = Math.min(1, this.alertness + 0.18);
    }

    if (this.damaged) {
      this.damaged = false;
      if (!this.lastKnownTarget) this.lastKnownTarget = { ...observation.target };
      this.transition('alert');
    }

    this.selectState(observation);
    return this.buildDecision(observation);
  }

  public snapshot(): BrainSnapshot {
    return {
      state: this.state,
      timeInState: this.timeInState,
      alertness: this.alertness,
      lastKnownTarget: copyPoint(this.lastKnownTarget),
      patrolIndex: this.patrolIndex,
    };
  }

  private selectState(observation: BrainObservation): void {
    const visible = observation.targetVisible;
    const inAttackBand = observation.distanceToTarget >= this.profile.attackMinimumRange
      && observation.distanceToTarget <= this.profile.attackMaximumRange;
    const tooClose = observation.distanceToTarget < this.profile.retreatRange;
    const leashed = distance(observation.self, this.home) > this.profile.leashRange;

    if (leashed && !visible && this.state !== 'return') {
      this.transition('return');
      return;
    }
    if (visible) {
      if (this.state === 'idle' || this.state === 'patrol' || this.state === 'return') {
        this.transition('alert');
        return;
      }
      if (this.state === 'alert' && this.timeInState < this.profile.alertDuration) return;
      if (inAttackBand || tooClose) this.transition('engage');
      else this.transition('chase');
      return;
    }
    if (observation.targetAudible && this.lastKnownTarget) {
      this.transition('investigate');
      return;
    }
    if (this.unseenElapsed <= this.profile.loseSightDelay && this.lastKnownTarget) {
      this.transition('chase');
      return;
    }
    if (this.lastKnownTarget && this.memoryElapsed <= this.profile.memoryDuration) {
      if (distance(observation.self, this.lastKnownTarget) > 22) this.transition('investigate');
      else this.transition('search');
      return;
    }
    if (this.state === 'search') {
      this.searchElapsed += observation.delta;
      if (this.searchElapsed < this.profile.searchDuration) return;
    }
    if (distance(observation.self, this.home) > 28) this.transition('return');
    else this.transition(this.patrol.length > 1 ? 'patrol' : 'idle');
  }

  private buildDecision(observation: BrainObservation): BrainDecision {
    let moveTarget: NavPoint | undefined;
    let wantsAttack = false;
    let wantsRetreat = false;
    switch (this.state) {
      case 'alert':
        moveTarget = undefined;
        break;
      case 'chase':
        moveTarget = copyPoint(observation.targetVisible ? observation.target : this.lastKnownTarget);
        break;
      case 'engage':
        wantsAttack = observation.targetVisible;
        wantsRetreat = observation.distanceToTarget < this.profile.retreatRange;
        if (!wantsAttack) moveTarget = copyPoint(this.lastKnownTarget);
        break;
      case 'investigate':
        moveTarget = copyPoint(this.lastKnownTarget);
        break;
      case 'search':
        moveTarget = this.searchTarget();
        break;
      case 'return':
        moveTarget = { ...this.home };
        if (distance(observation.self, this.home) <= 24) this.transition(this.patrol.length > 1 ? 'patrol' : 'idle');
        break;
      case 'patrol':
        moveTarget = this.patrolTarget(observation.self, observation.delta);
        break;
      case 'idle':
        moveTarget = undefined;
        break;
    }
    return {
      state: this.state,
      moveTarget,
      lookTarget: copyPoint(observation.targetVisible ? observation.target : this.lastKnownTarget),
      lastKnownTarget: copyPoint(this.lastKnownTarget),
      targetVisible: observation.targetVisible,
      wantsAttack,
      wantsRetreat,
      urgency: this.urgency(),
    };
  }

  private patrolTarget(self: NavPoint, delta: number): NavPoint | undefined {
    const target = this.patrol[this.patrolIndex];
    if (distance(self, target) > 18) {
      this.patrolWaitElapsed = 0;
      return { ...target };
    }
    this.patrolWaitElapsed += delta;
    if (this.patrolWaitElapsed < this.profile.patrolWait) return undefined;
    this.patrolWaitElapsed = 0;
    this.patrolIndex = (this.patrolIndex + 1) % this.patrol.length;
    return { ...this.patrol[this.patrolIndex] };
  }

  private searchTarget(): NavPoint | undefined {
    if (!this.lastKnownTarget) return undefined;
    const ring = 1 + Math.floor(this.searchStep / 8);
    const angle = (this.searchStep % 8) * Math.PI / 4;
    this.searchStep = (this.searchStep + 1) % 24;
    const radius = 24 + ring * 22;
    return {
      x: this.lastKnownTarget.x + Math.cos(angle) * radius,
      y: this.lastKnownTarget.y + Math.sin(angle) * radius,
    };
  }

  private urgency(): number {
    switch (this.state) {
      case 'engage': return 1;
      case 'chase': return 0.92;
      case 'alert': return 0.85;
      case 'investigate': return 0.68;
      case 'search': return 0.5;
      case 'return': return 0.42;
      case 'patrol': return 0.3;
      default: return 0;
    }
  }

  private transition(next: AwarenessState): void {
    if (next === this.state) return;
    this.state = next;
    this.timeInState = 0;
    if (next === 'search') {
      this.searchElapsed = 0;
      this.searchStep = 0;
    }
    if (next === 'idle' || next === 'patrol') {
      this.lastKnownTarget = undefined;
      this.memoryElapsed = Infinity;
      this.alertness = 0;
    }
  }
}
