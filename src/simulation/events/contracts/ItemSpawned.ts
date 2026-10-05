import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ItemSpawnedType = 'inventory.item.spawned' as const;

export interface ItemSpawnedPayload extends JsonObject {
  itemId: number;
  itemType: string;
  x: number;
  y: number;
}

export type ItemSpawnedEvent = SimulationEvent<ItemSpawnedPayload>;

export function createItemSpawnedPayload(
  overrides: Partial<ItemSpawnedPayload> = {},
): ItemSpawnedPayload {
  return {
    itemId: 0,
    itemType: '',
    x: 0,
    y: 0,
    ...overrides,
  };
}

export function createItemSpawnedDraft(
  payload: ItemSpawnedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ItemSpawnedPayload> {
  if (!validateItemSpawnedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.item.spawned');
  }
  return {
    type: ItemSpawnedType,
    payload: cloneItemSpawnedPayload(payload),
    metadata,
  };
}

export function isItemSpawnedEvent(
  event: SimulationEvent,
): event is ItemSpawnedEvent {
  return event.type === ItemSpawnedType && validateItemSpawnedPayload(event.payload);
}

export function validateItemSpawnedPayload(
  value: unknown,
): value is ItemSpawnedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ItemSpawnedPayload>;
  return (
    typeof payload.itemId === 'number' && Number.isFinite(payload.itemId) &&
    typeof payload.itemType === 'string' &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y)
  );
}

export function cloneItemSpawnedPayload(
  payload: ItemSpawnedPayload,
): ItemSpawnedPayload {
  return cloneJson(payload);
}

export function equalItemSpawnedPayload(
  left: ItemSpawnedPayload,
  right: ItemSpawnedPayload,
): boolean {
  return (
    left.itemId === right.itemId &&
    left.itemType === right.itemType &&
    left.x === right.x &&
    left.y === right.y
  );
}

export function serializeItemSpawnedPayload(
  payload: ItemSpawnedPayload,
): string {
  if (!validateItemSpawnedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.item.spawned payload');
  }
  return JSON.stringify(payload);
}

export function deserializeItemSpawnedPayload(
  serialized: string,
): ItemSpawnedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateItemSpawnedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.item.spawned payload');
  }
  return cloneItemSpawnedPayload(value);
}
