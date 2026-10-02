export const ARCHER_AIM_PIVOT = { x: 64, y: 46 };

export interface BowPoint { x: number; y: number }
export interface BowArm { shoulder: BowPoint; elbow: BowPoint; hand: BowPoint }

export function getArcherBodyTextureKey(sourceKey: string): string {
  return `${sourceKey}_aim_body`;
}

export function getArcherAimOrigin(x: number, y: number, scaleY: number): BowPoint {
  return { x, y: y + (ARCHER_AIM_PIVOT.y - 57) * scaleY };
}

/** Two rigid arm segments joined at an elbow, never a rotated strip of the torso. */
function solveArm(shoulder: BowPoint, hand: BowPoint, bend: number): BowArm {
  const upper = 13;
  const lower = 14;
  const dx = hand.x - shoulder.x;
  const dy = hand.y - shoulder.y;
  const distance = Math.max(0.001, Math.hypot(dx, dy));
  const reach = Math.min(upper + lower - 0.001, Math.max(Math.abs(upper - lower) + 0.001, distance));
  const along = (upper * upper - lower * lower + reach * reach) / (2 * reach);
  const across = Math.sqrt(Math.max(0, upper * upper - along * along)) * bend;
  return {
    shoulder,
    elbow: {
      x: shoulder.x + (dx * along - dy * across) / distance,
      y: shoulder.y + (dy * along + dx * across) / distance,
    },
    hand,
  };
}

export function getArcherBowPose(angle: number, charge: number, flipX: boolean, releasing = false) {
  const pull = releasing ? 0 : Math.max(0, Math.min(1, charge));
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  const point = (forward: number, side: number): BowPoint => ({
    x: direction.x * forward - direction.y * side,
    y: direction.y * forward + direction.x * side,
  });
  const side = flipX ? -1 : 1;
  // Keep the supporting arm almost straight at every angle. Its reach is
  // measured from the shoulder, not from the middle of the chest.
  const shoulderProjection = direction.x * side * 10;
  const gripDistance = shoulderProjection + Math.sqrt(25 * 25 - 10 * 10 + shoulderProjection ** 2);
  const grip = point(gripDistance, 0);
  const nock = point(12 - pull * 16, 0);
  return {
    point, grip, nock, pull, gripDistance,
    holdingArm: solveArm({ x: side * 10, y: 0 }, grip, side),
    drawingArm: solveArm({ x: -side * 10, y: 0 }, nock, -side),
    tips: [point(gripDistance - 6 - pull * 2, -23), point(gripDistance - 6 - pull * 2, 23)],
    showArrow: !releasing,
  };
}

