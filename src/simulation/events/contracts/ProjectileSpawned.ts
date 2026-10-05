import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ProjectileSpawnedType = 'combat.projectile.spawned' as const;

export interface ProjectileSpawnedPayload extends JsonObject {
  projectileId: number;
  ownerId: number;
  abilityId: string;
  speed: number;
}

export type ProjectileSpawnedEvent = SimulationEvent<ProjectileSpawnedPayload>;

export function createProjectileSpawnedPayload(
  overrides: Partial<ProjectileSpawnedPayload> = {},
): ProjectileSpawnedPayload {
  return {
    projectileId: 0,
    ownerId: 0,
    abilityId: '',
    speed: 0,
    ...overrides,
  };
}

export function createProjectileSpawnedDraft(
  payload: ProjectileSpawnedPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ProjectileSpawnedPayload> {
  if (!validateProjectileSpawnedPayload(payload)) {
    throw new TypeError('Invalid payload for combat.projectile.spawned');
  }
  return {
    type: ProjectileSpawnedType,
    payload: cloneProjectileSpawnedPayload(payload),
    metadata,
  };
}

export function isProjectileSpawnedEvent(
  event: SimulationEvent,
): event is ProjectileSpawnedEvent {
  return event.type === ProjectileSpawnedType && validateProjectileSpawnedPayload(event.payload);
}

export function validateProjectileSpawnedPayload(
  value: unknown,
): value is ProjectileSpawnedPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ProjectileSpawnedPayload>;
  return (
    typeof payload.projectileId === 'number' && Number.isFinite(payload.projectileId) &&
    typeof payload.ownerId === 'number' && Number.isFinite(payload.ownerId) &&
    typeof payload.abilityId === 'string' &&
    typeof payload.speed === 'number' && Number.isFinite(payload.speed)
  );
}

export function cloneProjectileSpawnedPayload(
  payload: ProjectileSpawnedPayload,
): ProjectileSpawnedPayload {
  return cloneJson(payload);
}

export function equalProjectileSpawnedPayload(
  left: ProjectileSpawnedPayload,
  right: ProjectileSpawnedPayload,
): boolean {
  return (
    left.projectileId === right.projectileId &&
    left.ownerId === right.ownerId &&
    left.abilityId === right.abilityId &&
    left.speed === right.speed
  );
}

export function serializeProjectileSpawnedPayload(
  payload: ProjectileSpawnedPayload,
): string {
  if (!validateProjectileSpawnedPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.projectile.spawned payload');
  }
  return JSON.stringify(payload);
}

export function deserializeProjectileSpawnedPayload(
  serialized: string,
): ProjectileSpawnedPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateProjectileSpawnedPayload(value)) {
    throw new TypeError('Serialized value is not a combat.projectile.spawned payload');
  }
  return cloneProjectileSpawnedPayload(value);
}
