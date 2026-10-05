import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const PointerPressedType = 'input.pointer.pressed' as const;

export interface PointerPressedPayload extends JsonObject {
  button: number;
  worldX: number;
  worldY: number;
}

export type PointerPressedEvent = SimulationEvent<PointerPressedPayload>;

export function createPointerPressedPayload(
  overrides: Partial<PointerPressedPayload> = {},
): PointerPressedPayload {
  return {
    button: 0,
    worldX: 0,
    worldY: 0,
    ...overrides,
  };
}

export function createPointerPressedDraft(
  payload: PointerPressedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<PointerPressedPayload> {
  if (!validatePointerPressedPayload(payload)) {
    throw new TypeError('Invalid payload for input.pointer.pressed');
  }
  return {
    type: PointerPressedType,
    payload: clonePointerPressedPayload(payload),
    metadata,
  };
}

export function isPointerPressedEvent(
  event: SimulationEvent,
): event is PointerPressedEvent {
  return event.type === PointerPressedType && validatePointerPressedPayload(event.payload);
}

export function validatePointerPressedPayload(
  value: unknown,
): value is PointerPressedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<PointerPressedPayload>;
  return (
    typeof payload.button === 'number' && Number.isFinite(payload.button) &&
    typeof payload.worldX === 'number' && Number.isFinite(payload.worldX) &&
    typeof payload.worldY === 'number' && Number.isFinite(payload.worldY)
  );
}

export function clonePointerPressedPayload(
  payload: PointerPressedPayload,
): PointerPressedPayload {
  return cloneJson(payload);
}

export function equalPointerPressedPayload(
  left: PointerPressedPayload,
  right: PointerPressedPayload,
): boolean {
  return (
    left.button === right.button &&
    left.worldX === right.worldX &&
    left.worldY === right.worldY
  );
}

export function serializePointerPressedPayload(
  payload: PointerPressedPayload,
): string {
  if (!validatePointerPressedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid input.pointer.pressed payload');
  }
  return JSON.stringify(payload);
}

export function deserializePointerPressedPayload(
  serialized: string,
): PointerPressedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validatePointerPressedPayload(value)) {
    throw new TypeError('Serialized value is not a input.pointer.pressed payload');
  }
  return clonePointerPressedPayload(value);
}