/** Draw only the weapon and articulated arms. The body is a separate, untouched asset. */
export function drawArcherBow(context: CanvasRenderingContext2D, angle: number,
  charge: number, flipX: boolean, releasing: boolean): void {
  const pose = getArcherBowPose(angle, charge, flipX, releasing);
  context.clearRect(0, 0, 128, 114);
  context.save();
  context.translate(ARCHER_AIM_PIVOT.x, ARCHER_AIM_PIVOT.y);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  const line = (points: BowPoint[], color: string, width: number) => {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    points.forEach((p, i) => i === 0
      ? context.moveTo(Math.round(p.x), Math.round(p.y))
      : context.lineTo(Math.round(p.x), Math.round(p.y)));
    context.stroke();
  };
  // Rasterize silhouettes on the sprite's pixel grid. Tapered shapes and
  // separate cloth/skin/bracer palettes read as limbs instead of wooden rods.
  const polygon = (points: BowPoint[], color: string) => {
    context.fillStyle = color;
    const top = Math.floor(Math.min(...points.map(p => p.y)));
    const bottom = Math.ceil(Math.max(...points.map(p => p.y)));
    for (let y = top; y < bottom; y++) {
      const intersections: number[] = [];
      points.forEach((a, i) => {
        const b = points[(i + 1) % points.length];
        if ((a.y <= y + 0.5 && b.y > y + 0.5) || (b.y <= y + 0.5 && a.y > y + 0.5)) {
          intersections.push(a.x + (y + 0.5 - a.y) * (b.x - a.x) / (b.y - a.y));
        }
      });
      intersections.sort((a, b) => a - b);
      for (let i = 0; i + 1 < intersections.length; i += 2) {
        const left = Math.round(intersections[i]);
        context.fillRect(left, y, Math.round(intersections[i + 1]) - left, 1);
      }
    }
  };
  const lerp = (a: BowPoint, b: BowPoint, t: number): BowPoint => ({
    x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
  });
  const segment = (a: BowPoint, b: BowPoint, startWidth: number, endWidth: number,
    color: string, offset = 0) => {
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / length;
    const ny = (b.x - a.x) / length;
    const edge = (p: BowPoint, width: number) => ({ x: p.x + nx * width, y: p.y + ny * width });
    polygon([edge(a, offset - startWidth / 2), edge(b, offset - endWidth / 2),
      edge(b, offset + endWidth / 2), edge(a, offset + startWidth / 2)], color);
  };
  const arm = ({ shoulder, elbow, hand }: BowArm) => {
    const sleeveEnd = lerp(shoulder, elbow, 0.65);
    const bracerStart = lerp(elbow, hand, 0.35);
    const wrist = lerp(elbow, hand, 0.85);
    segment(shoulder, elbow, 9, 7, '#2a2325');
    segment(elbow, hand, 7, 5, '#2a2325');
    segment(shoulder, elbow, 7, 5, '#cf936b');
    segment(elbow, hand, 5, 3, '#dba67b');
    segment(sleeveEnd, elbow, 3, 3, '#f0c79b', -1);
    segment(elbow, bracerStart, 3, 2, '#f0c79b', -1);
    // A broad, shaded linen sleeve overlaps the matching shoulder on the body.
    segment(shoulder, sleeveEnd, 9, 8, '#625b44');
    segment(shoulder, sleeveEnd, 7, 6, '#c7c29c', -0.5);
    segment(shoulder, sleeveEnd, 3, 3, '#f3ebca', -2);
    segment(lerp(shoulder, sleeveEnd, 0.82), sleeveEnd, 8, 8, '#9d8750');
    segment(bracerStart, wrist, 6, 5, '#25382a');
    segment(bracerStart, wrist, 4, 3, '#536d3b', -0.5);
    segment(bracerStart, wrist, 1, 1, '#87914a', -1.5);
    segment(lerp(bracerStart, wrist, 0.8), wrist, 6, 5, '#c3a160');
  };
  const hand = (limb: BowArm) => {
    const wrist = lerp(limb.elbow, limb.hand, 0.88);
    const knuckles = lerp(limb.elbow, limb.hand, 1.15);
    segment(wrist, knuckles, 6, 5, '#51362c');
    segment(wrist, knuckles, 4, 3, '#e1ad80', -0.5);
    segment(wrist, limb.hand, 2, 2, '#ffe0ac', -1);
    // Thumb curls across the grip/string; knuckles remain in front of the bow.
    const x = Math.round(limb.hand.x), y = Math.round(limb.hand.y);
    context.fillStyle = '#f4c592';
    context.fillRect(x - 2, y, 3, 2);
  };
  arm(pose.drawingArm);
  arm(pose.holdingArm);
  const bow = [pose.tips[0], pose.point(pose.gripDistance + 1, -18), pose.point(pose.gripDistance + 4, -9), pose.grip,
    pose.point(pose.gripDistance + 4, 9), pose.point(pose.gripDistance + 1, 18), pose.tips[1]];
  line(bow, '#21160f', 5);
  line(bow, '#865427', 3);
  line(bow, '#d2ab61', 1);
  line([pose.tips[0], pose.nock, pose.tips[1]], '#e6dbb4', 1);
  // Small green bindings and gold accents echo the authored ranger weapon.
  [-15, 15].forEach(side => {
    const p = pose.point(pose.gripDistance + 2, side);
    context.fillStyle = '#3d7436';
    context.fillRect(Math.round(p.x) - 2, Math.round(p.y) - 2, 4, 4);
    context.fillStyle = '#d7bd72';
    context.fillRect(Math.round(p.x), Math.round(p.y), 1, 2);
  });
  if (pose.showArrow) {
    const tail = 12 - pose.pull * 16;
    line([pose.point(tail, 0), pose.point(tail + 45, 0)], '#20180f', 3);
    line([pose.point(tail, 0), pose.point(tail + 45, 0)], '#c7ae71', 1);
    line([pose.point(tail + 41, -2), pose.point(tail + 46, 0), pose.point(tail + 41, 2)], '#ebeedc', 1);
    line([pose.point(tail + 4, -2), pose.point(tail, 0), pose.point(tail + 4, 2)], '#cddfaf', 2);
  }
  hand(pose.holdingArm);
  hand(pose.drawingArm);
  context.restore();
}
