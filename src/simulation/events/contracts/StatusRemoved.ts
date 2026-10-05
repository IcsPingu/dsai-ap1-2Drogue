import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const StatusRemovedType = 'status.removed' as const;

export interface StatusRemovedPayload extends JsonObject {
  entityId: number;
  statusId: string;
  reason: string;
}

export type StatusRemovedEvent = SimulationEvent<StatusRemovedPayload>;

export function createStatusRemovedPayload(
  overrides: Partial<StatusRemovedPayload> = {},
): StatusRemovedPayload {
  return {
    entityId: 0,
    statusId: '',
    reason: '',
    ...overrides,
  };
}

export function createStatusRemovedDraft(
  payload: StatusRemovedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<StatusRemovedPayload> {
  if (!validateStatusRemovedPayload(payload)) {
    throw new TypeError('Invalid payload for status.removed');
  }
  return {
    type: StatusRemovedType,
    payload: cloneStatusRemovedPayload(payload),
    metadata,
  };
}

export function isStatusRemovedEvent(
  event: SimulationEvent,
): event is StatusRemovedEvent {
  return event.type === StatusRemovedType && validateStatusRemovedPayload(event.payload);
}

export function validateStatusRemovedPayload(
  value: unknown,
): value is StatusRemovedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<StatusRemovedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.statusId === 'string' &&
    typeof payload.reason === 'string'
  );
}

export function cloneStatusRemovedPayload(
  payload: StatusRemovedPayload,
): StatusRemovedPayload {
  return cloneJson(payload);
}

export function equalStatusRemovedPayload(
  left: StatusRemovedPayload,
  right: StatusRemovedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.statusId === right.statusId &&
    left.reason === right.reason
  );
}

export function serializeStatusRemovedPayload(
  payload: StatusRemovedPayload,
): string {
  if (!validateStatusRemovedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid status.removed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeStatusRemovedPayload(
  serialized: string,
): StatusRemovedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateStatusRemovedPayload(value)) {
    throw new TypeError('Serialized value is not a status.removed payload');
  }
  return cloneStatusRemovedPayload(value);
}
