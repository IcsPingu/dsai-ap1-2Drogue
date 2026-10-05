import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DiagnosticMeasuredType = 'diagnostic.measured' as const;

export interface DiagnosticMeasuredPayload extends JsonObject {
  metric: string;
  value: number;
  unit: string;
  tick: number;
}

export type DiagnosticMeasuredEvent = SimulationEvent<DiagnosticMeasuredPayload>;

export function createDiagnosticMeasuredPayload(
  overrides: Partial<DiagnosticMeasuredPayload> = {},
): DiagnosticMeasuredPayload {
  return {
    metric: '',
    value: 0,
    unit: '',
    tick: 0,
    ...overrides,
  };
}

export function createDiagnosticMeasuredDraft(
  payload: DiagnosticMeasuredPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DiagnosticMeasuredPayload> {
  if (!validateDiagnosticMeasuredPayload(payload)) {
    throw new TypeError('Invalid payload for diagnostic.measured');
  }
  return {
    type: DiagnosticMeasuredType,
    payload: cloneDiagnosticMeasuredPayload(payload),
    metadata,
  };
}

export function isDiagnosticMeasuredEvent(
  event: SimulationEvent,
): event is DiagnosticMeasuredEvent {
  return event.type === DiagnosticMeasuredType && validateDiagnosticMeasuredPayload(event.payload);
}

export function validateDiagnosticMeasuredPayload(
  value: unknown,
): value is DiagnosticMeasuredPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DiagnosticMeasuredPayload>;
  return (
    typeof payload.metric === 'string' &&
    typeof payload.value === 'number' && Number.isFinite(payload.value) &&
    typeof payload.unit === 'string' &&
    typeof payload.tick === 'number' && Number.isFinite(payload.tick)
  );
}

export function cloneDiagnosticMeasuredPayload(
  payload: DiagnosticMeasuredPayload,
): DiagnosticMeasuredPayload {
  return cloneJson(payload);
}

export function equalDiagnosticMeasuredPayload(
  left: DiagnosticMeasuredPayload,
  right: DiagnosticMeasuredPayload,
): boolean {
  return (
    left.metric === right.metric &&
    left.value === right.value &&
    left.unit === right.unit &&
    left.tick === right.tick
  );
}

export function serializeDiagnosticMeasuredPayload(
  payload: DiagnosticMeasuredPayload,
): string {
  if (!validateDiagnosticMeasuredPayload(payload)) {
    throw new TypeError('Cannot serialize invalid diagnostic.measured payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDiagnosticMeasuredPayload(
  serialized: string,
): DiagnosticMeasuredPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDiagnosticMeasuredPayload(value)) {
    throw new TypeError('Serialized value is not a diagnostic.measured payload');
  }
  return cloneDiagnosticMeasuredPayload(value);
}
