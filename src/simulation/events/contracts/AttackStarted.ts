import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const AttackStartedType = 'combat.attack.started' as const;

export interface AttackStartedPayload extends JsonObject {
  attackerId: number;
  targetId: number;
  abilityId: string;
  windup: number;
}

export type AttackStartedEvent = SimulationEvent<AttackStartedPayload>;

export function createAttackStartedPayload(
  overrides: Partial<AttackStartedPayload> = {},
): AttackStartedPayload {
  return {
    attackerId: 0,
    targetId: 0,
    abilityId: '',
    windup: 0,
    ...overrides,
  };
}

export function createAttackStartedDraft(
  payload: AttackStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<AttackStartedPayload> {
  if (!validateAttackStartedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.attack.started');
  }
  return {
    type: AttackStartedType,
    payload: cloneAttackStartedPayload(payload),
    metadata,
  };
}

export function isAttackStartedEvent(
  event: SimulationEvent,
): event is AttackStartedEvent {
  return event.type === AttackStartedType && validateAttackStartedPayload(event.payload);
}

export function validateAttackStartedPayload(
  value: unknown,
): value is AttackStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<AttackStartedPayload>;
  return (
    typeof payload.attackerId === 'number' && Number.isFinite(payload.attackerId) &&
    typeof payload.targetId === 'number' && Number.isFinite(payload.targetId) &&
    typeof payload.abilityId === 'string' &&
    typeof payload.windup === 'number' && Number.isFinite(payload.windup)
  );
}

export function cloneAttackStartedPayload(
  payload: AttackStartedPayload,
): AttackStartedPayload {
  return cloneJson(payload);
}

export function equalAttackStartedPayload(
  left: AttackStartedPayload,
  right: AttackStartedPayload,
): boolean {
  return (
    left.attackerId === right.attackerId &&
    left.targetId === right.targetId &&
    left.abilityId === right.abilityId &&
    left.windup === right.windup
  );
}

export function serializeAttackStartedPayload(
  payload: AttackStartedPayload,
): string {
  if (!validateAttackStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.attack.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeAttackStartedPayload(
  serialized: string,
): AttackStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateAttackStartedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.attack.started payload');
  }
  return cloneAttackStartedPayload(value);
}
