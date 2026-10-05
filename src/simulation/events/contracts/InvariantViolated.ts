import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const InvariantViolatedType = 'diagnostic.invariant.violated' as const;

export interface InvariantViolatedPayload extends JsonObject {
  invariant: string;
  message: string;
  entityId: number;
  fatal: boolean;
}

export type InvariantViolatedEvent = SimulationEvent<InvariantViolatedPayload>;

export function createInvariantViolatedPayload(
  overrides: Partial<InvariantViolatedPayload> = {},
): InvariantViolatedPayload {
  return {
    invariant: '',
    message: '',
    entityId: 0,
    fatal: false,
    ...overrides,
  };
}

export function createInvariantViolatedDraft(
  payload: InvariantViolatedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<InvariantViolatedPayload> {
  if (!validateInvariantViolatedPayload(payload)) {
    throw new TypeError('Invalid payload for diagnostic.invariant.violated');
  }
  return {
    type: InvariantViolatedType,
    payload: cloneInvariantViolatedPayload(payload),
    metadata,
  };
}

export function isInvariantViolatedEvent(
  event: SimulationEvent,
): event is InvariantViolatedEvent {
  return event.type === InvariantViolatedType && validateInvariantViolatedPayload(event.payload);
}

export function validateInvariantViolatedPayload(
  value: unknown,
): value is InvariantViolatedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<InvariantViolatedPayload>;
  return (
    typeof payload.invariant === 'string' &&
    typeof payload.message === 'string' &&
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.fatal === 'boolean'
  );
}

export function cloneInvariantViolatedPayload(
  payload: InvariantViolatedPayload,
): InvariantViolatedPayload {
  return cloneJson(payload);
}

export function equalInvariantViolatedPayload(
  left: InvariantViolatedPayload,
  right: InvariantViolatedPayload,
): boolean {
  return (
    left.invariant === right.invariant &&
    left.message === right.message &&
    left.entityId === right.entityId &&
    left.fatal === right.fatal
  );
}

export function serializeInvariantViolatedPayload(
  payload: InvariantViolatedPayload,
): string {
  if (!validateInvariantViolatedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid diagnostic.invariant.violated payload');
  }
  return JSON.stringify(payload);
}

export function deserializeInvariantViolatedPayload(
  serialized: string,
): InvariantViolatedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateInvariantViolatedPayload(value)) {
    throw new TypeError('Serialized value is not a diagnostic.invariant.violated payload');
  }
  return cloneInvariantViolatedPayload(value);
}
