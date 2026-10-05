import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const RoomExitedType = 'world.room.exited' as const;

export interface RoomExitedPayload extends JsonObject {
  entityId: number;
  roomId: string;
  toRoomId: string;
}

export type RoomExitedEvent = SimulationEvent<RoomExitedPayload>;

export function createRoomExitedPayload(
  overrides: Partial<RoomExitedPayload> = {},
): RoomExitedPayload {
  return {
    entityId: 0,
    roomId: '',
    toRoomId: '',
    ...overrides,
  };
}

export function createRoomExitedDraft(
  payload: RoomExitedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<RoomExitedPayload> {
  if (!validateRoomExitedPayload(payload)) {
    throw new TypeError('Invalid payload for world.room.exited');
  }
  return {
    type: RoomExitedType,
    payload: cloneRoomExitedPayload(payload),
    metadata,
  };
}

export function isRoomExitedEvent(
  event: SimulationEvent,
): event is RoomExitedEvent {
  return event.type === RoomExitedType && validateRoomExitedPayload(event.payload);
}

export function validateRoomExitedPayload(
  value: unknown,
): value is RoomExitedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<RoomExitedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.roomId === 'string' &&
    typeof payload.toRoomId === 'string'
  );
}

export function cloneRoomExitedPayload(
  payload: RoomExitedPayload,
): RoomExitedPayload {
  return cloneJson(payload);
}

export function equalRoomExitedPayload(
  left: RoomExitedPayload,
  right: RoomExitedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.roomId === right.roomId &&
    left.toRoomId === right.toRoomId
  );
}

export function serializeRoomExitedPayload(
  payload: RoomExitedPayload,
): string {
  if (!validateRoomExitedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.room.exited payload');
  }
  return JSON.stringify(payload);
}

export function deserializeRoomExitedPayload(
  serialized: string,
): RoomExitedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateRoomExitedPayload(value)) {
    throw new TypeError('Serialized value is not a world.room.exited payload');
  }
  return cloneRoomExitedPayload(value);
}
