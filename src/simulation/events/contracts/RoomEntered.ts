import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const RoomEnteredType = 'world.room.entered' as const;

export interface RoomEnteredPayload extends JsonObject {
  entityId: number;
  roomId: string;
  fromRoomId: string;
}

export type RoomEnteredEvent = SimulationEvent<RoomEnteredPayload>;

export function createRoomEnteredPayload(
  overrides: Partial<RoomEnteredPayload> = {},
): RoomEnteredPayload {
  return {
    entityId: 0,
    roomId: '',
    fromRoomId: '',
    ...overrides,
  };
}

export function createRoomEnteredDraft(
  payload: RoomEnteredPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<RoomEnteredPayload> {
  if (!validateRoomEnteredPayload(payload)) {
    throw new TypeError('Invalid payload for world.room.entered');
  }
  return {
    type: RoomEnteredType,
    payload: cloneRoomEnteredPayload(payload),
    metadata,
  };
}

export function isRoomEnteredEvent(
  event: SimulationEvent,
): event is RoomEnteredEvent {
  return event.type === RoomEnteredType && validateRoomEnteredPayload(event.payload);
}

export function validateRoomEnteredPayload(
  value: unknown,
): value is RoomEnteredPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<RoomEnteredPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.roomId === 'string' &&
    typeof payload.fromRoomId === 'string'
  );
}

export function cloneRoomEnteredPayload(
  payload: RoomEnteredPayload,
): RoomEnteredPayload {
  return cloneJson(payload);
}

export function equalRoomEnteredPayload(
  left: RoomEnteredPayload,
  right: RoomEnteredPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.roomId === right.roomId &&
    left.fromRoomId === right.fromRoomId
  );
}

export function serializeRoomEnteredPayload(
  payload: RoomEnteredPayload,
): string {
  if (!validateRoomEnteredPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.room.entered payload');
  }
  return JSON.stringify(payload);
}

export function deserializeRoomEnteredPayload(
  serialized: string,
): RoomEnteredPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateRoomEnteredPayload(value)) {
    throw new TypeError('Serialized value is not a world.room.entered payload');
  }
  return cloneRoomEnteredPayload(value);
}
