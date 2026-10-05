import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const AchievementUnlockedType = 'progression.achievement.unlocked' as const;

export interface AchievementUnlockedPayload extends JsonObject {
  achievementId: string;
  entityId: number;
  title: string;
}

export type AchievementUnlockedEvent = SimulationEvent<AchievementUnlockedPayload>;

export function createAchievementUnlockedPayload(
  overrides: Partial<AchievementUnlockedPayload> = {},
): AchievementUnlockedPayload {
  return {
    achievementId: '',
    entityId: 0,
    title: '',
    ...overrides,
  };
}

export function createAchievementUnlockedDraft(
  payload: AchievementUnlockedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<AchievementUnlockedPayload> {
  if (!validateAchievementUnlockedPayload(payload)) {
    throw new TypeError('Invalid payload for progression.achievement.unlocked');
  }
  return {
    type: AchievementUnlockedType,
    payload: cloneAchievementUnlockedPayload(payload),
    metadata,
  };
}

export function isAchievementUnlockedEvent(
  event: SimulationEvent,
): event is AchievementUnlockedEvent {
  return event.type === AchievementUnlockedType && validateAchievementUnlockedPayload(event.payload);
}

export function validateAchievementUnlockedPayload(
  value: unknown,
): value is AchievementUnlockedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<AchievementUnlockedPayload>;
  return (
    typeof payload.achievementId === 'string' &&
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.title === 'string'
  );
}

export function cloneAchievementUnlockedPayload(
  payload: AchievementUnlockedPayload,
): AchievementUnlockedPayload {
  return cloneJson(payload);
}

export function equalAchievementUnlockedPayload(
  left: AchievementUnlockedPayload,
  right: AchievementUnlockedPayload,
): boolean {
  return (
    left.achievementId === right.achievementId &&
    left.entityId === right.entityId &&
    left.title === right.title
  );
}

export function serializeAchievementUnlockedPayload(
  payload: AchievementUnlockedPayload,
): string {
  if (!validateAchievementUnlockedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid progression.achievement.unlocked payload');
  }
  return JSON.stringify(payload);
}

export function deserializeAchievementUnlockedPayload(
  serialized: string,
): AchievementUnlockedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateAchievementUnlockedPayload(value)) {
    throw new TypeError('Serialized value is not a progression.achievement.unlocked payload');
  }
  return cloneAchievementUnlockedPayload(value);
}
