import Phaser from 'phaser';
import { PlayerClassDefinition, getPlayerClass } from '../data/ClassDatabase';
import { SoundManager } from '../managers/SoundManager';

export type CombatProjectile = Phaser.Physics.Arcade.Sprite & {
  bulletDamage: number;
  piercingHits?: number;
  hitTargets?: Set<Phaser.GameObjects.GameObject>;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  public hp: number;
  public maxHp: number;
  public magic: number;
  public maxMagic: number;
  public halos = 5000;
  public speed: number;
  public readonly heroClass: PlayerClassDefinition;
  public comboSequence: ('P' | 'K' | 'D' | 'H')[] = [];
  public comboTimer = 0;
  public meleeAttackId = 0;
  public isDodging = false;
  public dodgeAttackId = 0;
  public isShadowActive = false;
  public dodgeCooldown = 0;
  public isWitchTimeActive = false;
  public witchTimeRemaining = 0;
  public shieldCharges = 0;
  public facingX = 1;
  public facingY = 0;
  public bulletGroup?: Phaser.Physics.Arcade.Group;
  public combatInputEnabled = true;

  private attackCooldown = 0;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private keyAttack?: Phaser.Input.Keyboard.Key;
  private keyDodge?: Phaser.Input.Keyboard.Key;
  private baseScaleX = 1;
  private baseScaleY = 1;
  private readonly animationPrefix: string;
  private animationLocked = false;
  private animationToken = 0;
  private dodgeDirectionX = 1;
  private dodgeDirectionY = 0;
  private footstepEffectCooldown = 0;
  private walkPhase = 0;
  private chargeStartedAt: number | null = null;
  private shadowToken = 0;

  private static readonly MAX_CHARGE_MS = 1100;
  private static readonly ROGUE_THROW_THRESHOLD_MS = 220;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureKey = 'player_bayo',
    heroClass: PlayerClassDefinition = getPlayerClass(),
  ) {
    super(scene, x, y, textureKey);
    this.animationPrefix = textureKey;
    this.heroClass = heroClass;
    this.maxHp = heroClass.maxHp;
    this.hp = this.maxHp;
    this.maxMagic = heroClass.maxMagic;
    this.magic = this.maxMagic;
    this.speed = heroClass.speed;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true).setBounce(0.1).setDepth(10);
    this.setDisplaySize(86, 76);
    this.baseScaleX = this.scaleX;
    this.baseScaleY = this.scaleY;
    this.setSize(42, 58).setOffset(43, 48);

    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyAttack = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
      this.keyDodge = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    scene.input.on('pointerdown', this.handlePointerDown, this);
    scene.input.on('pointerup', this.handlePointerUp, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.off('pointerdown', this.handlePointerDown, this);
      scene.input.off('pointerup', this.handlePointerUp, this);
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]): void {
    if (!this.combatInputEnabled || currentlyOver.length > 0) return;
    this.aimAt(pointer.worldX, pointer.worldY);
    if (pointer.rightButtonDown()) {
      this.chargeStartedAt = null;
      this.fireSpecial();
    }
    else if (pointer.leftButtonDown()) {
      if (this.heroClass.primaryStyle === 'arrow' || this.heroClass.primaryStyle === 'daggers') {
        if (this.attackCooldown <= 0) this.chargeStartedAt = this.scene.time.now;
      } else {
        this.usePrimaryWeapon();
      }
    }
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0 || this.chargeStartedAt === null) return;
    const heldMs = this.scene.time.now - this.chargeStartedAt;
    this.chargeStartedAt = null;
    if (!this.combatInputEnabled || !this.active) return;
    this.aimAt(pointer.worldX, pointer.worldY);
    const charge = Phaser.Math.Clamp(heldMs / Player.MAX_CHARGE_MS, 0, 1);
    if (this.heroClass.primaryStyle === 'daggers' && heldMs < Player.ROGUE_THROW_THRESHOLD_MS) {
      this.performPrimaryAttack(0, false);
    } else {
      this.performPrimaryAttack(charge, true);
    }
  }

  public updatePlayer(_time: number, delta: number): void {
    if (!this.active || !this.body) return;
    if (!this.combatInputEnabled) this.chargeStartedAt = null;
    this.aimAt(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    this.dodgeCooldown = Math.max(0, this.dodgeCooldown - delta);
    this.footstepEffectCooldown = Math.max(0, this.footstepEffectCooldown - delta);
    if (this.isWitchTimeActive) {
      this.witchTimeRemaining -= delta;
      if (this.witchTimeRemaining <= 0) {
        this.isWitchTimeActive = false;
        this.clearTint();
      }
    }
    if (this.comboSequence.length > 0) {
      this.comboTimer += delta;
      if (this.comboTimer > 1000) {
        this.comboSequence = [];
        this.comboTimer = 0;
      }
    }

    let vx = 0;
    let vy = 0;
    if (this.cursors?.left.isDown || this.keyA?.isDown) vx--;
    if (this.cursors?.right.isDown || this.keyD?.isDown) vx++;
    if (this.cursors?.up.isDown || this.keyW?.isDown) vy--;
    if (this.cursors?.down.isDown || this.keyS?.isDown) vy++;
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    if (this.keyDodge && Phaser.Input.Keyboard.JustDown(this.keyDodge) && !this.isDodging && this.dodgeCooldown <= 0) {
      this.triggerDodge(vx, vy);
    }

    if (this.isDodging) {
      this.setVelocity(this.dodgeDirectionX * this.speed * 2.65, this.dodgeDirectionY * this.speed * 2.65);
    } else {
      this.setVelocity(vx * this.speed, vy * this.speed);
    }

    // The authored sprites face screen-left. Mirror them only while travelling
    // right, so D/right always reads as moving forward to the right.
    if (!this.isDodging && vx !== 0) this.setFlipX(vx > 0);
    if (!this.animationLocked) {
      if (vx !== 0 || vy !== 0) {
        this.play(`${this.animationPrefix}_walk`, true);
        this.walkPhase += delta * 0.018;
        const stepStretch = Math.abs(Math.sin(this.walkPhase)) * 0.035;
        this.setScale(this.baseScaleX * (1 + stepStretch), this.baseScaleY * (1 - stepStretch));
        if (this.footstepEffectCooldown <= 0) {
          this.spawnFootstepDust();
          this.footstepEffectCooldown = 155;
        }
      } else {
        this.stop();
        this.setFrame(0);
        this.setScale(this.baseScaleX, this.baseScaleY);
      }
    }
    if (this.keyAttack && Phaser.Input.Keyboard.JustDown(this.keyAttack)) this.usePrimaryWeapon();
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

  private usePrimaryWeapon(): void {
    this.performPrimaryAttack(0, false);
  }

  private performPrimaryAttack(charge: number, throwDagger: boolean): void {
    if (this.attackCooldown > 0) return;
    this.attackCooldown = this.heroClass.attackCooldown;
    this.comboSequence.push('P');
    this.comboTimer = 0;
    this.playSpriteAction('attack');
    this.playPrimaryAnimation();
    const aimAngle = Math.atan2(this.facingY, this.facingX);
    if (this.heroClass.primaryStyle === 'melee' || (this.heroClass.primaryStyle === 'daggers' && !throwDagger)) {
      this.scene.time.delayedCall(110, () => {
        if (!this.active) return;
        this.meleeAttackId++;
        this.spawnSlashEffect();
      });
      SoundManager.playSwordSlash();
    } else if (this.heroClass.primaryStyle === 'daggers') {
      const damage = this.heroClass.baseDamage * Phaser.Math.Linear(1.2, 2.2, charge);
      const speed = Phaser.Math.Linear(this.heroClass.projectileSpeed, 680, charge);
      const lifetime = Phaser.Math.Linear(650, 1250, charge);
      this.scene.time.delayedCall(90, () => {
        if (!this.active) return;
        this.fireProjectile(0, damage, speed, lifetime, Phaser.Math.Linear(0.75, 1.05, charge), false, 0, aimAngle);
      });
      SoundManager.playSwordSlash();
    } else if (this.heroClass.primaryStyle === 'orb') {
      this.scene.time.delayedCall(170, () => {
        if (this.active) this.fireProjectile(0, this.heroClass.baseDamage, this.heroClass.projectileSpeed, 1300, 1, false, 0, aimAngle);
      });
      SoundManager.playGunshot();
    } else {
      const damage = this.heroClass.baseDamage * Phaser.Math.Linear(1, 2.25, charge);
      const speed = Phaser.Math.Linear(this.heroClass.projectileSpeed, 720, charge);
      const lifetime = Phaser.Math.Linear(850, 1600, charge);
      this.scene.time.delayedCall(140, () => {
        if (this.active) this.fireProjectile(0, damage, speed, lifetime, Phaser.Math.Linear(0.85, 1.25, charge), false, 0, aimAngle);
      });
      SoundManager.playGunshot();
    }
    this.addMagic(5);
  }

  private fireSpecial(): void {
    if (!this.bulletGroup || this.magic < this.heroClass.magicCost) return;
    this.magic -= this.heroClass.magicCost;
    this.comboSequence = [];
    this.playSpriteAction('attack');
    this.playSpecialAnimation();
    if (this.heroClass.specialStyle === 'aegis') {
      this.shieldCharges = 2;
      for (let i = 0; i < 8; i++) this.fireProjectile((Math.PI * 2 * i) / 8, this.heroClass.baseDamage, 390, 650, 1.2, true);
    } else if (this.heroClass.specialStyle === 'nova') {
      for (let i = 0; i < 16; i++) this.fireProjectile((Math.PI * 2 * i) / 16, this.heroClass.baseDamage * 1.6, 400, 1050, 1.25, true);
    } else if (this.heroClass.specialStyle === 'volley') {
      for (let i = -3; i <= 3; i++) this.fireProjectile(i * 0.11, this.heroClass.baseDamage * 1.25, 650, 1050, 1, false, 3);
    } else {
      const token = ++this.shadowToken;
      this.isShadowActive = true;
      this.setAlpha(0.5);
      this.scene.time.delayedCall(700, () => {
        if (token !== this.shadowToken) return;
        this.isShadowActive = false;
        this.setAlpha(1);
      });
      for (let i = 0; i < 12; i++) this.fireProjectile((Math.PI * 2 * i) / 12, this.heroClass.baseDamage * 1.45, 520, 750, 0.8, true);
    }
    this.spawnSpecialRing(this.heroClass.accentColor);
    SoundManager.playWickedWeave();
  }

  private fireProjectile(
    angleOffset: number,
    damage: number,
    speed: number,
    lifetime: number,
    scale: number,
    absoluteAngle = false,
    piercingHits = 0,
    aimAngle?: number,
  ): void {
    if (!this.bulletGroup) return;
    const baseAngle = aimAngle ?? Math.atan2(this.facingY, this.facingX);
    const angle = absoluteAngle ? angleOffset : baseAngle + angleOffset;
    const bullet = this.scene.physics.add.sprite(this.x, this.y, this.getProjectileTexture()) as CombatProjectile;
    bullet.setDepth(8).setScale(scale).setRotation(angle);
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bullet.bulletDamage = damage;
    if (piercingHits > 0) {
      bullet.piercingHits = piercingHits;
      bullet.hitTargets = new Set();
    }
    this.bulletGroup.add(bullet);
    this.scene.time.delayedCall(lifetime, () => bullet.active && bullet.destroy());
  }

  private getProjectileTexture(): string {
    if (this.heroClass.primaryStyle === 'orb') return 'proj_magic_bolt';
    if (this.heroClass.primaryStyle === 'arrow') return 'proj_ranger_arrow';
    if (this.heroClass.primaryStyle === 'daggers') return 'proj_rogue_dagger';
    return 'proj_sword_wave';
  }

  private playSpriteAction(action: 'attack' | 'hurt' | 'dodge'): void {
    const token = ++this.animationToken;
    this.animationLocked = true;
    this.play(`${this.animationPrefix}_${action}`, true);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (token !== this.animationToken) return;
      this.animationLocked = false;
      this.stop();
      this.setFrame(0);
    });
  }

  private spawnSlashEffect(): void {
    const range = this.getMeleeRange();
    const slash = this.scene.add.circle(
      this.x + this.facingX * range * 0.55,
      this.y + this.facingY * range * 0.55,
      22,
      this.heroClass.accentColor,
      0.65,
    ).setDepth(9);
    this.scene.tweens.add({ targets: slash, alpha: 0, scaleX: 2.8, scaleY: 1.5, duration: 190, onComplete: () => slash.destroy() });
  }

  private playPrimaryAnimation(): void {
    const angle = Math.atan2(this.facingY, this.facingX);
    if (this.heroClass.primaryStyle === 'melee') {
      const slash = this.scene.add.graphics({ x: this.x, y: this.y }).setDepth(12).setRotation(angle);
      slash.lineStyle(7, 0xf8e7a4, 0.95);
      slash.beginPath();
      slash.arc(0, 0, 52, -0.8, 0.8, false);
      slash.strokePath();
      this.scene.tweens.add({ targets: slash, alpha: 0, scaleX: 1.25, scaleY: 1.25, duration: 190, onComplete: () => slash.destroy() });
    } else if (this.heroClass.primaryStyle === 'orb') {
      const castX = this.x + this.facingX * 38;
      const castY = this.y + this.facingY * 38;
      const cast = this.scene.add.container(castX, castY).setDepth(12).setScale(0.25);
      const glow = this.scene.add.rectangle(0, 0, 44, 8, 0x321b73, 0.4);
      const bolt = this.scene.add.rectangle(0, 0, 48, 3, 0xd9fbff, 0.95);
      cast.add([glow, bolt]);
      cast.setRotation(angle);
      this.scene.tweens.add({
        targets: cast,
        scaleX: 1.35,
        scaleY: 0.8,
        alpha: 0,
        duration: 260,
        ease: 'Cubic.Out',
        onComplete: () => cast.destroy(true),
      });
    } else if (this.heroClass.primaryStyle === 'arrow') {
      const streak = this.scene.add.rectangle(
        this.x + this.facingX * 30,
        this.y + this.facingY * 30,
        34,
        3,
        0xe8f2b0,
        0.9,
      ).setDepth(11).setRotation(angle);
      this.scene.tweens.add({
        targets: streak,
        x: streak.x + this.facingX * 36,
        y: streak.y + this.facingY * 36,
        alpha: 0,
        duration: 130,
        onComplete: () => streak.destroy(),
      });
    } else {
      [-1, 1].forEach(direction => {
        const slash = this.scene.add.graphics({ x: this.x, y: this.y }).setDepth(12).setRotation(angle + direction * 0.18);
        slash.lineStyle(4, direction > 0 ? 0xf2f3ff : 0xe84f75, 0.95);
        slash.beginPath();
        slash.arc(0, 0, 39, -0.55, 0.55, false);
        slash.strokePath();
        this.scene.tweens.add({ targets: slash, alpha: 0, scaleX: 1.3, scaleY: 1.3, duration: 150, onComplete: () => slash.destroy() });
      });
    }
    this.scene.tweens.add({
      targets: this,
      scaleX: this.baseScaleX * 1.1,
      scaleY: this.baseScaleY * 0.94,
      duration: 80,
      yoyo: true,
      onComplete: () => this.setScale(this.baseScaleX, this.baseScaleY),
    });
  }

  private playSpecialAnimation(): void {
    if (this.heroClass.specialStyle === 'aegis') {
      this.scene.tweens.add({ targets: this, angle: 360, duration: 360, ease: 'Cubic.Out', onComplete: () => this.setAngle(0) });
    } else if (this.heroClass.specialStyle === 'nova') {
      this.setTint(this.heroClass.accentColor);
      this.scene.tweens.add({
        targets: this,
        scaleX: this.baseScaleX * 1.25,
        scaleY: this.baseScaleY * 1.25,
        duration: 180,
        yoyo: true,
        onComplete: () => {
          this.setScale(this.baseScaleX, this.baseScaleY);
          if (!this.isWitchTimeActive) this.clearTint();
        },
      });
    } else if (this.heroClass.specialStyle === 'volley') {
      this.scene.tweens.add({
        targets: this,
        x: this.x - this.facingX * 16,
        y: this.y - this.facingY * 16,
        duration: 90,
        yoyo: true,
      });
    } else {
      this.scene.tweens.add({
        targets: this,
        angle: 720,
        scaleX: this.baseScaleX * 0.75,
        scaleY: this.baseScaleY * 0.75,
        duration: 430,
        ease: 'Cubic.InOut',
        onComplete: () => this.setAngle(0).setScale(this.baseScaleX, this.baseScaleY),
      });
    }
  }

  private spawnSpecialRing(color: number): void {
    const ring = this.scene.add.circle(this.x, this.y, 24, color, 0.2).setStrokeStyle(5, color, 0.9).setDepth(11);
    this.scene.tweens.add({ targets: ring, alpha: 0, scaleX: 5, scaleY: 5, duration: 450, onComplete: () => ring.destroy() });
  }

  public getMeleeDamage(): number { return this.heroClass.baseDamage; }
  public getMeleeRange(): number { return this.heroClass.primaryStyle === 'daggers' ? 78 : this.heroClass.attackRange; }
  public getDodgeDamage(): number { return Math.max(12, this.heroClass.baseDamage * 0.6); }
  public getChargeRatio(): number {
    if (this.chargeStartedAt === null) return 0;
    return Phaser.Math.Clamp((this.scene.time.now - this.chargeStartedAt) / Player.MAX_CHARGE_MS, 0, 1);
  }

  private spawnFootstepDust(): void {
    const side = Math.sin(this.walkPhase) >= 0 ? -1 : 1;
    const dust = this.scene.add.ellipse(
      this.x + side * 7,
      this.y + 29,
      9,
      4,
      0xc8b5ce,
      0.34,
    ).setDepth(8);
    this.scene.tweens.add({
      targets: dust,
      y: dust.y + 5,
      scaleX: 1.8,
      scaleY: 1.35,
      alpha: 0,
      duration: 170,
      onComplete: () => dust.destroy(),
    });
  }

  private spawnDodgeAfterimage(delay: number): void {
    this.scene.time.delayedCall(delay, () => {
      if (!this.active || !this.isDodging) return;
      const ghost = this.scene.add.sprite(this.x, this.y, this.texture.key, this.frame.name)
        .setDisplaySize(this.displayWidth, this.displayHeight)
        .setFlipX(this.flipX)
        .setTint(this.heroClass.accentColor)
        .setAlpha(0.3)
        .setDepth(this.depth - 1);
      this.scene.tweens.add({
        targets: ghost,
        alpha: 0,
        scaleX: ghost.scaleX * 0.92,
        scaleY: ghost.scaleY * 1.08,
        duration: 150,
        onComplete: () => ghost.destroy(),
      });
    });
  }

  public triggerDodge(directionX = this.facingX, directionY = this.facingY): void {
    const length = Math.hypot(directionX, directionY);
    if (length > 0.01) {
      this.dodgeDirectionX = directionX / length;
      this.dodgeDirectionY = directionY / length;
    } else {
      this.dodgeDirectionX = this.flipX ? 1 : -1;
      this.dodgeDirectionY = 0;
    }
    this.isDodging = true;
    this.dodgeAttackId++;
    this.dodgeCooldown = 600;
    if (Math.abs(this.dodgeDirectionX) > 0.05) this.setFlipX(this.dodgeDirectionX > 0);
    this.setAlpha(0.72);
    this.playSpriteAction('dodge');
    [0, 55, 110, 165].forEach(delay => this.spawnDodgeAfterimage(delay));
    this.spawnFootstepDust();
    SoundManager.playDodgeSwoosh();
    this.scene.time.delayedCall(250, () => {
      if (!this.active) return;
      this.isDodging = false;
      this.setAlpha(1);
      this.setScale(this.baseScaleX, this.baseScaleY);
    });
  }

  public triggerWitchTime(): void {
    this.isWitchTimeActive = true;
    this.witchTimeRemaining = 4000;
    this.setTint(0x00ffff);
    SoundManager.playWitchTimeActivate();
  }

  public takeDamage(_amount: number): void {
    if (this.isDodging) {
      this.triggerWitchTime();
      return;
    }
    if (this.isShadowActive) return;
    if (this.shieldCharges > 0) {
      this.shieldCharges--;
      this.spawnSpecialRing(0xf5cf5b);
      return;
    }
    this.hp = Math.max(0, this.hp - 1);
    this.playSpriteAction('hurt');
    this.setTint(0xff0000);
    this.scene.cameras.main.shake(90, 0.003);
    this.scene.tweens.add({ targets: this, alpha: 0.35, duration: 60, yoyo: true, repeat: 1 });
    this.scene.time.delayedCall(150, () => {
      if (!this.isWitchTimeActive) this.clearTint();
    });
  }

  public heal(amount: number): void {
    const hearts = Math.max(1, Math.ceil(amount / 20));
    this.hp = Math.min(this.maxHp, this.hp + hearts);
  }
  public addMagic(amount: number): void { this.magic = Math.min(this.maxMagic, this.magic + amount); }
  public addHalos(amount: number): void {
    this.halos += amount;
    SoundManager.playHaloPickup();
  }
}
