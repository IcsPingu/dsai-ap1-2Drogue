import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const TeleportStartedType = 'movement.teleport.started' as const;

export interface TeleportStartedPayload extends JsonObject {
  entityId: number;
  targetX: number;
  targetY: number;
  portalId: number;
}

export type TeleportStartedEvent = SimulationEvent<TeleportStartedPayload>;

export function createTeleportStartedPayload(
  overrides: Partial<TeleportStartedPayload> = {},
): TeleportStartedPayload {
  return {
    entityId: 0,
    targetX: 0,
    targetY: 0,
    portalId: 0,
    ...overrides,
  };
}

export function createTeleportStartedDraft(
  payload: TeleportStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<TeleportStartedPayload> {
  if (!validateTeleportStartedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.teleport.started');
  }
  return {
    type: TeleportStartedType,
    payload: cloneTeleportStartedPayload(payload),
    metadata,
  };
}

export function isTeleportStartedEvent(
  event: SimulationEvent,
): event is TeleportStartedEvent {
  return event.type === TeleportStartedType && validateTeleportStartedPayload(event.payload);
}

export function validateTeleportStartedPayload(
  value: unknown,
): value is TeleportStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<TeleportStartedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.targetX === 'number' && Number.isFinite(payload.targetX) &&
    typeof payload.targetY === 'number' && Number.isFinite(payload.targetY) &&
    typeof payload.portalId === 'number' && Number.isFinite(payload.portalId)
  );
}

export function cloneTeleportStartedPayload(
  payload: TeleportStartedPayload,
): TeleportStartedPayload {
  return cloneJson(payload);
}

export function equalTeleportStartedPayload(
  left: TeleportStartedPayload,
  right: TeleportStartedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.targetX === right.targetX &&
    left.targetY === right.targetY &&
    left.portalId === right.portalId
  );
}

export function serializeTeleportStartedPayload(
  payload: TeleportStartedPayload,
): string {
  if (!validateTeleportStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.teleport.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeTeleportStartedPayload(
  serialized: string,
): TeleportStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateTeleportStartedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.teleport.started payload');
  }
  return cloneTeleportStartedPayload(value);
}
