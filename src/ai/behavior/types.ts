import { NavPoint } from '../navigation';

export type EnemyRole = 'melee' | 'ranged' | 'boss';

export type AwarenessState =
  | 'idle'
  | 'patrol'
  | 'alert'
  | 'chase'
  | 'engage'
  | 'investigate'
  | 'search'
  | 'return';

export interface EnemyBehaviorProfile {
  role: EnemyRole;
  sightRange: number;
  hearingRange: number;
  loseSightDelay: number;
  memoryDuration: number;
  alertDuration: number;
  searchDuration: number;
  patrolWait: number;
  attackMinimumRange: number;
  attackMaximumRange: number;
  preferredRange: number;
  retreatRange: number;
  leashRange: number;
  aggression: number;
}

export interface BrainObservation {
  self: NavPoint;
  target: NavPoint;
  delta: number;
  targetVisible: boolean;
  targetAudible: boolean;
  distanceToTarget: number;
}

export interface BrainDecision {
  state: AwarenessState;
  moveTarget?: NavPoint;
  lookTarget?: NavPoint;
  lastKnownTarget?: NavPoint;
  targetVisible: boolean;
  wantsAttack: boolean;
  wantsRetreat: boolean;
  urgency: number;
}

export interface PerceptionResult {
  visible: boolean;
  audible: boolean;
  distance: number;
}

export interface BrainSnapshot {
  state: AwarenessState;
  timeInState: number;
  alertness: number;
  lastKnownTarget?: NavPoint;
  patrolIndex: number;
}

export function copyPoint(point: NavPoint | undefined): NavPoint | undefined {
  return point ? { x: point.x, y: point.y } : undefined;
}
