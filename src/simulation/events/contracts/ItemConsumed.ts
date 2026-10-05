import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ItemConsumedType = 'inventory.item.consumed' as const;

export interface ItemConsumedPayload extends JsonObject {
  entityId: number;
  itemId: number;
  quantity: number;
  effect: string;
}

export type ItemConsumedEvent = SimulationEvent<ItemConsumedPayload>;

export function createItemConsumedPayload(
  overrides: Partial<ItemConsumedPayload> = {},
): ItemConsumedPayload {
  return {
    entityId: 0,
    itemId: 0,
    quantity: 0,
    effect: '',
    ...overrides,
  };
}

export function createItemConsumedDraft(
  payload: ItemConsumedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ItemConsumedPayload> {
  if (!validateItemConsumedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.item.consumed');
  }
  return {
    type: ItemConsumedType,
    payload: cloneItemConsumedPayload(payload),
    metadata,
  };
}

export function isItemConsumedEvent(
  event: SimulationEvent,
): event is ItemConsumedEvent {
  return event.type === ItemConsumedType && validateItemConsumedPayload(event.payload);
}

export function validateItemConsumedPayload(
  value: unknown,
): value is ItemConsumedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ItemConsumedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.itemId === 'number' && Number.isFinite(payload.itemId) &&
    typeof payload.quantity === 'number' && Number.isFinite(payload.quantity) &&
    typeof payload.effect === 'string'
  );
}

export function cloneItemConsumedPayload(
  payload: ItemConsumedPayload,
): ItemConsumedPayload {
  return cloneJson(payload);
}

export function equalItemConsumedPayload(
  left: ItemConsumedPayload,
  right: ItemConsumedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.itemId === right.itemId &&
    left.quantity === right.quantity &&
    left.effect === right.effect
  );
}

export function serializeItemConsumedPayload(
  payload: ItemConsumedPayload,
): string {
  if (!validateItemConsumedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.item.consumed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeItemConsumedPayload(
  serialized: string,
): ItemConsumedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateItemConsumedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.item.consumed payload');
  }
  return cloneItemConsumedPayload(value);
}
