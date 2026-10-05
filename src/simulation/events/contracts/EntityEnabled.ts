import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EntityEnabledType = 'entity.enabled' as const;

export interface EntityEnabledPayload extends JsonObject {
  entityId: number;
  source: string;
}

export type EntityEnabledEvent = SimulationEvent<EntityEnabledPayload>;

export function createEntityEnabledPayload(
  overrides: Partial<EntityEnabledPayload> = {},
): EntityEnabledPayload {
  return {
    entityId: 0,
    source: '',
    ...overrides,
  };
}

export function createEntityEnabledDraft(
  payload: EntityEnabledPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EntityEnabledPayload> {
  if (!validateEntityEnabledPayload(payload)) {
    throw new TypeError('Invalid payload for entity.enabled');
  }
  return {
    type: EntityEnabledType,
    payload: cloneEntityEnabledPayload(payload),
    metadata,
  };
}

export function isEntityEnabledEvent(
  event: SimulationEvent,
): event is EntityEnabledEvent {
  return event.type === EntityEnabledType && validateEntityEnabledPayload(event.payload);
}

export function validateEntityEnabledPayload(
  value: unknown,
): value is EntityEnabledPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EntityEnabledPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.source === 'string'
  );
}

export function cloneEntityEnabledPayload(
  payload: EntityEnabledPayload,
): EntityEnabledPayload {
  return cloneJson(payload);
}

export function equalEntityEnabledPayload(
  left: EntityEnabledPayload,
  right: EntityEnabledPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.source === right.source
  );
}

export function serializeEntityEnabledPayload(
  payload: EntityEnabledPayload,
): string {
  if (!validateEntityEnabledPayload(payload)) {
    throw new TypeError('Cannot serialize invalid entity.enabled payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEntityEnabledPayload(
  serialized: string,
): EntityEnabledPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEntityEnabledPayload(value)) {
    throw new TypeError('Serialized value is not a entity.enabled payload');
  }
  return cloneEntityEnabledPayload(value);
}
