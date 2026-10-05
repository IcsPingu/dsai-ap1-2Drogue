import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EntityDisabledType = 'entity.disabled' as const;

export interface EntityDisabledPayload extends JsonObject {
  entityId: number;
  source: string;
}

export type EntityDisabledEvent = SimulationEvent<EntityDisabledPayload>;

export function createEntityDisabledPayload(
  overrides: Partial<EntityDisabledPayload> = {},
): EntityDisabledPayload {
  return {
    entityId: 0,
    source: '',
    ...overrides,
  };
}

export function createEntityDisabledDraft(
  payload: EntityDisabledPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EntityDisabledPayload> {
  if (!validateEntityDisabledPayload(payload)) {
    throw new TypeError('Invalid payload for entity.disabled');
  }
  return {
    type: EntityDisabledType,
    payload: cloneEntityDisabledPayload(payload),
    metadata,
  };
}

export function isEntityDisabledEvent(
  event: SimulationEvent,
): event is EntityDisabledEvent {
  return event.type === EntityDisabledType && validateEntityDisabledPayload(event.payload);
}

export function validateEntityDisabledPayload(
  value: unknown,
): value is EntityDisabledPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EntityDisabledPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.source === 'string'
  );
}

export function cloneEntityDisabledPayload(
  payload: EntityDisabledPayload,
): EntityDisabledPayload {
  return cloneJson(payload);
}

export function equalEntityDisabledPayload(
  left: EntityDisabledPayload,
  right: EntityDisabledPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.source === right.source
  );
}

export function serializeEntityDisabledPayload(
  payload: EntityDisabledPayload,
): string {
  if (!validateEntityDisabledPayload(payload)) {
    throw new TypeError('Cannot serialize invalid entity.disabled payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEntityDisabledPayload(
  serialized: string,
): EntityDisabledPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEntityDisabledPayload(value)) {
    throw new TypeError('Serialized value is not a entity.disabled payload');
  }
  return cloneEntityDisabledPayload(value);
}
