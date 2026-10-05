import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DamageCalculatedType = 'combat.damage.calculated' as const;

export interface DamageCalculatedPayload extends JsonObject {
  sourceId: number;
  targetId: number;
  base: number;
  multiplier: number;
  result: number;
}

export type DamageCalculatedEvent = SimulationEvent<DamageCalculatedPayload>;

export function createDamageCalculatedPayload(
  overrides: Partial<DamageCalculatedPayload> = {},
): DamageCalculatedPayload {
  return {
    sourceId: 0,
    targetId: 0,
    base: 0,
    multiplier: 0,
    result: 0,
    ...overrides,
  };
}

export function createDamageCalculatedDraft(
  payload: DamageCalculatedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DamageCalculatedPayload> {
  if (!validateDamageCalculatedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.damage.calculated');
  }
  return {
    type: DamageCalculatedType,
    payload: cloneDamageCalculatedPayload(payload),
    metadata,
  };
}

export function isDamageCalculatedEvent(
  event: SimulationEvent,
): event is DamageCalculatedEvent {
  return event.type === DamageCalculatedType && validateDamageCalculatedPayload(event.payload);
}

export function validateDamageCalculatedPayload(
  value: unknown,
): value is DamageCalculatedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DamageCalculatedPayload>;
  return (
    typeof payload.sourceId === 'number' && Number.isFinite(payload.sourceId) &&
    typeof payload.targetId === 'number' && Number.isFinite(payload.targetId) &&
    typeof payload.base === 'number' && Number.isFinite(payload.base) &&
    typeof payload.multiplier === 'number' && Number.isFinite(payload.multiplier) &&
    typeof payload.result === 'number' && Number.isFinite(payload.result)
  );
}

export function cloneDamageCalculatedPayload(
  payload: DamageCalculatedPayload,
): DamageCalculatedPayload {
  return cloneJson(payload);
}

export function equalDamageCalculatedPayload(
  left: DamageCalculatedPayload,
  right: DamageCalculatedPayload,
): boolean {
  return (
    left.sourceId === right.sourceId &&
    left.targetId === right.targetId &&
    left.base === right.base &&
    left.multiplier === right.multiplier &&
    left.result === right.result
  );
}

export function serializeDamageCalculatedPayload(
  payload: DamageCalculatedPayload,
): string {
  if (!validateDamageCalculatedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.damage.calculated payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDamageCalculatedPayload(
  serialized: string,
): DamageCalculatedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDamageCalculatedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.damage.calculated payload');
  }
  return cloneDamageCalculatedPayload(value);
}
