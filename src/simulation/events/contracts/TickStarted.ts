import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const TickStartedType = 'simulation.tick.started' as const;

export interface TickStartedPayload extends JsonObject {
  tick: number;
  delta: number;
  elapsed: number;
}

export type TickStartedEvent = SimulationEvent<TickStartedPayload>;

export function createTickStartedPayload(
  overrides: Partial<TickStartedPayload> = {},
): TickStartedPayload {
  return {
    tick: 0,
    delta: 0,
    elapsed: 0,
    ...overrides,
  };
}

export function createTickStartedDraft(
  payload: TickStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<TickStartedPayload> {
  if (!validateTickStartedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.tick.started');
  }
  return {
    type: TickStartedType,
    payload: cloneTickStartedPayload(payload),
    metadata,
  };
}

export function isTickStartedEvent(
  event: SimulationEvent,
): event is TickStartedEvent {
  return event.type === TickStartedType && validateTickStartedPayload(event.payload);
}

export function validateTickStartedPayload(
  value: unknown,
): value is TickStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<TickStartedPayload>;
  return (
    typeof payload.tick === 'number' && Number.isFinite(payload.tick) &&
    typeof payload.delta === 'number' && Number.isFinite(payload.delta) &&
    typeof payload.elapsed === 'number' && Number.isFinite(payload.elapsed)
  );
}

export function cloneTickStartedPayload(
  payload: TickStartedPayload,
): TickStartedPayload {
  return cloneJson(payload);
}

export function equalTickStartedPayload(
  left: TickStartedPayload,
  right: TickStartedPayload,
): boolean {
  return (
    left.tick === right.tick &&
    left.delta === right.delta &&
    left.elapsed === right.elapsed
  );
}

export function serializeTickStartedPayload(
  payload: TickStartedPayload,
): string {
  if (!validateTickStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.tick.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeTickStartedPayload(
  serialized: string,
): TickStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateTickStartedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.tick.started payload');
  }
  return cloneTickStartedPayload(value);
}
