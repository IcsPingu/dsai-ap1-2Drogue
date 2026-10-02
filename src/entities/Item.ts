// src/entities/Item.ts
// Pickup item base entity for Halos, Health Pots, and Chests.

import Phaser from 'phaser';

export class Item extends Phaser.Physics.Arcade.Sprite {
  public itemType: string;

  constructor(scene: Phaser.Scene, x: number, y: number, itemType: string = 'item_halo') {
    super(scene, x, y, itemType);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.itemType = itemType;
  }
}
