import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DebuffAppliedType = 'status.debuff.applied' as const;

export interface DebuffAppliedPayload extends JsonObject {
  entityId: number;
  attribute: string;
  amount: number;
  duration: number;
}

export type DebuffAppliedEvent = SimulationEvent<DebuffAppliedPayload>;

export function createDebuffAppliedPayload(
  overrides: Partial<DebuffAppliedPayload> = {},
): DebuffAppliedPayload {
  return {
    entityId: 0,
    attribute: '',
    amount: 0,
    duration: 0,
    ...overrides,
  };
}

export function createDebuffAppliedDraft(
  payload: DebuffAppliedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DebuffAppliedPayload> {
  if (!validateDebuffAppliedPayload(payload)) {
    throw new TypeError('Invalid payload for status.debuff.applied');
  }
  return {
    type: DebuffAppliedType,
    payload: cloneDebuffAppliedPayload(payload),
    metadata,
  };
}

export function isDebuffAppliedEvent(
  event: SimulationEvent,
): event is DebuffAppliedEvent {
  return event.type === DebuffAppliedType && validateDebuffAppliedPayload(event.payload);
}

export function validateDebuffAppliedPayload(
  value: unknown,
): value is DebuffAppliedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DebuffAppliedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.attribute === 'string' &&
    typeof payload.amount === 'number' && Number.isFinite(payload.amount) &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneDebuffAppliedPayload(
  payload: DebuffAppliedPayload,
): DebuffAppliedPayload {
  return cloneJson(payload);
}

export function equalDebuffAppliedPayload(
  left: DebuffAppliedPayload,
  right: DebuffAppliedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.attribute === right.attribute &&
    left.amount === right.amount &&
    left.duration === right.duration
  );
}

export function serializeDebuffAppliedPayload(
  payload: DebuffAppliedPayload,
): string {
  if (!validateDebuffAppliedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid status.debuff.applied payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDebuffAppliedPayload(
  serialized: string,
): DebuffAppliedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDebuffAppliedPayload(value)) {
    throw new TypeError('Serialized value is not a status.debuff.applied payload');
  }
  return cloneDebuffAppliedPayload(value);
}
