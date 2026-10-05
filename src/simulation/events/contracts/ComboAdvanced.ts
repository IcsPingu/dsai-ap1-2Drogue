import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ComboAdvancedType = 'combat.combo.advanced' as const;

export interface ComboAdvancedPayload extends JsonObject {
  entityId: number;
  comboId: string;
  step: number;
  input: string;
}

export type ComboAdvancedEvent = SimulationEvent<ComboAdvancedPayload>;

export function createComboAdvancedPayload(
  overrides: Partial<ComboAdvancedPayload> = {},
): ComboAdvancedPayload {
  return {
    entityId: 0,
    comboId: '',
    step: 0,
    input: '',
    ...overrides,
  };
}

export function createComboAdvancedDraft(
  payload: ComboAdvancedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ComboAdvancedPayload> {
  if (!validateComboAdvancedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.combo.advanced');
  }
  return {
    type: ComboAdvancedType,
    payload: cloneComboAdvancedPayload(payload),
    metadata,
  };
}

export function isComboAdvancedEvent(
  event: SimulationEvent,
): event is ComboAdvancedEvent {
  return event.type === ComboAdvancedType && validateComboAdvancedPayload(event.payload);
}

export function validateComboAdvancedPayload(
  value: unknown,
): value is ComboAdvancedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ComboAdvancedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.comboId === 'string' &&
    typeof payload.step === 'number' && Number.isFinite(payload.step) &&
    typeof payload.input === 'string'
  );
}

export function cloneComboAdvancedPayload(
  payload: ComboAdvancedPayload,
): ComboAdvancedPayload {
  return cloneJson(payload);
}

export function equalComboAdvancedPayload(
  left: ComboAdvancedPayload,
  right: ComboAdvancedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.comboId === right.comboId &&
    left.step === right.step &&
    left.input === right.input
  );
}

export function serializeComboAdvancedPayload(
  payload: ComboAdvancedPayload,
): string {
  if (!validateComboAdvancedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.combo.advanced payload');
  }
  return JSON.stringify(payload);
}

export function deserializeComboAdvancedPayload(
  serialized: string,
): ComboAdvancedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateComboAdvancedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.combo.advanced payload');
  }
  return cloneComboAdvancedPayload(value);
}
