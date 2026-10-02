jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    Physics: { Arcade: { Sprite: class {} } },
    Math: {
      Clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value)),
      Linear: (start: number, end: number, ratio: number) => start + (end - start) * ratio,
    },
  },
}));

import { Player } from '../entities/Hero';
import { CLASS_DATABASE } from '../data/ClassDatabase';
import { SoundManager } from '../managers/SoundManager';

afterEach(() => jest.restoreAllMocks());

test.each(Object.values(CLASS_DATABASE))('$id moves with D/A while the archer keeps facing the mouse', heroClass => {
  const player = Object.create(Player.prototype) as Player;
  const setVelocity = jest.fn();
  Object.assign(player, {
    x: 0, y: 0, active: true, body: {}, heroClass, speed: heroClass.speed,
    combatInputEnabled: true, attackCooldown: 0, dodgeCooldown: 0,
    footstepEffectCooldown: 1000, comboSequence: [], animationLocked: true, chargeStartedAt: null,
    keyD: { isDown: true }, keyA: { isDown: false },
    scene: {
      cameras: { main: {} },
      input: { activePointer: { worldX: -100, worldY: 0, updateWorldPoint: jest.fn() } },
    },
    setVelocity,
    setFlipX: (flip: boolean) => { player.flipX = flip; },
  });

  player.updatePlayer(0, 16);
  expect(setVelocity).toHaveBeenLastCalledWith(heroClass.speed, 0);
  expect(player.flipX).toBe(true);

  Object.assign(player, { keyD: { isDown: false }, keyA: { isDown: true } });
  player.updatePlayer(16, 16);
  expect(setVelocity).toHaveBeenLastCalledWith(-heroClass.speed, 0);
  expect(player.flipX).toBe(heroClass.id === 'ranger');

  Object.assign(player, { keyA: { isDown: false } });
  player.updatePlayer(32, 16);
  expect(setVelocity).toHaveBeenLastCalledWith(0, 0);
  expect(player.flipX).toBe(heroClass.id === 'ranger');
});

test('archer charge fills while holding and resets when the arrow is released', () => {
  const performPrimaryAttack = jest.fn();
  const time = { now: 100 };
  const setTexture = jest.fn();
  const player = Object.create(Player.prototype) as Player;
  Object.assign(player, {
    x: 0, y: 0, active: true, combatInputEnabled: true,
    heroClass: CLASS_DATABASE.ranger, attackCooldown: 0, chargeStartedAt: null,
    scene: { time, cameras: { main: {} } }, performPrimaryAttack,
    animationPrefix: 'anim_ranger_woman', baseScaleX: 0.67, baseScaleY: 0.67,
    stop: jest.fn(), setTexture, setScale: jest.fn(), setFlipX: jest.fn(),
  });
  const pointer = {
    button: 0, worldX: 100, worldY: 0,
    updateWorldPoint: jest.fn(),
    rightButtonDown: () => false, leftButtonDown: () => true,
  } as unknown as Parameters<Player['handlePointerDown']>[0];

  expect(player.isChargingAttack()).toBe(false);
  player['handlePointerDown'](pointer, []);
  expect(player.isChargingAttack()).toBe(true);
  expect(player.getChargeRatio()).toBe(0);
  expect(setTexture).toHaveBeenLastCalledWith('anim_ranger_woman', 4);
  time.now = 650;
  expect(player.getChargeRatio()).toBeCloseTo(0.5);
  player['updateBowChargePose']();
  expect(setTexture).toHaveBeenLastCalledWith('anim_ranger_woman', 5);
  time.now = 1600;
  expect(player.getChargeRatio()).toBe(1);
  player['updateBowChargePose']();
  expect(setTexture).toHaveBeenLastCalledWith('anim_ranger_woman', 5);
  player['handlePointerUp'](pointer);
  expect(performPrimaryAttack).toHaveBeenCalledWith(1, true);
  expect(player.isChargingAttack()).toBe(false);
  expect(player.getChargeRatio()).toBe(0);
  expect(player['updateBowChargePose']()).toBe(false);
});

