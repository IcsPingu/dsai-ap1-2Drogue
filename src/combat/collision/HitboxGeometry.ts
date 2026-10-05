import { Vec2, normalize } from '../core/types';

export interface CircleHitbox { kind: 'circle'; center: Vec2; radius: number; }
export interface RectangleHitbox { kind: 'rectangle'; center: Vec2; halfWidth: number; halfHeight: number; rotation: number; }
export interface CapsuleHitbox { kind: 'capsule'; start: Vec2; end: Vec2; radius: number; }
export interface SectorHitbox { kind: 'sector'; center: Vec2; direction: Vec2; radius: number; angle: number; }
export type Hitbox = CircleHitbox | RectangleHitbox | CapsuleHitbox | SectorHitbox;

export interface SweepResult { hit: boolean; time: number; position: Vec2; normal: Vec2; }

export class HitboxGeometry {
  public contains(hitbox: Hitbox, point: Vec2): boolean {
    if (hitbox.kind === 'circle') return this.distanceSquared(hitbox.center, point) <= hitbox.radius * hitbox.radius;
    if (hitbox.kind === 'rectangle') return this.rectangleContains(hitbox, point);
    if (hitbox.kind === 'capsule') return this.segmentDistance(point, hitbox.start, hitbox.end) <= hitbox.radius;
    return this.sectorContains(hitbox, point);
  }

  public intersects(left: Hitbox, right: Hitbox): boolean {
    if (left.kind === 'circle' && right.kind === 'circle') {
      const radius = left.radius + right.radius;
      return this.distanceSquared(left.center, right.center) <= radius * radius;
    }
    if (left.kind === 'circle') return this.circleIntersects(left, right as Exclude<Hitbox, CircleHitbox>);
    if (right.kind === 'circle') return this.circleIntersects(right, left as Exclude<Hitbox, CircleHitbox>);
    const leftPoints = this.sampleBoundary(left, 24);
    const rightPoints = this.sampleBoundary(right, 24);
    return leftPoints.some((point) => this.contains(right, point)) || rightPoints.some((point) => this.contains(left, point));
  }

  public sweepCircle(circle: CircleHitbox, velocity: Vec2, duration: number, obstacle: Hitbox, steps = 24): SweepResult {
    const count = Math.max(1, Math.floor(steps));
    let previous = { ...circle.center };
    for (let index = 1; index <= count; index++) {
      const time = duration * index / count;
      const position = { x: circle.center.x + velocity.x * time, y: circle.center.y + velocity.y * time };
      if (this.intersects({ ...circle, center: position }, obstacle)) {
        const normal = normalize({ x: previous.x - position.x, y: previous.y - position.y }, { x: -1, y: 0 });
        return { hit: true, time, position, normal };
      }
      previous = position;
    }
    return { hit: false, time: duration, position: { x: circle.center.x + velocity.x * duration, y: circle.center.y + velocity.y * duration }, normal: { x: 0, y: 0 } };
  }

  public closestPoint(hitbox: Hitbox, point: Vec2): Vec2 {
    if (hitbox.kind === 'circle') {
      const direction = normalize({ x: point.x - hitbox.center.x, y: point.y - hitbox.center.y });
      return { x: hitbox.center.x + direction.x * hitbox.radius, y: hitbox.center.y + direction.y * hitbox.radius };
    }
    if (hitbox.kind === 'capsule') {
      const segment = this.closestOnSegment(point, hitbox.start, hitbox.end);
      const direction = normalize({ x: point.x - segment.x, y: point.y - segment.y });
      return { x: segment.x + direction.x * hitbox.radius, y: segment.y + direction.y * hitbox.radius };
    }
    const samples = this.sampleBoundary(hitbox, 48);
    return samples.sort((left, right) => this.distanceSquared(left, point) - this.distanceSquared(right, point))[0] ?? { ...point };
  }

