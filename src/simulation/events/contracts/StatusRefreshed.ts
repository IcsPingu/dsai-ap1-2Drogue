import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const StatusRefreshedType = 'status.refreshed' as const;

export interface StatusRefreshedPayload extends JsonObject {
  entityId: number;
  statusId: string;
  stacks: number;
  duration: number;
}

export type StatusRefreshedEvent = SimulationEvent<StatusRefreshedPayload>;

export function createStatusRefreshedPayload(
  overrides: Partial<StatusRefreshedPayload> = {},
): StatusRefreshedPayload {
  return {
    entityId: 0,
    statusId: '',
    stacks: 0,
    duration: 0,
    ...overrides,
  };
}

export function createStatusRefreshedDraft(
  payload: StatusRefreshedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<StatusRefreshedPayload> {
  if (!validateStatusRefreshedPayload(payload)) {
    throw new TypeError('Invalid payload for status.refreshed');
  }
  return {
    type: StatusRefreshedType,
    payload: cloneStatusRefreshedPayload(payload),
    metadata,
  };
}

export function isStatusRefreshedEvent(
  event: SimulationEvent,
): event is StatusRefreshedEvent {
  return event.type === StatusRefreshedType && validateStatusRefreshedPayload(event.payload);
}

export function validateStatusRefreshedPayload(
  value: unknown,
): value is StatusRefreshedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<StatusRefreshedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.statusId === 'string' &&
    typeof payload.stacks === 'number' && Number.isFinite(payload.stacks) &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneStatusRefreshedPayload(
  payload: StatusRefreshedPayload,
): StatusRefreshedPayload {
  return cloneJson(payload);
}

export function equalStatusRefreshedPayload(
  left: StatusRefreshedPayload,
  right: StatusRefreshedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.statusId === right.statusId &&
    left.stacks === right.stacks &&
    left.duration === right.duration
  );
}

export function serializeStatusRefreshedPayload(
  payload: StatusRefreshedPayload,
): string {
  if (!validateStatusRefreshedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid status.refreshed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeStatusRefreshedPayload(
  serialized: string,
): StatusRefreshedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateStatusRefreshedPayload(value)) {
    throw new TypeError('Serialized value is not a status.refreshed payload');
  }
  return cloneStatusRefreshedPayload(value);
}
