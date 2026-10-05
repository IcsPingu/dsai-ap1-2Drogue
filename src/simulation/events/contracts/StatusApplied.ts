import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const StatusAppliedType = 'status.applied' as const;

export interface StatusAppliedPayload extends JsonObject {
  entityId: number;
  statusId: string;
  stacks: number;
  duration: number;
}

export type StatusAppliedEvent = SimulationEvent<StatusAppliedPayload>;

export function createStatusAppliedPayload(
  overrides: Partial<StatusAppliedPayload> = {},
): StatusAppliedPayload {
  return {
    entityId: 0,
    statusId: '',
    stacks: 0,
    duration: 0,
    ...overrides,
  };
}

export function createStatusAppliedDraft(
  payload: StatusAppliedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<StatusAppliedPayload> {
  if (!validateStatusAppliedPayload(payload)) {
    throw new TypeError('Invalid payload for status.applied');
  }
  return {
    type: StatusAppliedType,
    payload: cloneStatusAppliedPayload(payload),
    metadata,
  };
}

export function isStatusAppliedEvent(
  event: SimulationEvent,
): event is StatusAppliedEvent {
  return event.type === StatusAppliedType && validateStatusAppliedPayload(event.payload);
}

export function validateStatusAppliedPayload(
  value: unknown,
): value is StatusAppliedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<StatusAppliedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.statusId === 'string' &&
    typeof payload.stacks === 'number' && Number.isFinite(payload.stacks) &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneStatusAppliedPayload(
  payload: StatusAppliedPayload,
): StatusAppliedPayload {
  return cloneJson(payload);
}

export function equalStatusAppliedPayload(
  left: StatusAppliedPayload,
  right: StatusAppliedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.statusId === right.statusId &&
    left.stacks === right.stacks &&
    left.duration === right.duration
  );
}

export function serializeStatusAppliedPayload(
  payload: StatusAppliedPayload,
): string {
  if (!validateStatusAppliedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid status.applied payload');
  }
  return JSON.stringify(payload);
}

export function deserializeStatusAppliedPayload(
  serialized: string,
): StatusAppliedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateStatusAppliedPayload(value)) {
    throw new TypeError('Serialized value is not a status.applied payload');
  }
  return cloneStatusAppliedPayload(value);
}
