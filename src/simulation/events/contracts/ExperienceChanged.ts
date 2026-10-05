import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ExperienceChangedType = 'progression.experience.changed' as const;

export interface ExperienceChangedPayload extends JsonObject {
  entityId: number;
  previous: number;
  current: number;
  source: string;
}

export type ExperienceChangedEvent = SimulationEvent<ExperienceChangedPayload>;

export function createExperienceChangedPayload(
  overrides: Partial<ExperienceChangedPayload> = {},
): ExperienceChangedPayload {
  return {
    entityId: 0,
    previous: 0,
    current: 0,
    source: '',
    ...overrides,
  };
}

export function createExperienceChangedDraft(
  payload: ExperienceChangedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ExperienceChangedPayload> {
  if (!validateExperienceChangedPayload(payload)) {
    throw new TypeError('Invalid payload for progression.experience.changed');
  }
  return {
    type: ExperienceChangedType,
    payload: cloneExperienceChangedPayload(payload),
    metadata,
  };
}

export function isExperienceChangedEvent(
  event: SimulationEvent,
): event is ExperienceChangedEvent {
  return event.type === ExperienceChangedType && validateExperienceChangedPayload(event.payload);
}

export function validateExperienceChangedPayload(
  value: unknown,
): value is ExperienceChangedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ExperienceChangedPayload>;
  return (
    typeof payload.entityId === 'number' && Number.isFinite(payload.entityId) &&
    typeof payload.previous === 'number' && Number.isFinite(payload.previous) &&
    typeof payload.current === 'number' && Number.isFinite(payload.current) &&
    typeof payload.source === 'string'
  );
}

export function cloneExperienceChangedPayload(
  payload: ExperienceChangedPayload,
): ExperienceChangedPayload {
  return cloneJson(payload);
}

export function equalExperienceChangedPayload(
  left: ExperienceChangedPayload,
  right: ExperienceChangedPayload,
): boolean {
  return (
    left.entityId === right.entityId &&
    left.previous === right.previous &&
    left.current === right.current &&
    left.source === right.source
  );
}

export function serializeExperienceChangedPayload(
  payload: ExperienceChangedPayload,
): string {
  if (!validateExperienceChangedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid progression.experience.changed payload');
  }
  return JSON.stringify(payload);
}

export function deserializeExperienceChangedPayload(
  serialized: string,
): ExperienceChangedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateExperienceChangedPayload(value)) {
    throw new TypeError('Serialized value is not a progression.experience.changed payload');
  }
  return cloneExperienceChangedPayload(value);
}
