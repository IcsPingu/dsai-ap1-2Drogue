import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const LevelGainedType = 'progression.level.gained' as const;

export interface LevelGainedPayload extends JsonObject {
  entityId: number;
  previousLevel: number;
  currentLevel: number;
  points: number;
}

export type LevelGainedEvent = SimulationEvent<LevelGainedPayload>;

export function createLevelGainedPayload(
  overrides: Partial<LevelGainedPayload> = {},
): LevelGainedPayload {
  return {
    entityId: 0,
    previousLevel: 0,
    currentLevel: 0,
    points: 0,
    ...overrides,
  };
}

export function createLevelGainedDraft(
  payload: LevelGainedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<LevelGainedPayload> {
  if (!validateLevelGainedPayload(payload)) {
    throw new TypeError('Invalid payload for progression.level.gained');
  }
  return {
    type: LevelGainedType,
    payload: cloneLevelGainedPayload(payload),
    metadata,
  };
}

export function isLevelGainedEvent(
  event: SimulationEvent,
): event is LevelGainedEvent {
  return event.type === LevelGainedType && validateLevelGainedPayload(event.payload);
}

export function validateLevelGainedPayload(
  value: unknown,
): value is LevelGainedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<LevelGainedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.previousLevel === 'number' && Number.isFinite(payload.previousLevel) &&
    typeof payload.currentLevel === 'number' && Number.isFinite(payload.currentLevel) &&
    typeof payload.points === 'number' && Number.isFinite(payload.points)
  );
}

export function cloneLevelGainedPayload(
  payload: LevelGainedPayload,
): LevelGainedPayload {
  return cloneJson(payload);
}

export function equalLevelGainedPayload(
  left: LevelGainedPayload,
  right: LevelGainedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.previousLevel === right.previousLevel &&
    left.currentLevel === right.currentLevel &&
    left.points === right.points
  );
}

export function serializeLevelGainedPayload(
  payload: LevelGainedPayload,
): string {
  if (!validateLevelGainedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid progression.level.gained payload');
  }
  return JSON.stringify(payload);
}

export function deserializeLevelGainedPayload(
  serialized: string,
): LevelGainedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateLevelGainedPayload(value)) {
    throw new TypeError('Serialized value is not a progression.level.gained payload');
  }
  return cloneLevelGainedPayload(value);
}
