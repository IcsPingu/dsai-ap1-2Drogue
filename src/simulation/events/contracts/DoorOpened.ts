import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DoorOpenedType = 'world.door.opened' as const;

export interface DoorOpenedPayload extends JsonObject {
  doorId: number;
  entityId: number;
  roomId: string;
}

export type DoorOpenedEvent = SimulationEvent<DoorOpenedPayload>;

export function createDoorOpenedPayload(
  overrides: Partial<DoorOpenedPayload> = {},
): DoorOpenedPayload {
  return {
    doorId: 0,
    entityId: 0,
    roomId: '',
    ...overrides,
  };
}

export function createDoorOpenedDraft(
  payload: DoorOpenedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DoorOpenedPayload> {
  if (!validateDoorOpenedPayload(payload)) {
    throw new TypeError('Invalid payload for world.door.opened');
  }
  return {
    type: DoorOpenedType,
    payload: cloneDoorOpenedPayload(payload),
    metadata,
  };
}

export function isDoorOpenedEvent(
  event: SimulationEvent,
): event is DoorOpenedEvent {
  return event.type === DoorOpenedType && validateDoorOpenedPayload(event.payload);
}

export function validateDoorOpenedPayload(
  value: unknown,
): value is DoorOpenedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DoorOpenedPayload>;
  return (
    typeof payload.doorId === 'number' && Number.isFinite(payload.doorId) &&
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.roomId === 'string'
  );
}

export function cloneDoorOpenedPayload(
  payload: DoorOpenedPayload,
): DoorOpenedPayload {
  return cloneJson(payload);
}

export function equalDoorOpenedPayload(
  left: DoorOpenedPayload,
  right: DoorOpenedPayload,
): boolean {
  return (
    left.doorId === right.doorId &&
    left.entityId === right.entityId &&
    left.roomId === right.roomId
  );
}

export function serializeDoorOpenedPayload(
  payload: DoorOpenedPayload,
): string {
  if (!validateDoorOpenedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.door.opened payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDoorOpenedPayload(
  serialized: string,
): DoorOpenedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDoorOpenedPayload(value)) {
    throw new TypeError('Serialized value is not a world.door.opened payload');
  }
  return cloneDoorOpenedPayload(value);
}
