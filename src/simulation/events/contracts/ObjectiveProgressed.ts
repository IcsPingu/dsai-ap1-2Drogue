import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ObjectiveProgressedType = 'progression.objective.progressed' as const;

export interface ObjectiveProgressedPayload extends JsonObject {
  objectiveId: string;
  previous: number;
  current: number;
  target: number;
}

export type ObjectiveProgressedEvent = SimulationEvent<ObjectiveProgressedPayload>;

export function createObjectiveProgressedPayload(
  overrides: Partial<ObjectiveProgressedPayload> = {},
): ObjectiveProgressedPayload {
  return {
    objectiveId: '',
    previous: 0,
    current: 0,
    target: 0,
    ...overrides,
  };
}

export function createObjectiveProgressedDraft(
  payload: ObjectiveProgressedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ObjectiveProgressedPayload> {
  if (!validateObjectiveProgressedPayload(payload)) {
    throw new TypeError('Invalid payload for progression.objective.progressed');
  }
  return {
    type: ObjectiveProgressedType,
    payload: cloneObjectiveProgressedPayload(payload),
    metadata,
  };
}

export function isObjectiveProgressedEvent(
  event: SimulationEvent,
): event is ObjectiveProgressedEvent {
  return event.type === ObjectiveProgressedType && validateObjectiveProgressedPayload(event.payload);
}

export function validateObjectiveProgressedPayload(
  value: unknown,
): value is ObjectiveProgressedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ObjectiveProgressedPayload>;
  return (
    typeof payload.objectiveId === 'string' &&
    typeof payload.previous === 'number' && Number.isFinite(payload.previous) &&
    typeof payload.current === 'number' && Number.isFinite(payload.current) &&
    typeof payload.target === 'number' && Number.isFinite(payload.target)
  );
}

export function cloneObjectiveProgressedPayload(
  payload: ObjectiveProgressedPayload,
): ObjectiveProgressedPayload {
  return cloneJson(payload);
}

export function equalObjectiveProgressedPayload(
  left: ObjectiveProgressedPayload,
  right: ObjectiveProgressedPayload,
): boolean {
  return (
    left.objectiveId === right.objectiveId &&
    left.previous === right.previous &&
    left.current === right.current &&
    left.target === right.target
  );
}

export function serializeObjectiveProgressedPayload(
  payload: ObjectiveProgressedPayload,
): string {
  if (!validateObjectiveProgressedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid progression.objective.progressed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeObjectiveProgressedPayload(
  serialized: string,
): ObjectiveProgressedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateObjectiveProgressedPayload(value)) {
    throw new TypeError('Serialized value is not a progression.objective.progressed payload');
  }
  return cloneObjectiveProgressedPayload(value);
}
