import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const WaveStartedType = 'world.wave.started' as const;

export interface WaveStartedPayload extends JsonObject {
  roomId: string;
  wave: number;
  enemyCount: number;
}

export type WaveStartedEvent = SimulationEvent<WaveStartedPayload>;

export function createWaveStartedPayload(
  overrides: Partial<WaveStartedPayload> = {},
): WaveStartedPayload {
  return {
    roomId: '',
    wave: 0,
    enemyCount: 0,
    ...overrides,
  };
}

export function createWaveStartedDraft(
  payload: WaveStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<WaveStartedPayload> {
  if (!validateWaveStartedPayload(payload)) {
    throw new TypeError('Invalid payload for world.wave.started');
  }
  return {
    type: WaveStartedType,
    payload: cloneWaveStartedPayload(payload),
    metadata,
  };
}

export function isWaveStartedEvent(
  event: SimulationEvent,
): event is WaveStartedEvent {
  return event.type === WaveStartedType && validateWaveStartedPayload(event.payload);
}

export function validateWaveStartedPayload(
  value: unknown,
): value is WaveStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<WaveStartedPayload>;
  return (
    typeof payload.roomId === 'string' &&
    typeof payload.wave === 'number' && Number.isFinite(payload.wave) &&
    typeof payload.enemyCount === 'number' && Number.isFinite(payload.enemyCount)
  );
}

export function cloneWaveStartedPayload(
  payload: WaveStartedPayload,
): WaveStartedPayload {
  return cloneJson(payload);
}

export function equalWaveStartedPayload(
  left: WaveStartedPayload,
  right: WaveStartedPayload,
): boolean {
  return (
    left.roomId === right.roomId &&
    left.wave === right.wave &&
    left.enemyCount === right.enemyCount
  );
}

export function serializeWaveStartedPayload(
  payload: WaveStartedPayload,
): string {
  if (!validateWaveStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid world.wave.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeWaveStartedPayload(
  serialized: string,
): WaveStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateWaveStartedPayload(value)) {
    throw new TypeError('Serialized value is not a world.wave.started payload');
  }
  return cloneWaveStartedPayload(value);
}
