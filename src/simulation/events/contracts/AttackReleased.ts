import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const AttackReleasedType = 'combat.attack.released' as const;

export interface AttackReleasedPayload extends JsonObject {
  attackerId: number;
  abilityId: string;
  x: number;
  y: number;
  angle: number;
}

export type AttackReleasedEvent = SimulationEvent<AttackReleasedPayload>;

export function createAttackReleasedPayload(
  overrides: Partial<AttackReleasedPayload> = {},
): AttackReleasedPayload {
  return {
    attackerId: 0,
    abilityId: '',
    x: 0,
    y: 0,
    angle: 0,
    ...overrides,
  };
}

export function createAttackReleasedDraft(
  payload: AttackReleasedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<AttackReleasedPayload> {
  if (!validateAttackReleasedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.attack.released');
  }
  return {
    type: AttackReleasedType,
    payload: cloneAttackReleasedPayload(payload),
    metadata,
  };
}

export function isAttackReleasedEvent(
  event: SimulationEvent,
): event is AttackReleasedEvent {
  return event.type === AttackReleasedType && validateAttackReleasedPayload(event.payload);
}

export function validateAttackReleasedPayload(
  value: unknown,
): value is AttackReleasedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<AttackReleasedPayload>;
  return (
    typeof payload.attackerId === 'number' && Number.isFinite(payload.attackerId) &&
    typeof payload.abilityId === 'string' &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y) &&
    typeof payload.angle === 'number' && Number.isFinite(payload.angle)
  );
}

export function cloneAttackReleasedPayload(
  payload: AttackReleasedPayload,
): AttackReleasedPayload {
  return cloneJson(payload);
}

export function equalAttackReleasedPayload(
  left: AttackReleasedPayload,
  right: AttackReleasedPayload,
): boolean {
  return (
    left.attackerId === right.attackerId &&
    left.abilityId === right.abilityId &&
    left.x === right.x &&
    left.y === right.y &&
    left.angle === right.angle
  );
}

export function serializeAttackReleasedPayload(
  payload: AttackReleasedPayload,
): string {
  if (!validateAttackReleasedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.attack.released payload');
  }
  return JSON.stringify(payload);
}

export function deserializeAttackReleasedPayload(
  serialized: string,
): AttackReleasedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateAttackReleasedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.attack.released payload');
  }
  return cloneAttackReleasedPayload(value);
}
