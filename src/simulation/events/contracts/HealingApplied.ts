import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const HealingAppliedType = 'combat.healing.applied' as const;

export interface HealingAppliedPayload extends JsonObject {
  sourceId: number;
  targetId: number;
  amount: number;
  overheal: number;
}

export type HealingAppliedEvent = SimulationEvent<HealingAppliedPayload>;

export function createHealingAppliedPayload(
  overrides: Partial<HealingAppliedPayload> = {},
): HealingAppliedPayload {
  return {
    sourceId: 0,
    targetId: 0,
    amount: 0,
    overheal: 0,
    ...overrides,
  };
}

export function createHealingAppliedDraft(
  payload: HealingAppliedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<HealingAppliedPayload> {
  if (!validateHealingAppliedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.healing.applied');
  }
  return {
    type: HealingAppliedType,
    payload: cloneHealingAppliedPayload(payload),
    metadata,
  };
}

export function isHealingAppliedEvent(
  event: SimulationEvent,
): event is HealingAppliedEvent {
  return event.type === HealingAppliedType && validateHealingAppliedPayload(event.payload);
}

export function validateHealingAppliedPayload(
  value: unknown,
): value is HealingAppliedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<HealingAppliedPayload>;
  return (
    typeof payload.sourceId === 'number' && Number.isFinite(payload.sourceId) &&
    typeof payload.targetId === 'number' && Number.isFinite(payload.targetId) &&
    typeof payload.amount === 'number' && Number.isFinite(payload.amount) &&
    typeof payload.overheal === 'number' && Number.isFinite(payload.overheal)
  );
}

export function cloneHealingAppliedPayload(
  payload: HealingAppliedPayload,
): HealingAppliedPayload {
  return cloneJson(payload);
}

export function equalHealingAppliedPayload(
  left: HealingAppliedPayload,
  right: HealingAppliedPayload,
): boolean {
  return (
    left.sourceId === right.sourceId &&
    left.targetId === right.targetId &&
    left.amount === right.amount &&
    left.overheal === right.overheal
  );
}

export function serializeHealingAppliedPayload(
  payload: HealingAppliedPayload,
): string {
  if (!validateHealingAppliedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.healing.applied payload');
  }
  return JSON.stringify(payload);
}

export function deserializeHealingAppliedPayload(
  serialized: string,
): HealingAppliedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateHealingAppliedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.healing.applied payload');
  }
  return cloneHealingAppliedPayload(value);
}
