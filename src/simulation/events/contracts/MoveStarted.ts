import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const MoveStartedType = 'movement.started' as const;

export interface MoveStartedPayload extends JsonObject {
  entityId: number;
  directionX: number;
  directionY: number;
  speed: number;
}

export type MoveStartedEvent = SimulationEvent<MoveStartedPayload>;

export function createMoveStartedPayload(
  overrides: Partial<MoveStartedPayload> = {},
): MoveStartedPayload {
  return {
    entityId: 0,
    directionX: 0,
    directionY: 0,
    speed: 0,
    ...overrides,
  };
}

export function createMoveStartedDraft(
  payload: MoveStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<MoveStartedPayload> {
  if (!validateMoveStartedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.started');
  }
  return {
    type: MoveStartedType,
    payload: cloneMoveStartedPayload(payload),
    metadata,
  };
}

export function isMoveStartedEvent(
  event: SimulationEvent,
): event is MoveStartedEvent {
  return event.type === MoveStartedType && validateMoveStartedPayload(event.payload);
}

export function validateMoveStartedPayload(
  value: unknown,
): value is MoveStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<MoveStartedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.directionX === 'number' && Number.isFinite(payload.directionX) &&
    typeof payload.directionY === 'number' && Number.isFinite(payload.directionY) &&
    typeof payload.speed === 'number' && Number.isFinite(payload.speed)
  );
}

export function cloneMoveStartedPayload(
  payload: MoveStartedPayload,
): MoveStartedPayload {
  return cloneJson(payload);
}

export function equalMoveStartedPayload(
  left: MoveStartedPayload,
  right: MoveStartedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.directionX === right.directionX &&
    left.directionY === right.directionY &&
    left.speed === right.speed
  );
}

export function serializeMoveStartedPayload(
  payload: MoveStartedPayload,
): string {
  if (!validateMoveStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeMoveStartedPayload(
  serialized: string,
): MoveStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateMoveStartedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.started payload');
  }
  return cloneMoveStartedPayload(value);
}
