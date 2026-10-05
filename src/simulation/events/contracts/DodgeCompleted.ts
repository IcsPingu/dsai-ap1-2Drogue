import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DodgeCompletedType = 'movement.dodge.completed' as const;

export interface DodgeCompletedPayload extends JsonObject {
  entityId: number;
  distance: number;
  perfect: boolean;
}

export type DodgeCompletedEvent = SimulationEvent<DodgeCompletedPayload>;

export function createDodgeCompletedPayload(
  overrides: Partial<DodgeCompletedPayload> = {},
): DodgeCompletedPayload {
  return {
    entityId: 0,
    distance: 0,
    perfect: false,
    ...overrides,
  };
}

export function createDodgeCompletedDraft(
  payload: DodgeCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DodgeCompletedPayload> {
  if (!validateDodgeCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.dodge.completed');
  }
  return {
    type: DodgeCompletedType,
    payload: cloneDodgeCompletedPayload(payload),
    metadata,
  };
}

export function isDodgeCompletedEvent(
  event: SimulationEvent,
): event is DodgeCompletedEvent {
  return event.type === DodgeCompletedType && validateDodgeCompletedPayload(event.payload);
}

export function validateDodgeCompletedPayload(
  value: unknown,
): value is DodgeCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DodgeCompletedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.distance === 'number' && Number.isFinite(payload.distance) &&
    typeof payload.perfect === 'boolean'
  );
}

export function cloneDodgeCompletedPayload(
  payload: DodgeCompletedPayload,
): DodgeCompletedPayload {
  return cloneJson(payload);
}

export function equalDodgeCompletedPayload(
  left: DodgeCompletedPayload,
  right: DodgeCompletedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.distance === right.distance &&
    left.perfect === right.perfect
  );
}

export function serializeDodgeCompletedPayload(
  payload: DodgeCompletedPayload,
): string {
  if (!validateDodgeCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.dodge.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDodgeCompletedPayload(
  serialized: string,
): DodgeCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDodgeCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.dodge.completed payload');
  }
  return cloneDodgeCompletedPayload(value);
}
