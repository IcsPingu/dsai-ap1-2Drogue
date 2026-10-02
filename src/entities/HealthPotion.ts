// src/entities/HealthPotion.ts
import { Item } from './Item';
import Phaser from 'phaser';

export class HealthPotion extends Item {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'item_potion');
  }
}
