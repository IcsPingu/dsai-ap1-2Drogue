import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const SimulationStartedType = 'simulation.started' as const;

export interface SimulationStartedPayload extends JsonObject {
  sessionId: string;
  seed: number;
  difficulty: string;
}

export type SimulationStartedEvent = SimulationEvent<SimulationStartedPayload>;

export function createSimulationStartedPayload(
  overrides: Partial<SimulationStartedPayload> = {},
): SimulationStartedPayload {
  return {
    sessionId: '',
    seed: 0,
    difficulty: '',
    ...overrides,
  };
}

export function createSimulationStartedDraft(
  payload: SimulationStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<SimulationStartedPayload> {
  if (!validateSimulationStartedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.started');
  }
  return {
    type: SimulationStartedType,
    payload: cloneSimulationStartedPayload(payload),
    metadata,
  };
}

export function isSimulationStartedEvent(
  event: SimulationEvent,
): event is SimulationStartedEvent {
  return event.type === SimulationStartedType && validateSimulationStartedPayload(event.payload);
}

export function validateSimulationStartedPayload(
  value: unknown,
): value is SimulationStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<SimulationStartedPayload>;
  return (
    typeof payload.sessionId === 'string' &&
    typeof payload.seed === 'number' && Number.isFinite(payload.seed) &&
    typeof payload.difficulty === 'string'
  );
}

export function cloneSimulationStartedPayload(
  payload: SimulationStartedPayload,
): SimulationStartedPayload {
  return cloneJson(payload);
}

export function equalSimulationStartedPayload(
  left: SimulationStartedPayload,
  right: SimulationStartedPayload,
): boolean {
  return (
    left.sessionId === right.sessionId &&
    left.seed === right.seed &&
    left.difficulty === right.difficulty
  );
}

export function serializeSimulationStartedPayload(
  payload: SimulationStartedPayload,
): string {
  if (!validateSimulationStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeSimulationStartedPayload(
  serialized: string,
): SimulationStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateSimulationStartedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.started payload');
  }
  return cloneSimulationStartedPayload(value);
}
