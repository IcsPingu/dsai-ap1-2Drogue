import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const SystemFailedType = 'diagnostic.system.failed' as const;

export interface SystemFailedPayload extends JsonObject {
  systemId: string;
  phase: string;
  message: string;
  tick: number;
}

export type SystemFailedEvent = SimulationEvent<SystemFailedPayload>;

export function createSystemFailedPayload(
  overrides: Partial<SystemFailedPayload> = {},
): SystemFailedPayload {
  return {
    systemId: '',
    phase: '',
    message: '',
    tick: 0,
    ...overrides,
  };
}

export function createSystemFailedDraft(
  payload: SystemFailedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<SystemFailedPayload> {
  if (!validateSystemFailedPayload(payload)) {
    throw new TypeError('Invalid payload for diagnostic.system.failed');
  }
  return {
    type: SystemFailedType,
    payload: cloneSystemFailedPayload(payload),
    metadata,
  };
}

export function isSystemFailedEvent(
  event: SimulationEvent,
): event is SystemFailedEvent {
  return event.type === SystemFailedType && validateSystemFailedPayload(event.payload);
}

export function validateSystemFailedPayload(
  value: unknown,
): value is SystemFailedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<SystemFailedPayload>;
  return (
    typeof payload.systemId === 'string' &&
    typeof payload.phase === 'string' &&
    typeof payload.message === 'string' &&
    typeof payload.tick === 'number' && Number.isFinite(payload.tick)
  );
}

export function cloneSystemFailedPayload(
  payload: SystemFailedPayload,
): SystemFailedPayload {
  return cloneJson(payload);
}

export function equalSystemFailedPayload(
  left: SystemFailedPayload,
  right: SystemFailedPayload,
): boolean {
  return (
    left.systemId === right.systemId &&
    left.phase === right.phase &&
    left.message === right.message &&
    left.tick === right.tick
  );
}

export function serializeSystemFailedPayload(
  payload: SystemFailedPayload,
): string {
  if (!validateSystemFailedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid diagnostic.system.failed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeSystemFailedPayload(
  serialized: string,
): SystemFailedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateSystemFailedPayload(value)) {
    throw new TypeError('Serialized value is not a diagnostic.system.failed payload');
  }
  return cloneSystemFailedPayload(value);
}
