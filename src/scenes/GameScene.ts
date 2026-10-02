// src/scenes/GameScene.ts
// Main gameplay scene: hand-crafted level rendering, combat, Witch Time FX,
// item pickups, Shop UI, Level Progression, and bullet projectile collisions.

import Phaser from 'phaser';
import { Player, CombatProjectile } from '../entities/Hero';
import { Enemy } from '../entities/Enemy';
import { BossEnemy } from '../entities/BossEnemy';
import { RangedEnemy } from '../entities/RangedEnemy';
import { Item } from '../entities/Item';
import { TextureGenerator } from '../utils/TextureGenerator';
import { LevelDefinition } from '../data/LevelData';
import { CORRIDOR_LEVEL } from '../data/CorridorLevelData';
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

  private allLevels: LevelDefinition[] = [CORRIDOR_LEVEL];
  private currentLevelIndex: number = 0;
  private currentLevel: LevelDefinition = CORRIDOR_LEVEL;
  private isTransitioning: boolean = false;

  private shopUI!: ShopUI;
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
    this.showChapterTitle(this.currentLevel.name);
    this.createAimReticle();
    if (loadSettings().showControls && !this.skipControlsGuide) this.showControlsGuide();
  }

  private setupColliders(): void {
    // Player vs Walls
    this.physics.add.collider(this.player, this.wallTiles);
    // Enemies vs Walls
    this.physics.add.collider(this.enemies, this.wallTiles);

    // Player vs Enemy = contact damage (with cooldown)
    this.physics.add.overlap(this.player, this.enemies, (_playerObj, enemyObj) => {
      const enemy = enemyObj as Enemy;
      if (this.player.isDodging) {
        if (this.player.dodgeAttackId !== this.lastHandledDodgeAttack) {
          this.lastHandledDodgeAttack = this.player.dodgeAttackId;
          this.dodgeHitTargets.clear();
        }
        if (!this.dodgeHitTargets.has(enemy)) {
          this.dodgeHitTargets.add(enemy);
          enemy.takeDamage(this.player.getDodgeDamage());
          this.comboManager.registerHit();
        }
        return;
      }
      if (this.playerDamageCooldown > 0) return;
      this.damagePlayer(enemy.getAttackDamage());
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
      }
      itm.destroy();
    });

    // Player vs Exit Stairs → advance level
    this.physics.add.overlap(this.player, this.stairTiles, () => {
      if (!this.isTransitioning && this.enemies.countActive(true) === 0) {
        this.advanceToNextLevel();
      }
    });

    // Bullets vs Enemies → ranged damage
    this.physics.add.overlap(this.bullets, this.enemies, (bulletObj, enemyObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
      const enemy = enemyObj as Enemy;
      const combatBullet = bullet as CombatProjectile;
      if (combatBullet.hitTargets?.has(enemy)) return;
      combatBullet.hitTargets?.add(enemy);
      const dmg = combatBullet.bulletDamage || 15;
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

  private spawnEnemiesAndItems(level: LevelDefinition): void {
    level.enemies.forEach(e => {
      const px = e.x * 32 + 16;
      const py = e.y * 32 + 16;

      if (e.type === 'ranged' || e.type === 'applaud') {
        const enemy = new RangedEnemy(this, px, py, this.enemyBullets);
        this.enemies.add(enemy);
      } else if (e.type === 'boss' || e.type === 'fortitudo') {
        const boss = new BossEnemy(this, px, py, 'Fortitudo');
        this.enemies.add(boss);
      } else {
        const enemy = new Enemy(this, px, py, 'enemy_melee_anim');
        this.enemies.add(enemy);
      }
    });

    level.items.forEach(itm => {
      const px = itm.x * 32 + 16;
      const py = itm.y * 32 + 16;
      const isHealth = itm.type === 'potion' || itm.type === 'health_herb';
      const isMagic = itm.type === 'mana_shard';
      const itemType = isHealth ? 'item_potion' : isMagic ? 'item_magic' : 'item_halo';
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

    // Check if level cleared
    if (activeEnemies.length === 0 && !this.levelClearedBannerShowing) {
      this.levelClearedBannerShowing = true;
      this.levelBannerText.setText('CAMINHO LIBERADO!\nEncontre o portal dourado');
      this.levelBannerText.setVisible(true);
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
            enemy.takeDamage(this.player.getMeleeDamage());
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
      'WASD / SETAS   MOVER\nMOUSE           MIRAR\nBOTÃO ESQUERDO  ATACAR / SEGURAR PARA CARREGAR\nBOTÃO DIREITO   USAR ESPECIAL (CONSOME MAGIA)\nESPAÇO          ESQUIVAR E ATRAVESSAR INIMIGOS\nB               LOJA   •   ESC MENU', {
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
