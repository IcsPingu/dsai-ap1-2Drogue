import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ImmunityGrantedType = 'status.immunity.granted' as const;

export interface ImmunityGrantedPayload extends JsonObject {
  entityId: number;
  immunity: string;
  duration: number;
}

export type ImmunityGrantedEvent = SimulationEvent<ImmunityGrantedPayload>;

export function createImmunityGrantedPayload(
  overrides: Partial<ImmunityGrantedPayload> = {},
): ImmunityGrantedPayload {
  return {
    entityId: 0,
    immunity: '',
    duration: 0,
    ...overrides,
  };
}

export function createImmunityGrantedDraft(
  payload: ImmunityGrantedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ImmunityGrantedPayload> {
  if (!validateImmunityGrantedPayload(payload)) {
    throw new TypeError('Invalid payload for status.immunity.granted');
  }
  return {
    type: ImmunityGrantedType,
    payload: cloneImmunityGrantedPayload(payload),
    metadata,
  };
}

export function isImmunityGrantedEvent(
  event: SimulationEvent,
): event is ImmunityGrantedEvent {
  return event.type === ImmunityGrantedType && validateImmunityGrantedPayload(event.payload);
}

export function validateImmunityGrantedPayload(
  value: unknown,
): value is ImmunityGrantedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ImmunityGrantedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.immunity === 'string' &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneImmunityGrantedPayload(
  payload: ImmunityGrantedPayload,
): ImmunityGrantedPayload {
  return cloneJson(payload);
}

export function equalImmunityGrantedPayload(
  left: ImmunityGrantedPayload,
  right: ImmunityGrantedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.immunity === right.immunity &&
    left.duration === right.duration
  );
}

export function serializeImmunityGrantedPayload(
  payload: ImmunityGrantedPayload,
): string {
  if (!validateImmunityGrantedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid status.immunity.granted payload');
  }
  return JSON.stringify(payload);
}

export function deserializeImmunityGrantedPayload(
  serialized: string,
): ImmunityGrantedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateImmunityGrantedPayload(value)) {
    throw new TypeError('Serialized value is not a status.immunity.granted payload');
  }
  return cloneImmunityGrantedPayload(value);
}
