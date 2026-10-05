import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ComboBrokenType = 'combat.combo.broken' as const;

export interface ComboBrokenPayload extends JsonObject {
  entityId: number;
  comboId: string;
  reason: string;
}

export type ComboBrokenEvent = SimulationEvent<ComboBrokenPayload>;

export function createComboBrokenPayload(
  overrides: Partial<ComboBrokenPayload> = {},
): ComboBrokenPayload {
  return {
    entityId: 0,
    comboId: '',
    reason: '',
    ...overrides,
  };
}

export function createComboBrokenDraft(
  payload: ComboBrokenPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ComboBrokenPayload> {
  if (!validateComboBrokenPayload(payload)) {
    throw new TypeError('Invalid payload for combat.combo.broken');
  }
  return {
    type: ComboBrokenType,
    payload: cloneComboBrokenPayload(payload),
    metadata,
  };
}

export function isComboBrokenEvent(
  event: SimulationEvent,
): event is ComboBrokenEvent {
  return event.type === ComboBrokenType && validateComboBrokenPayload(event.payload);
}

export function validateComboBrokenPayload(
  value: unknown,
): value is ComboBrokenPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ComboBrokenPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.comboId === 'string' &&
    typeof payload.reason === 'string'
  );
}

export function cloneComboBrokenPayload(
  payload: ComboBrokenPayload,
): ComboBrokenPayload {
  return cloneJson(payload);
}

export function equalComboBrokenPayload(
  left: ComboBrokenPayload,
  right: ComboBrokenPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.comboId === right.comboId &&
    left.reason === right.reason
  );
}

export function serializeComboBrokenPayload(
  payload: ComboBrokenPayload,
): string {
  if (!validateComboBrokenPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.combo.broken payload');
  }
  return JSON.stringify(payload);
}

export function deserializeComboBrokenPayload(
  serialized: string,
): ComboBrokenPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateComboBrokenPayload(value)) {
    throw new TypeError('Serialized value is not a combat.combo.broken payload');
  }
  return cloneComboBrokenPayload(value);
}
