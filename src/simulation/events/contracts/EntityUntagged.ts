import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EntityUntaggedType = 'entity.untagged' as const;

export interface EntityUntaggedPayload extends JsonObject {
  entityId: number;
  tag: string;
}

export type EntityUntaggedEvent = SimulationEvent<EntityUntaggedPayload>;

export function createEntityUntaggedPayload(
  overrides: Partial<EntityUntaggedPayload> = {},
): EntityUntaggedPayload {
  return {
    entityId: 0,
    tag: '',
    ...overrides,
  };
}

export function createEntityUntaggedDraft(
  payload: EntityUntaggedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EntityUntaggedPayload> {
  if (!validateEntityUntaggedPayload(payload)) {
    throw new TypeError('Invalid payload for entity.untagged');
  }
  return {
    type: EntityUntaggedType,
    payload: cloneEntityUntaggedPayload(payload),
    metadata,
  };
}

export function isEntityUntaggedEvent(
  event: SimulationEvent,
): event is EntityUntaggedEvent {
  return event.type === EntityUntaggedType && validateEntityUntaggedPayload(event.payload);
}

export function validateEntityUntaggedPayload(
  value: unknown,
): value is EntityUntaggedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EntityUntaggedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.tag === 'string'
  );
}

export function cloneEntityUntaggedPayload(
  payload: EntityUntaggedPayload,
): EntityUntaggedPayload {
  return cloneJson(payload);
}

export function equalEntityUntaggedPayload(
  left: EntityUntaggedPayload,
  right: EntityUntaggedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.tag === right.tag
  );
}

export function serializeEntityUntaggedPayload(
  payload: EntityUntaggedPayload,
): string {
  if (!validateEntityUntaggedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid entity.untagged payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEntityUntaggedPayload(
  serialized: string,
): EntityUntaggedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEntityUntaggedPayload(value)) {
    throw new TypeError('Serialized value is not a entity.untagged payload');
  }
  return cloneEntityUntaggedPayload(value);
}
