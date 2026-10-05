import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const PositionChangedType = 'movement.position.changed' as const;

export interface PositionChangedPayload extends JsonObject {
  entityId: number;
  previousX: number;
  previousY: number;
  x: number;
  y: number;
}

export type PositionChangedEvent = SimulationEvent<PositionChangedPayload>;

export function createPositionChangedPayload(
  overrides: Partial<PositionChangedPayload> = {},
): PositionChangedPayload {
  return {
    entityId: 0,
    previousX: 0,
    previousY: 0,
    x: 0,
    y: 0,
    ...overrides,
  };
}

export function createPositionChangedDraft(
  payload: PositionChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<PositionChangedPayload> {
  if (!validatePositionChangedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.position.changed');
  }
  return {
    type: PositionChangedType,
    payload: clonePositionChangedPayload(payload),
    metadata,
  };
}

export function isPositionChangedEvent(
  event: SimulationEvent,
): event is PositionChangedEvent {
  return event.type === PositionChangedType && validatePositionChangedPayload(event.payload);
}

export function validatePositionChangedPayload(
  value: unknown,
): value is PositionChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<PositionChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.previousX === 'number' && Number.isFinite(payload.previousX) &&
    typeof payload.previousY === 'number' && Number.isFinite(payload.previousY) &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y)
  );
}

export function clonePositionChangedPayload(
  payload: PositionChangedPayload,
): PositionChangedPayload {
  return cloneJson(payload);
}

export function equalPositionChangedPayload(
  left: PositionChangedPayload,
  right: PositionChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.previousX === right.previousX &&
    left.previousY === right.previousY &&
    left.x === right.x &&
    left.y === right.y
  );
}

export function serializePositionChangedPayload(
  payload: PositionChangedPayload,
): string {
  if (!validatePositionChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.position.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializePositionChangedPayload(
  serialized: string,
): PositionChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validatePositionChangedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.position.changed payload');
  }
  return clonePositionChangedPayload(value);
}
