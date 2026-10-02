import type Phaser from 'phaser';

export const ARCHER_AIM_PIVOT = { x: 64, y: 44 };

/** Split the existing draw poses into an upright body and independently aimed arms/bow. */
export function createArcherAimTextures(scene: Phaser.Scene, sourceKey: string) {
  const bodyKey = `${sourceKey}_aim_body`;
  const bowKey = `${sourceKey}_aim_bow`;
  if (scene.textures.exists(bodyKey) && scene.textures.exists(bowKey)) return { bodyKey, bowKey };
  const woman = sourceKey.endsWith('_woman');
  const canvas = (width = 128) => {
    const result = document.createElement('canvas');
    result.width = width;
    result.height = 114;
    return result;
  };
  const sheet = canvas(384);
  const body = canvas();
  [4, 5, 6].forEach((frameNumber, index) => {
    const frame = scene.textures.getFrame(sourceKey, frameNumber);
    const source = canvas();
    source.getContext('2d')!.drawImage(frame.source.image as CanvasImageSource,
      frame.cutX, frame.cutY, 128, 114, 0, 0, 128, 114);
    const ready = frameNumber !== 4;
    const outline = woman
      ? ready
        ? [[34, 35], [51, 34], [69, 39], [90, 42], [99, 33], [91, 0], [128, 0],
          [128, 105], [90, 105], [90, 73], [79, 60], [59, 53], [37, 49]]
        : [[37, 38], [55, 38], [76, 46], [96, 50], [104, 34], [97, 0], [128, 0],
          [128, 105], [92, 105], [91, 78], [77, 65], [56, 56], [37, 52]]
      : ready
        ? [[37, 34], [56, 33], [76, 40], [96, 42], [97, 32], [82, 0], [128, 0],
          [128, 101], [94, 101], [94, 75], [77, 58], [57, 51], [36, 46]]
        : [[40, 39], [58, 39], [78, 44], [99, 46], [103, 30], [85, 0], [128, 0],
          [128, 102], [94, 102], [94, 74], [77, 63], [57, 56], [38, 51]];
    const mask = new Path2D();
    outline.forEach(([x, y], point) => point === 0 ? mask.moveTo(x, y) : mask.lineTo(x, y));
    mask.closePath();
    const context = sheet.getContext('2d')!;
    context.save();
    context.translate(index * 128, 0);
    context.clip(mask);
    context.drawImage(source, 0, 0);
    context.restore();
    if (frameNumber === 5) {
      const bodyContext = body.getContext('2d')!;
      bodyContext.drawImage(source, 0, 0);
      bodyContext.globalCompositeOperation = 'destination-out';
      bodyContext.fill(mask);
      bodyContext.globalCompositeOperation = 'source-over';
      // Restore the tunic behind the arms; the original sheet has no hidden-body layer.
      bodyContext.save();
      bodyContext.clip(mask);
      bodyContext.imageSmoothingEnabled = false;
      const tunic = new Path2D();
      tunic.moveTo(49, 36); tunic.lineTo(62, 35); tunic.lineTo(74, 44);
      tunic.lineTo(78, 52); tunic.lineTo(69, 65); tunic.lineTo(54, 65);
      tunic.lineTo(39, 46); tunic.closePath();
      bodyContext.fillStyle = '#1d382c';
      bodyContext.fill(tunic);
      const panel = new Path2D();
      panel.moveTo(51, 38); panel.lineTo(61, 38); panel.lineTo(72, 47);
      panel.lineTo(65, 61); panel.lineTo(53, 55); panel.closePath();
      bodyContext.fillStyle = '#38523a';
      bodyContext.fill(panel);
      bodyContext.strokeStyle = '#ad9154';
      bodyContext.lineWidth = 1;
      bodyContext.beginPath();
      bodyContext.moveTo(49, 37); bodyContext.lineTo(62, 45); bodyContext.lineTo(71, 44);
      bodyContext.moveTo(45, 46); bodyContext.lineTo(68, 61);
      bodyContext.stroke();
      bodyContext.restore();
    }
  });
  scene.textures.addCanvas(bodyKey, body);
  const bow = scene.textures.addCanvas(bowKey, sheet);
  if (!bow) throw new Error(`Unable to create archer aiming texture: ${bowKey}`);
  [0, 1, 2].forEach(index => bow.add(index, 0, index * 128, 0, 128, 114));
  return { bodyKey, bowKey };
}

export function getArcherAimOrigin(x: number, y: number, scaleY: number) {
  return { x, y: y + (ARCHER_AIM_PIVOT.y - 57) * scaleY };
}

/** Position a center-origin bow image around the shoulder, independently of body rotation. */
export function getArcherBowTransform(x: number, y: number, scaleX: number, scaleY: number,
  aimAngle: number, flipX: boolean) {
  const rotation = aimAngle - (flipX ? Math.PI : 0);
  const offsetX = (64 - ARCHER_AIM_PIVOT.x) * scaleX * (flipX ? -1 : 1);
  const offsetY = (57 - ARCHER_AIM_PIVOT.y) * scaleY;
  return {
    x: x + Math.cos(rotation) * offsetX - Math.sin(rotation) * offsetY,
    y: y + (ARCHER_AIM_PIVOT.y - 57) * scaleY + Math.sin(rotation) * offsetX + Math.cos(rotation) * offsetY,
    rotation,
  };
}
