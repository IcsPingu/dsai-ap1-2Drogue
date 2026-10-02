// src/entities/RangedEnemy.ts
// Flying Archer angel enemy (Applaud) that shoots divine light arrows.

import { Enemy } from './Enemy';
import Phaser from 'phaser';

export class RangedEnemy extends Enemy {
  private shootCooldown: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy_applaud');
    this.speed = 90;
    this.hp = 70;
    this.maxHp = 70;
    this.attackDamage = 10;
  }

  public override updateEnemy(playerX: number, playerY: number, delta: number): void {
    if (!this.active || !this.body) return;

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Keep distance and shoot
    if (dist < 180) {
      // Back away
      this.setVelocity((-dx / dist) * this.speed, (-dy / dist) * this.speed);
    } else if (dist < 350) {
      // Hold position and shoot
      this.setVelocity(0, 0);
      this.shootCooldown -= delta;
      if (this.shootCooldown <= 0) {
        this.shootArrow(playerX, playerY);
        this.shootCooldown = 2000; // 2 sec cooldown
      }
    } else {
      // Approach
      this.setVelocity((dx / dist) * this.speed, (dy / dist) * this.speed);
    }
  }

  private shootArrow(targetX: number, targetY: number): void {
    const arrow = this.scene.physics.add.sprite(this.x, this.y, 'proj_divine_arrow');
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    arrow.setRotation(angle);
    this.scene.physics.velocityFromRotation(angle, 250, arrow.body?.velocity);

    this.scene.time.delayedCall(3000, () => {
      if (arrow.active) arrow.destroy();
    });
  }
}
