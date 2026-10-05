import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const FrameStartedType = 'simulation.frame.started' as const;

export interface FrameStartedPayload extends JsonObject {
  frame: number;
  realDelta: number;
  speed: number;
}

export type FrameStartedEvent = SimulationEvent<FrameStartedPayload>;

export function createFrameStartedPayload(
  overrides: Partial<FrameStartedPayload> = {},
): FrameStartedPayload {
  return {
    frame: 0,
    realDelta: 0,
    speed: 0,
    ...overrides,
  };
}

export function createFrameStartedDraft(
  payload: FrameStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<FrameStartedPayload> {
  if (!validateFrameStartedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.frame.started');
  }
  return {
    type: FrameStartedType,
    payload: cloneFrameStartedPayload(payload),
    metadata,
  };
}

export function isFrameStartedEvent(
  event: SimulationEvent,
): event is FrameStartedEvent {
  return event.type === FrameStartedType && validateFrameStartedPayload(event.payload);
}

export function validateFrameStartedPayload(
  value: unknown,
): value is FrameStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<FrameStartedPayload>;
  return (
    typeof payload.frame === 'number' && Number.isFinite(payload.frame) &&
    typeof payload.realDelta === 'number' && Number.isFinite(payload.realDelta) &&
    typeof payload.speed === 'number' && Number.isFinite(payload.speed)
  );
}

export function cloneFrameStartedPayload(
  payload: FrameStartedPayload,
): FrameStartedPayload {
  return cloneJson(payload);
}

export function equalFrameStartedPayload(
  left: FrameStartedPayload,
  right: FrameStartedPayload,
): boolean {
  return (
    left.frame === right.frame &&
    left.realDelta === right.realDelta &&
    left.speed === right.speed
  );
}

export function serializeFrameStartedPayload(
  payload: FrameStartedPayload,
): string {
  if (!validateFrameStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.frame.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeFrameStartedPayload(
  serialized: string,
): FrameStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateFrameStartedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.frame.started payload');
  }
  return cloneFrameStartedPayload(value);
}
