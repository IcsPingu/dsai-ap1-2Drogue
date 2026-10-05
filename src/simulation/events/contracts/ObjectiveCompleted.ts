import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ObjectiveCompletedType = 'progression.objective.completed' as const;

export interface ObjectiveCompletedPayload extends JsonObject {
  objectiveId: string;
  rewardId: string;
  score: number;
}

export type ObjectiveCompletedEvent = SimulationEvent<ObjectiveCompletedPayload>;

export function createObjectiveCompletedPayload(
  overrides: Partial<ObjectiveCompletedPayload> = {},
): ObjectiveCompletedPayload {
  return {
    objectiveId: '',
    rewardId: '',
    score: 0,
    ...overrides,
  };
}

export function createObjectiveCompletedDraft(
  payload: ObjectiveCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ObjectiveCompletedPayload> {
  if (!validateObjectiveCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for progression.objective.completed');
  }
  return {
    type: ObjectiveCompletedType,
    payload: cloneObjectiveCompletedPayload(payload),
    metadata,
  };
}

export function isObjectiveCompletedEvent(
  event: SimulationEvent,
): event is ObjectiveCompletedEvent {
  return event.type === ObjectiveCompletedType && validateObjectiveCompletedPayload(event.payload);
}

export function validateObjectiveCompletedPayload(
  value: unknown,
): value is ObjectiveCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ObjectiveCompletedPayload>;
  return (
    typeof payload.objectiveId === 'string' &&
    typeof payload.rewardId === 'string' &&
    typeof payload.score === 'number' && Number.isFinite(payload.score)
  );
}

export function cloneObjectiveCompletedPayload(
  payload: ObjectiveCompletedPayload,
): ObjectiveCompletedPayload {
  return cloneJson(payload);
}

export function equalObjectiveCompletedPayload(
  left: ObjectiveCompletedPayload,
  right: ObjectiveCompletedPayload,
): boolean {
  return (
    left.objectiveId === right.objectiveId &&
    left.rewardId === right.rewardId &&
    left.score === right.score
  );
}

export function serializeObjectiveCompletedPayload(
  payload: ObjectiveCompletedPayload,
): string {
  if (!validateObjectiveCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid progression.objective.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeObjectiveCompletedPayload(
  serialized: string,
): ObjectiveCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateObjectiveCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a progression.objective.completed payload');
  }
  return cloneObjectiveCompletedPayload(value);
}