test('archer aim follows current camera coordinates even when the mouse does not move', () => {
  const camera = { scrollX: 0, scrollY: 0 };
  const pointer = {
    worldX: 999, worldY: 999,
    updateWorldPoint: jest.fn(function (this: { worldX: number; worldY: number }, currentCamera: typeof camera) {
      this.worldX = 200 + currentCamera.scrollX;
      this.worldY = 89 + currentCamera.scrollY;
    }),
  } as unknown as Parameters<Player['aimAtPointer']>[0];
  const player = Object.create(Player.prototype) as Player;
  Object.assign(player, {
    x: 100, y: 100, heroClass: CLASS_DATABASE.ranger,
    scene: { cameras: { main: camera } },
    setFlipX: (flip: boolean) => { player.flipX = flip; },
  });

  player['aimAtPointer'](pointer);
  expect(player.facingX).toBe(1);
  expect(player.facingY).toBe(0);
  expect(player.flipX).toBe(false);

  camera.scrollX = -200;
  camera.scrollY = -100;
  player['aimAtPointer'](pointer);
  expect(player.facingX).toBeCloseTo(-Math.SQRT1_2);
  expect(player.facingY).toBeCloseTo(-Math.SQRT1_2);
  expect(player.flipX).toBe(true);

  camera.scrollX = -100;
  camera.scrollY = 100;
  player['aimAtPointer'](pointer);
  expect(player.facingX).toBe(0);
  expect(player.facingY).toBe(1);
  expect(pointer.updateWorldPoint).toHaveBeenCalledTimes(3);
});

test.each([Math.PI / 2, -Math.PI / 2, Math.PI / 4, -3 * Math.PI / 4])(
  'archer aims the separate bow layer at %s without rotating the body', angle => {
    const bow = { bodyKey: 'archer_body', setPose: jest.fn(), sync: jest.fn(), hide: jest.fn() };
    const time = { now: 550 };
    const player = Object.create(Player.prototype) as Player;
    Object.assign(player, {
      active: true, combatInputEnabled: true, heroClass: CLASS_DATABASE.ranger,
      x: 100, y: 100, rotation: 0, alpha: 1, baseScaleX: 0.67, baseScaleY: 0.67,
      facingX: Math.cos(angle), facingY: Math.sin(angle), chargeStartedAt: 0,
      scene: { time }, archerBow: bow, animationToken: 0, bowReleaseUntil: 0,
      stop: jest.fn(), setTexture: jest.fn(),
      setScale: (x: number, y: number) => { player.scaleX = x; player.scaleY = y; },
      setFlipX: (flip: boolean) => { player.flipX = flip; },
    });
    expect(player['updateBowChargePose']()).toBe(true);
    expect(player.setTexture).toHaveBeenCalledWith('archer_body', undefined);
    expect(bow.setPose).toHaveBeenLastCalledWith(1, angle, 0.5);
    expect(bow.sync).toHaveBeenCalledWith(100, 100, 0.67, 0.67, player.flipX, 1);
    expect(player.rotation).toBe(0);

    player['chargeStartedAt'] = null;
    player['playSpriteAction']('attack');
    expect(bow.setPose).toHaveBeenLastCalledWith(2, angle, 0);
    expect(player.rotation).toBe(0);
    time.now = 800;
    expect(player['updateBowChargePose']()).toBe(true);
    expect(bow.setPose).toHaveBeenLastCalledWith(0, angle, 0);
    expect(bow.hide).not.toHaveBeenCalled();
  },
);

