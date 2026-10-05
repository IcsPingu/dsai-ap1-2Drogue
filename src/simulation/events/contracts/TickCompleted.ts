import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const TickCompletedType = 'simulation.tick.completed' as const;

export interface TickCompletedPayload extends JsonObject {
  tick: number;
  delta: number;
  systemsExecuted: number;
  systemsFailed: number;
}

export type TickCompletedEvent = SimulationEvent<TickCompletedPayload>;

export function createTickCompletedPayload(
  overrides: Partial<TickCompletedPayload> = {},
): TickCompletedPayload {
  return {
    tick: 0,
    delta: 0,
    systemsExecuted: 0,
    systemsFailed: 0,
    ...overrides,
  };
}

export function createTickCompletedDraft(
  payload: TickCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<TickCompletedPayload> {
  if (!validateTickCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.tick.completed');
  }
  return {
    type: TickCompletedType,
    payload: cloneTickCompletedPayload(payload),
    metadata,
  };
}

export function isTickCompletedEvent(
  event: SimulationEvent,
): event is TickCompletedEvent {
  return event.type === TickCompletedType && validateTickCompletedPayload(event.payload);
}

export function validateTickCompletedPayload(
  value: unknown,
): value is TickCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<TickCompletedPayload>;
  return (
    typeof payload.tick === 'number' && Number.isFinite(payload.tick) &&
    typeof payload.delta === 'number' && Number.isFinite(payload.delta) &&
    typeof payload.systemsExecuted === 'number' && Number.isFinite(payload.systemsExecuted) &&
    typeof payload.systemsFailed === 'number' && Number.isFinite(payload.systemsFailed)
  );
}

export function cloneTickCompletedPayload(
  payload: TickCompletedPayload,
): TickCompletedPayload {
  return cloneJson(payload);
}

export function equalTickCompletedPayload(
  left: TickCompletedPayload,
  right: TickCompletedPayload,
): boolean {
  return (
    left.tick === right.tick &&
    left.delta === right.delta &&
    left.systemsExecuted === right.systemsExecuted &&
    left.systemsFailed === right.systemsFailed
  );
}

export function serializeTickCompletedPayload(
  payload: TickCompletedPayload,
): string {
  if (!validateTickCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.tick.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeTickCompletedPayload(
  serialized: string,
): TickCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateTickCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.tick.completed payload');
  }
  return cloneTickCompletedPayload(value);
}
