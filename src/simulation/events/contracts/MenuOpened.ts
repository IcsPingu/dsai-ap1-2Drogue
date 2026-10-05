import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const MenuOpenedType = 'ui.menu.opened' as const;

export interface MenuOpenedPayload extends JsonObject {
  menuId: string;
  source: string;
  pausesSimulation: boolean;
}

export type MenuOpenedEvent = SimulationEvent<MenuOpenedPayload>;

export function createMenuOpenedPayload(
  overrides: Partial<MenuOpenedPayload> = {},
): MenuOpenedPayload {
  return {
    menuId: '',
    source: '',
    pausesSimulation: false,
    ...overrides,
  };
}

export function createMenuOpenedDraft(
  payload: MenuOpenedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<MenuOpenedPayload> {
  if (!validateMenuOpenedPayload(payload)) {
    throw new TypeError('Invalid payload for ui.menu.opened');
  }
  return {
    type: MenuOpenedType,
    payload: cloneMenuOpenedPayload(payload),
    metadata,
  };
}

export function isMenuOpenedEvent(
  event: SimulationEvent,
): event is MenuOpenedEvent {
  return event.type === MenuOpenedType && validateMenuOpenedPayload(event.payload);
}

export function validateMenuOpenedPayload(
  value: unknown,
): value is MenuOpenedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<MenuOpenedPayload>;
  return (
    typeof payload.menuId === 'string' &&
    typeof payload.source === 'string' &&
    typeof payload.pausesSimulation === 'boolean'
  );
}

export function cloneMenuOpenedPayload(
  payload: MenuOpenedPayload,
): MenuOpenedPayload {
  return cloneJson(payload);
}

export function equalMenuOpenedPayload(
  left: MenuOpenedPayload,
  right: MenuOpenedPayload,
): boolean {
  return (
    left.menuId === right.menuId &&
    left.source === right.source &&
    left.pausesSimulation === right.pausesSimulation
  );
}

export function serializeMenuOpenedPayload(
  payload: MenuOpenedPayload,
): string {
  if (!validateMenuOpenedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid ui.menu.opened payload');
  }
  return JSON.stringify(payload);
}

export function deserializeMenuOpenedPayload(
  serialized: string,
): MenuOpenedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateMenuOpenedPayload(value)) {
    throw new TypeError('Serialized value is not a ui.menu.opened payload');
  }
  return cloneMenuOpenedPayload(value);
}
