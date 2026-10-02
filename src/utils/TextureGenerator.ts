// src/utils/TextureGenerator.ts
// Programmatically generates rich 2D vector textures for all game entities, map tiles,
// items, weapons, visual effects, and UI elements. 
// Uses Phaser's Canvas & Graphics pipelines so everything renders natively without missing textures.

import Phaser from 'phaser';

export class TextureGenerator {
  public static generateAllTextures(scene: Phaser.Scene): void {
    const tm = scene.textures;

    // 1. Player (Bayonetta)
    if (!tm.exists('player_bayo')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      // Witch Suit / Silhouette
      g.fillStyle(0x1a0f2b, 1);
      g.fillCircle(16, 16, 14);
      // Long hair ribbon / tail
      g.fillStyle(0x110820, 1);
      g.fillRect(14, 24, 4, 12);
      // Scarborough Fair Gold accents
      g.fillStyle(0xd4af37, 1);
      g.fillCircle(10, 14, 3);
      g.fillCircle(22, 14, 3);
      // Crimson Rose/Glasses highlight
      g.fillStyle(0xff0044, 1);
      g.fillRect(13, 10, 6, 2);
      g.generateTexture('player_bayo', 32, 36);
      g.destroy();
    }

    // 2. Enemy — Affinity (Standard Angel)
    if (!tm.exists('enemy_affinity')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      // White Marble / Porcelain Body
      g.fillStyle(0xf0efe6, 1);
      g.fillCircle(16, 16, 12);
      // Golden Halo
      g.lineStyle(2, 0xffd700, 1);
      g.strokeCircle(16, 6, 6);
      // Feathered Wings
      g.fillStyle(0xe6e4ce, 0.9);
      g.fillTriangle(4, 16, -4, 4, 8, 12);
      g.fillTriangle(28, 16, 36, 4, 24, 12);
      // Angel Face Mask
      g.fillStyle(0xccaa44, 1);
      g.fillRect(12, 14, 8, 4);
      g.generateTexture('enemy_affinity', 32, 32);
      g.destroy();
    }

    // 3. Enemy — Applaud (Flying Archer Angel)
    if (!tm.exists('enemy_applaud')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      // Divine Cyan Armor
      g.fillStyle(0xe0f7fa, 1);
      g.fillCircle(16, 16, 10);
      // Seraph Wings
      g.fillStyle(0x80deea, 0.8);
      g.fillTriangle(2, 10, -6, -2, 10, 8);
      g.fillTriangle(30, 10, 38, -2, 22, 8);
      // Gold Bow/Halo
      g.lineStyle(2, 0xffd700, 1);
      g.strokeCircle(16, 4, 5);
      g.generateTexture('enemy_applaud', 32, 32);
      g.destroy();
    }

    // 4. Boss — Fortitudo (Auditia of Courage - Dragon Boss)
    if (!tm.exists('boss_fortitudo')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      // Golden Fiery Dragon Head & Body
      g.fillStyle(0xcc3300, 1);
      g.fillCircle(40, 40, 36);
      // Golden Divine Mask
      g.fillStyle(0xffd700, 1);
      g.fillTriangle(40, 10, 15, 60, 65, 60);
      // Two Angel Heads on Shoulders
      g.fillStyle(0xffffff, 1);
      g.fillCircle(18, 25, 12);
      g.fillCircle(62, 25, 12);
      // Lava Core
      g.fillStyle(0xffaa00, 1);
      g.fillCircle(40, 45, 16);
      g.generateTexture('boss_fortitudo', 80, 80);
      g.destroy();
    }

    // 5. Boss — Temperantia (Auditia of Temperance - Colossus Boss)
    if (!tm.exists('boss_temperantia')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      // Sacred Mechanical Golem
      g.fillStyle(0x4a6572, 1);
      g.fillRect(10, 10, 70, 70);
      // Golden Inscription Rings
      g.lineStyle(4, 0xffd700, 1);
      g.strokeCircle(45, 45, 28);
      // Glowing Azure Eye
      g.fillStyle(0x00e5ff, 1);
      g.fillCircle(45, 45, 12);
      g.generateTexture('boss_temperantia', 90, 90);
      g.destroy();
    }

    // 6. Projectile — Divine Arrow
    if (!tm.exists('proj_divine_arrow')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x00ffff, 1);
      g.fillRect(0, 3, 12, 2);
      g.fillStyle(0xffffff, 1);
      g.fillTriangle(12, 0, 16, 4, 12, 8);
      g.generateTexture('proj_divine_arrow', 16, 8);
      g.destroy();
    }

