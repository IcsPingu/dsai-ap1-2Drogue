// src/scenes/GameScene.ts
// Main gameplay scene: hand-crafted level rendering, combat, Witch Time FX,
// item pickups, Shop UI, Level Progression, and bullet projectile collisions.

import Phaser from 'phaser';
import { CombatProjectile, Player } from '../entities/Hero';
import { Summon, SummonConfig } from '../entities/Summon';
import { Enemy } from '../entities/Enemy';
import { BossEnemy } from '../entities/BossEnemy';
import { RangedEnemy } from '../entities/RangedEnemy';
import { Item } from '../entities/Item';
import { TextureGenerator } from '../utils/TextureGenerator';
import { LevelDefinition, EnemyPlacement } from '../data/LevelData';
import { CORRIDOR_LEVEL } from '../data/CorridorLevelData';
import { VERSE_SECTIONS } from '../data/VerseLevelData';
import { loadAppearance, loadSettings } from '../data/PlayerProfile';
import { getCharacterAnimationKey } from '../utils/CharacterTexture';
import { ShopUI } from '../ui/ShopUI';
import { SoundManager } from '../managers/SoundManager';
import { getPlayerClass } from '../data/ClassDatabase';
import { ComboManager } from '../managers/ComboManager';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private items!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemyBullets!: Phaser.Physics.Arcade.Group;
  private wallTiles!: Phaser.Physics.Arcade.StaticGroup;
  private stairTiles!: Phaser.Physics.Arcade.StaticGroup;

  // Floor tile images (so we can destroy them on level transition)
  private floorImages: Phaser.GameObjects.Image[] = [];

  private allLevels: LevelDefinition[] = VERSE_SECTIONS;
  private currentLevelIndex: number = 0;
  private currentLevel: LevelDefinition = VERSE_SECTIONS[0];
  private foundKeys = new Set<string>();
  private isTransitioning: boolean = false;

  private shopUI!: ShopUI;
  private summons: Summon[] = [];
  private waves: { enemies: EnemyPlacement[] }[] = [];
  private currentWaveIndex = 0;
  private waveDelayTimer = 0;
  private waveTransition = false;
  private doorSealNotice = 0;
  private keyShop?: Phaser.Input.Keyboard.Key;
  private keyMenu?: Phaser.Input.Keyboard.Key;

  // HUD & UI Elements
  private hpHudText!: Phaser.GameObjects.Text;
  private magicHudText!: Phaser.GameObjects.Text;
  private haloHudText!: Phaser.GameObjects.Text;
  private weaponHudText!: Phaser.GameObjects.Text;
  private comboHudText!: Phaser.GameObjects.Text;
  private comboManager!: ComboManager;
  private levelTitleText!: Phaser.GameObjects.Text;
  private levelBannerText!: Phaser.GameObjects.Text;
  private witchTimeOverlay!: Phaser.GameObjects.Rectangle;
  private aimReticle!: Phaser.GameObjects.Arc;
  private arrowChargeBar!: Phaser.GameObjects.Graphics;
  private objectiveText!: Phaser.GameObjects.Text;

  private levelClearedBannerShowing: boolean = false;
  private controlsGuideOpen: boolean = false;
  private skipControlsGuide: boolean = false;

  // Damage cooldown to prevent instant-kill overlap spam
  private playerDamageCooldown: number = 0;
  private lastHandledMeleeAttack: number = 0;
  private lastHandledDodgeAttack: number = 0;
  private dodgeHitTargets = new Set<Enemy>();

  constructor() {
    super('GameScene');
  }

  public init(data?: { skipControls?: boolean }): void {
    // Phaser keeps the Scene instance on restart, so explicitly reset every
    // run-scoped guard that could otherwise leave update() permanently locked.
    this.currentLevelIndex = 0;
    this.currentLevel = this.allLevels[0];
    this.isTransitioning = false;
    this.levelClearedBannerShowing = false;
    this.controlsGuideOpen = false;
    this.playerDamageCooldown = 0;
    this.lastHandledMeleeAttack = 0;
    this.lastHandledDodgeAttack = 0;
    this.dodgeHitTargets.clear();
    this.floorImages = [];
    this.skipControlsGuide = data?.skipControls ?? false;
  }

  public create(): void {
    this.physics.world.resume();
    // 1. Generate all vector textures
    TextureGenerator.generateAllTextures(this);

    // 2. Create physics groups
    this.wallTiles = this.physics.add.staticGroup();
    this.stairTiles = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.items = this.physics.add.group();
    this.bullets = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();

    // 3. Build level map
    this.currentLevel = this.allLevels[this.currentLevelIndex];
    this.buildMapFromDefinition(this.currentLevel);

    // 4. Create Player
    const spawn = this.findSpawnPoint(this.currentLevel);
    const appearance = loadAppearance();
    const heroClass = getPlayerClass(appearance.classId);
    this.player = new Player(this, spawn.x, spawn.y, getCharacterAnimationKey(appearance), heroClass);
    this.player.bulletGroup = this.bullets;
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    const worldWidth = this.currentLevel.tileMap[0].length * 32;
    const worldHeight = this.currentLevel.tileMap.length * 32;
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

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
      this.keyMenu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    // 9. HUD & Chapter Title
    this.createHUD();
    this.comboManager = new ComboManager(this, this.comboHudText);
    this.spawnWave(0);
    this.events.off('enemyDropHalo');
    this.events.on('enemyDropHalo', (x: number, y: number) => {
      const halo = new Item(this, x, y, 'item_halo', 'item_halo');
      this.items.add(halo);
    });
    this.events.off('enemyMeleeStrike');
    this.events.off('playerSummon');
    this.events.off('enemyShockwave');
    this.events.off('summonNova');
    this.events.on('summonNova', (x: number, y: number, dmg: number, radius: number) => {
      this.enemies.getChildren().forEach(e => {
        const enemy = e as Enemy;
        if (enemy.active && Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) < radius) {
          enemy.takeDamage(dmg * this.comboManager.getDamageMultiplier());
          this.comboManager.registerHit();
        }
      });
    });
    this.events.on('enemyMeleeStrike', (dmg: number) => {
      if (this.playerDamageCooldown <= 0 || this.player.isDodging) this.damagePlayer(dmg);
    });
    this.events.on('playerSummon', (x: number, y: number, classId: string) => this.spawnSummon(x, y, classId));
    this.events.on('enemyShockwave', (x: number, y: number, dmg: number) => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) < 95) {
        this.damagePlayer(dmg);
      }
    });
    this.showChapterTitle(this.currentLevel.name);
    this.createAimReticle();
    this.arrowChargeBar = this.add.graphics().setDepth(30).setVisible(false);
    if (loadSettings().showControls && !this.skipControlsGuide) this.showControlsGuide();
  }

  private setupColliders(): void {
    // Player vs Walls
    this.physics.add.collider(this.player, this.wallTiles);
    // Enemies vs Walls
    this.physics.add.collider(this.enemies, this.wallTiles);

    // Player vs Enemy: dodging through an enemy damages it (Witch Arts).
    // Contact itself deals NO damage — players are only hurt by telegraphed
    // attacks (lunge, shockwave, bullets), so camping inside an enemy is safe.
    this.physics.add.overlap(this.player, this.enemies, (_playerObj, enemyObj) => {
      const enemy = enemyObj as Enemy;
      if (this.player.isDodging) {
        if (this.player.dodgeAttackId !== this.lastHandledDodgeAttack) {
          this.lastHandledDodgeAttack = this.player.dodgeAttackId;
          this.dodgeHitTargets.clear();
        }
        if (!this.dodgeHitTargets.has(enemy)) {
          this.dodgeHitTargets.add(enemy);
          enemy.takeDamage(this.player.getDodgeDamage() * this.comboManager.getDamageMultiplier());
          this.comboManager.registerHit();
        }
        return;
      }
      // No contact damage — enemies can overlap the player freely without hurting them.
    });

    // Player vs Item Pickups
    this.physics.add.overlap(this.player, this.items, (_playerObj, itemObj) => {
      const itm = itemObj as Item;
      if (itm.itemType === 'item_halo') {
        this.player.addHalos(100);
      } else if (itm.itemType === 'item_potion') {
        this.player.heal(40);
      } else if (itm.itemType === 'item_magic') {
        this.player.addMagic(25);
      } else if (itm.itemType === 'item_key') {
        const keyId = `${this.currentLevelIndex}:${Math.floor(itm.x / 32)},${Math.floor(itm.y / 32)}`;
        this.foundKeys.add(keyId);
        this.levelBannerText.setText('EMBOSCADA! Defenda-se!');
        this.levelBannerText.setVisible(true);
        this.time.delayedCall(1200, () => this.levelBannerText.setVisible(false));
        (this.currentLevel.ambush ?? []).forEach(e => this.spawnSingleEnemy(e));
      }
      itm.destroy();
    });

    // Player vs Section Doors → travel between sections
    this.physics.add.overlap(this.player, this.stairTiles, (_playerObj, doorObj) => {
      if (this.isTransitioning || !this.currentLevel.exits) return;
      // Doors are sealed while a wave is active — finish the fight first
      if (this.enemies.countActive(true) > 0 || this.waveTransition) {
        if (!this.doorSealNotice || this.time.now - this.doorSealNotice > 2000) {
          this.doorSealNotice = this.time.now;
          this.levelBannerText.setText('PORTAS SELADAS! Termine o combate.');
          this.levelBannerText.setVisible(true);
          this.time.delayedCall(1200, () => this.levelBannerText.setVisible(false));
        }
        return;
      }
      const door = doorObj as Phaser.Physics.Arcade.Sprite;
      const exit = this.currentLevel.exits.find(e =>
        Math.abs(e.x * 32 + 16 - door.x) < 24 && Math.abs(e.y * 32 + 16 - door.y) < 24);
      if (exit) this.transitionToSection(exit);
    });

    // Bullets vs Enemies → ranged damage
    this.physics.add.overlap(this.bullets, this.enemies, (bulletObj, enemyObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
      const enemy = enemyObj as Enemy;
      const combatBullet = bullet as CombatProjectile;
      if (combatBullet.hitTargets?.has(enemy)) return;
      combatBullet.hitTargets?.add(enemy);
      const dmg = (combatBullet.bulletDamage || 15) * this.comboManager.getDamageMultiplier();
      enemy.takeDamage(dmg);
      this.comboManager.registerHit();
      if (combatBullet.piercingHits && combatBullet.piercingHits > 1) {
        combatBullet.piercingHits--;
      } else {
        bullet.destroy();
      }
    });

    // Bullets vs Walls → destroy on impact
    this.physics.add.collider(this.bullets, this.wallTiles, (bulletObj) => {
      (bulletObj as Phaser.Physics.Arcade.Sprite).destroy();
    });

    this.physics.add.overlap(this.player, this.enemyBullets, (_playerObj, bulletObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Sprite & { bulletDamage?: number };
      if (this.playerDamageCooldown <= 0) {
        this.damagePlayer(bullet.bulletDamage ?? 10);
      }
      bullet.destroy();
    });

    this.physics.add.collider(this.enemyBullets, this.wallTiles, (bulletObj) => {
      (bulletObj as Phaser.Physics.Arcade.Sprite).destroy();
    });
  }

  private spawnSummon(x: number, y: number, classId: string): void {
    const configs: Record<string, SummonConfig> = {
      // One single big extending sword wave per summon — re-do PPK for another
      knight: { tint: 0xf5cf5b, damage: 40, attackCooldown: 900, duration: 1100, projectileTexture: 'proj_sword_wave', volleySize: 1, spread: 0, projectileScale: 2.4, piercing: 4 },
      // Single nova per summon, like the knight's sword wave
      mage: { tint: 0x62e1ff, damage: 24, attackCooldown: 900, duration: 700, projectileTexture: 'proj_magic_bolt', volleySize: 0, spread: 0, aoeRadius: 95, aoeDamage: 24 },
      // Volley of many arrows in a wide fan
      ranger: { tint: 0xc8e66b, damage: 12, attackCooldown: 650, duration: 6500, projectileTexture: 'proj_ranger_arrow', volleySize: 5, spread: 0.13, projectileScale: 0.85, piercing: 2 },
      // Shadow clone: short-lived, strikes twice with fast daggers
      rogue: { tint: 0xe84f75, damage: 16, attackCooldown: 420, duration: 700, projectileTexture: 'proj_rogue_dagger', volleySize: 2, spread: 0.2, projectileScale: 1.1 },
    };
    const config = configs[classId] ?? configs.knight;
    // Only one summon at a time — a new finisher replaces the old one
    this.summons.forEach(s => s.destroy());
    this.summons = [];
    this.summons.push(new Summon(this, x, y, config, this.bullets));
  }

  private damagePlayer(amount: number): void {
    this.player.takeDamage(amount);
    this.playerDamageCooldown = 500;
    if (this.player.hp <= 0 && !this.isTransitioning) {
      this.isTransitioning = true;
      this.player.setVelocity(0, 0);
      this.player.setActive(false);
      this.levelBannerText.setText('GAME OVER');
      this.levelBannerText.setVisible(true);
      this.time.delayedCall(1500, () => this.scene.restart({ skipControls: true }));
    }
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

  private spawnSingleEnemy(e: EnemyPlacement): void {
    const px = e.x * 32 + 16;
    const py = e.y * 32 + 16;
    if (e.type === 'ranged' || e.type === 'applaud') {
      this.enemies.add(new RangedEnemy(this, px, py, this.enemyBullets));
    } else if (e.type === 'boss' || e.type === 'fortitudo') {
      this.enemies.add(new BossEnemy(this, px, py, 'Fortitudo'));
    } else if (e.type === 'miniboss') {
      this.enemies.add(new BossEnemy(this, px, py, 'Sevido', 'boss_guardian_anim', 700, 0.6));
    } else {
      this.enemies.add(new Enemy(this, px, py, 'enemy_melee_anim'));
    }
  }

  private spawnWave(index: number): void {
    const wave = this.waves[index];
    if (!wave) return;
    wave.enemies.forEach(e => this.spawnSingleEnemy(e));
    if (this.levelBannerText) {
      this.levelBannerText.setText(`ONDA ${index + 1} / ${this.waves.length}`);
      this.levelBannerText.setVisible(true);
      this.time.delayedCall(1400, () => {
        if (!this.levelClearedBannerShowing && this.enemies.countActive(true) > 0) {
          this.levelBannerText.setVisible(false);
        }
      });
    }
  }

  private spawnEnemiesAndItems(level: LevelDefinition): void {
    // Build wave schedule: hand-authored waves if present, otherwise chunk by level
    if (level.waves && level.waves.length > 0) {
      this.waves = level.waves.map(w => ({ enemies: w.enemies }));
    } else {
      const sorted = [...level.enemies].sort((a, b) => a.level - b.level);
      this.waves = [];
      for (let i = 0; i < sorted.length; i += 5) {
        this.waves.push({ enemies: sorted.slice(i, i + 5) });
      }
      const minibossSpots = [{ x: 25, y: 8 }, { x: 30, y: 9 }, { x: 34, y: 9 }];
      const mb = minibossSpots[this.currentLevelIndex] ?? { x: 20, y: 8 };
      this.waves.push({ enemies: [{ type: 'miniboss', x: mb.x, y: mb.y, level: 9 }] });
    }
    this.currentWaveIndex = 0;
    this.waveDelayTimer = 0;
    this.waveTransition = false;
    // Wave 0 is spawned in create() once the HUD (banner text) exists.

    level.items.forEach(itm => {
      // Keys already collected stay collected across revisits
      if (itm.type === 'key') {
        const keyId = `${this.currentLevelIndex}:${itm.x},${itm.y}`;
        if (this.foundKeys.has(keyId)) return;
      }
      const px = itm.x * 32 + 16;
      const py = itm.y * 32 + 16;
      const isHealth = itm.type === 'potion' || itm.type === 'health_herb';
      const isMagic = itm.type === 'mana_shard';
      const isKey = itm.type === 'key';
      const itemType = isHealth ? 'item_potion' : isMagic ? 'item_magic' : isKey ? 'item_key' : 'item_halo';
      const textureKey = isMagic ? 'item_potion' : itemType;
      const itemEntity = new Item(this, px, py, itemType, textureKey);
      this.items.add(itemEntity);
    });
  }

  private createHUD(): void {
    const hudBg = this.add.rectangle(640, 25, 1280, 50, 0x05020a, 0.85);
    hudBg.setScrollFactor(0);
    hudBg.setDepth(950);

    this.hpHudText = this.add.text(20, 9, '♥♥♥♥♥', {
      fontFamily: 'Courier, monospace',
      fontSize: '28px',
      color: '#ff5a6f',
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

    this.weaponHudText = this.add.text(650, 15, "CLASSE: CAVALEIRO", {
      fontFamily: 'Courier, monospace',
      fontSize: '16px',
      color: '#ffffff'
    }).setScrollFactor(0).setDepth(960);

    this.comboHudText = this.add.text(910, 15, "ESPECIAL: -", {
      fontFamily: 'Courier, monospace',
      fontSize: '16px',
      color: '#ffcc00',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(960);

    const shopBtn = this.add.text(1165, 15, "[ LOJA (B) ]", {
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

    // Objective tracker (what to do next)
    this.objectiveText = this.add.text(640, 62, '', {
      fontFamily: 'Courier, monospace',
      fontSize: '16px',
      color: '#f6d77a',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(960);
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

  private transitionToSection(exit: { to: number; spawnX: number; spawnY: number }): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.cameras.main.flash(500, 255, 215, 0);
    SoundManager.playWitchTimeActivate();

    this.time.delayedCall(400, () => {
      this.currentLevelIndex = exit.to;
      this.currentLevel = this.allLevels[this.currentLevelIndex];

      this.floorImages.forEach(img => img.destroy());
      this.floorImages = [];
      this.enemies.clear(true, true);
      this.items.clear(true, true);
      this.bullets.clear(true, true);
      this.enemyBullets.clear(true, true);
      this.wallTiles.clear(true, true);
      this.stairTiles.clear(true, true);
      this.summons.forEach(s => s.destroy());
      this.summons = [];

      this.buildMapFromDefinition(this.currentLevel);
      this.spawnEnemiesAndItems(this.currentLevel);
      this.spawnWave(0);

      this.player.setPosition(exit.spawnX * 32 + 16, exit.spawnY * 32 + 16);
      this.player.setVelocity(0, 0);
      this.player.setActive(true);
      this.player.setVisible(true);
      this.player.setAlpha(1);
      this.player.resetResourcesForNextStage();

      // Rebuild camera/world bounds for the new section
      const worldWidth = this.currentLevel.tileMap[0].length * 32;
      const worldHeight = this.currentLevel.tileMap.length * 32;
      this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
      this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

      this.levelClearedBannerShowing = false;
      this.currentWaveIndex = 0;
      this.waveTransition = false;
      this.showChapterTitle(this.currentLevel.name);
      this.isTransitioning = false;
    });
  }

  public advanceToNextLevel(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    if (this.currentLevelIndex === this.allLevels.length - 1) {
      this.levelBannerText.setText('PASSAGEM CONCLUÍDA!');
      this.levelBannerText.setVisible(true);
      this.cameras.main.flash(700, 246, 215, 122);
      this.time.delayedCall(1800, () => this.scene.start('MenuScene'));
      return;
    }

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
      this.enemyBullets.clear(true, true);
      this.summons.forEach(s => s.destroy());
      this.summons = [];
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
      this.player.resetResourcesForNextStage();

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
    // Early returns for menus, death and transitions must also hide the charge UI.
    this.arrowChargeBar.setVisible(false);
    this.comboManager.update();
    // Damage cooldown tick
    if (this.playerDamageCooldown > 0) {
      this.playerDamageCooldown -= delta;
    }

    if (this.keyMenu && Phaser.Input.Keyboard.JustDown(this.keyMenu)) {
      this.physics.world.resume();
      this.scene.start('MenuScene');
      return;
    }

    if (this.controlsGuideOpen) return;

    // Shop Key
    if (this.keyShop && Phaser.Input.Keyboard.JustDown(this.keyShop)) {
      this.shopUI.toggle();
    }

    this.player.combatInputEnabled = !this.shopUI.getIsVisible();
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
      enemy.updateEnemy(this.player.x, this.player.y, delta * witchMultiplier, witchMultiplier);
    });

    // Witch Time also slows enemy projectiles
    this.enemyBullets.getChildren().forEach(b => {
      const bullet = b as Phaser.Physics.Arcade.Sprite & { baseVelX?: number; baseVelY?: number };
      if (bullet.baseVelX !== undefined && bullet.baseVelY !== undefined) {
        bullet.setVelocity(bullet.baseVelX * witchMultiplier, bullet.baseVelY * witchMultiplier);
      }
    });

    // Update active summons
    this.summons = this.summons.filter(s => s.updateSummon(delta, this.player.x, this.player.y, activeEnemies));

    // Wave progression: when a wave is cleared, delay then spawn the next one
    if (activeEnemies.length === 0 && !this.waveTransition) {
      if (this.currentWaveIndex < this.waves.length - 1) {
        this.waveTransition = true;
        this.waveDelayTimer = 1200;
      } else if (!this.levelClearedBannerShowing) {
        this.levelClearedBannerShowing = true;
        this.levelBannerText.setText('CAMINHO LIBERADO!\nEncontre o portal dourado');
        this.levelBannerText.setVisible(true);
      }
    }
    if (this.waveTransition) {
      this.waveDelayTimer -= delta;
      if (this.waveDelayTimer <= 0) {
        this.currentWaveIndex++;
        this.spawnWave(this.currentWaveIndex);
        this.waveTransition = false;
      }
    }

    // Melee attack collisions (when player recently tapped J/K)
    if (this.player.meleeAttackId !== this.lastHandledMeleeAttack) {
      this.lastHandledMeleeAttack = this.player.meleeAttackId;
      activeEnemies.forEach(e => {
        const enemy = e as Enemy;
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.player.getMeleeRange()) {
          // Check if enemy is roughly in facing direction (dot product)
          const dot = (dx * this.player.facingX + dy * this.player.facingY);
          if (dot > -20) { // generous: hits in facing hemisphere
            enemy.takeDamage(this.player.getMeleeDamage() * this.comboManager.getDamageMultiplier());
            this.comboManager.registerHit();
          }
        }
      });
    }

    // Update HUD
    this.hpHudText.setText('♥'.repeat(this.player.hp) + '♡'.repeat(this.player.maxHp - this.player.hp));
    this.magicHudText.setText(`MAGIA: ${Math.round(this.player.magic)}/${this.player.maxMagic}`);
    this.haloHudText.setText(`HALOS: ${this.player.halos} ⏣`);
    this.weaponHudText.setText(`${this.player.heroClass.name}: ${this.player.heroClass.weaponName}`);
    if (this.player.shieldCharges > 0) {
      this.weaponHudText.setText(`${this.player.heroClass.name}: ${this.player.heroClass.weaponName}  ESCUDO x${this.player.shieldCharges}`);
    }
    const charge = this.player.getChargeRatio();
    this.aimReticle.setScale(1 + charge * 0.9);
    this.aimReticle.setStrokeStyle(2 + charge * 3, charge >= 1 ? 0xffffff : this.player.heroClass.accentColor, 0.9);
    this.aimReticle.setPosition(this.input.activePointer.x, this.input.activePointer.y);
    this.updateArrowChargeBar();
    this.updateObjective();
  }

  private updateObjective(): void {
    // Escaped state — controls guide is covering the screen
    if (this.controlsGuideOpen || this.shopUI.getIsVisible()) return;
    const aliveEnemies = this.enemies.countActive(true);
    let objective = '';
    if (aliveEnemies > 0 || this.waveTransition) {
      objective = `OBJETIVO: Derrube os inimigos (Onda ${this.currentWaveIndex + 1}/${this.waves.length}, ${aliveEnemies} restantes)`;
    } else if (this.currentWaveIndex < this.waves.length - 1) {
      objective = 'OBJETIVO: Prepare-se para a próxima onda...';
    } else {
      objective = 'OBJETIVO: Seção limpa! Procure uma chave ou use uma porta.';
    }
    this.objectiveText.setText(objective);
  }

  private updateArrowChargeBar(): void {
    if (this.player.heroClass.primaryStyle !== 'arrow' || !this.player.isChargingAttack()) return;
    const charge = this.player.getChargeRatio();
    const width = 48;
    const height = 6;
    // World coordinates keep the meter attached to the archer as the camera moves.
    this.arrowChargeBar.clear()
      .setPosition(this.player.x, this.player.y - this.player.displayHeight / 2 - 12)
      .setVisible(true);
    this.arrowChargeBar.fillStyle(0x100b18, 0.95);
    this.arrowChargeBar.fillRect(-width / 2 - 2, -2, width + 4, height + 4);
    this.arrowChargeBar.fillStyle(0x3a3344, 1);
    this.arrowChargeBar.fillRect(-width / 2, 0, width, height);
    this.arrowChargeBar.fillStyle(charge >= 1 ? 0xf6d77a : 0x8bdc75, 1);
    this.arrowChargeBar.fillRect(-width / 2, 0, width * charge, height);
  }

  private createAimReticle(): void {
    this.aimReticle = this.add.circle(0, 0, 10, 0x000000, 0)
      .setStrokeStyle(2, 0xf6d77a, 0.9)
      .setScrollFactor(0)
      .setDepth(980);
  }

  private showControlsGuide(): void {
    this.controlsGuideOpen = true;
    this.player.combatInputEnabled = false;
    this.physics.world.pause();
    const panel = this.add.container(640, 390).setScrollFactor(0).setDepth(990);
    const bg = this.add.rectangle(0, 0, 680, 330, 0x100b18, 0.96).setStrokeStyle(4, this.player.heroClass.accentColor);
    const title = this.add.text(0, -135, `${this.player.heroClass.name} — ${this.player.heroClass.title}`, {
      fontFamily: 'Courier New, monospace', fontSize: '28px', color: '#f6d77a', fontStyle: 'bold',
    }).setOrigin(0.5);
    const classInfo = this.add.text(0, -92,
      `${this.player.heroClass.weaponName}\nDIREITO: ${this.player.heroClass.specialName} - ${this.player.heroClass.specialDescription}`, {
      fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#cbb8d4', align: 'center',
      wordWrap: { width: 610 },
    }).setOrigin(0.5);
    const commands = this.add.text(0, 15,
      'WASD / SETAS   MOVER\nMOUSE           MIRAR\nBOTÃO ESQUERDO  ATACAR (PUNCH / CARREGAR)\nBOTÃO DIREITO   CHUTE (KICK)\nJ               ATACAR   •   K CHUTE\nESPAÇO          ESQUIVAR E ATRAVESSAR INIMIGOS\nCOMBOS P/K      PPK/KPK = INVOCAÇÃO\nB               LOJA   •   ESC MENU', {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#ffffff', lineSpacing: 8, align: 'left',
    }).setOrigin(0.5);
    const hint = this.add.text(0, 140, 'CLIQUE PARA COMEÇAR', {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#a990b6',
    }).setOrigin(0.5);
    panel.add([bg, title, classInfo, commands, hint]);
    bg.setInteractive({ useHandCursor: true }).once('pointerdown', () => {
      panel.destroy(true);
      this.controlsGuideOpen = false;
      this.player.combatInputEnabled = true;
      this.physics.world.resume();
    });
  }
}
