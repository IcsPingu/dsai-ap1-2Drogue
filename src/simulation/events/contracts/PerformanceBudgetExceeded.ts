import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const PerformanceBudgetExceededType = 'diagnostic.performance.exceeded' as const;

export interface PerformanceBudgetExceededPayload extends JsonObject {
  systemId: string;
  duration: number;
  budget: number;
  tick: number;
}

export type PerformanceBudgetExceededEvent = SimulationEvent<PerformanceBudgetExceededPayload>;

export function createPerformanceBudgetExceededPayload(
  overrides: Partial<PerformanceBudgetExceededPayload> = {},
): PerformanceBudgetExceededPayload {
  return {
    systemId: '',
    duration: 0,
    budget: 0,
    tick: 0,
    ...overrides,
  };
}

export function createPerformanceBudgetExceededDraft(
  payload: PerformanceBudgetExceededPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<PerformanceBudgetExceededPayload> {
  if (!validatePerformanceBudgetExceededPayload(payload)) {
    throw new TypeError('Invalid payload for diagnostic.performance.exceeded');
  }
  return {
    type: PerformanceBudgetExceededType,
    payload: clonePerformanceBudgetExceededPayload(payload),
    metadata,
  };
}

export function isPerformanceBudgetExceededEvent(
  event: SimulationEvent,
): event is PerformanceBudgetExceededEvent {
  return event.type === PerformanceBudgetExceededType && validatePerformanceBudgetExceededPayload(event.payload);
}

export function validatePerformanceBudgetExceededPayload(
  value: unknown,
): value is PerformanceBudgetExceededPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<PerformanceBudgetExceededPayload>;
  return (
    typeof payload.systemId === 'string' &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration) &&
    typeof payload.budget === 'number' && Number.isFinite(payload.budget) &&
    typeof payload.tick === 'number' && Number.isFinite(payload.tick)
  );
}

export function clonePerformanceBudgetExceededPayload(
  payload: PerformanceBudgetExceededPayload,
): PerformanceBudgetExceededPayload {
  return cloneJson(payload);
}

export function equalPerformanceBudgetExceededPayload(
  left: PerformanceBudgetExceededPayload,
  right: PerformanceBudgetExceededPayload,
): boolean {
  return (
    left.systemId === right.systemId &&
    left.duration === right.duration &&
    left.budget === right.budget &&
    left.tick === right.tick
  );
}

export function serializePerformanceBudgetExceededPayload(
  payload: PerformanceBudgetExceededPayload,
): string {
  if (!validatePerformanceBudgetExceededPayload(payload)) {
    throw new TypeError('Cannot serialize invalid diagnostic.performance.exceeded payload');
  }
  return JSON.stringify(payload);
}

export function deserializePerformanceBudgetExceededPayload(
  serialized: string,
): PerformanceBudgetExceededPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validatePerformanceBudgetExceededPayload(value)) {
    throw new TypeError('Serialized value is not a diagnostic.performance.exceeded payload');
  }
  return clonePerformanceBudgetExceededPayload(value);
}
