import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const EncounterStartedType = 'world.encounter.started' as const;

export interface EncounterStartedPayload extends JsonObject {
  encounterId: string;
  roomId: string;
  difficulty: number;
}

export type EncounterStartedEvent = SimulationEvent<EncounterStartedPayload>;

export function createEncounterStartedPayload(
  overrides: Partial<EncounterStartedPayload> = {},
): EncounterStartedPayload {
  return {
    encounterId: '',
    roomId: '',
    difficulty: 0,
    ...overrides,
  };
}

export function createEncounterStartedDraft(
  payload: EncounterStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<EncounterStartedPayload> {
  if (!validateEncounterStartedPayload(payload)) {
    throw new TypeError('Invalid payload for world.encounter.started');
  }
  return {
    type: EncounterStartedType,
    payload: cloneEncounterStartedPayload(payload),
    metadata,
  };
}

export function isEncounterStartedEvent(
  event: SimulationEvent,
): event is EncounterStartedEvent {
  return event.type === EncounterStartedType && validateEncounterStartedPayload(event.payload);
}

export function validateEncounterStartedPayload(
  value: unknown,
): value is EncounterStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<EncounterStartedPayload>;
  return (
    typeof payload.encounterId === 'string' &&
    typeof payload.roomId === 'string' &&
    typeof payload.difficulty === 'number' && Number.isFinite(payload.difficulty)
  );
}

export function cloneEncounterStartedPayload(
  payload: EncounterStartedPayload,
): EncounterStartedPayload {
  return cloneJson(payload);
}

export function equalEncounterStartedPayload(
  left: EncounterStartedPayload,
  right: EncounterStartedPayload,
): boolean {
  return (
    left.encounterId === right.encounterId &&
    left.roomId === right.roomId &&
    left.difficulty === right.difficulty
  );
}

export function serializeEncounterStartedPayload(
  payload: EncounterStartedPayload,
): string {
  if (!validateEncounterStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.encounter.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeEncounterStartedPayload(
  serialized: string,
): EncounterStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateEncounterStartedPayload(value)) {
    throw new TypeError('Serialized value is not a world.encounter.started payload');
  }
  return cloneEncounterStartedPayload(value);
}
