import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EntityDefeatedType = 'combat.entity.defeated' as const;

export interface EntityDefeatedPayload extends JsonObject {
  entityId: number;
  killerId: number;
  abilityId: string;
  overkill: number;
}

export type EntityDefeatedEvent = SimulationEvent<EntityDefeatedPayload>;

export function createEntityDefeatedPayload(
  overrides: Partial<EntityDefeatedPayload> = {},
): EntityDefeatedPayload {
  return {
    entityId: 0,
    killerId: 0,
    abilityId: '',
    overkill: 0,
    ...overrides,
  };
}

export function createEntityDefeatedDraft(
  payload: EntityDefeatedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EntityDefeatedPayload> {
  if (!validateEntityDefeatedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.entity.defeated');
  }
  return {
    type: EntityDefeatedType,
    payload: cloneEntityDefeatedPayload(payload),
    metadata,
  };
}

export function isEntityDefeatedEvent(
  event: SimulationEvent,
): event is EntityDefeatedEvent {
  return event.type === EntityDefeatedType && validateEntityDefeatedPayload(event.payload);
}

export function validateEntityDefeatedPayload(
  value: unknown,
): value is EntityDefeatedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EntityDefeatedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.killerId === 'number' && Number.isFinite(payload.killerId) &&
    typeof payload.abilityId === 'string' &&
    typeof payload.overkill === 'number' && Number.isFinite(payload.overkill)
  );
}

export function cloneEntityDefeatedPayload(
  payload: EntityDefeatedPayload,
): EntityDefeatedPayload {
  return cloneJson(payload);
}

export function equalEntityDefeatedPayload(
  left: EntityDefeatedPayload,
  right: EntityDefeatedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.killerId === right.killerId &&
    left.abilityId === right.abilityId &&
    left.overkill === right.overkill
  );
}

export function serializeEntityDefeatedPayload(
  payload: EntityDefeatedPayload,
): string {
  if (!validateEntityDefeatedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.entity.defeated payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEntityDefeatedPayload(
  serialized: string,
): EntityDefeatedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEntityDefeatedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.entity.defeated payload');
  }
  return cloneEntityDefeatedPayload(value);
}
