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

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string = 'enemy_affinity') {
    super(scene, x, y, textureKey);
    this.animationPrefix = textureKey;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = 100;
    this.maxHp = 100;
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

    // Basic AI tracking player position
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 20 && dist < 400) {
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
