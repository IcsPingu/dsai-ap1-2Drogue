// src/entities/RangedEnemy.ts
// Flying Archer angel enemy (Applaud) that shoots divine light arrows.

import { Enemy } from './Enemy';
import Phaser from 'phaser';

export class RangedEnemy extends Enemy {
  private shootCooldown: number = 0;
  private projectileGroup?: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, projectileGroup?: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'enemy_ranged_anim');
    this.projectileGroup = projectileGroup;
    this.speed = 90;
    this.hp = 70;
    this.maxHp = 70;
    this.attackDamage = 10;
    this.setDisplaySize(78, 69);
    this.setSize(42, 56).setOffset(43, 46);
  }

  public override updateEnemy(playerX: number, playerY: number, delta: number, speedMultiplier: number = 1): void {
    if (!this.active || !this.body) return;
    this.syncHealthBar();

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Keep distance and shoot
    if (dist < 1) {
      this.setVelocity(0, 0);
      this.updateMovementAnimation(false);
    } else if (dist < 180) {
      // Back away
      this.setVelocity((-dx / dist) * this.speed * speedMultiplier, (-dy / dist) * this.speed * speedMultiplier);
      this.updateMovementAnimation(true);
    } else if (dist < 350) {
      // Hold position and shoot
      this.setVelocity(0, 0);
      this.updateMovementAnimation(false);
      this.shootCooldown -= delta;
      if (this.shootCooldown <= 0) {
        this.shootArrow(playerX, playerY);
        this.shootCooldown = 2000; // 2 sec cooldown
      }
    } else {
      // Approach
      this.setVelocity((dx / dist) * this.speed * speedMultiplier, (dy / dist) * this.speed * speedMultiplier);
      this.updateMovementAnimation(true);
    }
  }

  private shootArrow(targetX: number, targetY: number): void {
    this.playEnemyAction('attack');
    const arrow = this.scene.physics.add.sprite(this.x, this.y, 'proj_divine_arrow');
    (arrow as Phaser.Physics.Arcade.Sprite & { bulletDamage: number }).bulletDamage = this.attackDamage;
    this.projectileGroup?.add(arrow);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    arrow.setRotation(angle);
    this.scene.physics.velocityFromRotation(angle, 250, arrow.body?.velocity);

    this.scene.time.delayedCall(3000, () => {
      if (arrow.active) arrow.destroy();
    });
  }
}
