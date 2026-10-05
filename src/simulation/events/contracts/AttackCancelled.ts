import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const AttackCancelledType = 'combat.attack.cancelled' as const;

export interface AttackCancelledPayload extends JsonObject {
  attackerId: number;
  abilityId: string;
  reason: string;
}

export type AttackCancelledEvent = SimulationEvent<AttackCancelledPayload>;

export function createAttackCancelledPayload(
  overrides: Partial<AttackCancelledPayload> = {},
): AttackCancelledPayload {
  return {
    attackerId: 0,
    abilityId: '',
    reason: '',
    ...overrides,
  };
}

export function createAttackCancelledDraft(
  payload: AttackCancelledPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<AttackCancelledPayload> {
  if (!validateAttackCancelledPayload(payload)) {
    throw new TypeError('Invalid payload for combat.attack.cancelled');
  }
  return {
    type: AttackCancelledType,
    payload: cloneAttackCancelledPayload(payload),
    metadata,
  };
}

export function isAttackCancelledEvent(
  event: SimulationEvent,
): event is AttackCancelledEvent {
  return event.type === AttackCancelledType && validateAttackCancelledPayload(event.payload);
}

export function validateAttackCancelledPayload(
  value: unknown,
): value is AttackCancelledPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<AttackCancelledPayload>;
  return (
    typeof payload.attackerId === 'number' && Number.isFinite(payload.attackerId) &&
    typeof payload.abilityId === 'string' &&
    typeof payload.reason === 'string'
  );
}

export function cloneAttackCancelledPayload(
  payload: AttackCancelledPayload,
): AttackCancelledPayload {
  return cloneJson(payload);
}

export function equalAttackCancelledPayload(
  left: AttackCancelledPayload,
  right: AttackCancelledPayload,
): boolean {
  return (
    left.attackerId === right.attackerId &&
    left.abilityId === right.abilityId &&
    left.reason === right.reason
  );
}

export function serializeAttackCancelledPayload(
  payload: AttackCancelledPayload,
): string {
  if (!validateAttackCancelledPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.attack.cancelled payload');
  }
  return JSON.stringify(payload);
}

export function deserializeAttackCancelledPayload(
  serialized: string,
): AttackCancelledPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateAttackCancelledPayload(value)) {
    throw new TypeError('Serialized value is not a combat.attack.cancelled payload');
  }
  return cloneAttackCancelledPayload(value);
}
