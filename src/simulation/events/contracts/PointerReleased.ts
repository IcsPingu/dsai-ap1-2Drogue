import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const PointerReleasedType = 'input.pointer.released' as const;

export interface PointerReleasedPayload extends JsonObject {
  button: number;
  worldX: number;
  worldY: number;
}

export type PointerReleasedEvent = SimulationEvent<PointerReleasedPayload>;

export function createPointerReleasedPayload(
  overrides: Partial<PointerReleasedPayload> = {},
): PointerReleasedPayload {
  return {
    button: 0,
    worldX: 0,
    worldY: 0,
    ...overrides,
  };
}

export function createPointerReleasedDraft(
  payload: PointerReleasedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<PointerReleasedPayload> {
  if (!validatePointerReleasedPayload(payload)) {
    throw new TypeError('Invalid payload for input.pointer.released');
  }
  return {
    type: PointerReleasedType,
    payload: clonePointerReleasedPayload(payload),
    metadata,
  };
}

export function isPointerReleasedEvent(
  event: SimulationEvent,
): event is PointerReleasedEvent {
  return event.type === PointerReleasedType && validatePointerReleasedPayload(event.payload);
}

export function validatePointerReleasedPayload(
  value: unknown,
): value is PointerReleasedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<PointerReleasedPayload>;
  return (
    typeof payload.button === 'number' && Number.isFinite(payload.button) &&
    typeof payload.worldX === 'number' && Number.isFinite(payload.worldX) &&
    typeof payload.worldY === 'number' && Number.isFinite(payload.worldY)
  );
}

export function clonePointerReleasedPayload(
  payload: PointerReleasedPayload,
): PointerReleasedPayload {
  return cloneJson(payload);
}

export function equalPointerReleasedPayload(
  left: PointerReleasedPayload,
  right: PointerReleasedPayload,
): boolean {
  return (
    left.button === right.button &&
    left.worldX === right.worldX &&
    left.worldY === right.worldY
  );
}

export function serializePointerReleasedPayload(
  payload: PointerReleasedPayload,
): string {
  if (!validatePointerReleasedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid input.pointer.released payload');
  }
  return JSON.stringify(payload);
}

export function deserializePointerReleasedPayload(
  serialized: string,
): PointerReleasedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validatePointerReleasedPayload(value)) {
    throw new TypeError('Serialized value is not a input.pointer.released payload');
  }
  return clonePointerReleasedPayload(value);
}
