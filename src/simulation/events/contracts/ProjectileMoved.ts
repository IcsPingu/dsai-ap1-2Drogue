import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ProjectileMovedType = 'combat.projectile.moved' as const;

export interface ProjectileMovedPayload extends JsonObject {
  projectileId: number;
  x: number;
  y: number;
  remainingLifetime: number;
}

export type ProjectileMovedEvent = SimulationEvent<ProjectileMovedPayload>;

export function createProjectileMovedPayload(
  overrides: Partial<ProjectileMovedPayload> = {},
): ProjectileMovedPayload {
  return {
    projectileId: 0,
    x: 0,
    y: 0,
    remainingLifetime: 0,
    ...overrides,
  };
}

export function createProjectileMovedDraft(
  payload: ProjectileMovedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ProjectileMovedPayload> {
  if (!validateProjectileMovedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.projectile.moved');
  }
  return {
    type: ProjectileMovedType,
    payload: cloneProjectileMovedPayload(payload),
    metadata,
  };
}

export function isProjectileMovedEvent(
  event: SimulationEvent,
): event is ProjectileMovedEvent {
  return event.type === ProjectileMovedType && validateProjectileMovedPayload(event.payload);
}

export function validateProjectileMovedPayload(
  value: unknown,
): value is ProjectileMovedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ProjectileMovedPayload>;
  return (
    typeof payload.projectileId === 'number' && Number.isFinite(payload.projectileId) &&
    typeof payload.x === 'number' && Number.isFinite(payload.x) &&
    typeof payload.y === 'number' && Number.isFinite(payload.y) &&
    typeof payload.remainingLifetime === 'number' && Number.isFinite(payload.remainingLifetime)
  );
}

export function cloneProjectileMovedPayload(
  payload: ProjectileMovedPayload,
): ProjectileMovedPayload {
  return cloneJson(payload);
}

export function equalProjectileMovedPayload(
  left: ProjectileMovedPayload,
  right: ProjectileMovedPayload,
): boolean {
  return (
    left.projectileId === right.projectileId &&
    left.x === right.x &&
    left.y === right.y &&
    left.remainingLifetime === right.remainingLifetime
  );
}

export function serializeProjectileMovedPayload(
  payload: ProjectileMovedPayload,
): string {
  if (!validateProjectileMovedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.projectile.moved payload');
  }
  return JSON.stringify(payload);
}

export function deserializeProjectileMovedPayload(
  serialized: string,
): ProjectileMovedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateProjectileMovedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.projectile.moved payload');
  }
  return cloneProjectileMovedPayload(value);
}
