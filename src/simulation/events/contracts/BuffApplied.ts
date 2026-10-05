import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const BuffAppliedType = 'status.buff.applied' as const;

export interface BuffAppliedPayload extends JsonObject {
  entityId: number;
  attribute: string;
  amount: number;
  duration: number;
}

export type BuffAppliedEvent = SimulationEvent<BuffAppliedPayload>;

export function createBuffAppliedPayload(
  overrides: Partial<BuffAppliedPayload> = {},
): BuffAppliedPayload {
  return {
    entityId: 0,
    attribute: '',
    amount: 0,
    duration: 0,
    ...overrides,
  };
}

export function createBuffAppliedDraft(
  payload: BuffAppliedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<BuffAppliedPayload> {
  if (!validateBuffAppliedPayload(payload)) {
    throw new TypeError('Invalid payload for status.buff.applied');
  }
  return {
    type: BuffAppliedType,
    payload: cloneBuffAppliedPayload(payload),
    metadata,
  };
}

export function isBuffAppliedEvent(
  event: SimulationEvent,
): event is BuffAppliedEvent {
  return event.type === BuffAppliedType && validateBuffAppliedPayload(event.payload);
}

export function validateBuffAppliedPayload(
  value: unknown,
): value is BuffAppliedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<BuffAppliedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.attribute === 'string' &&
    typeof payload.amount === 'number' && Number.isFinite(payload.amount) &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneBuffAppliedPayload(
  payload: BuffAppliedPayload,
): BuffAppliedPayload {
  return cloneJson(payload);
}

export function equalBuffAppliedPayload(
  left: BuffAppliedPayload,
  right: BuffAppliedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.attribute === right.attribute &&
    left.amount === right.amount &&
    left.duration === right.duration
  );
}

export function serializeBuffAppliedPayload(
  payload: BuffAppliedPayload,
): string {
  if (!validateBuffAppliedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid status.buff.applied payload');
  }
  return JSON.stringify(payload);
}

export function deserializeBuffAppliedPayload(
  serialized: string,
): BuffAppliedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateBuffAppliedPayload(value)) {
    throw new TypeError('Serialized value is not a status.buff.applied payload');
  }
  return cloneBuffAppliedPayload(value);
}
