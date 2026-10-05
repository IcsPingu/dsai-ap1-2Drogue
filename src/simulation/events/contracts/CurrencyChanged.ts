import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const CurrencyChangedType = 'inventory.currency.changed' as const;

export interface CurrencyChangedPayload extends JsonObject {
  entityId: number;
  currency: string;
  previous: number;
  current: number;
}

export type CurrencyChangedEvent = SimulationEvent<CurrencyChangedPayload>;

export function createCurrencyChangedPayload(
  overrides: Partial<CurrencyChangedPayload> = {},
): CurrencyChangedPayload {
  return {
    entityId: 0,
    currency: '',
    previous: 0,
    current: 0,
    ...overrides,
  };
}

export function createCurrencyChangedDraft(
  payload: CurrencyChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<CurrencyChangedPayload> {
  if (!validateCurrencyChangedPayload(payload)) {
    throw new TypeError('Invalid payload for inventory.currency.changed');
  }
  return {
    type: CurrencyChangedType,
    payload: cloneCurrencyChangedPayload(payload),
    metadata,
  };
}

export function isCurrencyChangedEvent(
  event: SimulationEvent,
): event is CurrencyChangedEvent {
  return event.type === CurrencyChangedType && validateCurrencyChangedPayload(event.payload);
}

export function validateCurrencyChangedPayload(
  value: unknown,
): value is CurrencyChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<CurrencyChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.currency === 'string' &&
    typeof payload.previous === 'number' && Number.isFinite(payload.previous) &&
    typeof payload.current === 'number' && Number.isFinite(payload.current)
  );
}

export function cloneCurrencyChangedPayload(
  payload: CurrencyChangedPayload,
): CurrencyChangedPayload {
  return cloneJson(payload);
}

export function equalCurrencyChangedPayload(
  left: CurrencyChangedPayload,
  right: CurrencyChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.currency === right.currency &&
    left.previous === right.previous &&
    left.current === right.current
  );
}

export function serializeCurrencyChangedPayload(
  payload: CurrencyChangedPayload,
): string {
  if (!validateCurrencyChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid inventory.currency.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeCurrencyChangedPayload(
  serialized: string,
): CurrencyChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateCurrencyChangedPayload(value)) {
    throw new TypeError('Serialized value is not a inventory.currency.changed payload');
  }
  return cloneCurrencyChangedPayload(value);
}
