import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const SettingChangedType = 'ui.setting.changed' as const;

export interface SettingChangedPayload extends JsonObject {
  setting: string;
  previous: string;
  current: string;
}

export type SettingChangedEvent = SimulationEvent<SettingChangedPayload>;

export function createSettingChangedPayload(
  overrides: Partial<SettingChangedPayload> = {},
): SettingChangedPayload {
  return {
    setting: '',
    previous: '',
    current: '',
    ...overrides,
  };
}

export function createSettingChangedDraft(
  payload: SettingChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<SettingChangedPayload> {
  if (!validateSettingChangedPayload(payload)) {
    throw new TypeError('Invalid payload for ui.setting.changed');
  }
  return {
    type: SettingChangedType,
    payload: cloneSettingChangedPayload(payload),
    metadata,
  };
}

export function isSettingChangedEvent(
  event: SimulationEvent,
): event is SettingChangedEvent {
  return event.type === SettingChangedType && validateSettingChangedPayload(event.payload);
}

export function validateSettingChangedPayload(
  value: unknown,
): value is SettingChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<SettingChangedPayload>;
  return (
    typeof payload.setting === 'string' &&
    typeof payload.previous === 'string' &&
    typeof payload.current === 'string'
  );
}

export function cloneSettingChangedPayload(
  payload: SettingChangedPayload,
): SettingChangedPayload {
  return cloneJson(payload);
}

export function equalSettingChangedPayload(
  left: SettingChangedPayload,
  right: SettingChangedPayload,
): boolean {
  return (
    left.setting === right.setting &&
    left.previous === right.previous &&
    left.current === right.current
  );
}

export function serializeSettingChangedPayload(
  payload: SettingChangedPayload,
): string {
  if (!validateSettingChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid ui.setting.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeSettingChangedPayload(
  serialized: string,
): SettingChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateSettingChangedPayload(value)) {
    throw new TypeError('Serialized value is not a ui.setting.changed payload');
  }
  return cloneSettingChangedPayload(value);
}
