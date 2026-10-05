import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ShieldChangedType = 'combat.shield.changed' as const;

export interface ShieldChangedPayload extends JsonObject {
  entityId: number;
  previous: number;
  current: number;
  source: string;
}

export type ShieldChangedEvent = SimulationEvent<ShieldChangedPayload>;

export function createShieldChangedPayload(
  overrides: Partial<ShieldChangedPayload> = {},
): ShieldChangedPayload {
  return {
    entityId: 0,
    previous: 0,
    current: 0,
    source: '',
    ...overrides,
  };
}

export function createShieldChangedDraft(
  payload: ShieldChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ShieldChangedPayload> {
  if (!validateShieldChangedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.shield.changed');
  }
  return {
    type: ShieldChangedType,
    payload: cloneShieldChangedPayload(payload),
    metadata,
  };
}

export function isShieldChangedEvent(
  event: SimulationEvent,
): event is ShieldChangedEvent {
  return event.type === ShieldChangedType && validateShieldChangedPayload(event.payload);
}

export function validateShieldChangedPayload(
  value: unknown,
): value is ShieldChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ShieldChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.previous === 'number' && Number.isFinite(payload.previous) &&
    typeof payload.current === 'number' && Number.isFinite(payload.current) &&
    typeof payload.source === 'string'
  );
}

export function cloneShieldChangedPayload(
  payload: ShieldChangedPayload,
): ShieldChangedPayload {
  return cloneJson(payload);
}

export function equalShieldChangedPayload(
  left: ShieldChangedPayload,
  right: ShieldChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.previous === right.previous &&
    left.current === right.current &&
    left.source === right.source
  );
}

export function serializeShieldChangedPayload(
  payload: ShieldChangedPayload,
): string {
  if (!validateShieldChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.shield.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeShieldChangedPayload(
  serialized: string,
): ShieldChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateShieldChangedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.shield.changed payload');
  }
  return cloneShieldChangedPayload(value);
}
