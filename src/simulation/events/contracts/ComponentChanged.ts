import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ComponentChangedType = 'component.changed' as const;

export interface ComponentChangedPayload extends JsonObject {
  entityId: number;
  component: string;
  version: number;
}

export type ComponentChangedEvent = SimulationEvent<ComponentChangedPayload>;

export function createComponentChangedPayload(
  overrides: Partial<ComponentChangedPayload> = {},
): ComponentChangedPayload {
  return {
    entityId: 0,
    component: '',
    version: 0,
    ...overrides,
  };
}

export function createComponentChangedDraft(
  payload: ComponentChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ComponentChangedPayload> {
  if (!validateComponentChangedPayload(payload)) {
    throw new TypeError('Invalid payload for component.changed');
  }
  return {
    type: ComponentChangedType,
    payload: cloneComponentChangedPayload(payload),
    metadata,
  };
}

export function isComponentChangedEvent(
  event: SimulationEvent,
): event is ComponentChangedEvent {
  return event.type === ComponentChangedType && validateComponentChangedPayload(event.payload);
}

export function validateComponentChangedPayload(
  value: unknown,
): value is ComponentChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ComponentChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.component === 'string' &&
    typeof payload.version === 'number' && Number.isFinite(payload.version)
  );
}

export function cloneComponentChangedPayload(
  payload: ComponentChangedPayload,
): ComponentChangedPayload {
  return cloneJson(payload);
}

export function equalComponentChangedPayload(
  left: ComponentChangedPayload,
  right: ComponentChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.component === right.component &&
    left.version === right.version
  );
}

export function serializeComponentChangedPayload(
  payload: ComponentChangedPayload,
): string {
  if (!validateComponentChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid component.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeComponentChangedPayload(
  serialized: string,
): ComponentChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateComponentChangedPayload(value)) {
    throw new TypeError('Serialized value is not a component.changed payload');
  }
  return cloneComponentChangedPayload(value);
}
