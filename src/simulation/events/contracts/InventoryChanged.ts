import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const InventoryChangedType = 'inventory.changed' as const;

export interface InventoryChangedPayload extends JsonObject {
  entityId: number;
  slotsUsed: number;
  capacity: number;
  reason: string;
}

export type InventoryChangedEvent = SimulationEvent<InventoryChangedPayload>;

export function createInventoryChangedPayload(
  overrides: Partial<InventoryChangedPayload> = {},
): InventoryChangedPayload {
  return {
    entityId: 0,
    slotsUsed: 0,
    capacity: 0,
    reason: '',
    ...overrides,
  };
}

export function createInventoryChangedDraft(
  payload: InventoryChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<InventoryChangedPayload> {
  if (!validateInventoryChangedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.changed');
  }
  return {
    type: InventoryChangedType,
    payload: cloneInventoryChangedPayload(payload),
    metadata,
  };
}

export function isInventoryChangedEvent(
  event: SimulationEvent,
): event is InventoryChangedEvent {
  return event.type === InventoryChangedType && validateInventoryChangedPayload(event.payload);
}

export function validateInventoryChangedPayload(
  value: unknown,
): value is InventoryChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<InventoryChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.slotsUsed === 'number' && Number.isFinite(payload.slotsUsed) &&
    typeof payload.capacity === 'number' && Number.isFinite(payload.capacity) &&
    typeof payload.reason === 'string'
  );
}

export function cloneInventoryChangedPayload(
  payload: InventoryChangedPayload,
): InventoryChangedPayload {
  return cloneJson(payload);
}

export function equalInventoryChangedPayload(
  left: InventoryChangedPayload,
  right: InventoryChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.slotsUsed === right.slotsUsed &&
    left.capacity === right.capacity &&
    left.reason === right.reason
  );
}

export function serializeInventoryChangedPayload(
  payload: InventoryChangedPayload,
): string {
  if (!validateInventoryChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeInventoryChangedPayload(
  serialized: string,
): InventoryChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateInventoryChangedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.changed payload');
  }
  return cloneInventoryChangedPayload(value);
}
