import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DamagePreventedType = 'combat.damage.prevented' as const;

export interface DamagePreventedPayload extends JsonObject {
  sourceId: number;
  targetId: number;
  amount: number;
  reason: string;
}

export type DamagePreventedEvent = SimulationEvent<DamagePreventedPayload>;

export function createDamagePreventedPayload(
  overrides: Partial<DamagePreventedPayload> = {},
): DamagePreventedPayload {
  return {
    sourceId: 0,
    targetId: 0,
    amount: 0,
    reason: '',
    ...overrides,
  };
}

export function createDamagePreventedDraft(
  payload: DamagePreventedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DamagePreventedPayload> {
  if (!validateDamagePreventedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.damage.prevented');
  }
  return {
    type: DamagePreventedType,
    payload: cloneDamagePreventedPayload(payload),
    metadata,
  };
}

export function isDamagePreventedEvent(
  event: SimulationEvent,
): event is DamagePreventedEvent {
  return event.type === DamagePreventedType && validateDamagePreventedPayload(event.payload);
}

export function validateDamagePreventedPayload(
  value: unknown,
): value is DamagePreventedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DamagePreventedPayload>;
  return (
    typeof payload.sourceId === 'number' && Number.isFinite(payload.sourceId) &&
    typeof payload.targetId === 'number' && Number.isFinite(payload.targetId) &&
    typeof payload.amount === 'number' && Number.isFinite(payload.amount) &&
    typeof payload.reason === 'string'
  );
}

export function cloneDamagePreventedPayload(
  payload: DamagePreventedPayload,
): DamagePreventedPayload {
  return cloneJson(payload);
}

export function equalDamagePreventedPayload(
  left: DamagePreventedPayload,
  right: DamagePreventedPayload,
): boolean {
  return (
    left.sourceId === right.sourceId &&
    left.targetId === right.targetId &&
    left.amount === right.amount &&
    left.reason === right.reason
  );
}

export function serializeDamagePreventedPayload(
  payload: DamagePreventedPayload,
): string {
  if (!validateDamagePreventedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.damage.prevented payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDamagePreventedPayload(
  serialized: string,
): DamagePreventedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDamagePreventedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.damage.prevented payload');
  }
  return cloneDamagePreventedPayload(value);
}
