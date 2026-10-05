import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const SimulationPausedType = 'simulation.paused' as const;

export interface SimulationPausedPayload extends JsonObject {
  reason: string;
  tick: number;
  requestedBy: string;
}

export type SimulationPausedEvent = SimulationEvent<SimulationPausedPayload>;

export function createSimulationPausedPayload(
  overrides: Partial<SimulationPausedPayload> = {},
): SimulationPausedPayload {
  return {
    reason: '',
    tick: 0,
    requestedBy: '',
    ...overrides,
  };
}

export function createSimulationPausedDraft(
  payload: SimulationPausedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<SimulationPausedPayload> {
  if (!validateSimulationPausedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.paused');
  }
  return {
    type: SimulationPausedType,
    payload: cloneSimulationPausedPayload(payload),
    metadata,
  };
}

export function isSimulationPausedEvent(
  event: SimulationEvent,
): event is SimulationPausedEvent {
  return event.type === SimulationPausedType && validateSimulationPausedPayload(event.payload);
}

export function validateSimulationPausedPayload(
  value: unknown,
): value is SimulationPausedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<SimulationPausedPayload>;
  return (
    typeof payload.reason === 'string' &&
    typeof payload.tick === 'number' && Number.isFinite(payload.tick) &&
    typeof payload.requestedBy === 'string'
  );
}

export function cloneSimulationPausedPayload(
  payload: SimulationPausedPayload,
): SimulationPausedPayload {
  return cloneJson(payload);
}

export function equalSimulationPausedPayload(
  left: SimulationPausedPayload,
  right: SimulationPausedPayload,
): boolean {
  return (
    left.reason === right.reason &&
    left.tick === right.tick &&
    left.requestedBy === right.requestedBy
  );
}

export function serializeSimulationPausedPayload(
  payload: SimulationPausedPayload,
): string {
  if (!validateSimulationPausedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.paused payload');
  }
  return JSON.stringify(payload);
}

export function deserializeSimulationPausedPayload(
  serialized: string,
): SimulationPausedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateSimulationPausedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.paused payload');
  }
  return cloneSimulationPausedPayload(value);
}
