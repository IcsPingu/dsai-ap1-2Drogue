import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ItemDroppedType = 'inventory.item.dropped' as const;

export interface ItemDroppedPayload extends JsonObject {
  entityId: number;
  itemId: number;
  quantity: number;
  x: number;
  y: number;
}

export type ItemDroppedEvent = SimulationEvent<ItemDroppedPayload>;

export function createItemDroppedPayload(
  overrides: Partial<ItemDroppedPayload> = {},
): ItemDroppedPayload {
  return {
    entityId: 0,
    itemId: 0,
    quantity: 0,
    x: 0,
    y: 0,
    ...overrides,
  };
}

export function createItemDroppedDraft(
  payload: ItemDroppedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ItemDroppedPayload> {
  if (!validateItemDroppedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.item.dropped');
  }
  return {
    type: ItemDroppedType,
    payload: cloneItemDroppedPayload(payload),
    metadata,
  };
}

export function isItemDroppedEvent(
  event: SimulationEvent,
): event is ItemDroppedEvent {
  return event.type === ItemDroppedType && validateItemDroppedPayload(event.payload);
}

export function validateItemDroppedPayload(
  value: unknown,
): value is ItemDroppedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ItemDroppedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.itemId === 'number' && Number.isFinite(payload.itemId) &&
    typeof payload.quantity === 'number' && Number.isFinite(payload.quantity) &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y)
  );
}

export function cloneItemDroppedPayload(
  payload: ItemDroppedPayload,
): ItemDroppedPayload {
  return cloneJson(payload);
}

export function equalItemDroppedPayload(
  left: ItemDroppedPayload,
  right: ItemDroppedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.itemId === right.itemId &&
    left.quantity === right.quantity &&
    left.x === right.x &&
    left.y === right.y
  );
}

export function serializeItemDroppedPayload(
  payload: ItemDroppedPayload,
): string {
  if (!validateItemDroppedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.item.dropped payload');
  }
  return JSON.stringify(payload);
}

export function deserializeItemDroppedPayload(
  serialized: string,
): ItemDroppedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateItemDroppedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.item.dropped payload');
  }
  return cloneItemDroppedPayload(value);
}
