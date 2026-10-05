import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const WaveCompletedType = 'world.wave.completed' as const;

export interface WaveCompletedPayload extends JsonObject {
  roomId: string;
  wave: number;
  duration: number;
}

export type WaveCompletedEvent = SimulationEvent<WaveCompletedPayload>;

export function createWaveCompletedPayload(
  overrides: Partial<WaveCompletedPayload> = {},
): WaveCompletedPayload {
  return {
    roomId: '',
    wave: 0,
    duration: 0,
    ...overrides,
  };
}

export function createWaveCompletedDraft(
  payload: WaveCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<WaveCompletedPayload> {
  if (!validateWaveCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for world.wave.completed');
  }
  return {
    type: WaveCompletedType,
    payload: cloneWaveCompletedPayload(payload),
    metadata,
  };
}

export function isWaveCompletedEvent(
  event: SimulationEvent,
): event is WaveCompletedEvent {
  return event.type === WaveCompletedType && validateWaveCompletedPayload(event.payload);
}

export function validateWaveCompletedPayload(
  value: unknown,
): value is WaveCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<WaveCompletedPayload>;
  return (
    typeof payload.roomId === 'string' &&
    typeof payload.wave === 'number' && Number.isFinite(payload.wave) &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneWaveCompletedPayload(
  payload: WaveCompletedPayload,
): WaveCompletedPayload {
  return cloneJson(payload);
}

export function equalWaveCompletedPayload(
  left: WaveCompletedPayload,
  right: WaveCompletedPayload,
): boolean {
  return (
    left.roomId === right.roomId &&
    left.wave === right.wave &&
    left.duration === right.duration
  );
}

export function serializeWaveCompletedPayload(
  payload: WaveCompletedPayload,
): string {
  if (!validateWaveCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.wave.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeWaveCompletedPayload(
  serialized: string,
): WaveCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateWaveCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a world.wave.completed payload');
  }
  return cloneWaveCompletedPayload(value);
}
