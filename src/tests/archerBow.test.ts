import type Phaser from 'phaser';
import { ArcherBow } from '../entities/ArcherBow';
import { getArcherAimOrigin, getArcherBowPose } from '../utils/ArcherAimTextures';

test.each(Array.from({ length: 16 }, (_, index) => index * Math.PI / 8))(
  'bow aims at %s radians without stretching either arm', angle => {
    for (const charge of [0, 0.25, 0.5, 1]) {
      const pose = getArcherBowPose(angle, charge, Math.cos(angle) < 0);
      expect(Math.atan2(pose.grip.y, pose.grip.x)).toBeCloseTo(Math.atan2(Math.sin(angle), Math.cos(angle)));
      for (const arm of [pose.holdingArm, pose.drawingArm]) {
        expect(Math.hypot(arm.elbow.x - arm.shoulder.x, arm.elbow.y - arm.shoulder.y)).toBeCloseTo(13);
        expect(Math.hypot(arm.hand.x - arm.elbow.x, arm.hand.y - arm.elbow.y)).toBeCloseTo(14);
      }
      // The bow hand stays extended while the other hand draws the string.
      const holding = pose.holdingArm;
      expect(Math.hypot(holding.hand.x - holding.shoulder.x, holding.hand.y - holding.shoulder.y)).toBeCloseTo(25);
      expect(pose.holdingArm.hand).toEqual(pose.grip);
      expect(pose.drawingArm.hand).toEqual(pose.nock);
      expect(Math.hypot(pose.tips[0].x - pose.tips[1].x, pose.tips[0].y - pose.tips[1].y)).toBeCloseTo(46);
    }
  },
);

test('charge pulls the string continuously and release removes the held arrow', () => {
  const ready = getArcherBowPose(0, 0, false);
  const half = getArcherBowPose(0, 0.5, false);
  const full = getArcherBowPose(0, 1, false);
  expect(ready.nock.x).toBeGreaterThan(half.nock.x);
  expect(half.nock.x).toBeGreaterThan(full.nock.x);
  expect(full.grip).toEqual(ready.grip);
  expect(full.showArrow).toBe(true);
  expect(getArcherBowPose(0, 1, false, true).showArrow).toBe(false);
});

test('weapon layer stays centered and uniformly scaled instead of rotating a body cutout', () => {
  const context = {
    clearRect: jest.fn(), save: jest.fn(), restore: jest.fn(), translate: jest.fn(),
    beginPath: jest.fn(), moveTo: jest.fn(), lineTo: jest.fn(), stroke: jest.fn(), fillRect: jest.fn(),
  };
  const texture = { context, refresh: jest.fn() };
  const image = {
    setDepth: jest.fn().mockReturnThis(), setVisible: jest.fn().mockReturnThis(),
    setPosition: jest.fn().mockReturnThis(), setScale: jest.fn().mockReturnThis(),
    setAlpha: jest.fn().mockReturnThis(), setRotation: jest.fn().mockReturnThis(),
    setFlipX: jest.fn().mockReturnThis(), destroy: jest.fn(),
  };
  const remove = jest.fn();
  const scene = {
    textures: { createCanvas: () => texture, remove }, add: { image: () => image },
  } as unknown as Phaser.Scene;
  const bow = new ArcherBow(scene, 'anim_ranger_woman');
  expect(bow.bodyKey).toBe('anim_ranger_woman_aim_body');
  bow.setPose(1, Math.PI / 2, 0.75);
  bow.sync(100, 200, 0.68, 0.67, false, 1);
  expect(image.setPosition).toHaveBeenCalledWith(100, 200);
  expect(image.setScale).toHaveBeenCalledWith(0.67, 0.67);
  expect(image.setRotation).not.toHaveBeenCalled();
  expect(image.setFlipX).not.toHaveBeenCalled();
  expect(texture.refresh).toHaveBeenCalledTimes(1);
  bow.hide();
  bow.sync(100, 200, 0.67, 0.67, false, 1);
  expect(texture.refresh).toHaveBeenCalledTimes(1);
  expect(image.setVisible).toHaveBeenLastCalledWith(false);
  bow.destroy();
  expect(image.destroy).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledWith('anim_ranger_woman_articulated_bow');
});

test('arrows use the same chest origin as the animated bow', () => {
  expect(getArcherAimOrigin(100, 200, 0.67)).toEqual({ x: 100, y: 200 - 11 * 0.67 });
});
