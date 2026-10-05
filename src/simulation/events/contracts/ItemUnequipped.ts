import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ItemUnequippedType = 'inventory.item.unequipped' as const;

export interface ItemUnequippedPayload extends JsonObject {
  entityId: number;
  itemId: number;
  slot: string;
}

export type ItemUnequippedEvent = SimulationEvent<ItemUnequippedPayload>;

export function createItemUnequippedPayload(
  overrides: Partial<ItemUnequippedPayload> = {},
): ItemUnequippedPayload {
  return {
    entityId: 0,
    itemId: 0,
    slot: '',
    ...overrides,
  };
}

export function createItemUnequippedDraft(
  payload: ItemUnequippedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ItemUnequippedPayload> {
  if (!validateItemUnequippedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.item.unequipped');
  }
  return {
    type: ItemUnequippedType,
    payload: cloneItemUnequippedPayload(payload),
    metadata,
  };
}

export function isItemUnequippedEvent(
  event: SimulationEvent,
): event is ItemUnequippedEvent {
  return event.type === ItemUnequippedType && validateItemUnequippedPayload(event.payload);
}

export function validateItemUnequippedPayload(
  value: unknown,
): value is ItemUnequippedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ItemUnequippedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.itemId === 'number' && Number.isFinite(payload.itemId) &&
    typeof payload.slot === 'string'
  );
}

export function cloneItemUnequippedPayload(
  payload: ItemUnequippedPayload,
): ItemUnequippedPayload {
  return cloneJson(payload);
}

export function equalItemUnequippedPayload(
  left: ItemUnequippedPayload,
  right: ItemUnequippedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.itemId === right.itemId &&
    left.slot === right.slot
  );
}

export function serializeItemUnequippedPayload(
  payload: ItemUnequippedPayload,
): string {
  if (!validateItemUnequippedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.item.unequipped payload');
  }
  return JSON.stringify(payload);
}

export function deserializeItemUnequippedPayload(
  serialized: string,
): ItemUnequippedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateItemUnequippedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.item.unequipped payload');
  }
  return cloneItemUnequippedPayload(value);
}
