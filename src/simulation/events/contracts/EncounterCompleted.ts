import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EncounterCompletedType = 'world.encounter.completed' as const;

export interface EncounterCompletedPayload extends JsonObject {
  encounterId: string;
  roomId: string;
  score: number;
  duration: number;
}

export type EncounterCompletedEvent = SimulationEvent<EncounterCompletedPayload>;

export function createEncounterCompletedPayload(
  overrides: Partial<EncounterCompletedPayload> = {},
): EncounterCompletedPayload {
  return {
    encounterId: '',
    roomId: '',
    score: 0,
    duration: 0,
    ...overrides,
  };
}

export function createEncounterCompletedDraft(
  payload: EncounterCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EncounterCompletedPayload> {
  if (!validateEncounterCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for world.encounter.completed');
  }
  return {
    type: EncounterCompletedType,
    payload: cloneEncounterCompletedPayload(payload),
    metadata,
  };
}

export function isEncounterCompletedEvent(
  event: SimulationEvent,
): event is EncounterCompletedEvent {
  return event.type === EncounterCompletedType && validateEncounterCompletedPayload(event.payload);
}

export function validateEncounterCompletedPayload(
  value: unknown,
): value is EncounterCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EncounterCompletedPayload>;
  return (
    typeof payload.encounterId === 'string' &&
    typeof payload.roomId === 'string' &&
    typeof payload.score === 'number' && Number.isFinite(payload.score) &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneEncounterCompletedPayload(
  payload: EncounterCompletedPayload,
): EncounterCompletedPayload {
  return cloneJson(payload);
}

export function equalEncounterCompletedPayload(
  left: EncounterCompletedPayload,
  right: EncounterCompletedPayload,
): boolean {
  return (
    left.encounterId === right.encounterId &&
    left.roomId === right.roomId &&
    left.score === right.score &&
    left.duration === right.duration
  );
}

export function serializeEncounterCompletedPayload(
  payload: EncounterCompletedPayload,
): string {
  if (!validateEncounterCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.encounter.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEncounterCompletedPayload(
  serialized: string,
): EncounterCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEncounterCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a world.encounter.completed payload');
  }
  return cloneEncounterCompletedPayload(value);
}
