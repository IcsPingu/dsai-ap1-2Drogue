import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const MoveBlockedType = 'movement.blocked' as const;

export interface MoveBlockedPayload extends JsonObject {
  entityId: number;
  x: number;
  y: number;
  obstacleId: number;
  reason: string;
}

export type MoveBlockedEvent = SimulationEvent<MoveBlockedPayload>;

export function createMoveBlockedPayload(
  overrides: Partial<MoveBlockedPayload> = {},
): MoveBlockedPayload {
  return {
    entityId: 0,
    x: 0,
    y: 0,
    obstacleId: 0,
    reason: '',
    ...overrides,
  };
}

export function createMoveBlockedDraft(
  payload: MoveBlockedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<MoveBlockedPayload> {
  if (!validateMoveBlockedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.blocked');
  }
  return {
    type: MoveBlockedType,
    payload: cloneMoveBlockedPayload(payload),
    metadata,
  };
}

export function isMoveBlockedEvent(
  event: SimulationEvent,
): event is MoveBlockedEvent {
  return event.type === MoveBlockedType && validateMoveBlockedPayload(event.payload);
}

export function validateMoveBlockedPayload(
  value: unknown,
): value is MoveBlockedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<MoveBlockedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y) &&
    typeof payload.obstacleId === 'number' && Number.isFinite(payload.obstacleId) &&
    typeof payload.reason === 'string'
  );
}

export function cloneMoveBlockedPayload(
  payload: MoveBlockedPayload,
): MoveBlockedPayload {
  return cloneJson(payload);
}

export function equalMoveBlockedPayload(
  left: MoveBlockedPayload,
  right: MoveBlockedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.x === right.x &&
    left.y === right.y &&
    left.obstacleId === right.obstacleId &&
    left.reason === right.reason
  );
}

export function serializeMoveBlockedPayload(
  payload: MoveBlockedPayload,
): string {
  if (!validateMoveBlockedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.blocked payload');
  }
  return JSON.stringify(payload);
}

export function deserializeMoveBlockedPayload(
  serialized: string,
): MoveBlockedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateMoveBlockedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.blocked payload');
  }
  return cloneMoveBlockedPayload(value);
}
