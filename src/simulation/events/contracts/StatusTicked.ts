import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const StatusTickedType = 'status.ticked' as const;

export interface StatusTickedPayload extends JsonObject {
  entityId: number;
  statusId: string;
  stacks: number;
  remaining: number;
}

export type StatusTickedEvent = SimulationEvent<StatusTickedPayload>;

export function createStatusTickedPayload(
  overrides: Partial<StatusTickedPayload> = {},
): StatusTickedPayload {
  return {
    entityId: 0,
    statusId: '',
    stacks: 0,
    remaining: 0,
    ...overrides,
  };
}

export function createStatusTickedDraft(
  payload: StatusTickedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<StatusTickedPayload> {
  if (!validateStatusTickedPayload(payload)) {
    throw new TypeError('Invalid payload for status.ticked');
  }
  return {
    type: StatusTickedType,
    payload: cloneStatusTickedPayload(payload),
    metadata,
  };
}

export function isStatusTickedEvent(
  event: SimulationEvent,
): event is StatusTickedEvent {
  return event.type === StatusTickedType && validateStatusTickedPayload(event.payload);
}

export function validateStatusTickedPayload(
  value: unknown,
): value is StatusTickedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<StatusTickedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.statusId === 'string' &&
    typeof payload.stacks === 'number' && Number.isFinite(payload.stacks) &&
    typeof payload.remaining === 'number' && Number.isFinite(payload.remaining)
  );
}

export function cloneStatusTickedPayload(
  payload: StatusTickedPayload,
): StatusTickedPayload {
  return cloneJson(payload);
}

export function equalStatusTickedPayload(
  left: StatusTickedPayload,
  right: StatusTickedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.statusId === right.statusId &&
    left.stacks === right.stacks &&
    left.remaining === right.remaining
  );
}

export function serializeStatusTickedPayload(
  payload: StatusTickedPayload,
): string {
  if (!validateStatusTickedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid status.ticked payload');
  }
  return JSON.stringify(payload);
}

export function deserializeStatusTickedPayload(
  serialized: string,
): StatusTickedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateStatusTickedPayload(value)) {
    throw new TypeError('Serialized value is not a status.ticked payload');
  }
  return cloneStatusTickedPayload(value);
}
