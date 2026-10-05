import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ItemEquippedType = 'inventory.item.equipped' as const;

export interface ItemEquippedPayload extends JsonObject {
  entityId: number;
  itemId: number;
  slot: string;
}

export type ItemEquippedEvent = SimulationEvent<ItemEquippedPayload>;

export function createItemEquippedPayload(
  overrides: Partial<ItemEquippedPayload> = {},
): ItemEquippedPayload {
  return {
    entityId: 0,
    itemId: 0,
    slot: '',
    ...overrides,
  };
}

export function createItemEquippedDraft(
  payload: ItemEquippedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ItemEquippedPayload> {
  if (!validateItemEquippedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.item.equipped');
  }
  return {
    type: ItemEquippedType,
    payload: cloneItemEquippedPayload(payload),
    metadata,
  };
}

export function isItemEquippedEvent(
  event: SimulationEvent,
): event is ItemEquippedEvent {
  return event.type === ItemEquippedType && validateItemEquippedPayload(event.payload);
}

export function validateItemEquippedPayload(
  value: unknown,
): value is ItemEquippedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ItemEquippedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.itemId === 'number' && Number.isFinite(payload.itemId) &&
    typeof payload.slot === 'string'
  );
}

export function cloneItemEquippedPayload(
  payload: ItemEquippedPayload,
): ItemEquippedPayload {
  return cloneJson(payload);
}

export function equalItemEquippedPayload(
  left: ItemEquippedPayload,
  right: ItemEquippedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.itemId === right.itemId &&
    left.slot === right.slot
  );
}

export function serializeItemEquippedPayload(
  payload: ItemEquippedPayload,
): string {
  if (!validateItemEquippedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.item.equipped payload');
  }
  return JSON.stringify(payload);
}

export function deserializeItemEquippedPayload(
  serialized: string,
): ItemEquippedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateItemEquippedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.item.equipped payload');
  }
  return cloneItemEquippedPayload(value);
}
