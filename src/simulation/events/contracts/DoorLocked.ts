import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DoorLockedType = 'world.door.locked' as const;

export interface DoorLockedPayload extends JsonObject {
  doorId: number;
  lockId: string;
  roomId: string;
}

export type DoorLockedEvent = SimulationEvent<DoorLockedPayload>;

export function createDoorLockedPayload(
  overrides: Partial<DoorLockedPayload> = {},
): DoorLockedPayload {
  return {
    doorId: 0,
    lockId: '',
    roomId: '',
    ...overrides,
  };
}

export function createDoorLockedDraft(
  payload: DoorLockedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DoorLockedPayload> {
  if (!validateDoorLockedPayload(payload)) {
    throw new TypeError('Invalid payload for world.door.locked');
  }
  return {
    type: DoorLockedType,
    payload: cloneDoorLockedPayload(payload),
    metadata,
  };
}

export function isDoorLockedEvent(
  event: SimulationEvent,
): event is DoorLockedEvent {
  return event.type === DoorLockedType && validateDoorLockedPayload(event.payload);
}

export function validateDoorLockedPayload(
  value: unknown,
): value is DoorLockedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DoorLockedPayload>;
  return (
    typeof payload.doorId === 'number' && Number.isFinite(payload.doorId) &&
    typeof payload.lockId === 'string' &&
    typeof payload.roomId === 'string'
  );
}

export function cloneDoorLockedPayload(
  payload: DoorLockedPayload,
): DoorLockedPayload {
  return cloneJson(payload);
}

export function equalDoorLockedPayload(
  left: DoorLockedPayload,
  right: DoorLockedPayload,
): boolean {
  return (
    left.doorId === right.doorId &&
    left.lockId === right.lockId &&
    left.roomId === right.roomId
  );
}

export function serializeDoorLockedPayload(
  payload: DoorLockedPayload,
): string {
  if (!validateDoorLockedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.door.locked payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDoorLockedPayload(
  serialized: string,
): DoorLockedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDoorLockedPayload(value)) {
    throw new TypeError('Serialized value is not a world.door.locked payload');
  }
  return cloneDoorLockedPayload(value);
}
