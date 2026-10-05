import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ComboCompletedType = 'combat.combo.completed' as const;

export interface ComboCompletedPayload extends JsonObject {
  entityId: number;
  comboId: string;
  hits: number;
  score: number;
}

export type ComboCompletedEvent = SimulationEvent<ComboCompletedPayload>;

export function createComboCompletedPayload(
  overrides: Partial<ComboCompletedPayload> = {},
): ComboCompletedPayload {
  return {
    entityId: 0,
    comboId: '',
    hits: 0,
    score: 0,
    ...overrides,
  };
}

export function createComboCompletedDraft(
  payload: ComboCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ComboCompletedPayload> {
  if (!validateComboCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.combo.completed');
  }
  return {
    type: ComboCompletedType,
    payload: cloneComboCompletedPayload(payload),
    metadata,
  };
}

export function isComboCompletedEvent(
  event: SimulationEvent,
): event is ComboCompletedEvent {
  return event.type === ComboCompletedType && validateComboCompletedPayload(event.payload);
}

export function validateComboCompletedPayload(
  value: unknown,
): value is ComboCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ComboCompletedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.comboId === 'string' &&
    typeof payload.hits === 'number' && Number.isFinite(payload.hits) &&
    typeof payload.score === 'number' && Number.isFinite(payload.score)
  );
}

export function cloneComboCompletedPayload(
  payload: ComboCompletedPayload,
): ComboCompletedPayload {
  return cloneJson(payload);
}

export function equalComboCompletedPayload(
  left: ComboCompletedPayload,
  right: ComboCompletedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.comboId === right.comboId &&
    left.hits === right.hits &&
    left.score === right.score
  );
}

export function serializeComboCompletedPayload(
  payload: ComboCompletedPayload,
): string {
  if (!validateComboCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.combo.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeComboCompletedPayload(
  serialized: string,
): ComboCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateComboCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.combo.completed payload');
  }
  return cloneComboCompletedPayload(value);
}
