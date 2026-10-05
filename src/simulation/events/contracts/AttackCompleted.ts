import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const AttackCompletedType = 'combat.attack.completed' as const;

export interface AttackCompletedPayload extends JsonObject {
  attackerId: number;
  abilityId: string;
  hits: number;
  damage: number;
}

export type AttackCompletedEvent = SimulationEvent<AttackCompletedPayload>;

export function createAttackCompletedPayload(
  overrides: Partial<AttackCompletedPayload> = {},
): AttackCompletedPayload {
  return {
    attackerId: 0,
    abilityId: '',
    hits: 0,
    damage: 0,
    ...overrides,
  };
}

export function createAttackCompletedDraft(
  payload: AttackCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<AttackCompletedPayload> {
  if (!validateAttackCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.attack.completed');
  }
  return {
    type: AttackCompletedType,
    payload: cloneAttackCompletedPayload(payload),
    metadata,
  };
}

export function isAttackCompletedEvent(
  event: SimulationEvent,
): event is AttackCompletedEvent {
  return event.type === AttackCompletedType && validateAttackCompletedPayload(event.payload);
}

export function validateAttackCompletedPayload(
  value: unknown,
): value is AttackCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<AttackCompletedPayload>;
  return (
    typeof payload.attackerId === 'number' && Number.isFinite(payload.attackerId) &&
    typeof payload.abilityId === 'string' &&
    typeof payload.hits === 'number' && Number.isFinite(payload.hits) &&
    typeof payload.damage === 'number' && Number.isFinite(payload.damage)
  );
}

export function cloneAttackCompletedPayload(
  payload: AttackCompletedPayload,
): AttackCompletedPayload {
  return cloneJson(payload);
}

export function equalAttackCompletedPayload(
  left: AttackCompletedPayload,
  right: AttackCompletedPayload,
): boolean {
  return (
    left.attackerId === right.attackerId &&
    left.abilityId === right.abilityId &&
    left.hits === right.hits &&
    left.damage === right.damage
  );
}

export function serializeAttackCompletedPayload(
  payload: AttackCompletedPayload,
): string {
  if (!validateAttackCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.attack.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeAttackCompletedPayload(
  serialized: string,
): AttackCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateAttackCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.attack.completed payload');
  }
  return cloneAttackCompletedPayload(value);
}
