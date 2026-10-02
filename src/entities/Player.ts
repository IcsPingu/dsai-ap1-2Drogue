// src/entities/Player.ts
// Bayonetta player character with full combat controls, Dodge Offset, Witch Time,
// Magic Meter, Halo wallet, weapon equipment, directional attacks, and held-button shooting.

import Phaser from 'phaser';
import { WEAPON_DATABASE, WeaponDefinition, MoveDefinition } from '../data/WeaponDatabase';
import { SoundManager } from '../managers/SoundManager';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public hp: number = 5;
  public maxHp: number = 5;
  public magic: number = 100;
  public maxMagic: number = 100;
  public halos: number = 5000;
  public speed: number = 220;

  public equippedWeapon: WeaponDefinition = WEAPON_DATABASE.scarborough_fair;
  public comboSequence: ('P' | 'K' | 'D' | 'H')[] = [];
  public comboTimer: number = 0;
  public meleeAttackId: number = 0;

  public isDodging: boolean = false;
  public dodgeCooldown: number = 0;
  public isWitchTimeActive: boolean = false;
  public witchTimeRemaining: number = 0;

  // Facing direction for directional attacks (unit vector)
  public facingX: number = 1;
  public facingY: number = 0;

  // Held-button rapid fire state
  private holdFireTimer: number = 0;
  private holdFireRate: number = 180; // ms between bullets when holding

  // Projectile group (set by GameScene)
  public bulletGroup?: Phaser.Physics.Arcade.Group;
  public combatInputEnabled: boolean = true;

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private keyPunch?: Phaser.Input.Keyboard.Key;
  private keyKick?: Phaser.Input.Keyboard.Key;
  private keyDodge?: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string = 'player_bayo') {
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setDepth(10);
    this.setSize(28, 42);
    this.setOffset(11, 18);

    if (scene.input && scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyPunch = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
      this.keyKick = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
      this.keyDodge = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    scene.input.on('pointerdown', this.handlePointerDown, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.off('pointerdown', this.handlePointerDown, this);
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]): void {
    if (!this.combatInputEnabled || currentlyOver.length > 0) return;
    this.aimAt(pointer.worldX, pointer.worldY);
    if (pointer.rightButtonDown()) {
      this.fireSpecial();
    } else if (pointer.leftButtonDown()) {
      this.executeAttack('P');
      this.fireBullet('punch');
    }
  }

  public updatePlayer(time: number, delta: number): void {
    if (!this.active || !this.body) return;

    const pointer = this.scene.input.activePointer;
    this.aimAt(pointer.worldX, pointer.worldY);

    // Handle Witch Time countdown
    if (this.isWitchTimeActive) {
      this.witchTimeRemaining -= delta;
      if (this.witchTimeRemaining <= 0) {
        this.isWitchTimeActive = false;
        this.clearTint();
      }
    }

    // Handle Dodge Cooldown
    if (this.dodgeCooldown > 0) {
      this.dodgeCooldown -= delta;
    }

    // Reset combo timer if idle too long
    if (this.comboSequence.length > 0) {
      this.comboTimer += delta;
      if (this.comboTimer > 1200) {
        this.comboSequence = [];
        this.comboTimer = 0;
      }
    }

    // 1. Movement Logic — also updates facing direction
    let vx = 0;
    let vy = 0;

    if (this.cursors?.left.isDown || this.keyA?.isDown) vx -= 1;
    if (this.cursors?.right.isDown || this.keyD?.isDown) vx += 1;
    if (this.cursors?.up.isDown || this.keyW?.isDown) vy -= 1;
    if (this.cursors?.down.isDown || this.keyS?.isDown) vy += 1;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    const currentSpeed = this.isDodging ? this.speed * 2.2 : this.speed;
    this.setVelocity(vx * currentSpeed, vy * currentSpeed);

    // 2. Dodge Action (SPACE)
    if (this.keyDodge && Phaser.Input.Keyboard.JustDown(this.keyDodge) && !this.isDodging && this.dodgeCooldown <= 0) {
      this.triggerDodge();
    }

    // 3. Attack Input — Tap for combo, HOLD for rapid-fire bullets
    const punchHeld = this.keyPunch?.isDown ?? false;
    const kickHeld = this.keyKick?.isDown ?? false;

    if (this.keyPunch && Phaser.Input.Keyboard.JustDown(this.keyPunch)) {
      this.executeAttack('P');
    } else if (this.keyKick && Phaser.Input.Keyboard.JustDown(this.keyKick)) {
      this.executeAttack('K');
    }

    // 4. Held-Button Rapid Fire (shoot projectile bullets in facing direction)
    if (punchHeld || kickHeld) {
      this.holdFireTimer += delta;
      if (this.holdFireTimer >= this.holdFireRate) {
        this.holdFireTimer = 0;
        const bulletType = punchHeld ? 'punch' : 'kick';
        this.fireBullet(bulletType);
      }
    } else {
      this.holdFireTimer = 0;
    }
  }

  private aimAt(x: number, y: number): void {
    const dx = x - this.x;
    const dy = y - this.y;
    const length = Math.hypot(dx, dy);
    if (length > 2) {
      this.facingX = dx / length;
      this.facingY = dy / length;
    }
  }

  private fireSpecial(): void {
    if (!this.bulletGroup || this.magic < 25) return;
    this.magic -= 25;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const bullet = this.scene.physics.add.sprite(this.x, this.y, 'proj_divine_arrow');
      bullet.setTint(0xc06cff);
      bullet.setVelocity(Math.cos(angle) * 380, Math.sin(angle) * 380);
      bullet.setRotation(angle);
      (bullet as Phaser.Physics.Arcade.Sprite & { bulletDamage: number }).bulletDamage = this.equippedWeapon.baseDamage * 1.5;
      this.bulletGroup.add(bullet);
      this.scene.time.delayedCall(900, () => bullet.active && bullet.destroy());
    }
    this.spawnWickedWeaveEffect(this.equippedWeapon.moves[0]);
    SoundManager.playWickedWeave();
  }

  /** Fire a projectile bullet in the current facing direction */
  public fireBullet(type: 'punch' | 'kick'): void {
    if (!this.bulletGroup) return;

    const bullet = this.scene.physics.add.sprite(this.x, this.y, 'proj_divine_arrow');
    bullet.setDepth(8);

    // Color based on attack type
    if (type === 'punch') {
      bullet.setTint(this.equippedWeapon.trailColor);
    } else {
      bullet.setTint(0xff3366); // Kick bullets are crimson
    }

    // Shoot in the facing direction
    const bulletSpeed = 450;
    bullet.setVelocity(this.facingX * bulletSpeed, this.facingY * bulletSpeed);
    bullet.setRotation(Math.atan2(this.facingY, this.facingX));

    // Store damage on the bullet for collision detection
    (bullet as unknown as { bulletDamage: number }).bulletDamage =
      type === 'punch' ? this.equippedWeapon.baseDamage : this.equippedWeapon.baseDamage * 1.3;

    this.bulletGroup.add(bullet);

    // Auto-destroy after 1.5 seconds
    this.scene.time.delayedCall(1500, () => {
      if (bullet.active) bullet.destroy();
    });

    // Muzzle flash effect at player position
    const flash = this.scene.add.circle(this.x + this.facingX * 18, this.y + this.facingY * 18, 6,
      type === 'punch' ? this.equippedWeapon.glowColor : 0xff0055, 0.8);
    flash.setDepth(9);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 120,
      onComplete: () => flash.destroy()
    });

    SoundManager.playGunshot();
  }

  public triggerDodge(): void {
    this.isDodging = true;
    this.dodgeCooldown = 600;
    SoundManager.playDodgeSwoosh();

    // Panther / Bat Within Visual Feedback
    this.setAlpha(0.5);

    this.scene.time.delayedCall(250, () => {
      this.isDodging = false;
      this.setAlpha(1.0);
    });
  }

  public triggerWitchTime(): void {
    this.isWitchTimeActive = true;
    this.witchTimeRemaining = 4000 + (this.equippedWeapon.witchTimeBonusDuration * 1000);
    this.setTint(0x00ffff);
    SoundManager.playWitchTimeActivate();
  }

  public executeAttack(input: 'P' | 'K'): void {
    this.meleeAttackId++;
    this.comboSequence.push(input);
    this.comboTimer = 0;

    // Check weapon database for matching move
    const move = this.findMatchingMove(this.comboSequence);

    if (move) {
      if (move.isWickedWeave) {
        SoundManager.playWickedWeave();
        this.spawnWickedWeaveEffect(move);
        this.addMagic(25);
      } else {
        if (input === 'P') SoundManager.playGunshot();
        else SoundManager.playSwordSlash();
        this.addMagic(5);
      }
    } else {
      SoundManager.playGunshot();
    }

    // Spawn a melee hitbox in the facing direction
    this.spawnMeleeHitEffect();
  }

  /** Visual slash effect in facing direction */
  private spawnMeleeHitEffect(): void {
    const slashX = this.x + this.facingX * 36;
    const slashY = this.y + this.facingY * 36;
    const slash = this.scene.add.circle(slashX, slashY, 18, this.equippedWeapon.trailColor, 0.6);
    slash.setDepth(9);
    this.scene.tweens.add({
      targets: slash,
      alpha: 0,
      scaleX: 2.5,
      scaleY: 2.5,
      duration: 200,
      onComplete: () => slash.destroy()
    });
  }

  private findMatchingMove(seq: ('P' | 'K' | 'D' | 'H')[]): MoveDefinition | undefined {
    const seqStr = seq.join('');
    return this.equippedWeapon.moves.find(m => m.sequence.join('') === seqStr);
  }

  private spawnWickedWeaveEffect(move: MoveDefinition): void {
    const fx = this.scene.add.sprite(
      this.x + this.facingX * 60,
      this.y + this.facingY * 60,
      'fx_wicked_fist'
    );
    fx.setScale(1.5);
    fx.setTint(move.fxColor);
    fx.setDepth(11);

    this.scene.tweens.add({
      targets: fx,
      alpha: 0,
      scaleX: 2.5,
      scaleY: 2.5,
      duration: 400,
      onComplete: () => fx.destroy()
    });
  }

  public takeDamage(_amount: number): void {
    if (this.isDodging) {
      // Perfect Dodge triggers Witch Time!
      this.triggerWitchTime();
      return;
    }

    this.hp = Math.max(0, this.hp - 1);
    this.setTint(0xff0000);
    this.scene.time.delayedCall(150, () => {
      if (!this.isWitchTimeActive) this.clearTint();
    });
  }

  public heal(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  public addMagic(amount: number): void {
    this.magic = Math.min(this.maxMagic, this.magic + amount);
  }

  public addHalos(amount: number): void {
    this.halos += amount;
    SoundManager.playHaloPickup();
  }
}
