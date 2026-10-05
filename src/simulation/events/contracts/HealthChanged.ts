import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const HealthChangedType = 'combat.health.changed' as const;

export interface HealthChangedPayload extends JsonObject {
  entityId: number;
  previous: number;
  current: number;
  maximum: number;
}

export type HealthChangedEvent = SimulationEvent<HealthChangedPayload>;

export function createHealthChangedPayload(
  overrides: Partial<HealthChangedPayload> = {},
): HealthChangedPayload {
  return {
    entityId: 0,
    previous: 0,
    current: 0,
    maximum: 0,
    ...overrides,
  };
}

export function createHealthChangedDraft(
  payload: HealthChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<HealthChangedPayload> {
  if (!validateHealthChangedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.health.changed');
  }
  return {
    type: HealthChangedType,
    payload: cloneHealthChangedPayload(payload),
    metadata,
  };
}

export function isHealthChangedEvent(
  event: SimulationEvent,
): event is HealthChangedEvent {
  return event.type === HealthChangedType && validateHealthChangedPayload(event.payload);
}

export function validateHealthChangedPayload(
  value: unknown,
): value is HealthChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<HealthChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.previous === 'number' && Number.isFinite(payload.previous) &&
    typeof payload.current === 'number' && Number.isFinite(payload.current) &&
    typeof payload.maximum === 'number' && Number.isFinite(payload.maximum)
  );
}

export function cloneHealthChangedPayload(
  payload: HealthChangedPayload,
): HealthChangedPayload {
  return cloneJson(payload);
}

export function equalHealthChangedPayload(
  left: HealthChangedPayload,
  right: HealthChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.previous === right.previous &&
    left.current === right.current &&
    left.maximum === right.maximum
  );
}

export function serializeHealthChangedPayload(
  payload: HealthChangedPayload,
): string {
  if (!validateHealthChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.health.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeHealthChangedPayload(
  serialized: string,
): HealthChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateHealthChangedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.health.changed payload');
  }
  return cloneHealthChangedPayload(value);
}
