import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const TeleportCompletedType = 'movement.teleport.completed' as const;

export interface TeleportCompletedPayload extends JsonObject {
  entityId: number;
  x: number;
  y: number;
  portalId: number;
}

export type TeleportCompletedEvent = SimulationEvent<TeleportCompletedPayload>;

export function createTeleportCompletedPayload(
  overrides: Partial<TeleportCompletedPayload> = {},
): TeleportCompletedPayload {
  return {
    entityId: 0,
    x: 0,
    y: 0,
    portalId: 0,
    ...overrides,
  };
}

export function createTeleportCompletedDraft(
  payload: TeleportCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<TeleportCompletedPayload> {
  if (!validateTeleportCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.teleport.completed');
  }
  return {
    type: TeleportCompletedType,
    payload: cloneTeleportCompletedPayload(payload),
    metadata,
  };
}

export function isTeleportCompletedEvent(
  event: SimulationEvent,
): event is TeleportCompletedEvent {
  return event.type === TeleportCompletedType && validateTeleportCompletedPayload(event.payload);
}

export function validateTeleportCompletedPayload(
  value: unknown,
): value is TeleportCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<TeleportCompletedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y) &&
    typeof payload.portalId === 'number' && Number.isFinite(payload.portalId)
  );
}

export function cloneTeleportCompletedPayload(
  payload: TeleportCompletedPayload,
): TeleportCompletedPayload {
  return cloneJson(payload);
}

export function equalTeleportCompletedPayload(
  left: TeleportCompletedPayload,
  right: TeleportCompletedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.x === right.x &&
    left.y === right.y &&
    left.portalId === right.portalId
  );
}

export function serializeTeleportCompletedPayload(
  payload: TeleportCompletedPayload,
): string {
  if (!validateTeleportCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.teleport.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeTeleportCompletedPayload(
  serialized: string,
): TeleportCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateTeleportCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.teleport.completed payload');
  }
  return cloneTeleportCompletedPayload(value);
}