test('archer keeps the same body, scale and position from movement through charge, release and idle', () => {
  const time = { now: 0 };
  const bow = { bodyKey: 'archer_body', setPose: jest.fn(), sync: jest.fn(), hide: jest.fn() };
  const setTexture = jest.fn();
  const setScale = jest.fn();
  const setVelocity = jest.fn();
  const player = Object.create(Player.prototype) as Player;
  Object.assign(player, {
    x: 100, y: 100, active: true, body: {}, alpha: 1, rotation: 0,
    combatInputEnabled: true, heroClass: CLASS_DATABASE.ranger, speed: CLASS_DATABASE.ranger.speed,
    attackCooldown: 0, dodgeCooldown: 0, footstepEffectCooldown: 10000,
    comboSequence: [], chargeStartedAt: null, bowReleaseUntil: 0,
    animationLocked: false, animationToken: 0, archerBow: bow,
    baseScaleX: 86 / 128, baseScaleY: 76 / 114, facingX: 1, facingY: 0,
    keyD: { isDown: true }, stop: jest.fn(), play: jest.fn(), setTexture,
    setScale: (x: number, y: number) => { setScale(x, y); player.scaleX = x; player.scaleY = y; },
    setVelocity, setFlipX: (flip: boolean) => { player.flipX = flip; },
    scene: { time, cameras: { main: {} }, input: {
      activePointer: { worldX: 300, worldY: 100, updateWorldPoint: jest.fn() },
    } },
  });
  player.updatePlayer(0, 16);
  expect(setVelocity).toHaveBeenLastCalledWith(CLASS_DATABASE.ranger.speed, 0);
  player['chargeStartedAt'] = 0;
  time.now = 550;
  player.updatePlayer(550, 16);
  expect(player.getChargeRatio()).toBe(0.5);
  player['chargeStartedAt'] = null;
  player['playSpriteAction']('attack');
  time.now = 800;
  Object.assign(player, { keyD: { isDown: false } });
  player.updatePlayer(800, 16);
  expect(setVelocity).toHaveBeenLastCalledWith(0, 0);
  expect(setTexture.mock.calls).toHaveLength(4);
  expect(setTexture.mock.calls.every(([key, frame]) => key === 'archer_body' && frame === undefined)).toBe(true);
  expect(setScale.mock.calls.every(([x, y]) => x === 86 / 128 && y === 76 / 114)).toBe(true);
  expect(player.play).not.toHaveBeenCalled();
  expect({ x: player.x, y: player.y }).toEqual({ x: 100, y: 100 });
  expect(player.rotation).toBe(0);
});

test('charged arrows launch together with the release animation, without another draw delay', () => {
  jest.spyOn(SoundManager, 'playGunshot').mockImplementation(() => {});
  const fireProjectile = jest.fn();
  const playSpriteAction = jest.fn();
  const delayedCall = jest.fn();
  const player = Object.create(Player.prototype) as Player;
  Object.assign(player, {
    active: true, heroClass: CLASS_DATABASE.ranger,
    attackCooldown: 0, comboSequence: [], facingX: -1, facingY: 0,
    scene: { time: { delayedCall } },
    playSpriteAction, playPrimaryAnimation: jest.fn(), fireProjectile, addMagic: jest.fn(),
  });
  player['performPrimaryAttack'](1, true);
  expect(playSpriteAction).toHaveBeenCalledWith('attack');
  expect(fireProjectile).toHaveBeenCalledWith(0, CLASS_DATABASE.ranger.baseDamage * 2.25,
    720, 1600, 1.25, false, 0, Math.PI);
  expect(delayedCall).not.toHaveBeenCalled();
});

test('mage spell effects animate independently of the player body', () => {
  const cast = {
    setDepth: jest.fn().mockReturnThis(),
    setRotation: jest.fn().mockReturnThis(),
    add: jest.fn(),
    destroy: jest.fn(),
  };
  const addTween = jest.fn();
  const player = Object.create(Player.prototype) as Player;
  Object.assign(player, {
    x: 100, y: 120,
    scaleX: 0.67, scaleY: 0.67,
    facingX: 1, facingY: 0,
    heroClass: CLASS_DATABASE.mage,
    scene: {
      add: { container: jest.fn(() => cast), circle: jest.fn(() => ({})) },
      tweens: { add: addTween },
    },
  });

  player['playPrimaryAnimation']();
  player['playSpecialAnimation']();

  expect(addTween).toHaveBeenCalledTimes(1);
  expect(addTween.mock.calls[0][0].targets).toBe(cast);
  expect(player.x).toBe(100);
  expect(player.y).toBe(120);
  expect(player.scaleX).toBe(0.67);
  expect(player.scaleY).toBe(0.67);
});

