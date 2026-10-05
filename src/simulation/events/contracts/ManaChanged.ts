import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ManaChangedType = 'combat.mana.changed' as const;

export interface ManaChangedPayload extends JsonObject {
  entityId: number;
  previous: number;
  current: number;
  maximum: number;
}

export type ManaChangedEvent = SimulationEvent<ManaChangedPayload>;

export function createManaChangedPayload(
  overrides: Partial<ManaChangedPayload> = {},
): ManaChangedPayload {
  return {
    entityId: 0,
    previous: 0,
    current: 0,
    maximum: 0,
    ...overrides,
  };
}

export function createManaChangedDraft(
  payload: ManaChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ManaChangedPayload> {
  if (!validateManaChangedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.mana.changed');
  }
  return {
    type: ManaChangedType,
    payload: cloneManaChangedPayload(payload),
    metadata,
  };
}

export function isManaChangedEvent(
  event: SimulationEvent,
): event is ManaChangedEvent {
  return event.type === ManaChangedType && validateManaChangedPayload(event.payload);
}

export function validateManaChangedPayload(
  value: unknown,
): value is ManaChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ManaChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.previous === 'number' && Number.isFinite(payload.previous) &&
    typeof payload.current === 'number' && Number.isFinite(payload.current) &&
    typeof payload.maximum === 'number' && Number.isFinite(payload.maximum)
  );
}

export function cloneManaChangedPayload(
  payload: ManaChangedPayload,
): ManaChangedPayload {
  return cloneJson(payload);
}

export function equalManaChangedPayload(
  left: ManaChangedPayload,
  right: ManaChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.previous === right.previous &&
    left.current === right.current &&
    left.maximum === right.maximum
  );
}

export function serializeManaChangedPayload(
  payload: ManaChangedPayload,
): string {
  if (!validateManaChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.mana.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeManaChangedPayload(
  serialized: string,
): ManaChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateManaChangedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.mana.changed payload');
  }
  return cloneManaChangedPayload(value);
}
