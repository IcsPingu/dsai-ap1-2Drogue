// src/managers/ComboManager.ts
import Phaser from 'phaser';

/**
 * Handles combo counting, level calculation and UI updates.
 * The combo streak increases with each successful hit and resets after a timeout.
 */
export class ComboManager {
  private scene: Phaser.Scene;
  private comboText: Phaser.GameObjects.Text;
  private comboCount: number = 0;
  private lastHitTime: number = 0;
  private timeoutMs: number = 1200;
  private readonly rankNames = ['D', 'C', 'B', 'A', 'S', 'SS'];

  constructor(scene: Phaser.Scene, comboText: Phaser.GameObjects.Text) {
    this.scene = scene;
    this.comboText = comboText;
    this.updateUI();
  }

  /** Call when a hit is registered. */
  public registerHit(): void {
    this.comboCount += 1;
    this.lastHitTime = this.scene.time.now;
    this.updateUI();
  }

  /** Should be called each frame to handle timeout. */
  public update(): void {
    if (this.scene.time.now - this.lastHitTime > this.timeoutMs && this.comboCount > 0) {
      this.comboCount = 0;
      this.updateUI();
    }
  }

  /** Current damage multiplier from the active combo (1 + rank bonus). */
  public getDamageMultiplier(): number {
    return 1 + (this.getLevel() - 1) * 0.25;
  }

  public getComboCount(): number {
    return this.comboCount;
  }

  private getLevel(): number {
    // Every 5 hits increase level (capped at S/SS rank)
    return Math.min(Math.floor(this.comboCount / 5) + 1, this.rankNames.length);
  }

  private getColor(): string {
    const colors = ['#ffffff', '#aaff00', '#ffdd00', '#ff7700', '#ff0000'];
    const level = this.getLevel();
    return colors[Math.min(level - 1, colors.length - 1)];
  }

  private updateUI(): void {
    const level = this.getLevel();
    this.comboText.setColor(this.getColor());
    this.comboText.setText(`COMBO: ${this.comboCount}  RANK ${this.rankNames[level - 1]}  x${this.getDamageMultiplier().toFixed(2)}`);
  }
}
