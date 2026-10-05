import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ImmunityExpiredType = 'status.immunity.expired' as const;

export interface ImmunityExpiredPayload extends JsonObject {
  entityId: number;
  immunity: string;
}

export type ImmunityExpiredEvent = SimulationEvent<ImmunityExpiredPayload>;

export function createImmunityExpiredPayload(
  overrides: Partial<ImmunityExpiredPayload> = {},
): ImmunityExpiredPayload {
  return {
    entityId: 0,
    immunity: '',
    ...overrides,
  };
}

export function createImmunityExpiredDraft(
  payload: ImmunityExpiredPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ImmunityExpiredPayload> {
  if (!validateImmunityExpiredPayload(payload)) {
    throw new TypeError('Invalid payload for status.immunity.expired');
  }
  return {
    type: ImmunityExpiredType,
    payload: cloneImmunityExpiredPayload(payload),
    metadata,
  };
}

export function isImmunityExpiredEvent(
  event: SimulationEvent,
): event is ImmunityExpiredEvent {
  return event.type === ImmunityExpiredType && validateImmunityExpiredPayload(event.payload);
}

export function validateImmunityExpiredPayload(
  value: unknown,
): value is ImmunityExpiredPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ImmunityExpiredPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.immunity === 'string'
  );
}

export function cloneImmunityExpiredPayload(
  payload: ImmunityExpiredPayload,
): ImmunityExpiredPayload {
  return cloneJson(payload);
}

export function equalImmunityExpiredPayload(
  left: ImmunityExpiredPayload,
  right: ImmunityExpiredPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.immunity === right.immunity
  );
}

export function serializeImmunityExpiredPayload(
  payload: ImmunityExpiredPayload,
): string {
  if (!validateImmunityExpiredPayload(payload)) {
    throw new TypeError('Cannot serialize invalid status.immunity.expired payload');
  }
  return JSON.stringify(payload);
}

export function deserializeImmunityExpiredPayload(
  serialized: string,
): ImmunityExpiredPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateImmunityExpiredPayload(value)) {
    throw new TypeError('Serialized value is not a status.immunity.expired payload');
  }
  return cloneImmunityExpiredPayload(value);
}
