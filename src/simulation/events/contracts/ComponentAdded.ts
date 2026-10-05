import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ComponentAddedType = 'component.added' as const;

export interface ComponentAddedPayload extends JsonObject {
  entityId: number;
  component: string;
  version: number;
}

export type ComponentAddedEvent = SimulationEvent<ComponentAddedPayload>;

export function createComponentAddedPayload(
  overrides: Partial<ComponentAddedPayload> = {},
): ComponentAddedPayload {
  return {
    entityId: 0,
    component: '',
    version: 0,
    ...overrides,
  };
}

export function createComponentAddedDraft(
  payload: ComponentAddedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ComponentAddedPayload> {
  if (!validateComponentAddedPayload(payload)) {
    throw new TypeError('Invalid payload for component.added');
  }
  return {
    type: ComponentAddedType,
    payload: cloneComponentAddedPayload(payload),
    metadata,
  };
}

export function isComponentAddedEvent(
  event: SimulationEvent,
): event is ComponentAddedEvent {
  return event.type === ComponentAddedType && validateComponentAddedPayload(event.payload);
}

export function validateComponentAddedPayload(
  value: unknown,
): value is ComponentAddedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ComponentAddedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.component === 'string' &&
    typeof payload.version === 'number' && Number.isFinite(payload.version)
  );
}

export function cloneComponentAddedPayload(
  payload: ComponentAddedPayload,
): ComponentAddedPayload {
  return cloneJson(payload);
}

export function equalComponentAddedPayload(
  left: ComponentAddedPayload,
  right: ComponentAddedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.component === right.component &&
    left.version === right.version
  );
}

export function serializeComponentAddedPayload(
  payload: ComponentAddedPayload,
): string {
  if (!validateComponentAddedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid component.added payload');
  }
  return JSON.stringify(payload);
}

export function deserializeComponentAddedPayload(
  serialized: string,
): ComponentAddedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateComponentAddedPayload(value)) {
    throw new TypeError('Serialized value is not a component.added payload');
  }
  return cloneComponentAddedPayload(value);
}
