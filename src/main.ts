// src/main.ts
import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { BootScene } from './scenes/BootScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#0a0a0a',
  parent: document.body,
  scene: [BootScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
};

new Phaser.Game(config);
