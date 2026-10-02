// src/managers/LevelManager.ts
import Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { RangedEnemy } from '../entities/RangedEnemy';
import { BossEnemy } from '../entities/BossEnemy';
import { Item } from '../entities/Item';
import { HealthPotion } from '../entities/HealthPotion';

export interface LevelData {
  name: string;
  enemies: Array<{ x: number; y: number; type: string }>;
  items: Array<{ x: number; y: number; type: string }>;
  backgroundKey: string;
}

export const LEVEL_1: LevelData = {
  name: 'Venezia Streets',
  backgroundKey: 'bgTexture',
  enemies: [
    { x: 200, y: 150, type: 'Melee' },
    { x: 600, y: 300, type: 'Ranged' },
    { x: 1000, y: 500, type: 'Melee' },
  ],
  items: [
    { x: 400, y: 200, type: 'HealthPotion' },
    { x: 800, y: 400, type: 'ComboBoost' },
  ],
};

export class LevelManager {
  private scene: Phaser.Scene;
  private level: LevelData;
  public enemyGroup: Phaser.GameObjects.Group;
  public itemGroup: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene, level: LevelData) {
    this.scene = scene;
    this.level = level;
    this.enemyGroup = new Phaser.GameObjects.Group(scene);
    this.itemGroup = new Phaser.GameObjects.Group(scene);
  }

  public init(): void {
    this.spawnEnemies();
    this.spawnItems();
  }

  private spawnEnemies(): void {
    this.level.enemies.forEach((def) => {
      let enemy: Enemy;
      switch (def.type) {
        case 'Melee':
          enemy = new Enemy(this.scene, def.x, def.y);
          break;
        case 'Ranged':
          enemy = new RangedEnemy(this.scene, def.x, def.y);
          break;
        case 'Boss':
          enemy = new BossEnemy(this.scene, def.x, def.y);
          break;
        default:
          enemy = new Enemy(this.scene, def.x, def.y);
      }
      this.enemyGroup.add(enemy);
    });
  }

  private spawnItems(): void {
    this.level.items.forEach((def) => {
      let item: Item;
      switch (def.type) {
        case 'HealthPotion':
          item = new HealthPotion(this.scene, def.x, def.y);
          break;
        default:
          item = new Item(this.scene, def.x, def.y, 'item_halo');
      }
      this.itemGroup.add(item);
    });
  }
}
