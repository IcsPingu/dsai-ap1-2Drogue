// src/scenes/GameScene.ts
// Main gameplay scene: hand-crafted level rendering, combat, Witch Time FX,
// item pickups, Shop UI, Level Progression, and bullet projectile collisions.

import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { BossEnemy } from '../entities/BossEnemy';
import { RangedEnemy } from '../entities/RangedEnemy';
import { Item } from '../entities/Item';
import { TextureGenerator } from '../utils/TextureGenerator';
import { LEVEL_01_VESTIBULE, LEVEL_02_NAVE, LEVEL_03_VIGRID_STREETS, LevelDefinition } from '../data/LevelData';
import { ShopUI } from '../ui/ShopUI';
import { SoundManager } from '../managers/SoundManager';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private items!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;
  private wallTiles!: Phaser.Physics.Arcade.StaticGroup;
  private stairTiles!: Phaser.Physics.Arcade.StaticGroup;

  // Floor tile images (so we can destroy them on level transition)
  private floorImages: Phaser.GameObjects.Image[] = [];

  private allLevels: LevelDefinition[] = [LEVEL_01_VESTIBULE, LEVEL_02_NAVE, LEVEL_03_VIGRID_STREETS];
  private currentLevelIndex: number = 0;
  private currentLevel: LevelDefinition = LEVEL_01_VESTIBULE;
  private isTransitioning: boolean = false;

  private shopUI!: ShopUI;
  private keyShop?: Phaser.Input.Keyboard.Key;
  private keyNextLevel?: Phaser.Input.Keyboard.Key;

  // HUD & UI Elements
  private hpHudText!: Phaser.GameObjects.Text;
  private magicHudText!: Phaser.GameObjects.Text;
  private haloHudText!: Phaser.GameObjects.Text;
  private weaponHudText!: Phaser.GameObjects.Text;
  private comboHudText!: Phaser.GameObjects.Text;
  private levelTitleText!: Phaser.GameObjects.Text;
  private levelBannerText!: Phaser.GameObjects.Text;
  private witchTimeOverlay!: Phaser.GameObjects.Rectangle;

  private levelClearedBannerShowing: boolean = false;

  // Damage cooldown to prevent instant-kill overlap spam
  private playerDamageCooldown: number = 0;

  constructor() {
    super('GameScene');
  }

  public create(): void {
    // 1. Generate all vector textures
    TextureGenerator.generateAllTextures(this);

    // 2. Create physics groups
    this.wallTiles = this.physics.add.staticGroup();
    this.stairTiles = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.items = this.physics.add.group();
    this.bullets = this.physics.add.group();

    // 3. Build level map
    this.currentLevel = this.allLevels[this.currentLevelIndex];
    this.buildMapFromDefinition(this.currentLevel);

    // 4. Create Player
    const spawn = this.findSpawnPoint(this.currentLevel);
    this.player = new Player(this, spawn.x, spawn.y);
    this.player.bulletGroup = this.bullets;
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, 40 * 32, 25 * 32);

    // 5. Spawn enemies and items
    this.spawnEnemiesAndItems(this.currentLevel);

    // 6. Setup all colliders
    this.setupColliders();

    // 7. Witch Time FX Overlay
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.witchTimeOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x110033, 0.4);
    this.witchTimeOverlay.setScrollFactor(0);
    this.witchTimeOverlay.setDepth(900);
    this.witchTimeOverlay.setVisible(false);

    // 8. Key bindings
    this.shopUI = new ShopUI(this, this.player);
    if (this.input && this.input.keyboard) {
      this.keyShop = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
      this.keyNextLevel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    }

    // 9. HUD & Chapter Title
    this.createHUD();
    this.showChapterTitle(this.currentLevel.name);
  }

  private setupColliders(): void {
    // Player vs Walls
    this.physics.add.collider(this.player, this.wallTiles);
    // Enemies vs Walls
    this.physics.add.collider(this.enemies, this.wallTiles);

    // Player vs Enemy = contact damage (with cooldown)
    this.physics.add.overlap(this.player, this.enemies, (_playerObj, enemyObj) => {
      if (this.playerDamageCooldown > 0) return;
      const e = enemyObj as Enemy;
      this.player.takeDamage(e.getAttackDamage());
      this.playerDamageCooldown = 500; // 500ms invulnerability
    });

    // Player vs Item Pickups
    this.physics.add.overlap(this.player, this.items, (_playerObj, itemObj) => {
      const itm = itemObj as Item;
      if (itm.itemType === 'item_halo') {
        this.player.addHalos(100);
      } else if (itm.itemType === 'item_potion') {
        this.player.heal(40);
      }
      itm.destroy();
    });

    // Player vs Exit Stairs → advance level
    this.physics.add.overlap(this.player, this.stairTiles, () => {
      if (!this.isTransitioning) {
        this.advanceToNextLevel();
      }
    });

    // Bullets vs Enemies → ranged damage
    this.physics.add.overlap(this.bullets, this.enemies, (bulletObj, enemyObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
      const enemy = enemyObj as Enemy;
      const dmg = (bullet as unknown as { bulletDamage: number }).bulletDamage || 15;
      enemy.takeDamage(dmg);
      bullet.destroy();
    });

    // Bullets vs Walls → destroy on impact
    this.physics.add.collider(this.bullets, this.wallTiles, (bulletObj) => {
      (bulletObj as Phaser.Physics.Arcade.Sprite).destroy();
    });
  }

  /** Find tile value 8 (spawn point) in the level map */
  private findSpawnPoint(level: LevelDefinition): { x: number; y: number } {
    const map = level.tileMap;
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        if (map[r][c] === 8) {
          return { x: c * 32 + 16, y: r * 32 + 16 };
        }
      }
    }
    return { x: 120, y: 120 }; // fallback
  }

  private buildMapFromDefinition(level: LevelDefinition): void {
    const map = level.tileMap;
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        const tileVal = map[r][c];
        const posX = c * 32 + 16;
        const posY = r * 32 + 16;

        // Base Floor
        const floorImg = this.add.image(posX, posY, 'tile_floor');
        this.floorImages.push(floorImg);

        if (tileVal === 1) {
          this.wallTiles.create(posX, posY, 'tile_wall');
        } else if (tileVal === 2) {
          this.wallTiles.create(posX, posY, 'tile_pillar');
        } else if (tileVal === 4) {
          const lava = this.add.image(posX, posY, 'tile_lava');
          this.floorImages.push(lava);
        } else if (tileVal === 5) {
          this.stairTiles.create(posX, posY, 'tile_stairs');
        }
      }
    }
  }

  private spawnEnemiesAndItems(level: LevelDefinition): void {
    level.enemies.forEach(e => {
      const px = e.x * 32 + 16;
      const py = e.y * 32 + 16;

      if (e.type === 'ranged' || e.type === 'applaud') {
        const enemy = new RangedEnemy(this, px, py);
        this.enemies.add(enemy);
      } else if (e.type === 'boss' || e.type === 'fortitudo') {
        const boss = new BossEnemy(this, px, py, 'Fortitudo');
        this.enemies.add(boss);
      } else {
        const enemy = new Enemy(this, px, py, 'enemy_affinity');
        this.enemies.add(enemy);
      }
    });

    level.items.forEach(itm => {
      const px = itm.x * 32 + 16;
      const py = itm.y * 32 + 16;
      const itemEntity = new Item(this, px, py, itm.type === 'potion' ? 'item_potion' : 'item_halo');
      this.items.add(itemEntity);
    });
  }

  private createHUD(): void {
    const hudBg = this.add.rectangle(640, 25, 1280, 50, 0x05020a, 0.85);
    hudBg.setScrollFactor(0);
    hudBg.setDepth(950);

    this.hpHudText = this.add.text(20, 15, "HP: 100/100", {
      fontFamily: 'Courier, monospace',
      fontSize: '18px',
      color: '#00ff66',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(960);

    this.magicHudText = this.add.text(200, 15, "MAGIC: 0%", {
      fontFamily: 'Courier, monospace',
      fontSize: '18px',
      color: '#bb00ff',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(960);

    this.haloHudText = this.add.text(420, 15, "HALOS: 5000 ⏣", {
      fontFamily: 'Courier, monospace',
      fontSize: '18px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(960);

    this.weaponHudText = this.add.text(680, 15, "WEAPON: Scarborough Fair", {
      fontFamily: 'Courier, monospace',
      fontSize: '16px',
      color: '#ffffff'
    }).setScrollFactor(0).setDepth(960);

    this.comboHudText = this.add.text(1000, 15, "COMBO: -", {
      fontFamily: 'Courier, monospace',
      fontSize: '16px',
      color: '#ffcc00',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(960);

    const shopBtn = this.add.text(1180, 15, "[ SHOP (B) ]", {
      fontSize: '14px',
      color: '#ffd700',
      backgroundColor: '#331144',
      padding: { x: 8, y: 4 }
    }).setScrollFactor(0).setDepth(960).setInteractive({ useHandCursor: true });
    shopBtn.on('pointerdown', () => this.shopUI.toggle());

    // Level Title Card
    this.levelTitleText = this.add.text(640, 200, "", {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '36px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(970).setAlpha(0);

    // Level Cleared Banner
    this.levelBannerText = this.add.text(640, 300, "", {
      fontFamily: 'Georgia, serif',
      fontSize: '22px',
      color: '#00ffcc',
      fontStyle: 'bold',
      backgroundColor: '#110522',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(970).setVisible(false);
  }

  private showChapterTitle(title: string): void {
    this.levelTitleText.setText(`CHAPTER ${this.currentLevelIndex + 1}\n${title.toUpperCase()}`);
    this.levelTitleText.setAlpha(1);

    this.tweens.add({
      targets: this.levelTitleText,
      alpha: 0,
      duration: 3500,
      ease: 'Power2'
    });
  }

  public advanceToNextLevel(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Flash transition
    this.cameras.main.flash(600, 255, 215, 0);

    this.time.delayedCall(400, () => {
      this.currentLevelIndex = (this.currentLevelIndex + 1) % this.allLevels.length;
      this.currentLevel = this.allLevels[this.currentLevelIndex];

      // Destroy all floor/lava images
      this.floorImages.forEach(img => img.destroy());
      this.floorImages = [];

      // Clear physics groups (but NOT the player)
      this.enemies.clear(true, true);
      this.items.clear(true, true);
      this.bullets.clear(true, true);
      this.wallTiles.clear(true, true);
      this.stairTiles.clear(true, true);

      // Rebuild map
      this.buildMapFromDefinition(this.currentLevel);
      this.spawnEnemiesAndItems(this.currentLevel);

      // Reposition player at spawn
      const spawn = this.findSpawnPoint(this.currentLevel);
      this.player.setPosition(spawn.x, spawn.y);
      this.player.setVelocity(0, 0);
      this.player.setVisible(true);
      this.player.setActive(true);
      this.player.setAlpha(1);

      // Reset banner states
      this.levelClearedBannerShowing = false;
      this.levelBannerText.setVisible(false);

      // Show chapter title
      SoundManager.playWitchTimeActivate();
      this.showChapterTitle(this.currentLevel.name);

      this.isTransitioning = false;
    });
  }

  public override update(time: number, delta: number): void {
    // Damage cooldown tick
    if (this.playerDamageCooldown > 0) {
      this.playerDamageCooldown -= delta;
    }

    // Shop Key
    if (this.keyShop && Phaser.Input.Keyboard.JustDown(this.keyShop)) {
      this.shopUI.toggle();
    }

    // Manual Level Skip (N)
    if (this.keyNextLevel && Phaser.Input.Keyboard.JustDown(this.keyNextLevel)) {
      this.advanceToNextLevel();
    }

    if (this.shopUI.getIsVisible()) return;
    if (this.isTransitioning) return;

    // Update Player
    this.player.updatePlayer(time, delta);

    // Witch Time slow-down
    const witchMultiplier = this.player.isWitchTimeActive ? 0.2 : 1.0;
    this.witchTimeOverlay.setVisible(this.player.isWitchTimeActive);

    const activeEnemies = this.enemies.getChildren().filter(e => e.active);
    activeEnemies.forEach(e => {
      const enemy = e as Enemy;
      enemy.updateEnemy(this.player.x, this.player.y, delta * witchMultiplier);
    });

    // Check if level cleared
    if (activeEnemies.length === 0 && !this.levelClearedBannerShowing) {
      this.levelClearedBannerShowing = true;
      this.levelBannerText.setText("CHAPTER CLEARED!\nWalk to the golden stairs or press N");
      this.levelBannerText.setVisible(true);
    }

    // Melee attack collisions (when player recently tapped J/K)
    if (this.player.comboSequence.length > 0 && this.player.comboTimer < 200) {
      activeEnemies.forEach(e => {
        const enemy = e as Enemy;
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          // Check if enemy is roughly in facing direction (dot product)
          const dot = (dx * this.player.facingX + dy * this.player.facingY);
          if (dot > -20) { // generous: hits in facing hemisphere
            enemy.takeDamage(this.player.equippedWeapon.baseDamage);
          }
        }
      });
    }

    // Update HUD
    this.hpHudText.setText(`HP: ${Math.round(this.player.hp)}/${this.player.maxHp}`);
    this.magicHudText.setText(`MAGIC: ${Math.round(this.player.magic)}%`);
    this.haloHudText.setText(`HALOS: ${this.player.halos} ⏣`);
    this.weaponHudText.setText(`WEAPON: ${this.player.equippedWeapon.name}`);
    this.comboHudText.setText(`COMBO: ${this.player.comboSequence.join(' → ') || 'READY'}`);
  }
}
