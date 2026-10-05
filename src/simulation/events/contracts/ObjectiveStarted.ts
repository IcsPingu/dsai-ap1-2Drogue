import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ObjectiveStartedType = 'progression.objective.started' as const;

export interface ObjectiveStartedPayload extends JsonObject {
  objectiveId: string;
  description: string;
  target: number;
}

export type ObjectiveStartedEvent = SimulationEvent<ObjectiveStartedPayload>;

export function createObjectiveStartedPayload(
  overrides: Partial<ObjectiveStartedPayload> = {},
): ObjectiveStartedPayload {
  return {
    objectiveId: '',
    description: '',
    target: 0,
    ...overrides,
  };
}

export function createObjectiveStartedDraft(
  payload: ObjectiveStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ObjectiveStartedPayload> {
  if (!validateObjectiveStartedPayload(payload)) {
    throw new TypeError('Invalid payload for progression.objective.started');
  }
  return {
    type: ObjectiveStartedType,
    payload: cloneObjectiveStartedPayload(payload),
    metadata,
  };
}

export function isObjectiveStartedEvent(
  event: SimulationEvent,
): event is ObjectiveStartedEvent {
  return event.type === ObjectiveStartedType && validateObjectiveStartedPayload(event.payload);
}

export function validateObjectiveStartedPayload(
  value: unknown,
): value is ObjectiveStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ObjectiveStartedPayload>;
  return (
    typeof payload.objectiveId === 'string' &&
    typeof payload.description === 'string' &&
    typeof payload.target === 'number' && Number.isFinite(payload.target)
  );
}

export function cloneObjectiveStartedPayload(
  payload: ObjectiveStartedPayload,
): ObjectiveStartedPayload {
  return cloneJson(payload);
}

export function equalObjectiveStartedPayload(
  left: ObjectiveStartedPayload,
  right: ObjectiveStartedPayload,
): boolean {
  return (
    left.objectiveId === right.objectiveId &&
    left.description === right.description &&
    left.target === right.target
  );
}

export function serializeObjectiveStartedPayload(
  payload: ObjectiveStartedPayload,
): string {
  if (!validateObjectiveStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid progression.objective.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeObjectiveStartedPayload(
  serialized: string,
): ObjectiveStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateObjectiveStartedPayload(value)) {
    throw new TypeError('Serialized value is not a progression.objective.started payload');
  }
  return cloneObjectiveStartedPayload(value);
}
