import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ProjectileExpiredType = 'combat.projectile.expired' as const;

export interface ProjectileExpiredPayload extends JsonObject {
  projectileId: number;
  reason: string;
  x: number;
  y: number;
}

export type ProjectileExpiredEvent = SimulationEvent<ProjectileExpiredPayload>;

export function createProjectileExpiredPayload(
  overrides: Partial<ProjectileExpiredPayload> = {},
): ProjectileExpiredPayload {
  return {
    projectileId: 0,
    reason: '',
    x: 0,
    y: 0,
    ...overrides,
  };
}

export function createProjectileExpiredDraft(
  payload: ProjectileExpiredPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ProjectileExpiredPayload> {
  if (!validateProjectileExpiredPayload(payload)) {
    throw new TypeError('Invalid payload for combat.projectile.expired');
  }
  return {
    type: ProjectileExpiredType,
    payload: cloneProjectileExpiredPayload(payload),
    metadata,
  };
}

export function isProjectileExpiredEvent(
  event: SimulationEvent,
): event is ProjectileExpiredEvent {
  return event.type === ProjectileExpiredType && validateProjectileExpiredPayload(event.payload);
}

export function validateProjectileExpiredPayload(
  value: unknown,
): value is ProjectileExpiredPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ProjectileExpiredPayload>;
  return (
    typeof payload.projectileId === 'number' && Number.isFinite(payload.projectileId) &&
    typeof payload.reason === 'string' &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y)
  );
}

export function cloneProjectileExpiredPayload(
  payload: ProjectileExpiredPayload,
): ProjectileExpiredPayload {
  return cloneJson(payload);
}

export function equalProjectileExpiredPayload(
  left: ProjectileExpiredPayload,
  right: ProjectileExpiredPayload,
): boolean {
  return (
    left.projectileId === right.projectileId &&
    left.reason === right.reason &&
    left.x === right.x &&
    left.y === right.y
  );
}

export function serializeProjectileExpiredPayload(
  payload: ProjectileExpiredPayload,
): string {
  if (!validateProjectileExpiredPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.projectile.expired payload');
  }
  return JSON.stringify(payload);
}

export function deserializeProjectileExpiredPayload(
  serialized: string,
): ProjectileExpiredPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateProjectileExpiredPayload(value)) {
    throw new TypeError('Serialized value is not a combat.projectile.expired payload');
  }
  return cloneProjectileExpiredPayload(value);
}
