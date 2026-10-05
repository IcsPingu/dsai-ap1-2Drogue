import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const FrameCompletedType = 'simulation.frame.completed' as const;

export interface FrameCompletedPayload extends JsonObject {
  frame: number;
  steps: number;
  alpha: number;
  dropped: number;
}

export type FrameCompletedEvent = SimulationEvent<FrameCompletedPayload>;

export function createFrameCompletedPayload(
  overrides: Partial<FrameCompletedPayload> = {},
): FrameCompletedPayload {
  return {
    frame: 0,
    steps: 0,
    alpha: 0,
    dropped: 0,
    ...overrides,
  };
}

export function createFrameCompletedDraft(
  payload: FrameCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<FrameCompletedPayload> {
  if (!validateFrameCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.frame.completed');
  }
  return {
    type: FrameCompletedType,
    payload: cloneFrameCompletedPayload(payload),
    metadata,
  };
}

export function isFrameCompletedEvent(
  event: SimulationEvent,
): event is FrameCompletedEvent {
  return event.type === FrameCompletedType && validateFrameCompletedPayload(event.payload);
}

export function validateFrameCompletedPayload(
  value: unknown,
): value is FrameCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<FrameCompletedPayload>;
  return (
    typeof payload.frame === 'number' && Number.isFinite(payload.frame) &&
    typeof payload.steps === 'number' && Number.isFinite(payload.steps) &&
    typeof payload.alpha === 'number' && Number.isFinite(payload.alpha) &&
    typeof payload.dropped === 'number' && Number.isFinite(payload.dropped)
  );
}

export function cloneFrameCompletedPayload(
  payload: FrameCompletedPayload,
): FrameCompletedPayload {
  return cloneJson(payload);
}

export function equalFrameCompletedPayload(
  left: FrameCompletedPayload,
  right: FrameCompletedPayload,
): boolean {
  return (
    left.frame === right.frame &&
    left.steps === right.steps &&
    left.alpha === right.alpha &&
    left.dropped === right.dropped
  );
}

export function serializeFrameCompletedPayload(
  payload: FrameCompletedPayload,
): string {
  if (!validateFrameCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.frame.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeFrameCompletedPayload(
  serialized: string,
): FrameCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateFrameCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.frame.completed payload');
  }
  return cloneFrameCompletedPayload(value);
}
