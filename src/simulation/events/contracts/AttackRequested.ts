import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const AttackRequestedType = 'combat.attack.requested' as const;

export interface AttackRequestedPayload extends JsonObject {
  attackerId: number;
  targetId: number;
  abilityId: string;
  sequence: number;
}

export type AttackRequestedEvent = SimulationEvent<AttackRequestedPayload>;

export function createAttackRequestedPayload(
  overrides: Partial<AttackRequestedPayload> = {},
): AttackRequestedPayload {
  return {
    attackerId: 0,
    targetId: 0,
    abilityId: '',
    sequence: 0,
    ...overrides,
  };
}

export function createAttackRequestedDraft(
  payload: AttackRequestedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<AttackRequestedPayload> {
  if (!validateAttackRequestedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.attack.requested');
  }
  return {
    type: AttackRequestedType,
    payload: cloneAttackRequestedPayload(payload),
    metadata,
  };
}

export function isAttackRequestedEvent(
  event: SimulationEvent,
): event is AttackRequestedEvent {
  return event.type === AttackRequestedType && validateAttackRequestedPayload(event.payload);
}

export function validateAttackRequestedPayload(
  value: unknown,
): value is AttackRequestedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<AttackRequestedPayload>;
  return (
    typeof payload.attackerId === 'number' && Number.isFinite(payload.attackerId) &&
    typeof payload.targetId === 'number' && Number.isFinite(payload.targetId) &&
    typeof payload.abilityId === 'string' &&
    typeof payload.sequence === 'number' && Number.isFinite(payload.sequence)
  );
}

export function cloneAttackRequestedPayload(
  payload: AttackRequestedPayload,
): AttackRequestedPayload {
  return cloneJson(payload);
}

export function equalAttackRequestedPayload(
  left: AttackRequestedPayload,
  right: AttackRequestedPayload,
): boolean {
  return (
    left.attackerId === right.attackerId &&
    left.targetId === right.targetId &&
    left.abilityId === right.abilityId &&
    left.sequence === right.sequence
  );
}

export function serializeAttackRequestedPayload(
  payload: AttackRequestedPayload,
): string {
  if (!validateAttackRequestedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.attack.requested payload');
  }
  return JSON.stringify(payload);
}

export function deserializeAttackRequestedPayload(
  serialized: string,
): AttackRequestedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateAttackRequestedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.attack.requested payload');
  }
  return cloneAttackRequestedPayload(value);
}
