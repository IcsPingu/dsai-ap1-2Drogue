import { NavPoint, distance, normalize } from '../navigation';
import { EnemyBehaviorProfile, PerceptionResult } from './types';

export interface PerceptionInput {
  observer: NavPoint;
  target: NavPoint;
  facing?: NavPoint;
  lineOfSight: boolean;
  targetNoise?: number;
}

export class EnemyPerception {
  public constructor(private profile: EnemyBehaviorProfile) {}

  public setProfile(profile: EnemyBehaviorProfile): void {
    this.profile = profile;
  }

  public sense(input: PerceptionInput): PerceptionResult {
    const targetDistance = distance(input.observer, input.target);
    const facingFactor = this.facingFactor(input.observer, input.target, input.facing);
    const effectiveSight = this.profile.sightRange * facingFactor;
    const noise = Math.max(0.25, input.targetNoise ?? 1);
    return {
      distance: targetDistance,
      visible: input.lineOfSight && targetDistance <= effectiveSight,
      audible: targetDistance <= this.profile.hearingRange * noise,
    };
  }

  private facingFactor(observer: NavPoint, target: NavPoint, facing?: NavPoint): number {
    if (!facing || (facing.x === 0 && facing.y === 0)) return 1;
    const direction = normalize({ x: target.x - observer.x, y: target.y - observer.y });
    const normalizedFacing = normalize(facing);
    const dot = direction.x * normalizedFacing.x + direction.y * normalizedFacing.y;
    // Peripheral vision never disappears entirely. This prevents stationary
    // enemies from becoming blind while still rewarding flanking.
    return dot >= 0.15 ? 1 : dot >= -0.45 ? 0.72 : 0.48;
  }
}
