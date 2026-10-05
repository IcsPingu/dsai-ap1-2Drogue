import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const RollbackCompletedType = 'simulation.rollback.completed' as const;

export interface RollbackCompletedPayload extends JsonObject {
  requestedTick: number;
  restoredTick: number;
  eventsReplayed: number;
}

export type RollbackCompletedEvent = SimulationEvent<RollbackCompletedPayload>;

export function createRollbackCompletedPayload(
  overrides: Partial<RollbackCompletedPayload> = {},
): RollbackCompletedPayload {
  return {
    requestedTick: 0,
    restoredTick: 0,
    eventsReplayed: 0,
    ...overrides,
  };
}

export function createRollbackCompletedDraft(
  payload: RollbackCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<RollbackCompletedPayload> {
  if (!validateRollbackCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.rollback.completed');
  }
  return {
    type: RollbackCompletedType,
    payload: cloneRollbackCompletedPayload(payload),
    metadata,
  };
}

export function isRollbackCompletedEvent(
  event: SimulationEvent,
): event is RollbackCompletedEvent {
  return event.type === RollbackCompletedType && validateRollbackCompletedPayload(event.payload);
}

export function validateRollbackCompletedPayload(
  value: unknown,
): value is RollbackCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<RollbackCompletedPayload>;
  return (
    typeof payload.requestedTick === 'number' && Number.isFinite(payload.requestedTick) &&
    typeof payload.restoredTick === 'number' && Number.isFinite(payload.restoredTick) &&
    typeof payload.eventsReplayed === 'number' && Number.isFinite(payload.eventsReplayed)
  );
}

export function cloneRollbackCompletedPayload(
  payload: RollbackCompletedPayload,
): RollbackCompletedPayload {
  return cloneJson(payload);
}

export function equalRollbackCompletedPayload(
  left: RollbackCompletedPayload,
  right: RollbackCompletedPayload,
): boolean {
  return (
    left.requestedTick === right.requestedTick &&
    left.restoredTick === right.restoredTick &&
    left.eventsReplayed === right.eventsReplayed
  );
}

export function serializeRollbackCompletedPayload(
  payload: RollbackCompletedPayload,
): string {
  if (!validateRollbackCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.rollback.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeRollbackCompletedPayload(
  serialized: string,
): RollbackCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateRollbackCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.rollback.completed payload');
  }
  return cloneRollbackCompletedPayload(value);
}
