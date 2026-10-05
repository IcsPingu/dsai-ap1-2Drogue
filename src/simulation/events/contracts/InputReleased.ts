import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const InputReleasedType = 'input.released' as const;

export interface InputReleasedPayload extends JsonObject {
  device: string;
  action: string;
  value: number;
  player: number;
}

export type InputReleasedEvent = SimulationEvent<InputReleasedPayload>;

export function createInputReleasedPayload(
  overrides: Partial<InputReleasedPayload> = {},
): InputReleasedPayload {
  return {
    device: '',
    action: '',
    value: 0,
    player: 0,
    ...overrides,
  };
}

export function createInputReleasedDraft(
  payload: InputReleasedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<InputReleasedPayload> {
  if (!validateInputReleasedPayload(payload)) {
    throw new TypeError('Invalid payload for input.released');
  }
  return {
    type: InputReleasedType,
    payload: cloneInputReleasedPayload(payload),
    metadata,
  };
}

export function isInputReleasedEvent(
  event: SimulationEvent,
): event is InputReleasedEvent {
  return event.type === InputReleasedType && validateInputReleasedPayload(event.payload);
}

export function validateInputReleasedPayload(
  value: unknown,
): value is InputReleasedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<InputReleasedPayload>;
  return (
    typeof payload.device === 'string' &&
    typeof payload.action === 'string' &&
    typeof payload.value === 'number' && Number.isFinite(payload.value) &&
    typeof payload.player === 'number' && Number.isFinite(payload.player)
  );
}

export function cloneInputReleasedPayload(
  payload: InputReleasedPayload,
): InputReleasedPayload {
  return cloneJson(payload);
}

export function equalInputReleasedPayload(
  left: InputReleasedPayload,
  right: InputReleasedPayload,
): boolean {
  return (
    left.device === right.device &&
    left.action === right.action &&
    left.value === right.value &&
    left.player === right.player
  );
}

export function serializeInputReleasedPayload(
  payload: InputReleasedPayload,
): string {
  if (!validateInputReleasedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid input.released payload');
  }
  return JSON.stringify(payload);
}

export function deserializeInputReleasedPayload(
  serialized: string,
): InputReleasedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateInputReleasedPayload(value)) {
    throw new TypeError('Serialized value is not a input.released payload');
  }
  return cloneInputReleasedPayload(value);
}
