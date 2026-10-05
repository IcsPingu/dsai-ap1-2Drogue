import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const MoveRequestedType = 'movement.requested' as const;

export interface MoveRequestedPayload extends JsonObject {
  entityId: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export type MoveRequestedEvent = SimulationEvent<MoveRequestedPayload>;

export function createMoveRequestedPayload(
  overrides: Partial<MoveRequestedPayload> = {},
): MoveRequestedPayload {
  return {
    entityId: 0,
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0,
    ...overrides,
  };
}

export function createMoveRequestedDraft(
  payload: MoveRequestedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<MoveRequestedPayload> {
  if (!validateMoveRequestedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.requested');
  }
  return {
    type: MoveRequestedType,
    payload: cloneMoveRequestedPayload(payload),
    metadata,
  };
}

export function isMoveRequestedEvent(
  event: SimulationEvent,
): event is MoveRequestedEvent {
  return event.type === MoveRequestedType && validateMoveRequestedPayload(event.payload);
}

export function validateMoveRequestedPayload(
  value: unknown,
): value is MoveRequestedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<MoveRequestedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.fromX === 'number' && Number.isFinite(payload.fromX) &&
    typeof payload.fromY === 'number' && Number.isFinite(payload.fromY) &&
    typeof payload.toX === 'number' && Number.isFinite(payload.toX) &&
    typeof payload.toY === 'number' && Number.isFinite(payload.toY)
  );
}

export function cloneMoveRequestedPayload(
  payload: MoveRequestedPayload,
): MoveRequestedPayload {
  return cloneJson(payload);
}

export function equalMoveRequestedPayload(
  left: MoveRequestedPayload,
  right: MoveRequestedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.fromX === right.fromX &&
    left.fromY === right.fromY &&
    left.toX === right.toX &&
    left.toY === right.toY
  );
}

export function serializeMoveRequestedPayload(
  payload: MoveRequestedPayload,
): string {
  if (!validateMoveRequestedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.requested payload');
  }
  return JSON.stringify(payload);
}

export function deserializeMoveRequestedPayload(
  serialized: string,
): MoveRequestedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateMoveRequestedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.requested payload');
  }
  return cloneMoveRequestedPayload(value);
}
