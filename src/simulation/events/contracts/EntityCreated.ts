import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EntityCreatedType = 'entity.created' as const;

export interface EntityCreatedPayload extends JsonObject {
  entityId: number;
  archetype: string;
  tags: string[];
}

export type EntityCreatedEvent = SimulationEvent<EntityCreatedPayload>;

export function createEntityCreatedPayload(
  overrides: Partial<EntityCreatedPayload> = {},
): EntityCreatedPayload {
  return {
    entityId: 0,
    archetype: '',
    tags: [],
    ...overrides,
  };
}

export function createEntityCreatedDraft(
  payload: EntityCreatedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EntityCreatedPayload> {
  if (!validateEntityCreatedPayload(payload)) {
    throw new TypeError('Invalid payload for entity.created');
  }
  return {
    type: EntityCreatedType,
    payload: cloneEntityCreatedPayload(payload),
    metadata,
  };
}

export function isEntityCreatedEvent(
  event: SimulationEvent,
): event is EntityCreatedEvent {
  return event.type === EntityCreatedType && validateEntityCreatedPayload(event.payload);
}

export function validateEntityCreatedPayload(
  value: unknown,
): value is EntityCreatedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EntityCreatedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.archetype === 'string' &&
    Array.isArray(payload.tags) && payload.tags.every(value => typeof value === 'string')
  );
}

export function cloneEntityCreatedPayload(
  payload: EntityCreatedPayload,
): EntityCreatedPayload {
  return cloneJson(payload);
}

export function equalEntityCreatedPayload(
  left: EntityCreatedPayload,
  right: EntityCreatedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.archetype === right.archetype &&
    JSON.stringify(left.tags) === JSON.stringify(right.tags)
  );
}

export function serializeEntityCreatedPayload(
  payload: EntityCreatedPayload,
): string {
  if (!validateEntityCreatedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid entity.created payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEntityCreatedPayload(
  serialized: string,
): EntityCreatedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEntityCreatedPayload(value)) {
    throw new TypeError('Serialized value is not a entity.created payload');
  }
  return cloneEntityCreatedPayload(value);
}
