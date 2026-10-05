import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ItemPickedUpType = 'inventory.item.pickedUp' as const;

export interface ItemPickedUpPayload extends JsonObject {
  entityId: number;
  itemId: number;
  itemType: string;
  quantity: number;
}

export type ItemPickedUpEvent = SimulationEvent<ItemPickedUpPayload>;

export function createItemPickedUpPayload(
  overrides: Partial<ItemPickedUpPayload> = {},
): ItemPickedUpPayload {
  return {
    entityId: 0,
    itemId: 0,
    itemType: '',
    quantity: 0,
    ...overrides,
  };
}

export function createItemPickedUpDraft(
  payload: ItemPickedUpPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ItemPickedUpPayload> {
  if (!validateItemPickedUpPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.item.pickedUp');
  }
  return {
    type: ItemPickedUpType,
    payload: cloneItemPickedUpPayload(payload),
    metadata,
  };
}

export function isItemPickedUpEvent(
  event: SimulationEvent,
): event is ItemPickedUpEvent {
  return event.type === ItemPickedUpType && validateItemPickedUpPayload(event.payload);
}

export function validateItemPickedUpPayload(
  value: unknown,
): value is ItemPickedUpPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ItemPickedUpPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.itemId === 'number' && Number.isFinite(payload.itemId) &&
    typeof payload.itemType === 'string' &&
    typeof payload.quantity === 'number' && Number.isFinite(payload.quantity)
  );
}

export function cloneItemPickedUpPayload(
  payload: ItemPickedUpPayload,
): ItemPickedUpPayload {
  return cloneJson(payload);
}

export function equalItemPickedUpPayload(
  left: ItemPickedUpPayload,
  right: ItemPickedUpPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.itemId === right.itemId &&
    left.itemType === right.itemType &&
    left.quantity === right.quantity
  );
}

export function serializeItemPickedUpPayload(
  payload: ItemPickedUpPayload,
): string {
  if (!validateItemPickedUpPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.item.pickedUp payload');
  }
  return JSON.stringify(payload);
}

export function deserializeItemPickedUpPayload(
  serialized: string,
): ItemPickedUpPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateItemPickedUpPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.item.pickedUp payload');
  }
  return cloneItemPickedUpPayload(value);
}
