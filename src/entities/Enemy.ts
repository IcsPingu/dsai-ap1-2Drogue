// src/entities/Enemy.ts
// Base class for all angelic enemies in Vigrid.

import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  protected hp: number;
  protected maxHp: number;
  protected speed: number;
  protected attackDamage: number;
  protected enemyType: string;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string = 'enemy_affinity') {
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = 100;
    this.maxHp = 100;
    this.speed = 80;
    this.attackDamage = 15;
    this.enemyType = 'affinity';

    this.setCollideWorldBounds(true);
    this.setBounce(0.2);
  }

  public takeDamage(amount: number): void {
    this.hp -= amount;
    this.setTint(0xff0000);
    this.scene.time.delayedCall(150, () => {
      this.clearTint();
    });

    if (this.hp <= 0) {
      this.die();
    }
  }

  public die(): void {
    this.destroy();
  }

  public updateEnemy(playerX: number, playerY: number, delta: number): void {
    if (!this.active || !this.body) return;

    // Basic AI tracking player position
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 20 && dist < 400) {
      const vx = (dx / dist) * this.speed;
      const vy = (dy / dist) * this.speed;
      this.setVelocity(vx, vy);
    } else {
      this.setVelocity(0, 0);
    }
  }

  public getHp(): number {
    return this.hp;
  }

  public getAttackDamage(): number {
    return this.attackDamage;
  }
}
