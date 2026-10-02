import Phaser from 'phaser';

/** Separate the staff from the idle pose so casting never shifts the whole body. */
export function createMageCastTexture(scene: Phaser.Scene, sourceKey: string): string {
  const key = `${sourceKey}_staff_cast`;
  if (scene.textures.exists(key)) return key;
  const frame = scene.textures.getFrame(sourceKey, 0);
  const width = frame.cutWidth;
  const height = frame.cutHeight;
  const woman = sourceKey.endsWith('_woman');
  const grip = woman ? { x: 48, y: 66 } : { x: 59, y: 62 };
  // Outlines follow the staff in the original 128 x 114 idle frames.
  const outline = woman
    ? [[13, 9], [45, 9], [48, 39], [47, 49], [53, 62], [63, 107],
      [55, 110], [45, 77], [39, 62], [33, 49], [20, 49], [13, 39]]
    : [[28, 4], [56, 4], [59, 34], [55, 47], [64, 62], [70, 104],
      [61, 109], [54, 76], [49, 59], [42, 47], [29, 45], [26, 29]];
  const canvas = () => {
    const result = document.createElement('canvas');
    result.width = width;
    result.height = height;
    return result;
  };
  const idle = canvas();
  idle.getContext('2d')!.drawImage(frame.source.image as CanvasImageSource,
    frame.cutX, frame.cutY, width, height, 0, 0, width, height);
  const mask = new Path2D();
  outline.forEach(([x, y], index) => {
    if (index === 0) mask.moveTo(x, y);
    else mask.lineTo(x, y);
  });
  mask.closePath();
  const staff = canvas();
  const staffContext = staff.getContext('2d')!;
  staffContext.save();
  staffContext.clip(mask);
  staffContext.drawImage(idle, 0, 0);
  staffContext.restore();
  const body = canvas();
  const bodyContext = body.getContext('2d')!;
  bodyContext.drawImage(idle, 0, 0);
  bodyContext.globalCompositeOperation = 'destination-out';
  bodyContext.fill(mask);

  const sheet = canvas();
  const angles = [0, -0.045, -0.09, 0];
  sheet.width = width * angles.length;
  const context = sheet.getContext('2d')!;
  context.imageSmoothingEnabled = false;
  angles.forEach((angle, index) => {
    context.save();
    context.translate(index * width, 0);
    context.beginPath();
    context.rect(0, 0, width, height);
    context.clip();
    if (angle === 0) {
      context.drawImage(idle, 0, 0);
    } else {
      context.drawImage(body, 0, 0);
      context.translate(grip.x, grip.y);
      context.rotate(angle);
      context.drawImage(staff, -grip.x, -grip.y);
    }
    context.restore();
  });
  const texture = scene.textures.addCanvas(key, sheet);
  if (!texture) throw new Error(`Unable to create mage casting texture: ${key}`);
  angles.forEach((_, index) => texture.add(index, 0, index * width, 0, width, height));
  return key;
}
