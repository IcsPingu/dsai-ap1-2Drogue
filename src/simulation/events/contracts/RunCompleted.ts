import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const RunCompletedType = 'progression.run.completed' as const;

export interface RunCompletedPayload extends JsonObject {
  result: string;
  score: number;
  duration: number;
  roomsCleared: number;
}

export type RunCompletedEvent = SimulationEvent<RunCompletedPayload>;

export function createRunCompletedPayload(
  overrides: Partial<RunCompletedPayload> = {},
): RunCompletedPayload {
  return {
    result: '',
    score: 0,
    duration: 0,
    roomsCleared: 0,
    ...overrides,
  };
}

export function createRunCompletedDraft(
  payload: RunCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<RunCompletedPayload> {
  if (!validateRunCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for progression.run.completed');
  }
  return {
    type: RunCompletedType,
    payload: cloneRunCompletedPayload(payload),
    metadata,
  };
}

export function isRunCompletedEvent(
  event: SimulationEvent,
): event is RunCompletedEvent {
  return event.type === RunCompletedType && validateRunCompletedPayload(event.payload);
}

export function validateRunCompletedPayload(
  value: unknown,
): value is RunCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<RunCompletedPayload>;
  return (
    typeof payload.result === 'string' &&
    typeof payload.score === 'number' && Number.isFinite(payload.score) &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration) &&
    typeof payload.roomsCleared === 'number' && Number.isFinite(payload.roomsCleared)
  );
}

export function cloneRunCompletedPayload(
  payload: RunCompletedPayload,
): RunCompletedPayload {
  return cloneJson(payload);
}

export function equalRunCompletedPayload(
  left: RunCompletedPayload,
  right: RunCompletedPayload,
): boolean {
  return (
    left.result === right.result &&
    left.score === right.score &&
    left.duration === right.duration &&
    left.roomsCleared === right.roomsCleared
  );
}

export function serializeRunCompletedPayload(
  payload: RunCompletedPayload,
): string {
  if (!validateRunCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid progression.run.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeRunCompletedPayload(
  serialized: string,
): RunCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateRunCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a progression.run.completed payload');
  }
  return cloneRunCompletedPayload(value);
}
