import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const DamageAppliedType = 'combat.damage.applied' as const;

export interface DamageAppliedPayload extends JsonObject {
  sourceId: number;
  targetId: number;
  amount: number;
  damageType: string;
  critical: boolean;
}

export type DamageAppliedEvent = SimulationEvent<DamageAppliedPayload>;

export function createDamageAppliedPayload(
  overrides: Partial<DamageAppliedPayload> = {},
): DamageAppliedPayload {
  return {
    sourceId: 0,
    targetId: 0,
    amount: 0,
    damageType: '',
    critical: false,
    ...overrides,
  };
}

export function createDamageAppliedDraft(
  payload: DamageAppliedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<DamageAppliedPayload> {
  if (!validateDamageAppliedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.damage.applied');
  }
  return {
    type: DamageAppliedType,
    payload: cloneDamageAppliedPayload(payload),
    metadata,
  };
}

export function isDamageAppliedEvent(
  event: SimulationEvent,
): event is DamageAppliedEvent {
  return event.type === DamageAppliedType && validateDamageAppliedPayload(event.payload);
}

export function validateDamageAppliedPayload(
  value: unknown,
): value is DamageAppliedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<DamageAppliedPayload>;
  return (
    typeof payload.sourceId === 'number' && Number.isFinite(payload.sourceId) &&
    typeof payload.targetId === 'number' && Number.isFinite(payload.targetId) &&
    typeof payload.amount === 'number' && Number.isFinite(payload.amount) &&
    typeof payload.damageType === 'string' &&
    typeof payload.critical === 'boolean'
  );
}

export function cloneDamageAppliedPayload(
  payload: DamageAppliedPayload,
): DamageAppliedPayload {
  return cloneJson(payload);
}

export function equalDamageAppliedPayload(
  left: DamageAppliedPayload,
  right: DamageAppliedPayload,
): boolean {
  return (
    left.sourceId === right.sourceId &&
    left.targetId === right.targetId &&
    left.amount === right.amount &&
    left.damageType === right.damageType &&
    left.critical === right.critical
  );
}

export function serializeDamageAppliedPayload(
  payload: DamageAppliedPayload,
): string {
  if (!validateDamageAppliedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.damage.applied payload');
  }
  return JSON.stringify(payload);
}

export function deserializeDamageAppliedPayload(
  serialized: string,
): DamageAppliedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateDamageAppliedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.damage.applied payload');
  }
  return cloneDamageAppliedPayload(value);
}
