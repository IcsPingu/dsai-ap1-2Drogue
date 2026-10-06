import { NavPoint, clampMagnitude, distance, normalize } from '../navigation';

export interface NeighborSample extends NavPoint {
  radius?: number;
}

export function separation(
  self: NavPoint,
  neighbors: readonly NeighborSample[],
  desiredDistance = 48,
  maximumForce = 1,
): NavPoint {
  let x = 0;
  let y = 0;
  let contributors = 0;
  for (const neighbor of neighbors) {
    const minimum = desiredDistance + (neighbor.radius ?? 0);
    const current = distance(self, neighbor);
    if (current <= Number.EPSILON || current >= minimum) continue;
    const away = normalize({ x: self.x - neighbor.x, y: self.y - neighbor.y });
    const strength = 1 - current / minimum;
    x += away.x * strength;
    y += away.y * strength;
    contributors++;
  }
  if (contributors === 0) return { x: 0, y: 0 };
  return clampMagnitude({ x: x / contributors, y: y / contributors }, maximumForce);
}

export function blendVelocity(primary: NavPoint, avoidance: NavPoint, avoidanceWeight = 0.35): NavPoint {
  const speed = Math.hypot(primary.x, primary.y);
  if (speed <= Number.EPSILON) return primary;
  const desired = normalize(primary);
  const blended = normalize({
    x: desired.x + avoidance.x * avoidanceWeight,
    y: desired.y + avoidance.y * avoidanceWeight,
  });
  return { x: blended.x * speed, y: blended.y * speed };
}
