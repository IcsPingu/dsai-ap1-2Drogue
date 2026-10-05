import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const SimulationStoppedType = 'simulation.stopped' as const;

export interface SimulationStoppedPayload extends JsonObject {
  sessionId: string;
  reason: string;
  finalTick: number;
}

export type SimulationStoppedEvent = SimulationEvent<SimulationStoppedPayload>;

export function createSimulationStoppedPayload(
  overrides: Partial<SimulationStoppedPayload> = {},
): SimulationStoppedPayload {
  return {
    sessionId: '',
    reason: '',
    finalTick: 0,
    ...overrides,
  };
}

export function createSimulationStoppedDraft(
  payload: SimulationStoppedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<SimulationStoppedPayload> {
  if (!validateSimulationStoppedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.stopped');
  }
  return {
    type: SimulationStoppedType,
    payload: cloneSimulationStoppedPayload(payload),
    metadata,
  };
}

export function isSimulationStoppedEvent(
  event: SimulationEvent,
): event is SimulationStoppedEvent {
  return event.type === SimulationStoppedType && validateSimulationStoppedPayload(event.payload);
}

export function validateSimulationStoppedPayload(
  value: unknown,
): value is SimulationStoppedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<SimulationStoppedPayload>;
  return (
    typeof payload.sessionId === 'string' &&
    typeof payload.reason === 'string' &&
    typeof payload.finalTick === 'number' && Number.isFinite(payload.finalTick)
  );
}

export function cloneSimulationStoppedPayload(
  payload: SimulationStoppedPayload,
): SimulationStoppedPayload {
  return cloneJson(payload);
}

export function equalSimulationStoppedPayload(
  left: SimulationStoppedPayload,
  right: SimulationStoppedPayload,
): boolean {
  return (
    left.sessionId === right.sessionId &&
    left.reason === right.reason &&
    left.finalTick === right.finalTick
  );
}

export function serializeSimulationStoppedPayload(
  payload: SimulationStoppedPayload,
): string {
  if (!validateSimulationStoppedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.stopped payload');
  }
  return JSON.stringify(payload);
}

export function deserializeSimulationStoppedPayload(
  serialized: string,
): SimulationStoppedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateSimulationStoppedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.stopped payload');
  }
  return cloneSimulationStoppedPayload(value);
}
