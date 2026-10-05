import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const MenuClosedType = 'ui.menu.closed' as const;

export interface MenuClosedPayload extends JsonObject {
  menuId: string;
  source: string;
  duration: number;
}

export type MenuClosedEvent = SimulationEvent<MenuClosedPayload>;

export function createMenuClosedPayload(
  overrides: Partial<MenuClosedPayload> = {},
): MenuClosedPayload {
  return {
    menuId: '',
    source: '',
    duration: 0,
    ...overrides,
  };
}

export function createMenuClosedDraft(
  payload: MenuClosedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<MenuClosedPayload> {
  if (!validateMenuClosedPayload(payload)) {
    throw new TypeError('Invalid payload for ui.menu.closed');
  }
  return {
    type: MenuClosedType,
    payload: cloneMenuClosedPayload(payload),
    metadata,
  };
}

export function isMenuClosedEvent(
  event: SimulationEvent,
): event is MenuClosedEvent {
  return event.type === MenuClosedType && validateMenuClosedPayload(event.payload);
}

export function validateMenuClosedPayload(
  value: unknown,
): value is MenuClosedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<MenuClosedPayload>;
  return (
    typeof payload.menuId === 'string' &&
    typeof payload.source === 'string' &&
    typeof payload.duration === 'number' && Number.isFinite(payload.duration)
  );
}

export function cloneMenuClosedPayload(
  payload: MenuClosedPayload,
): MenuClosedPayload {
  return cloneJson(payload);
}

export function equalMenuClosedPayload(
  left: MenuClosedPayload,
  right: MenuClosedPayload,
): boolean {
  return (
    left.menuId === right.menuId &&
    left.source === right.source &&
    left.duration === right.duration
  );
}

export function serializeMenuClosedPayload(
  payload: MenuClosedPayload,
): string {
  if (!validateMenuClosedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid ui.menu.closed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeMenuClosedPayload(
  serialized: string,
): MenuClosedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateMenuClosedPayload(value)) {
    throw new TypeError('Serialized value is not a ui.menu.closed payload');
  }
  return cloneMenuClosedPayload(value);
}
