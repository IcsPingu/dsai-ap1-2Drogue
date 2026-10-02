// src/entities/BossEnemy.ts
// Boss enemy class for Auditia boss fights (Fortitudo, Temperantia)

import { Enemy } from './Enemy';
import Phaser from 'phaser';

export class BossEnemy extends Enemy {
  private phase: number = 1;
  private bossName: string;

  constructor(scene: Phaser.Scene, x: number, y: number, bossName: string = 'Fortitudo', textureKey: string = 'boss_fortitudo') {
    super(scene, x, y, textureKey);
    this.bossName = bossName;
    this.maxHp = 1000;
    this.hp = 1000;
    this.speed = 40;
    this.attackDamage = 35;
    this.setScale(1.5);
  }

  public override updateEnemy(playerX: number, playerY: number, delta: number): void {
    super.updateEnemy(playerX, playerY, delta);

    // Phase transition at 50% HP
    if (this.phase === 1 && this.hp < this.maxHp * 0.5) {
      this.phase = 2;
      this.speed = 70;
      this.setTint(0xff6600);
    }
  }
}
