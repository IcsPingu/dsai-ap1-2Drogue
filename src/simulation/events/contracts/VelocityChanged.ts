import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const VelocityChangedType = 'movement.velocity.changed' as const;

export interface VelocityChangedPayload extends JsonObject {
  entityId: number;
  velocityX: number;
  velocityY: number;
  source: string;
}

export type VelocityChangedEvent = SimulationEvent<VelocityChangedPayload>;

export function createVelocityChangedPayload(
  overrides: Partial<VelocityChangedPayload> = {},
): VelocityChangedPayload {
  return {
    entityId: 0,
    velocityX: 0,
    velocityY: 0,
    source: '',
    ...overrides,
  };
}

export function createVelocityChangedDraft(
  payload: VelocityChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<VelocityChangedPayload> {
  if (!validateVelocityChangedPayload(payload)) {
    throw new TypeError('Invalid payload for movement.velocity.changed');
  }
  return {
    type: VelocityChangedType,
    payload: cloneVelocityChangedPayload(payload),
    metadata,
  };
}

export function isVelocityChangedEvent(
  event: SimulationEvent,
): event is VelocityChangedEvent {
  return event.type === VelocityChangedType && validateVelocityChangedPayload(event.payload);
}

export function validateVelocityChangedPayload(
  value: unknown,
): value is VelocityChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<VelocityChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.velocityX === 'number' && Number.isFinite(payload.velocityX) &&
    typeof payload.velocityY === 'number' && Number.isFinite(payload.velocityY) &&
    typeof payload.source === 'string'
  );
}

export function cloneVelocityChangedPayload(
  payload: VelocityChangedPayload,
): VelocityChangedPayload {
  return cloneJson(payload);
}

export function equalVelocityChangedPayload(
  left: VelocityChangedPayload,
  right: VelocityChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.velocityX === right.velocityX &&
    left.velocityY === right.velocityY &&
    left.source === right.source
  );
}

export function serializeVelocityChangedPayload(
  payload: VelocityChangedPayload,
): string {
  if (!validateVelocityChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid movement.velocity.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeVelocityChangedPayload(
  serialized: string,
): VelocityChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateVelocityChangedPayload(value)) {
    throw new TypeError('Serialized value is not a movement.velocity.changed payload');
  }
  return cloneVelocityChangedPayload(value);
}
