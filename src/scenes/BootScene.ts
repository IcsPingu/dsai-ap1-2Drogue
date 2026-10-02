// src/scenes/BootScene.ts
import Phaser from 'phaser';
import { GameScene } from './GameScene';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // No external assets for the demo
  }

  create() {
    // Directly start the main gameplay scene
    this.scene.start('GameScene');
  }
}
