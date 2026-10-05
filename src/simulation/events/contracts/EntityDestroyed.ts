import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EntityDestroyedType = 'entity.destroyed' as const;

export interface EntityDestroyedPayload extends JsonObject {
  entityId: number;
  reason: string;
  killerId: number;
}

export type EntityDestroyedEvent = SimulationEvent<EntityDestroyedPayload>;

export function createEntityDestroyedPayload(
  overrides: Partial<EntityDestroyedPayload> = {},
): EntityDestroyedPayload {
  return {
    entityId: 0,
    reason: '',
    killerId: 0,
    ...overrides,
  };
}

export function createEntityDestroyedDraft(
  payload: EntityDestroyedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EntityDestroyedPayload> {
  if (!validateEntityDestroyedPayload(payload)) {
    throw new TypeError('Invalid payload for entity.destroyed');
  }
  return {
    type: EntityDestroyedType,
    payload: cloneEntityDestroyedPayload(payload),
    metadata,
  };
}

export function isEntityDestroyedEvent(
  event: SimulationEvent,
): event is EntityDestroyedEvent {
  return event.type === EntityDestroyedType && validateEntityDestroyedPayload(event.payload);
}

export function validateEntityDestroyedPayload(
  value: unknown,
): value is EntityDestroyedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EntityDestroyedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.reason === 'string' &&
    typeof payload.killerId === 'number' && Number.isFinite(payload.killerId)
  );
}

export function cloneEntityDestroyedPayload(
  payload: EntityDestroyedPayload,
): EntityDestroyedPayload {
  return cloneJson(payload);
}

export function equalEntityDestroyedPayload(
  left: EntityDestroyedPayload,
  right: EntityDestroyedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.reason === right.reason &&
    left.killerId === right.killerId
  );
}

export function serializeEntityDestroyedPayload(
  payload: EntityDestroyedPayload,
): string {
  if (!validateEntityDestroyedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid entity.destroyed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEntityDestroyedPayload(
  serialized: string,
): EntityDestroyedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEntityDestroyedPayload(value)) {
    throw new TypeError('Serialized value is not a entity.destroyed payload');
  }
  return cloneEntityDestroyedPayload(value);
}
