import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const NotificationShownType = 'ui.notification.shown' as const;

export interface NotificationShownPayload extends JsonObject {
  notificationId: string;
  message: string;
  severity: string;
  duration: number;
}

export type NotificationShownEvent = SimulationEvent<NotificationShownPayload>;

export function createNotificationShownPayload(
  overrides: Partial<NotificationShownPayload> = {},
): NotificationShownPayload {
  return {
    notificationId: '',
    message: '',
    severity: '',
    duration: 0,
    ...overrides,
  };
}

export function createNotificationShownDraft(
  payload: NotificationShownPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<NotificationShownPayload> {
  if (!validateNotificationShownPayload(payload)) {
    throw new TypeError('Invalid payload for ui.notification.shown');
  }
  return {
    type: NotificationShownType,
    payload: cloneNotificationShownPayload(payload),
    metadata,
  };
}

export function isNotificationShownEvent(
  event: SimulationEvent,
): event is NotificationShownEvent {
  return event.type === NotificationShownType && validateNotificationShownPayload(event.payload);
}

export function validateNotificationShownPayload(
  value: unknown,
): value is NotificationShownPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<NotificationShownPayload>;
  return (
    typeof payload.notificationId === 'string' &&
    typeof payload.message === 'string' &&
    typeof payload.severity === 'string' &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneNotificationShownPayload(
  payload: NotificationShownPayload,
): NotificationShownPayload {
  return cloneJson(payload);
}

export function equalNotificationShownPayload(
  left: NotificationShownPayload,
  right: NotificationShownPayload,
): boolean {
  return (
    left.notificationId === right.notificationId &&
    left.message === right.message &&
    left.severity === right.severity &&
    left.duration === right.duration
  );
}

export function serializeNotificationShownPayload(
  payload: NotificationShownPayload,
): string {
  if (!validateNotificationShownPayload(payload)) {
    throw new TypeError('Cannot serialize invalid ui.notification.shown payload');
  }
  return JSON.stringify(payload);
}

export function deserializeNotificationShownPayload(
  serialized: string,
): NotificationShownPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateNotificationShownPayload(value)) {
    throw new TypeError('Serialized value is not a ui.notification.shown payload');
  }
  return cloneNotificationShownPayload(value);
}
