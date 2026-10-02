// src/entities/Weapon.ts
import Phaser from 'phaser';

export class Weapon extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string = 'player_bayo') {
    super(scene, x, y, textureKey);
    scene.add.existing(this);
  }
}
