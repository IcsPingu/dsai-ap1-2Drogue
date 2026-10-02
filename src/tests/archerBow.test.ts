import type Phaser from 'phaser';
import { ArcherBow } from '../entities/ArcherBow';
import { getArcherAimOrigin, getArcherBowTransform } from '../utils/ArcherAimTextures';

test.each(Array.from({ length: 8 }, (_, index) => index * Math.PI / 4))(
  'the visible bow aligns with the shot at %s radians, including mirrored poses', angle => {
    const image = {
      setDepth: jest.fn().mockReturnThis(), setVisible: jest.fn().mockReturnThis(),
      setFrame: jest.fn().mockReturnThis(), setPosition: jest.fn().mockReturnThis(),
      setScale: jest.fn().mockReturnThis(), setFlipX: jest.fn().mockReturnThis(),
      setRotation: jest.fn().mockReturnThis(), setAlpha: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    };
    const scene = {
      textures: { exists: () => true }, add: { image: () => image },
    } as unknown as Phaser.Scene;
    const bow = new ArcherBow(scene, 'anim_ranger_woman');
    const flip = Math.cos(angle) < -0.001;
    bow.setPose(1, angle);
    bow.sync(100, 200, 0.67, 0.67, flip, 1);
    const rotation = image.setRotation.mock.calls[0][0];
    const sign = flip ? -1 : 1;
    expect(Math.cos(rotation) * sign).toBeCloseTo(Math.cos(angle));
    expect(Math.sin(rotation) * sign).toBeCloseTo(Math.sin(angle));
    expect(image.setFlipX).toHaveBeenCalledWith(flip);
    expect(image.setFrame).toHaveBeenCalledWith(1);
    expect(image.setVisible).toHaveBeenLastCalledWith(true);
    bow.hide();
    expect(image.setVisible).toHaveBeenLastCalledWith(false);
    bow.destroy();
    expect(image.destroy).toHaveBeenCalledTimes(1);
  },
);

test('the bow rotates around the same origin used to aim and launch arrows', () => {
  const scale = 0.67;
  const origin = getArcherAimOrigin(100, 200, scale);
  const right = getArcherBowTransform(100, 200, scale, scale, 0, false);
  const down = getArcherBowTransform(100, 200, scale, scale, Math.PI / 2, false);
  expect(right.x).toBeCloseTo(100);
  expect(right.y).toBeCloseTo(200);
  expect(down.x).toBeCloseTo(origin.x - 13 * scale);
  expect(down.y).toBeCloseTo(origin.y);
});