  public sampleBoundary(hitbox: Hitbox, samples: number): Vec2[] {
    const result: Vec2[] = [];
    const count = Math.max(4, Math.floor(samples));
    if (hitbox.kind === 'circle') {
      for (let index = 0; index < count; index++) {
        const angle = Math.PI * 2 * index / count;
        result.push({ x: hitbox.center.x + Math.cos(angle) * hitbox.radius, y: hitbox.center.y + Math.sin(angle) * hitbox.radius });
      }
    } else if (hitbox.kind === 'rectangle') {
      const corners = [
        { x: -hitbox.halfWidth, y: -hitbox.halfHeight }, { x: hitbox.halfWidth, y: -hitbox.halfHeight },
        { x: hitbox.halfWidth, y: hitbox.halfHeight }, { x: -hitbox.halfWidth, y: hitbox.halfHeight },
      ].map((point) => this.rotateAndTranslate(point, hitbox.center, hitbox.rotation));
      for (let edge = 0; edge < corners.length; edge++) {
        const start = corners[edge];
        const end = corners[(edge + 1) % corners.length];
        for (let index = 0; index < Math.ceil(count / 4); index++) {
          const ratio = index / Math.ceil(count / 4);
          result.push({ x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio });
        }
      }
    } else if (hitbox.kind === 'capsule') {
      const direction = normalize({ x: hitbox.end.x - hitbox.start.x, y: hitbox.end.y - hitbox.start.y });
      const normal = { x: -direction.y, y: direction.x };
      for (let index = 0; index <= count / 2; index++) {
        const ratio = index / (count / 2);
        const center = { x: hitbox.start.x + (hitbox.end.x - hitbox.start.x) * ratio, y: hitbox.start.y + (hitbox.end.y - hitbox.start.y) * ratio };
        result.push({ x: center.x + normal.x * hitbox.radius, y: center.y + normal.y * hitbox.radius });
        result.push({ x: center.x - normal.x * hitbox.radius, y: center.y - normal.y * hitbox.radius });
      }
    } else {
      const directionAngle = Math.atan2(hitbox.direction.y, hitbox.direction.x);
      const half = hitbox.angle * Math.PI / 360;
      result.push({ ...hitbox.center });
      for (let index = 0; index <= count; index++) {
        const angle = directionAngle - half + half * 2 * index / count;
        result.push({ x: hitbox.center.x + Math.cos(angle) * hitbox.radius, y: hitbox.center.y + Math.sin(angle) * hitbox.radius });
      }
    }
    return result;
  }

  private circleIntersects(circle: CircleHitbox, other: Exclude<Hitbox, CircleHitbox>): boolean {
    return this.distanceSquared(circle.center, this.closestPoint(other, circle.center)) <= circle.radius * circle.radius || this.contains(other, circle.center);
  }

  private rectangleContains(rectangle: RectangleHitbox, point: Vec2): boolean {
    const cosine = Math.cos(-rectangle.rotation);
    const sine = Math.sin(-rectangle.rotation);
    const dx = point.x - rectangle.center.x;
    const dy = point.y - rectangle.center.y;
    const local = { x: dx * cosine - dy * sine, y: dx * sine + dy * cosine };
    return Math.abs(local.x) <= rectangle.halfWidth && Math.abs(local.y) <= rectangle.halfHeight;
  }

  private sectorContains(sector: SectorHitbox, point: Vec2): boolean {
    const delta = { x: point.x - sector.center.x, y: point.y - sector.center.y };
    const length = Math.hypot(delta.x, delta.y);
    if (length > sector.radius) return false;
    if (length <= Number.EPSILON) return true;
    const direction = normalize(sector.direction);
    const dot = (delta.x / length) * direction.x + (delta.y / length) * direction.y;
    return dot >= Math.cos(sector.angle * Math.PI / 360);
  }

  private closestOnSegment(point: Vec2, start: Vec2, end: Vec2): Vec2 {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const denominator = dx * dx + dy * dy;
    if (denominator <= Number.EPSILON) return { ...start };
    const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / denominator));
    return { x: start.x + dx * ratio, y: start.y + dy * ratio };
  }

  private segmentDistance(point: Vec2, start: Vec2, end: Vec2): number {
    const closest = this.closestOnSegment(point, start, end);
    return Math.hypot(point.x - closest.x, point.y - closest.y);
  }

  private rotateAndTranslate(point: Vec2, center: Vec2, rotation: number): Vec2 {
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    return { x: center.x + point.x * cosine - point.y * sine, y: center.y + point.x * sine + point.y * cosine };
  }

  private distanceSquared(left: Vec2, right: Vec2): number { const dx = left.x - right.x; const dy = left.y - right.y; return dx * dx + dy * dy; }
}
