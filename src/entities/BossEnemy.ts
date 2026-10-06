// src/entities/BossEnemy.ts
// Boss enemy class for Auditia boss fights (Fortitudo, Temperantia)

import { Enemy } from './Enemy';
import Phaser from 'phaser';

export class BossEnemy extends Enemy {
  private phase: number = 1;
  private bossName: string;

  constructor(scene: Phaser.Scene, x: number, y: number, bossName: string = 'Fortitudo', textureKey: string = 'boss_guardian_anim', hp = 1600, scale = 1) {
    super(scene, x, y, textureKey);
    this.enemyRole = 'boss';
    this.enemyType = 'boss';
    this.bossName = bossName;
    this.maxHp = hp;
    this.hp = hp;
    this.speed = 40;
    this.attackDamage = 35;
    this.setDisplaySize(126 * scale, 112 * scale);
    this.setSize(58 * scale, 70 * scale).setOffset(35 * scale, 38 * scale);
  }

  public override updateEnemy(playerX: number, playerY: number, delta: number, speedMultiplier: number = 1): void {
    super.updateEnemy(playerX, playerY, delta, speedMultiplier);

    // Phase transition at 50% HP
    if (this.phase === 1 && this.hp < this.maxHp * 0.5) {
      this.phase = 2;
      this.speed = 70;
      this.configureAppearance(0xff432f);
    }
  }
}
