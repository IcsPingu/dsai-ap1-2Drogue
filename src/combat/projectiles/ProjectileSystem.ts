import { Combatant } from '../core/Combatant';
import { CombatantId, ProjectileId, ProjectileSnapshot, ProjectileSpawnRequest, Vec2, distance, normalize } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';

export interface ProjectileCollision { projectile: ProjectileSnapshot; targetId: CombatantId; position: Vec2; }
export interface ProjectileUpdateResult { collisions: ProjectileCollision[]; expired: ProjectileId[]; }
export interface ProjectileSystemSnapshot { projectiles: ProjectileSnapshot[]; serial: number; }

export class ProjectileSystem {
  private readonly projectiles = new Map<ProjectileId, ProjectileSnapshot>();
  private serial = 0;

  public constructor(private readonly events: CombatEventStream, private readonly combatants: Map<CombatantId, Combatant>) {}

  public spawn(request: ProjectileSpawnRequest, now: number): ProjectileSnapshot {
    const direction = normalize(request.direction);
    const projectile: ProjectileSnapshot = {
      id: 'projectile-' + ++this.serial,
      sourceId: request.sourceId,
      abilityId: request.abilityId,
      position: { ...request.origin },
      previousPosition: { ...request.origin },
      velocity: { x: direction.x * request.definition.speed, y: direction.y * request.definition.speed },
      definition: { ...request.definition, collisionTeams: [...request.definition.collisionTeams], tags: [...request.definition.tags] },
      createdAt: now,
      expiresAt: now + request.definition.lifetime,
      remainingPierces: request.definition.piercing,
      remainingBounces: request.definition.bounces,
      hitTargets: [],
      targetId: request.targetId,
    };
    this.projectiles.set(projectile.id, projectile);
    this.events.emit('projectile-spawned', now, { projectile: this.clone(projectile) }, request.sourceId);
    return this.clone(projectile);
  }

  public update(now: number, deltaMilliseconds: number, obstacleTest?: (from: Vec2, to: Vec2) => Vec2 | undefined): ProjectileUpdateResult {
    const delta = Math.max(0, Math.min(100, deltaMilliseconds)) / 1000;
    const collisions: ProjectileCollision[] = [];
    const expired: ProjectileId[] = [];
    for (const projectile of [...this.projectiles.values()]) {
      if (now >= projectile.expiresAt) { this.expire(projectile.id, now, 'lifetime'); expired.push(projectile.id); continue; }
      projectile.previousPosition = { ...projectile.position };
      this.applyHoming(projectile, delta);
      const speed = Math.hypot(projectile.velocity.x, projectile.velocity.y);
      if (projectile.definition.acceleration !== 0 && speed > 0) {
        const nextSpeed = Math.min(projectile.definition.maximumSpeed, speed + projectile.definition.acceleration * delta);
        projectile.velocity.x = projectile.velocity.x / speed * nextSpeed;
        projectile.velocity.y = projectile.velocity.y / speed * nextSpeed;
      }
      projectile.velocity.y += projectile.definition.gravity * delta;
      const next = { x: projectile.position.x + projectile.velocity.x * delta, y: projectile.position.y + projectile.velocity.y * delta };
      const normal = obstacleTest?.(projectile.position, next);
      if (normal) {
        if (projectile.remainingBounces <= 0) { this.expire(projectile.id, now, 'obstacle'); expired.push(projectile.id); continue; }
        this.reflect(projectile, normal);
        projectile.remainingBounces--;
      } else {
        projectile.position = next;
      }
      for (const target of this.combatants.values()) {
        const snapshot = target.snapshot();
        if (!snapshot.alive || target.id === projectile.sourceId || projectile.hitTargets.includes(target.id)) continue;
        if (!projectile.definition.collisionTeams.includes(snapshot.team)) continue;
        if (this.segmentDistance(snapshot.position, projectile.previousPosition, projectile.position) > projectile.definition.radius) continue;
        projectile.hitTargets.push(target.id);
        collisions.push({ projectile: this.clone(projectile), targetId: target.id, position: { ...projectile.position } });
        this.events.emit('projectile-hit', now, { projectileId: projectile.id, abilityId: projectile.abilityId }, projectile.sourceId, target.id);
        if (projectile.remainingPierces <= 0) { this.expire(projectile.id, now, 'hit'); expired.push(projectile.id); break; }
        projectile.remainingPierces--;
      }
      if (this.projectiles.has(projectile.id)) this.events.emit('projectile-moved', now, { id: projectile.id, position: { ...projectile.position }, velocity: { ...projectile.velocity } }, projectile.sourceId);
    }
    return { collisions, expired };
  }

  public expire(id: ProjectileId, now: number, reason: string): boolean {
    const projectile = this.projectiles.get(id);
    if (!projectile) return false;
    this.projectiles.delete(id);
    this.events.emit('projectile-expired', now, { id, reason }, projectile.sourceId);
    return true;
  }

  public removeBySource(sourceId: CombatantId, now: number): number {
    let removed = 0;
    for (const projectile of this.list()) if (projectile.sourceId === sourceId && this.expire(projectile.id, now, 'source-removed')) removed++;
    return removed;
  }

  public get(id: ProjectileId): ProjectileSnapshot | undefined { const value = this.projectiles.get(id); return value ? this.clone(value) : undefined; }
  public list(): ProjectileSnapshot[] { return [...this.projectiles.values()].map((projectile) => this.clone(projectile)); }
  public capture(): ProjectileSystemSnapshot { return { projectiles: this.list(), serial: this.serial }; }
  public restore(snapshot: ProjectileSystemSnapshot): void { this.projectiles.clear(); for (const projectile of snapshot.projectiles) this.projectiles.set(projectile.id, this.clone(projectile)); this.serial = snapshot.serial; }

  private applyHoming(projectile: ProjectileSnapshot, delta: number): void {
    if (!projectile.targetId || projectile.definition.homingStrength <= 0) return;
    const target = this.combatants.get(projectile.targetId)?.snapshot();
    if (!target?.alive) return;
    const desired = normalize({ x: target.position.x - projectile.position.x, y: target.position.y - projectile.position.y });
    const speed = Math.hypot(projectile.velocity.x, projectile.velocity.y);
    const current = normalize(projectile.velocity);
    const blend = Math.min(1, projectile.definition.homingStrength * delta * 60);
    const direction = normalize({ x: current.x + (desired.x - current.x) * blend, y: current.y + (desired.y - current.y) * blend });
    projectile.velocity = { x: direction.x * speed, y: direction.y * speed };
  }

  private reflect(projectile: ProjectileSnapshot, normal: Vec2): void {
    const unit = normalize(normal);
    const dot = projectile.velocity.x * unit.x + projectile.velocity.y * unit.y;
    projectile.velocity = { x: projectile.velocity.x - 2 * dot * unit.x, y: projectile.velocity.y - 2 * dot * unit.y };
  }

  private segmentDistance(point: Vec2, start: Vec2, end: Vec2): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared <= Number.EPSILON) return distance(point, start);
    const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
    return distance(point, { x: start.x + dx * ratio, y: start.y + dy * ratio });
  }

  private clone(projectile: ProjectileSnapshot): ProjectileSnapshot {
    return { ...projectile, position: { ...projectile.position }, previousPosition: { ...projectile.previousPosition }, velocity: { ...projectile.velocity }, definition: { ...projectile.definition, collisionTeams: [...projectile.definition.collisionTeams], tags: [...projectile.definition.tags] }, hitTargets: [...projectile.hitTargets] };
  }
}
