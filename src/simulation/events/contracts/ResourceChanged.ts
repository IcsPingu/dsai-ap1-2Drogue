import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ResourceChangedType = 'resource.changed' as const;

export interface ResourceChangedPayload extends JsonObject {
  resource: string;
  version: number;
  source: string;
}

export type ResourceChangedEvent = SimulationEvent<ResourceChangedPayload>;

export function createResourceChangedPayload(
  overrides: Partial<ResourceChangedPayload> = {},
): ResourceChangedPayload {
  return {
    resource: '',
    version: 0,
    source: '',
    ...overrides,
  };
}

export function createResourceChangedDraft(
  payload: ResourceChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ResourceChangedPayload> {
  if (!validateResourceChangedPayload(payload)) {
    throw new TypeError('Invalid payload for resource.changed');
  }
  return {
    type: ResourceChangedType,
    payload: cloneResourceChangedPayload(payload),
    metadata,
  };
}

export function isResourceChangedEvent(
  event: SimulationEvent,
): event is ResourceChangedEvent {
  return event.type === ResourceChangedType && validateResourceChangedPayload(event.payload);
}

export function validateResourceChangedPayload(
  value: unknown,
): value is ResourceChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ResourceChangedPayload>;
  return (
    typeof payload.resource === 'string' &&
    typeof payload.version === 'number' && Number.isFinite(payload.version) &&
    typeof payload.source === 'string'
  );
}

export function cloneResourceChangedPayload(
  payload: ResourceChangedPayload,
): ResourceChangedPayload {
  return cloneJson(payload);
}

export function equalResourceChangedPayload(
  left: ResourceChangedPayload,
  right: ResourceChangedPayload,
): boolean {
  return (
    left.resource === right.resource &&
    left.version === right.version &&
    left.source === right.source
  );
}

export function serializeResourceChangedPayload(
  payload: ResourceChangedPayload,
): string {
  if (!validateResourceChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid resource.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeResourceChangedPayload(
  serialized: string,
): ResourceChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateResourceChangedPayload(value)) {
    throw new TypeError('Serialized value is not a resource.changed payload');
  }
  return cloneResourceChangedPayload(value);
}
