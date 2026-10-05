import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DodgeStartedType = 'movement.dodge.started' as const;

export interface DodgeStartedPayload extends JsonObject {
  entityId: number;
  directionX: number;
  directionY: number;
  duration: number;
}

export type DodgeStartedEvent = SimulationEvent<DodgeStartedPayload>;

export function createDodgeStartedPayload(
  overrides: Partial<DodgeStartedPayload> = {},
): DodgeStartedPayload {
  return {
    entityId: 0,
    directionX: 0,
    directionY: 0,
    duration: 0,
    ...overrides,
  };
}

export function createDodgeStartedDraft(
  payload: DodgeStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DodgeStartedPayload> {
  if (!validateDodgeStartedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.dodge.started');
  }
  return {
    type: DodgeStartedType,
    payload: cloneDodgeStartedPayload(payload),
    metadata,
  };
}

export function isDodgeStartedEvent(
  event: SimulationEvent,
): event is DodgeStartedEvent {
  return event.type === DodgeStartedType && validateDodgeStartedPayload(event.payload);
}

export function validateDodgeStartedPayload(
  value: unknown,
): value is DodgeStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DodgeStartedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.directionX === 'number' && Number.isFinite(payload.directionX) &&
    typeof payload.directionY === 'number' && Number.isFinite(payload.directionY) &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneDodgeStartedPayload(
  payload: DodgeStartedPayload,
): DodgeStartedPayload {
  return cloneJson(payload);
}

export function equalDodgeStartedPayload(
  left: DodgeStartedPayload,
  right: DodgeStartedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.directionX === right.directionX &&
    left.directionY === right.directionY &&
    left.duration === right.duration
  );
}

export function serializeDodgeStartedPayload(
  payload: DodgeStartedPayload,
): string {
  if (!validateDodgeStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.dodge.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDodgeStartedPayload(
  serialized: string,
): DodgeStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDodgeStartedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.dodge.started payload');
  }
  return cloneDodgeStartedPayload(value);
}
