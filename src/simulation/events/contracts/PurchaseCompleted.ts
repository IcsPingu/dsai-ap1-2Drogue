import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const PurchaseCompletedType = 'inventory.purchase.completed' as const;

export interface PurchaseCompletedPayload extends JsonObject {
  entityId: number;
  itemType: string;
  quantity: number;
  price: number;
}

export type PurchaseCompletedEvent = SimulationEvent<PurchaseCompletedPayload>;

export function createPurchaseCompletedPayload(
  overrides: Partial<PurchaseCompletedPayload> = {},
): PurchaseCompletedPayload {
  return {
    entityId: 0,
    itemType: '',
    quantity: 0,
    price: 0,
    ...overrides,
  };
}

export function createPurchaseCompletedDraft(
  payload: PurchaseCompletedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<PurchaseCompletedPayload> {
  if (!validatePurchaseCompletedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.purchase.completed');
  }
  return {
    type: PurchaseCompletedType,
    payload: clonePurchaseCompletedPayload(payload),
    metadata,
  };
}

export function isPurchaseCompletedEvent(
  event: SimulationEvent,
): event is PurchaseCompletedEvent {
  return event.type === PurchaseCompletedType && validatePurchaseCompletedPayload(event.payload);
}

export function validatePurchaseCompletedPayload(
  value: unknown,
): value is PurchaseCompletedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<PurchaseCompletedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.itemType === 'string' &&
    typeof payload.quantity === 'number' && Number.isFinite(payload.quantity) &&
    typeof payload.price === 'number' && Number.isFinite(payload.price)
  );
}

export function clonePurchaseCompletedPayload(
  payload: PurchaseCompletedPayload,
): PurchaseCompletedPayload {
  return cloneJson(payload);
}

export function equalPurchaseCompletedPayload(
  left: PurchaseCompletedPayload,
  right: PurchaseCompletedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.itemType === right.itemType &&
    left.quantity === right.quantity &&
    left.price === right.price
  );
}

export function serializePurchaseCompletedPayload(
  payload: PurchaseCompletedPayload,
): string {
  if (!validatePurchaseCompletedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.purchase.completed payload');
  }
  return JSON.stringify(payload);
}

export function deserializePurchaseCompletedPayload(
  serialized: string,
): PurchaseCompletedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validatePurchaseCompletedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.purchase.completed payload');
  }
  return clonePurchaseCompletedPayload(value);
}
