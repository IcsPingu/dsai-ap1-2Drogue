import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DoorClosedType = 'world.door.closed' as const;

export interface DoorClosedPayload extends JsonObject {
  doorId: number;
  entityId: number;
  roomId: string;
}

export type DoorClosedEvent = SimulationEvent<DoorClosedPayload>;

export function createDoorClosedPayload(
  overrides: Partial<DoorClosedPayload> = {},
): DoorClosedPayload {
  return {
    doorId: 0,
    entityId: 0,
    roomId: '',
    ...overrides,
  };
}

export function createDoorClosedDraft(
  payload: DoorClosedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DoorClosedPayload> {
  if (!validateDoorClosedPayload(payload)) {
    throw new TypeError('Invalid payload for world.door.closed');
  }
  return {
    type: DoorClosedType,
    payload: cloneDoorClosedPayload(payload),
    metadata,
  };
}

export function isDoorClosedEvent(
  event: SimulationEvent,
): event is DoorClosedEvent {
  return event.type === DoorClosedType && validateDoorClosedPayload(event.payload);
}

export function validateDoorClosedPayload(
  value: unknown,
): value is DoorClosedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DoorClosedPayload>;
  return (
    typeof payload.doorId === 'number' && Number.isFinite(payload.doorId) &&
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.roomId === 'string'
  );
}

export function cloneDoorClosedPayload(
  payload: DoorClosedPayload,
): DoorClosedPayload {
  return cloneJson(payload);
}

export function equalDoorClosedPayload(
  left: DoorClosedPayload,
  right: DoorClosedPayload,
): boolean {
  return (
    left.doorId === right.doorId &&
    left.entityId === right.entityId &&
    left.roomId === right.roomId
  );
}

export function serializeDoorClosedPayload(
  payload: DoorClosedPayload,
): string {
  if (!validateDoorClosedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.door.closed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDoorClosedPayload(
  serialized: string,
): DoorClosedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDoorClosedPayload(value)) {
    throw new TypeError('Serialized value is not a world.door.closed payload');
  }
  return cloneDoorClosedPayload(value);
}
