import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ComponentRemovedType = 'component.removed' as const;

export interface ComponentRemovedPayload extends JsonObject {
  entityId: number;
  component: string;
  version: number;
}

export type ComponentRemovedEvent = SimulationEvent<ComponentRemovedPayload>;

export function createComponentRemovedPayload(
  overrides: Partial<ComponentRemovedPayload> = {},
): ComponentRemovedPayload {
  return {
    entityId: 0,
    component: '',
    version: 0,
    ...overrides,
  };
}

export function createComponentRemovedDraft(
  payload: ComponentRemovedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ComponentRemovedPayload> {
  if (!validateComponentRemovedPayload(payload)) {
    throw new TypeError('Invalid payload for component.removed');
  }
  return {
    type: ComponentRemovedType,
    payload: cloneComponentRemovedPayload(payload),
    metadata,
  };
}

export function isComponentRemovedEvent(
  event: SimulationEvent,
): event is ComponentRemovedEvent {
  return event.type === ComponentRemovedType && validateComponentRemovedPayload(event.payload);
}

export function validateComponentRemovedPayload(
  value: unknown,
): value is ComponentRemovedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ComponentRemovedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.component === 'string' &&
    typeof payload.version === 'number' && Number.isFinite(payload.version)
  );
}

export function cloneComponentRemovedPayload(
  payload: ComponentRemovedPayload,
): ComponentRemovedPayload {
  return cloneJson(payload);
}

export function equalComponentRemovedPayload(
  left: ComponentRemovedPayload,
  right: ComponentRemovedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.component === right.component &&
    left.version === right.version
  );
}

export function serializeComponentRemovedPayload(
  payload: ComponentRemovedPayload,
): string {
  if (!validateComponentRemovedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid component.removed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeComponentRemovedPayload(
  serialized: string,
): ComponentRemovedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateComponentRemovedPayload(value)) {
    throw new TypeError('Serialized value is not a component.removed payload');
  }
  return cloneComponentRemovedPayload(value);
}
