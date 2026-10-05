import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const RollbackRequestedType = 'simulation.rollback.requested' as const;

export interface RollbackRequestedPayload extends JsonObject {
  targetTick: number;
  reason: string;
  requestedBy: string;
}

export type RollbackRequestedEvent = SimulationEvent<RollbackRequestedPayload>;

export function createRollbackRequestedPayload(
  overrides: Partial<RollbackRequestedPayload> = {},
): RollbackRequestedPayload {
  return {
    targetTick: 0,
    reason: '',
    requestedBy: '',
    ...overrides,
  };
}

export function createRollbackRequestedDraft(
  payload: RollbackRequestedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<RollbackRequestedPayload> {
  if (!validateRollbackRequestedPayload(payload)) {
    throw new TypeError('Invalid payload for simulation.rollback.requested');
  }
  return {
    type: RollbackRequestedType,
    payload: cloneRollbackRequestedPayload(payload),
    metadata,
  };
}

export function isRollbackRequestedEvent(
  event: SimulationEvent,
): event is RollbackRequestedEvent {
  return event.type === RollbackRequestedType && validateRollbackRequestedPayload(event.payload);
}

export function validateRollbackRequestedPayload(
  value: unknown,
): value is RollbackRequestedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<RollbackRequestedPayload>;
  return (
    typeof payload.targetTick === 'number' && Number.isFinite(payload.targetTick) &&
    typeof payload.reason === 'string' &&
    typeof payload.requestedBy === 'string'
  );
}

export function cloneRollbackRequestedPayload(
  payload: RollbackRequestedPayload,
): RollbackRequestedPayload {
  return cloneJson(payload);
}

export function equalRollbackRequestedPayload(
  left: RollbackRequestedPayload,
  right: RollbackRequestedPayload,
): boolean {
  return (
    left.targetTick === right.targetTick &&
    left.reason === right.reason &&
    left.requestedBy === right.requestedBy
  );
}

export function serializeRollbackRequestedPayload(
  payload: RollbackRequestedPayload,
): string {
  if (!validateRollbackRequestedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid simulation.rollback.requested payload');
  }
  return JSON.stringify(payload);
}

export function deserializeRollbackRequestedPayload(
  serialized: string,
): RollbackRequestedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateRollbackRequestedPayload(value)) {
    throw new TypeError('Serialized value is not a simulation.rollback.requested payload');
  }
  return cloneRollbackRequestedPayload(value);
}
