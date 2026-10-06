import { EnemyBehaviorProfile, EnemyRole } from './types';

const PROFILES: Record<EnemyRole, EnemyBehaviorProfile> = {
  melee: {
    role: 'melee',
    sightRange: 540,
    hearingRange: 250,
    loseSightDelay: 650,
    memoryDuration: 4400,
    alertDuration: 180,
    searchDuration: 2600,
    patrolWait: 550,
    attackMinimumRange: 36,
    attackMaximumRange: 155,
    preferredRange: 82,
    retreatRange: 0,
    leashRange: 880,
    aggression: 0.9,
  },
  ranged: {
    role: 'ranged',
    sightRange: 650,
    hearingRange: 310,
    loseSightDelay: 900,
    memoryDuration: 5600,
    alertDuration: 240,
    searchDuration: 3200,
    patrolWait: 700,
    attackMinimumRange: 175,
    attackMaximumRange: 390,
    preferredRange: 275,
    retreatRange: 165,
    leashRange: 1000,
    aggression: 0.76,
  },
  boss: {
    role: 'boss',
    sightRange: 900,
    hearingRange: 700,
    loseSightDelay: 1200,
    memoryDuration: 8000,
    alertDuration: 80,
    searchDuration: 1800,
    patrolWait: 250,
    attackMinimumRange: 45,
    attackMaximumRange: 185,
    preferredRange: 105,
    retreatRange: 0,
    leashRange: 1600,
    aggression: 1,
  },
};

export function behaviorProfile(role: EnemyRole, overrides: Partial<EnemyBehaviorProfile> = {}): EnemyBehaviorProfile {
  return { ...PROFILES[role], ...overrides, role };
}
