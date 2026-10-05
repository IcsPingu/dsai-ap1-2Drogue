import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const InputPressedType = 'input.pressed' as const;

export interface InputPressedPayload extends JsonObject {
  device: string;
  action: string;
  value: number;
  player: number;
}

export type InputPressedEvent = SimulationEvent<InputPressedPayload>;

export function createInputPressedPayload(
  overrides: Partial<InputPressedPayload> = {},
): InputPressedPayload {
  return {
    device: '',
    action: '',
    value: 0,
    player: 0,
    ...overrides,
  };
}

export function createInputPressedDraft(
  payload: InputPressedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<InputPressedPayload> {
  if (!validateInputPressedPayload(payload)) {
    throw new TypeError('Invalid payload for input.pressed');
  }
  return {
    type: InputPressedType,
    payload: cloneInputPressedPayload(payload),
    metadata,
  };
}

export function isInputPressedEvent(
  event: SimulationEvent,
): event is InputPressedEvent {
  return event.type === InputPressedType && validateInputPressedPayload(event.payload);
}

export function validateInputPressedPayload(
  value: unknown,
): value is InputPressedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<InputPressedPayload>;
  return (
    typeof payload.device === 'string' &&
    typeof payload.action === 'string' &&
    typeof payload.value === 'number' && Number.isFinite(payload.value) &&
    typeof payload.player === 'number' && Number.isFinite(payload.player)
  );
}

export function cloneInputPressedPayload(
  payload: InputPressedPayload,
): InputPressedPayload {
  return cloneJson(payload);
}

export function equalInputPressedPayload(
  left: InputPressedPayload,
  right: InputPressedPayload,
): boolean {
  return (
    left.device === right.device &&
    left.action === right.action &&
    left.value === right.value &&
    left.player === right.player
  );
}

export function serializeInputPressedPayload(
  payload: InputPressedPayload,
): string {
  if (!validateInputPressedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid input.pressed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeInputPressedPayload(
  serialized: string,
): InputPressedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateInputPressedPayload(value)) {
    throw new TypeError('Serialized value is not a input.pressed payload');
  }
  return cloneInputPressedPayload(value);
}