    // 7. Projectile — Wicked Weave Fist
    if (!tm.exists('fx_wicked_fist')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      // Dark Purple Demonic Giant Hand
      g.fillStyle(0x660099, 0.9);
      g.fillCircle(30, 30, 26);
      g.fillStyle(0xaa00ff, 1);
      g.fillRect(10, 10, 40, 40);
      g.fillStyle(0xff33cc, 1);
      g.fillCircle(20, 20, 6);
      g.fillCircle(40, 20, 6);
      g.generateTexture('fx_wicked_fist', 60, 60);
      g.destroy();
    }

    // 8. Map Tiles — Wall, Floor, Pillar, Water, Lava, Door, Chest, Stairs
    if (!tm.exists('tile_floor')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x2a1a3a, 1);
      g.fillRect(0, 0, 32, 32);
      g.lineStyle(1, 0x3d2752, 1);
      g.strokeRect(0, 0, 32, 32);
      g.lineStyle(1, 0x1f122c, 1);
      g.lineBetween(0, 0, 32, 32);
      g.generateTexture('tile_floor', 32, 32);
      g.destroy();
    }

    if (!tm.exists('tile_wall')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x150b21, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x2d1a40, 1);
      g.fillRect(2, 2, 28, 12);
      g.fillRect(2, 16, 12, 14);
      g.fillRect(16, 16, 14, 14);
      g.lineStyle(1, 0x4a2a68, 1);
      g.strokeRect(0, 0, 32, 32);
      g.generateTexture('tile_wall', 32, 32);
      g.destroy();
    }

    if (!tm.exists('tile_pillar')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x4a3b5c, 1);
      g.fillCircle(16, 16, 14);
      g.fillStyle(0xd4af37, 1);
      g.fillCircle(16, 16, 8);
      g.generateTexture('tile_pillar', 32, 32);
      g.destroy();
    }

    if (!tm.exists('tile_lava')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xcc2200, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0xffbb00, 0.8);
      g.fillCircle(16, 16, 10);
      g.generateTexture('tile_lava', 32, 32);
      g.destroy();
    }

    if (!tm.exists('tile_water')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x004488, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x0088cc, 0.6);
      g.fillCircle(16, 16, 8);
      g.generateTexture('tile_water', 32, 32);
      g.destroy();
    }

    if (!tm.exists('tile_stairs')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x1a0f2b, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0xd4af37, 1);
      g.fillRect(4, 4, 24, 4);
      g.fillRect(8, 12, 16, 4);
      g.fillRect(12, 20, 8, 4);
      g.generateTexture('tile_stairs', 32, 32);
      g.destroy();
    }

    if (!tm.exists('item_potion')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x00cc44, 1);
      g.fillCircle(12, 14, 8);
      g.fillStyle(0xffffff, 1);
      g.fillRect(10, 4, 4, 4);
      g.generateTexture('item_potion', 24, 24);
      g.destroy();
    }

    if (!tm.exists('item_halo')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.lineStyle(3, 0xffd700, 1);
      g.strokeCircle(12, 12, 8);
      g.fillStyle(0xffea00, 0.5);
      g.fillCircle(12, 12, 7);
      g.generateTexture('item_halo', 24, 24);
      g.destroy();
    }

    if (!tm.exists('item_chest')) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x8b4513, 1);
      g.fillRect(2, 6, 28, 20);
      g.fillStyle(0xd4af37, 1);
      g.fillRect(2, 6, 28, 4);
      g.fillRect(14, 14, 4, 6);
      g.generateTexture('item_chest', 32, 32);
      g.destroy();
    }
  }
}
