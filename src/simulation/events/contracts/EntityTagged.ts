import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EntityTaggedType = 'entity.tagged' as const;

export interface EntityTaggedPayload extends JsonObject {
  entityId: number;
  tag: string;
}

export type EntityTaggedEvent = SimulationEvent<EntityTaggedPayload>;

export function createEntityTaggedPayload(
  overrides: Partial<EntityTaggedPayload> = {},
): EntityTaggedPayload {
  return {
    entityId: 0,
    tag: '',
    ...overrides,
  };
}

export function createEntityTaggedDraft(
  payload: EntityTaggedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EntityTaggedPayload> {
  if (!validateEntityTaggedPayload(payload)) {
    throw new TypeError('Invalid payload for entity.tagged');
  }
  return {
    type: EntityTaggedType,
    payload: cloneEntityTaggedPayload(payload),
    metadata,
  };
}

export function isEntityTaggedEvent(
  event: SimulationEvent,
): event is EntityTaggedEvent {
  return event.type === EntityTaggedType && validateEntityTaggedPayload(event.payload);
}

export function validateEntityTaggedPayload(
  value: unknown,
): value is EntityTaggedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EntityTaggedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.tag === 'string'
  );
}

export function cloneEntityTaggedPayload(
  payload: EntityTaggedPayload,
): EntityTaggedPayload {
  return cloneJson(payload);
}

export function equalEntityTaggedPayload(
  left: EntityTaggedPayload,
  right: EntityTaggedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.tag === right.tag
  );
}

export function serializeEntityTaggedPayload(
  payload: EntityTaggedPayload,
): string {
  if (!validateEntityTaggedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid entity.tagged payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEntityTaggedPayload(
  serialized: string,
): EntityTaggedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEntityTaggedPayload(value)) {
    throw new TypeError('Serialized value is not a entity.tagged payload');
  }
  return cloneEntityTaggedPayload(value);
}
