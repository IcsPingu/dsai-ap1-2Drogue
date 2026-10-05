import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const SimulationResumedType = 'simulation.resumed' as const;

export interface SimulationResumedPayload extends JsonObject {
  tick: number;
  requestedBy: string;
  pauseDuration: number;
}

export type SimulationResumedEvent = SimulationEvent<SimulationResumedPayload>;

export function createSimulationResumedPayload(
  overrides: Partial<SimulationResumedPayload> = {},
): SimulationResumedPayload {
  return {
    tick: 0,
    requestedBy: '',
    pauseDuration: 0,
    ...overrides,
  };
}

export function createSimulationResumedDraft(
  payload: SimulationResumedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<SimulationResumedPayload> {
  if (!validateSimulationResumedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.resumed');
  }
  return {
    type: SimulationResumedType,
    payload: cloneSimulationResumedPayload(payload),
    metadata,
  };
}

export function isSimulationResumedEvent(
  event: SimulationEvent,
): event is SimulationResumedEvent {
  return event.type === SimulationResumedType && validateSimulationResumedPayload(event.payload);
}

export function validateSimulationResumedPayload(
  value: unknown,
): value is SimulationResumedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<SimulationResumedPayload>;
  return (
    typeof payload.tick === 'number' && Number.isFinite(payload.tick) &&
    typeof payload.requestedBy === 'string' &&
    typeof payload.pauseDuration === 'number' && Number.isFinite(payload.pauseDuration)
  );
}

export function cloneSimulationResumedPayload(
  payload: SimulationResumedPayload,
): SimulationResumedPayload {
  return cloneJson(payload);
}

export function equalSimulationResumedPayload(
  left: SimulationResumedPayload,
  right: SimulationResumedPayload,
): boolean {
  return (
    left.tick === right.tick &&
    left.requestedBy === right.requestedBy &&
    left.pauseDuration === right.pauseDuration
  );
}

export function serializeSimulationResumedPayload(
  payload: SimulationResumedPayload,
): string {
  if (!validateSimulationResumedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.resumed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeSimulationResumedPayload(
  serialized: string,
): SimulationResumedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateSimulationResumedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.resumed payload');
  }
  return cloneSimulationResumedPayload(value);
}
