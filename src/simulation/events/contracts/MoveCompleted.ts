import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const MoveCompletedType = 'movement.completed' as const;

export interface MoveCompletedPayload extends JsonObject {
  entityId: number;
  x: number;
  y: number;
  distance: number;
}

export type MoveCompletedEvent = SimulationEvent<MoveCompletedPayload>;

export function createMoveCompletedPayload(
  overrides: Partial<MoveCompletedPayload> = {},
): MoveCompletedPayload {
  return {
    entityId: 0,
    x: 0,
    y: 0,
    distance: 0,
    ...overrides,
  };
}

export function createMoveCompletedDraft(
  payload: MoveCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<MoveCompletedPayload> {
  if (!validateMoveCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.completed');
  }
  return {
    type: MoveCompletedType,
    payload: cloneMoveCompletedPayload(payload),
    metadata,
  };
}

export function isMoveCompletedEvent(
  event: SimulationEvent,
): event is MoveCompletedEvent {
  return event.type === MoveCompletedType && validateMoveCompletedPayload(event.payload);
}

export function validateMoveCompletedPayload(
  value: unknown,
): value is MoveCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<MoveCompletedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y) &&
    typeof payload.distance === 'number' && Number.isFinite(payload.distance)
  );
}

export function cloneMoveCompletedPayload(
  payload: MoveCompletedPayload,
): MoveCompletedPayload {
  return cloneJson(payload);
}

export function equalMoveCompletedPayload(
  left: MoveCompletedPayload,
  right: MoveCompletedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.x === right.x &&
    left.y === right.y &&
    left.distance === right.distance
  );
}

export function serializeMoveCompletedPayload(
  payload: MoveCompletedPayload,
): string {
  if (!validateMoveCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeMoveCompletedPayload(
  serialized: string,
): MoveCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateMoveCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.completed payload');
  }
  return cloneMoveCompletedPayload(value);
}
