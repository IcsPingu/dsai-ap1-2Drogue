// src/entities/Enemy.ts
// Base class for all angelic enemies in Vigrid.

import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  protected hp: number;
  protected maxHp: number;
  protected speed: number;
  protected attackDamage: number;
  protected enemyType: string;
  private healthBarBg: Phaser.GameObjects.Rectangle;
  private healthBarFill: Phaser.GameObjects.Rectangle;
  private readonly animationPrefix: string;
  private animationLocked = false;
  private animationToken = 0;
  private attackAnimationCooldown = 0;
  private dying = false;

  // Telegraphed lunge strike (dodgeable "attack" instead of pure contact damage)
  private strikeState: 'none' | 'telegraph' | 'lunge' | 'recover' = 'none';
  private strikeTimer = 0;
  private strikeCooldown = 0;
  private strikeDirX = 0;
  private strikeDirY = 0;
  private strikeHitDone = false;
  private shockwaveCooldown = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string = 'enemy_affinity') {
    super(scene, x, y, textureKey);
    this.animationPrefix = textureKey;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = 160;
    this.maxHp = 160;
    this.speed = 80;
    this.attackDamage = 15;
    this.enemyType = 'affinity';

    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
    this.setDisplaySize(72, 64);
    this.setSize(44, 58).setOffset(42, 48);
    this.healthBarBg = scene.add.rectangle(x, y - 26, 32, 5, 0x160d18).setDepth(20);
    this.healthBarFill = scene.add.rectangle(x - 15, y - 26, 30, 3, 0xf05a67).setOrigin(0, 0.5).setDepth(21);
  }

  public takeDamage(amount: number): void {
    if (this.dying) return;
    this.hp -= amount;
    this.healthBarFill.setScale(Math.max(0, this.hp / this.maxHp), 1);
    this.playEnemyAction('hurt');
    this.setTint(0xff0000);
    this.scene.time.delayedCall(150, () => {
      this.clearTint();
    });

    if (this.hp <= 0) {
      this.dying = true;
      this.setVelocity(0, 0);
      if (this.body) this.body.enable = false;
      this.scene.time.delayedCall(360, () => this.die());
    }
  }

  public die(): void {
    // Drop halos as currency on death
    const drops = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < drops; i++) {
      const ox = (Math.random() - 0.5) * 24;
      const oy = (Math.random() - 0.5) * 24;
      this.scene.events.emit('enemyDropHalo', this.x + ox, this.y + oy);
    }
    this.destroy();
  }

  public override destroy(fromScene?: boolean): void {
    this.healthBarBg?.destroy();
    this.healthBarFill?.destroy();
    super.destroy(fromScene);
  }

  public updateEnemy(playerX: number, playerY: number, _delta: number, speedMultiplier: number = 1): void {
    if (!this.active || !this.body || this.dying) return;
    this.syncHealthBar();
    this.attackAnimationCooldown = Math.max(0, this.attackAnimationCooldown - _delta);
    this.strikeCooldown = Math.max(0, this.strikeCooldown - _delta);
    this.shockwaveCooldown = Math.max(0, this.shockwaveCooldown - _delta);

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Telegraph: flash red and pause before the lunge so the player can dodge
    if (this.strikeState === 'telegraph') {
      this.strikeTimer -= _delta;
      this.setVelocity(0, 0);
      this.updateMovementAnimation(false);
      if (this.strikeTimer <= 0) {
        this.strikeState = 'lunge';
        this.strikeTimer = 300;
        this.strikeHitDone = false;
        if (dist > 1) {
          this.strikeDirX = dx / dist;
          this.strikeDirY = dy / dist;
        }
        this.clearTint();
        this.playEnemyAction('attack');
      }
      return;
    }

    // Lunge: fast, committed burst — dodging through it triggers Witch Time
    if (this.strikeState === 'lunge') {
      this.strikeTimer -= _delta;
      this.setVelocity(this.strikeDirX * 430 * speedMultiplier, this.strikeDirY * 430 * speedMultiplier);
      if (!this.strikeHitDone && dist < 38) {
        this.strikeHitDone = true;
        this.scene.events.emit('enemyMeleeStrike', this.attackDamage);
      }
      if (this.strikeTimer <= 0) {
        this.strikeState = 'recover';
        this.strikeTimer = 420;
        this.setVelocity(0, 0);
      }
      return;
    }

    if (this.strikeState === 'recover') {
      this.strikeTimer -= _delta;
      this.setVelocity(0, 0);
      this.updateMovementAnimation(false);
      if (this.strikeTimer <= 0) {
        this.strikeState = 'none';
        this.strikeCooldown = 1400;
      }
      return;
    }

    if (dist > 20 && dist < 400) {
      // Second move: radial shockwave when the player presses in close
      if (dist < 80 && this.shockwaveCooldown <= 0 && this.strikeState === 'none') {
        this.shockwaveCooldown = 3200;
        this.setVelocity(0, 0);
        this.playEnemyAction('attack');
        const ring = this.scene.add.circle(this.x, this.y, 24, 0xff8800, 0.25)
          .setStrokeStyle(5, 0xff5500, 0.9)
          .setDepth(15);
        this.scene.tweens.add({ targets: ring, alpha: 0, scaleX: 4, scaleY: 4, duration: 420, onComplete: () => ring.destroy() });
        this.scene.events.emit('enemyShockwave', this.x, this.y, this.attackDamage);
        return;
      }
      // Start a telegraphed strike when in range
      if (dist < 150 && dist > 40 && this.strikeCooldown <= 0) {
        this.strikeState = 'telegraph';
        this.strikeTimer = 550;
        this.setTint(0xff3333);
        this.setVelocity(0, 0);
        this.updateMovementAnimation(false);
        return;
      }
      const vx = (dx / dist) * this.speed * speedMultiplier;
      const vy = (dy / dist) * this.speed * speedMultiplier;
      this.setVelocity(vx, vy);
      this.updateMovementAnimation(true);
    } else {
      this.setVelocity(0, 0);
      this.updateMovementAnimation(false);
      if (dist <= 34 && this.attackAnimationCooldown <= 0) {
        this.playEnemyAction('attack');
        this.attackAnimationCooldown = 850;
      }
    }
  }

  public getHp(): number {
    return this.hp;
  }

  public getAttackDamage(): number {
    return this.attackDamage;
  }

  protected syncHealthBar(): void {
    this.healthBarBg.setPosition(this.x, this.y - this.displayHeight / 2 - 7);
    this.healthBarFill.setPosition(this.x - 15, this.y - this.displayHeight / 2 - 7);
  }

  protected updateMovementAnimation(moving: boolean): void {
    if (this.animationLocked) return;
    if (moving) {
      this.play(`${this.animationPrefix}_walk`, true);
    } else {
      this.stop();
      this.setFrame(0);
    }
  }

  protected playEnemyAction(action: 'attack' | 'hurt'): void {
    const token = ++this.animationToken;
    this.animationLocked = true;
    this.play(`${this.animationPrefix}_${action}`, true);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (token !== this.animationToken || this.dying) return;
      this.animationLocked = false;
      this.stop();
      this.setFrame(0);
    });
  }
}
