import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ProjectileHitType = 'combat.projectile.hit' as const;

export interface ProjectileHitPayload extends JsonObject {
  projectileId: number;
  targetId: number;
  damage: number;
  piercingRemaining: number;
}

export type ProjectileHitEvent = SimulationEvent<ProjectileHitPayload>;

export function createProjectileHitPayload(
  overrides: Partial<ProjectileHitPayload> = {},
): ProjectileHitPayload {
  return {
    projectileId: 0,
    targetId: 0,
    damage: 0,
    piercingRemaining: 0,
    ...overrides,
  };
}

export function createProjectileHitDraft(
  payload: ProjectileHitPayload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<ProjectileHitPayload> {
  if (!validateProjectileHitPayload(payload)) {
    throw new TypeError('Invalid payload for combat.projectile.hit');
  }
  return {
    type: ProjectileHitType,
    payload: cloneProjectileHitPayload(payload),
    metadata,
  };
}

export function isProjectileHitEvent(
  event: SimulationEvent,
): event is ProjectileHitEvent {
  return event.type === ProjectileHitType && validateProjectileHitPayload(event.payload);
}

export function validateProjectileHitPayload(
  value: unknown,
): value is ProjectileHitPayload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<ProjectileHitPayload>;
  return (
    typeof payload.projectileId === 'number' && Number.isFinite(payload.projectileId) &&
    typeof payload.targetId === 'number' && Number.isFinite(payload.targetId) &&
    typeof payload.damage === 'number' && Number.isFinite(payload.damage) &&
    typeof payload.piercingRemaining === 'number' && Number.isFinite(payload.piercingRemaining)
  );
}

export function cloneProjectileHitPayload(
  payload: ProjectileHitPayload,
): ProjectileHitPayload {
  return cloneJson(payload);
}

export function equalProjectileHitPayload(
  left: ProjectileHitPayload,
  right: ProjectileHitPayload,
): boolean {
  return (
    left.projectileId === right.projectileId &&
    left.targetId === right.targetId &&
    left.damage === right.damage &&
    left.piercingRemaining === right.piercingRemaining
  );
}

export function serializeProjectileHitPayload(
  payload: ProjectileHitPayload,
): string {
  if (!validateProjectileHitPayload(payload)) {
    throw new TypeError('Cannot serialize invalid combat.projectile.hit payload');
  }
  return JSON.stringify(payload);
}

export function deserializeProjectileHitPayload(
  serialized: string,
): ProjectileHitPayload {
  const value: unknown = JSON.parse(serialized);
  if (!validateProjectileHitPayload(value)) {
    throw new TypeError('Serialized value is not a combat.projectile.hit payload');
  }
  return cloneProjectileHitPayload(value);
}
