import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const PurchaseRequestedType = 'inventory.purchase.requested' as const;

export interface PurchaseRequestedPayload extends JsonObject {
  entityId: number;
  itemType: string;
  quantity: number;
  price: number;
}

export type PurchaseRequestedEvent = SimulationEvent<PurchaseRequestedPayload>;

export function createPurchaseRequestedPayload(
  overrides: Partial<PurchaseRequestedPayload> = {},
): PurchaseRequestedPayload {
  return {
    entityId: 0,
    itemType: '',
    quantity: 0,
    price: 0,
    ...overrides,
  };
}

export function createPurchaseRequestedDraft(
  payload: PurchaseRequestedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<PurchaseRequestedPayload> {
  if (!validatePurchaseRequestedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.purchase.requested');
  }
  return {
    type: PurchaseRequestedType,
    payload: clonePurchaseRequestedPayload(payload),
    metadata,
  };
}

export function isPurchaseRequestedEvent(
  event: SimulationEvent,
): event is PurchaseRequestedEvent {
  return event.type === PurchaseRequestedType && validatePurchaseRequestedPayload(event.payload);
}

export function validatePurchaseRequestedPayload(
  value: unknown,
): value is PurchaseRequestedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<PurchaseRequestedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.itemType === 'string' &&
    typeof payload.quantity === 'number' && Number.isFinite(payload.quantity) &&
    typeof payload.price === 'number' && Number.isFinite(payload.price)
  );
}

export function clonePurchaseRequestedPayload(
  payload: PurchaseRequestedPayload,
): PurchaseRequestedPayload {
  return cloneJson(payload);
}

export function equalPurchaseRequestedPayload(
  left: PurchaseRequestedPayload,
  right: PurchaseRequestedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.itemType === right.itemType &&
    left.quantity === right.quantity &&
    left.price === right.price
  );
}

export function serializePurchaseRequestedPayload(
  payload: PurchaseRequestedPayload,
): string {
  if (!validatePurchaseRequestedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.purchase.requested payload');
  }
  return JSON.stringify(payload);
}

export function deserializePurchaseRequestedPayload(
  serialized: string,
): PurchaseRequestedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validatePurchaseRequestedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.purchase.requested payload');
  }
  return clonePurchaseRequestedPayload(value);
}