test('mage launches immediately toward the aim while retaining cooldown and range', () => {
  jest.spyOn(SoundManager, 'playGunshot').mockImplementation(() => {});
  const fireProjectile = jest.fn();
  const delayedCall = jest.fn();
  const player = Object.create(Player.prototype) as Player;
  Object.assign(player, {
    active: true,
    heroClass: CLASS_DATABASE.mage,
    attackCooldown: 0,
    comboSequence: [],
    facingX: 0,
    facingY: -1,
    scene: { time: { delayedCall } },
    playSpriteAction: jest.fn(),
    playPrimaryAnimation: jest.fn(),
    fireProjectile,
    addMagic: jest.fn(),
  });

  player['usePrimaryWeapon']();

  expect(fireProjectile).toHaveBeenCalledTimes(1);
  expect(delayedCall).not.toHaveBeenCalled();
  const [, damage, speed, lifetime, , , , angle] = fireProjectile.mock.calls[0];
  expect(damage).toBe(CLASS_DATABASE.mage.baseDamage);
  expect(speed).toBe(CLASS_DATABASE.mage.projectileSpeed);
  expect(speed).toBeGreaterThan(350);
  expect(speed * lifetime / 1000).toBeCloseTo(455);
  expect(angle).toBeCloseTo(-Math.PI / 2);

  player['usePrimaryWeapon']();
  expect(fireProjectile).toHaveBeenCalledTimes(1);
  player['attackCooldown'] = 0;
  player['usePrimaryWeapon']();
  expect(fireProjectile).toHaveBeenCalledTimes(2);
});

test.each([
  { aim: 0, offset: 0, absolute: false, expected: 0 },
  { aim: Math.PI / 2, offset: 0, absolute: false, expected: Math.PI / 2 },
  { aim: -Math.PI / 4, offset: 0, absolute: false, expected: -Math.PI / 4 },
  { aim: Math.PI, offset: 0.11, absolute: false, expected: Math.PI + 0.11 },
  { aim: Math.PI, offset: Math.PI / 4, absolute: true, expected: Math.PI / 4 },
])('projectiles retain launch velocity after joining the physics group: %j', ({ aim, offset, absolute, expected }) => {
  const velocity = { x: 0, y: 0 };
  const bullet = {
    active: true,
    setDepth: jest.fn().mockReturnThis(),
    setScale: jest.fn().mockReturnThis(),
    setRotation: jest.fn().mockReturnThis(),
    setVelocity: (x: number, y: number) => Object.assign(velocity, { x, y }),
    destroy: jest.fn(),
  };
  const delayedCall = jest.fn();
  const add = jest.fn(() => {
    // Phaser's Arcade Group applies its default body velocities on insertion.
    bullet.setVelocity(0, 0);
  });
  const player = Object.create(Player.prototype) as Player;
  Object.assign(player, {
    x: 100,
    y: 100,
    heroClass: CLASS_DATABASE.mage,
    facingX: 1,
    facingY: 0,
    bulletGroup: { add },
    scene: {
      physics: { add: { sprite: jest.fn(() => bullet) } },
      time: { delayedCall },
    },
  });

  player['fireProjectile'](offset, 30, 350, 1300, 1, absolute, 0, aim);

  expect(add).toHaveBeenCalledWith(bullet);
  expect(bullet.setDepth).toHaveBeenCalledWith(12);
  expect(velocity.x).toBeCloseTo(Math.cos(expected) * 350);
  expect(velocity.y).toBeCloseTo(Math.sin(expected) * 350);
  expect(Math.hypot(velocity.x, velocity.y)).toBeCloseTo(350);
  expect(bullet).toHaveProperty('bulletDamage', 30);
  expect(delayedCall).toHaveBeenCalledWith(1300, expect.any(Function));
  delayedCall.mock.calls[0][1]();
  expect(bullet.destroy).toHaveBeenCalledTimes(1);
});
