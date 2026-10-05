import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DoorUnlockedType = 'world.door.unlocked' as const;

export interface DoorUnlockedPayload extends JsonObject {
  doorId: number;
  keyId: string;
  entityId: number;
}

export type DoorUnlockedEvent = SimulationEvent<DoorUnlockedPayload>;

export function createDoorUnlockedPayload(
  overrides: Partial<DoorUnlockedPayload> = {},
): DoorUnlockedPayload {
  return {
    doorId: 0,
    keyId: '',
    entityId: 0,
    ...overrides,
  };
}

export function createDoorUnlockedDraft(
  payload: DoorUnlockedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DoorUnlockedPayload> {
  if (!validateDoorUnlockedPayload(payload)) {
    throw new TypeError('Invalid payload for world.door.unlocked');
  }
  return {
    type: DoorUnlockedType,
    payload: cloneDoorUnlockedPayload(payload),
    metadata,
  };
}

export function isDoorUnlockedEvent(
  event: SimulationEvent,
): event is DoorUnlockedEvent {
  return event.type === DoorUnlockedType && validateDoorUnlockedPayload(event.payload);
}

export function validateDoorUnlockedPayload(
  value: unknown,
): value is DoorUnlockedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DoorUnlockedPayload>;
  return (
    typeof payload.doorId === 'number' && Number.isFinite(payload.doorId) &&
    typeof payload.keyId === 'string' &&
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId)
  );
}

export function cloneDoorUnlockedPayload(
  payload: DoorUnlockedPayload,
): DoorUnlockedPayload {
  return cloneJson(payload);
}

export function equalDoorUnlockedPayload(
  left: DoorUnlockedPayload,
  right: DoorUnlockedPayload,
): boolean {
  return (
    left.doorId === right.doorId &&
    left.keyId === right.keyId &&
    left.entityId === right.entityId
  );
}

export function serializeDoorUnlockedPayload(
  payload: DoorUnlockedPayload,
): string {
  if (!validateDoorUnlockedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.door.unlocked payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDoorUnlockedPayload(
  serialized: string,
): DoorUnlockedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDoorUnlockedPayload(value)) {
    throw new TypeError('Serialized value is not a world.door.unlocked payload');
  }
  return cloneDoorUnlockedPayload(value);
}
