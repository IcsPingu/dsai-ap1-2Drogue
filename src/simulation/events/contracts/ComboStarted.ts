import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ComboStartedType = 'combat.combo.started' as const;

export interface ComboStartedPayload extends JsonObject {
  entityId: number;
  comboId: string;
  input: string;
}

export type ComboStartedEvent = SimulationEvent<ComboStartedPayload>;

export function createComboStartedPayload(
  overrides: Partial<ComboStartedPayload> = {},
): ComboStartedPayload {
  return {
    entityId: 0,
    comboId: '',
    input: '',
    ...overrides,
  };
}

export function createComboStartedDraft(
  payload: ComboStartedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ComboStartedPayload> {
  if (!validateComboStartedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.combo.started');
  }
  return {
    type: ComboStartedType,
    payload: cloneComboStartedPayload(payload),
    metadata,
  };
}

export function isComboStartedEvent(
  event: SimulationEvent,
): event is ComboStartedEvent {
  return event.type === ComboStartedType && validateComboStartedPayload(event.payload);
}

export function validateComboStartedPayload(
  value: unknown,
): value is ComboStartedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ComboStartedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.comboId === 'string' &&
    typeof payload.input === 'string'
  );
}

export function cloneComboStartedPayload(
  payload: ComboStartedPayload,
): ComboStartedPayload {
  return cloneJson(payload);
}

export function equalComboStartedPayload(
  left: ComboStartedPayload,
  right: ComboStartedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.comboId === right.comboId &&
    left.input === right.input
  );
}

export function serializeComboStartedPayload(
  payload: ComboStartedPayload,
): string {
  if (!validateComboStartedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.combo.started payload');
  }
  return JSON.stringify(payload);
}

export function deserializeComboStartedPayload(
  serialized: string,
): ComboStartedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateComboStartedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.combo.started payload');
  }
  return cloneComboStartedPayload(value);
}
