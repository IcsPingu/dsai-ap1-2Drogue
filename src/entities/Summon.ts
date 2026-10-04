// src/entities/Summon.ts
// Class-specific "daemon summon" spawned by the special attack. It fights on
// the player's side for a limited duration, then vanishes.

import Phaser from 'phaser';
import { CombatProjectile } from './Hero';
import { Enemy } from './Enemy';
import { SoundManager } from '../managers/SoundManager';

export interface SummonConfig {
  /** Texture tint for the wisp */
  tint: number;
  /** Damage per summon projectile */
  damage: number;
  /** Ms between summon attacks */
  attackCooldown: number;
  /** How long the summon lasts (ms) */
  duration: number;
  /** Projectile texture for its attacks */
  projectileTexture: string;
  /** Number of projectiles per volley */
  volleySize: number;
  /** Spread angle between volley projectiles */
  spread: number;
  /** Extra projectile scale (big slow "swords" etc.) */
  projectileScale?: number;
  /** Piercing hits for projectiles */
  piercing?: number;
  /** AoE burst around the target instead of projectiles */
  aoeRadius?: number;
  aoeDamage?: number;
}

export class Summon extends Phaser.Physics.Arcade.Sprite {
  private expiresAt: number;
  private attackTimer = 250;
  private config: SummonConfig;
  private bullets?: Phaser.Physics.Arcade.Group;
  private orbitAngle = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, config: SummonConfig, bullets?: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, 'fx_summon');
    this.config = config;
    this.bullets = bullets;
    this.expiresAt = scene.time.now + config.duration;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setTint(config.tint);
    this.setDepth(9);
    this.setScale(1.4);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.7,
      scaleY: 1.7,
      duration: 350,
      yoyo: true,
      repeat: -1,
    });
    SoundManager.playWickedWeave();
  }

  public updateSummon(delta: number, playerX: number, playerY: number, enemies: Phaser.GameObjects.GameObject[]): boolean {
    if (!this.active) return false;
    if (this.scene.time.now >= this.expiresAt) {
      this.destroy();
      return false;
    }

    // Orbit around the player
    this.orbitAngle += delta * 0.002;
    const targetX = playerX + Math.cos(this.orbitAngle) * 40;
    const targetY = playerY + Math.sin(this.orbitAngle) * 40 - 14;
    this.setVelocity((targetX - this.x) * 6, (targetY - this.y) * 6);

    // Attack the nearest enemy in range
    this.attackTimer -= delta;
    if (this.attackTimer <= 0) {
      const target = this.findNearestEnemy(enemies);
      if (target) {
        if (this.config.aoeRadius) {
          // Nova detonates at the target's ground position, detached from the body
          this.scene.events.emit('summonNova', target.x, target.y, this.config.aoeDamage ?? this.config.damage, this.config.aoeRadius);
          const ring = this.scene.add.circle(target.x, target.y, 18, this.config.tint, 0.25)
            .setStrokeStyle(4, this.config.tint, 0.9).setDepth(15);
          this.scene.tweens.add({ targets: ring, alpha: 0, scaleX: 4, scaleY: 4, duration: 420, onComplete: () => ring.destroy() });
          SoundManager.playWickedWeave();
        } else {
          this.fireVolley(target.x, target.y);
        }
        this.attackTimer = this.config.attackCooldown;
      }
    }
    return true;
  }

  private findNearestEnemy(enemies: Phaser.GameObjects.GameObject[]): Enemy | null {
    let best: Enemy | null = null;
    let bestDist = 420;
    enemies.forEach(e => {
      const enemy = e as Enemy;
      if (!enemy.active) return;
      const d = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (d < bestDist) {
        bestDist = d;
        best = enemy;
      }
    });
    return best;
  }

  private fireVolley(targetX: number, targetY: number): void {
    if (!this.bullets) return;
    const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    for (let i = 0; i < this.config.volleySize; i++) {
      const offset = this.config.volleySize === 1 ? 0 : (i - (this.config.volleySize - 1) / 2) * this.config.spread;
      const angle = baseAngle + offset;
      const bullet = this.scene.physics.add.sprite(this.x, this.y, this.config.projectileTexture) as CombatProjectile;
      bullet.setDepth(8).setScale(this.config.projectileScale ?? 0.8).setRotation(angle).setTint(this.config.tint);
      bullet.bulletDamage = this.config.damage;
      if (this.config.piercing) {
        bullet.piercingHits = this.config.piercing;
        bullet.hitTargets = new Set();
      }
      this.bullets.add(bullet);
      bullet.setVelocity(Math.cos(angle) * 420, Math.sin(angle) * 420);
      this.scene.time.delayedCall(1200, () => bullet.active && bullet.destroy());
    }
    SoundManager.playGunshot();
  }
}
