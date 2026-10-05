import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const PointerMovedType = 'input.pointer.moved' as const;

export interface PointerMovedPayload extends JsonObject {
  x: number;
  y: number;
  worldX: number;
  worldY: number;
}

export type PointerMovedEvent = SimulationEvent<PointerMovedPayload>;

export function createPointerMovedPayload(
  overrides: Partial<PointerMovedPayload> = {},
): PointerMovedPayload {
  return {
    x: 0,
    y: 0,
    worldX: 0,
    worldY: 0,
    ...overrides,
  };
}

export function createPointerMovedDraft(
  payload: PointerMovedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<PointerMovedPayload> {
  if (!validatePointerMovedPayload(payload)) {
    throw new TypeError('Invalid payload for input.pointer.moved');
  }
  return {
    type: PointerMovedType,
    payload: clonePointerMovedPayload(payload),
    metadata,
  };
}

export function isPointerMovedEvent(
  event: SimulationEvent,
): event is PointerMovedEvent {
  return event.type === PointerMovedType && validatePointerMovedPayload(event.payload);
}

export function validatePointerMovedPayload(
  value: unknown,
): value is PointerMovedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<PointerMovedPayload>;
  return (
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y) &&
    typeof payload.worldX === 'number' && Number.isFinite(payload.worldX) &&
    typeof payload.worldY === 'number' && Number.isFinite(payload.worldY)
  );
}

export function clonePointerMovedPayload(
  payload: PointerMovedPayload,
): PointerMovedPayload {
  return cloneJson(payload);
}

export function equalPointerMovedPayload(
  left: PointerMovedPayload,
  right: PointerMovedPayload,
): boolean {
  return (
    left.x === right.x &&
    left.y === right.y &&
    left.worldX === right.worldX &&
    left.worldY === right.worldY
  );
}

export function serializePointerMovedPayload(
  payload: PointerMovedPayload,
): string {
  if (!validatePointerMovedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid input.pointer.moved payload');
  }
  return JSON.stringify(payload);
}

export function deserializePointerMovedPayload(
  serialized: string,
): PointerMovedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validatePointerMovedPayload(value)) {
    throw new TypeError('Serialized value is not a input.pointer.moved payload');
  }
  return clonePointerMovedPayload(value);
}
