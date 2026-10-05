import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const CheckpointReachedType = 'progression.checkpoint.reached' as const;

export interface CheckpointReachedPayload extends JsonObject {
  checkpointId: string;
  roomId: string;
  tick: number;
}

export type CheckpointReachedEvent = SimulationEvent<CheckpointReachedPayload>;

export function createCheckpointReachedPayload(
  overrides: Partial<CheckpointReachedPayload> = {},
): CheckpointReachedPayload {
  return {
    checkpointId: '',
    roomId: '',
    tick: 0,
    ...overrides,
  };
}

export function createCheckpointReachedDraft(
  payload: CheckpointReachedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<CheckpointReachedPayload> {
  if (!validateCheckpointReachedPayload(payload)) {
    throw new TypeError('Invalid payload for progression.checkpoint.reached');
  }
  return {
    type: CheckpointReachedType,
    payload: cloneCheckpointReachedPayload(payload),
    metadata,
  };
}

export function isCheckpointReachedEvent(
  event: SimulationEvent,
): event is CheckpointReachedEvent {
  return event.type === CheckpointReachedType && validateCheckpointReachedPayload(event.payload);
}

export function validateCheckpointReachedPayload(
  value: unknown,
): value is CheckpointReachedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<CheckpointReachedPayload>;
  return (
    typeof payload.checkpointId === 'string' &&
    typeof payload.roomId === 'string' &&
    typeof payload.tick === 'number' && Number.isFinite(payload.tick)
  );
}

export function cloneCheckpointReachedPayload(
  payload: CheckpointReachedPayload,
): CheckpointReachedPayload {
  return cloneJson(payload);
}

export function equalCheckpointReachedPayload(
  left: CheckpointReachedPayload,
  right: CheckpointReachedPayload,
): boolean {
  return (
    left.checkpointId === right.checkpointId &&
    left.roomId === right.roomId &&
    left.tick === right.tick
  );
}

export function serializeCheckpointReachedPayload(
  payload: CheckpointReachedPayload,
): string {
  if (!validateCheckpointReachedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid progression.checkpoint.reached payload');
  }
  return JSON.stringify(payload);
}

export function deserializeCheckpointReachedPayload(
  serialized: string,
): CheckpointReachedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateCheckpointReachedPayload(value)) {
    throw new TypeError('Serialized value is not a progression.checkpoint.reached payload');
  }
  return cloneCheckpointReachedPayload(value);
}
