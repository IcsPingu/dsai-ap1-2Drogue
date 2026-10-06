import Phaser from 'phaser';
import { PlayerClassDefinition, getPlayerClass } from '../data/ClassDatabase';
import { SoundManager } from '../managers/SoundManager';
import { ArcherBow } from './ArcherBow';
import { getArcherAimOrigin } from '../utils/ArcherAimTextures';

export type CombatProjectile = Phaser.Physics.Arcade.Sprite & {
  bulletDamage: number;
  piercingHits?: number;
  hitTargets?: Set<Phaser.GameObjects.GameObject>;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  public static readonly SPAWN_PROTECTION_MS = 5000;
  public hp: number;
  public maxHp: number;
  public magic: number;
  public maxMagic: number;
  public halos = 5000;
  public speed: number;
  public readonly heroClass: PlayerClassDefinition;
  public comboSequence: ('P' | 'K' | 'D' | 'H')[] = [];
  public comboTimer = 0;
  public meleeAttackId = 0;
  public isDodging = false;
  public dodgeAttackId = 0;
  public isShadowActive = false;
  public dodgeCooldown = 0;
  public lastAttackKick = false;
  private comboInputLock = 0;
  private comboWindowStart: number | null = null;
  private bufferedInput: 'P' | 'K' | null = null;
  private bufferedAt = 0;
  public isWitchTimeActive = false;
  public witchTimeRemaining = 0;
  public shieldCharges = 0;
  public facingX = 1;
  public facingY = 0;
  public bulletGroup?: Phaser.Physics.Arcade.Group;
  public combatInputEnabled = true;
  private spawnProtectionRemaining = Player.SPAWN_PROTECTION_MS;

  private attackCooldown = 0;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private keyAttack?: Phaser.Input.Keyboard.Key;
  private keyDodge?: Phaser.Input.Keyboard.Key;
  private keyUltimate?: Phaser.Input.Keyboard.Key;
  private baseScaleX = 1;
  private baseScaleY = 1;
  private readonly animationPrefix: string;
  private animationLocked = false;
  private animationToken = 0;
  private dodgeDirectionX = 1;
  private dodgeDirectionY = 0;
  private footstepEffectCooldown = 0;
  private footstepSide = -1;
  private chargeStartedAt: number | null = null;
  private shadowToken = 0;
  private archerBow?: ArcherBow;
  private bowReleaseUntil = 0;
  private bowReleaseAngle = 0;
  private primaryHeld = false;

  private static readonly MAX_CHARGE_MS = 1100;
  private static readonly ROGUE_THROW_THRESHOLD_MS = 220;
  private static readonly MAGIC_BOLT_RANGE = 455;
  public static readonly MAGIC_BOLT_COST = 4;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureKey = 'player_bayo',
    heroClass: PlayerClassDefinition = getPlayerClass(),
  ) {
    super(scene, x, y, textureKey);
    this.animationPrefix = textureKey;
    this.heroClass = heroClass;
    this.maxHp = heroClass.maxHp;
    this.hp = this.maxHp;
    this.maxMagic = heroClass.maxMagic;
    this.magic = this.maxMagic;
    this.speed = heroClass.speed;
    this.faceMovement(this.facingX);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true).setBounce(0.1).setDepth(10);
    this.setDisplaySize(86, 76);
    this.baseScaleX = this.scaleX;
    this.baseScaleY = this.scaleY;
    this.setSize(42, 58).setOffset(43, 48);
    if (heroClass.primaryStyle === 'arrow') {
      this.archerBow = new ArcherBow(scene, textureKey);
      this.updateBowChargePose();
      scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.syncArcherBow, this);
    }

    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyAttack = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
      this.keyDodge = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.keyUltimate = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    }
    scene.input.on('pointerdown', this.handlePointerDown, this);
    scene.input.on('pointerup', this.handlePointerUp, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.off('pointerdown', this.handlePointerDown, this);
      scene.input.off('pointerup', this.handlePointerUp, this);
      scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.syncArcherBow, this);
      this.archerBow?.destroy();
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]): void {
    if (!this.combatInputEnabled || currentlyOver.length > 0) return;
    this.aimAtPointer(pointer);
    if (pointer.rightButtonDown()) {
      this.useUltimate();
    }
    else if (pointer.leftButtonDown()) {
      if (this.heroClass.primaryStyle === 'arrow' || this.heroClass.primaryStyle === 'daggers') {
        if (this.attackCooldown <= 0 && !this.isDodging) {
          this.chargeStartedAt = this.scene.time.now;
          this.updateBowChargePose();
        }
      } else if (this.heroClass.primaryStyle === 'orb') {
        this.primaryHeld = true;
        this.usePrimaryWeapon();
      } else {
        this.usePrimaryWeapon();
      }
    }
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0) return;
    this.primaryHeld = false;
    if (pointer.button === 0 && this.heroClass.primaryStyle !== 'arrow' && this.heroClass.primaryStyle !== 'daggers') {
      // Melee/orb already fired the punch on press
      this.chargeStartedAt = null;
      return;
    }
    if (this.chargeStartedAt === null) return;
    const heldMs = this.scene.time.now - this.chargeStartedAt;
    this.chargeStartedAt = null;
    if (!this.combatInputEnabled || !this.active) return;
    this.aimAtPointer(pointer);
    const charge = Phaser.Math.Clamp(heldMs / Player.MAX_CHARGE_MS, 0, 1);
    if (this.heroClass.primaryStyle === 'daggers' && heldMs < Player.ROGUE_THROW_THRESHOLD_MS) {
      this.executeAttack('P', 0, false);
    } else {
      this.executeAttack('P', charge, true);
    }
  }

  public updatePlayer(_time: number, delta: number): void {
    if (!this.active || !this.body) return;
    if (this.spawnProtectionRemaining > 0) {
      this.spawnProtectionRemaining = Math.max(0, this.spawnProtectionRemaining - delta);
      const pulse = Math.floor(this.spawnProtectionRemaining / 120) % 2 === 0;
      this.setAlpha(pulse ? 1 : 0.58);
      if (this.spawnProtectionRemaining === 0) this.setAlpha(1);
    }
    if (!this.combatInputEnabled) {
      this.chargeStartedAt = null;
      this.primaryHeld = false;
    }
    this.aimAtPointer(this.scene.input.activePointer);
    // Witch Time: attack cooldown drains faster and magic regenerates
    this.attackCooldown = Math.max(0, this.attackCooldown - delta * (this.isWitchTimeActive ? 2.5 : 1));
    if (this.primaryHeld && this.heroClass.primaryStyle === 'orb' && this.combatInputEnabled && !this.isDodging) {
      this.usePrimaryWeapon();
    }
    if (this.isWitchTimeActive) this.addMagic(delta * 0.02);
    this.dodgeCooldown = Math.max(0, this.dodgeCooldown - delta);
    this.footstepEffectCooldown = Math.max(0, this.footstepEffectCooldown - delta);
    this.comboInputLock = Math.max(0, this.comboInputLock - delta);
    // Consume a buffered combo input once the lockout ends
    if (this.comboInputLock <= 0 && this.bufferedInput !== null) {
      const buffered = this.bufferedInput;
      const bufferedAt = this.bufferedAt;
      this.bufferedInput = null;
      if (this.scene.time.now - bufferedAt <= 300) {
        this.executeAttack(buffered);
      }
    }
    if (this.isWitchTimeActive) {
      this.witchTimeRemaining -= delta;
      if (this.witchTimeRemaining <= 0) {
        this.isWitchTimeActive = false;
        this.clearTint();
      }
    }
    if (this.comboSequence.length > 0) {
      this.comboTimer += delta;
      if (this.comboTimer > 2600) {
        this.comboSequence = [];
        this.comboTimer = 0;
        this.comboWindowStart = null;
      }
    }

    let vx = 0;
    let vy = 0;
    if (this.cursors?.left.isDown || this.keyA?.isDown) vx--;
    if (this.cursors?.right.isDown || this.keyD?.isDown) vx++;
    if (this.cursors?.up.isDown || this.keyW?.isDown) vy--;
    if (this.cursors?.down.isDown || this.keyS?.isDown) vy++;
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    if (this.keyDodge && Phaser.Input.Keyboard.JustDown(this.keyDodge) && !this.isDodging && this.dodgeCooldown <= 0) {
      this.triggerDodge(vx, vy);
    }

    if (this.isDodging) {
      this.setVelocity(this.dodgeDirectionX * this.speed * 2.65, this.dodgeDirectionY * this.speed * 2.65);
    } else {
      this.setVelocity(vx * this.speed, vy * this.speed);
    }

    if (!this.isDodging) {
      this.faceMovement(this.heroClass.primaryStyle === 'arrow' ? this.facingX : vx);
    }
    // The archer uses one body for idle, movement and shooting. Swapping to the
    // original sheet here changes the character's proportions between shots.
    const drawingBow = this.updateBowChargePose();
    if (!this.animationLocked && !drawingBow) {
      if (vx !== 0 || vy !== 0) {
        // Player and enemies now use the same animation path. The artwork
        // already contains four distinct contact poses, so no synthetic sway,
        // rotation or squash is applied on top of the actual sprite frames.
        this.play(`${this.animationPrefix}_walk`, true);
        this.setScale(this.baseScaleX, this.baseScaleY);
        this.setAngle(0);
      } else {
        this.resetMovementPose();
      }
    }
    if (!this.animationLocked && !this.isDodging && (vx !== 0 || vy !== 0) && this.footstepEffectCooldown <= 0) {
      this.spawnFootstepDust();
      this.footstepEffectCooldown = 155;
    }
    if (this.keyAttack && Phaser.Input.Keyboard.JustDown(this.keyAttack)) this.usePrimaryWeapon();
    if (this.keyUltimate && Phaser.Input.Keyboard.JustDown(this.keyUltimate)) this.useUltimate();
  }

  private faceMovement(directionX: number): void {
    if (Math.abs(directionX) < 0.001) return;
    const originallyFacesRight = this.heroClass.spriteFacing === 'right';
    this.setFlipX(originallyFacesRight ? directionX < 0 : directionX > 0);
  }

  private updateBowChargePose(): boolean {
    if (this.heroClass.primaryStyle !== 'arrow') return false;
    const charging = this.isChargingAttack();
    const releasing = this.bowReleaseUntil > 0 && this.scene.time.now < this.bowReleaseUntil;
    if ((!charging && !releasing) || this.isDodging || this.animationLocked) {
      this.archerBow?.hide();
      return false;
    }
    // Keep the same body and scale even before drawing and after releasing.
    // Only the arms, string and arrow change during an ordinary attack.
    const frame = releasing ? 6 : this.getChargeRatio() < 0.45 ? 4 : 5;
    const angle = releasing ? this.bowReleaseAngle : Math.atan2(this.facingY, this.facingX);
    this.stop();
    this.setTexture(this.archerBow?.bodyKey ?? this.animationPrefix, this.archerBow ? undefined : frame);
    this.setScale(this.baseScaleX, this.baseScaleY);
    this.setAngle(0);
    this.faceMovement(Math.cos(angle));
    this.archerBow?.setPose(frame - 4, angle, releasing ? 0 : this.getChargeRatio());
    this.syncArcherBow();
    return true;
  }

  private syncArcherBow(): void {
    if (!this.active || !this.combatInputEnabled || this.isDodging) {
      this.archerBow?.hide();
      return;
    }
    this.archerBow?.sync(this.x, this.y, this.scaleX, this.scaleY, this.flipX, this.alpha);
  }

  private getAimOrigin(): { x: number; y: number } {
    return this.heroClass.primaryStyle === 'arrow'
      ? getArcherAimOrigin(this.x, this.y, this.baseScaleY ?? 1)
      : { x: this.x, y: this.y };
  }

  private aimAt(x: number, y: number): void {
    const origin = this.getAimOrigin();
    const dx = x - origin.x;
    const dy = y - origin.y;
    const length = Math.hypot(dx, dy);
    if (length > 2) {
      this.facingX = dx / length;
      this.facingY = dy / length;
    }
  }

  private usePrimaryWeapon(): void {
    if (this.heroClass.primaryStyle === 'orb') {
      this.performPrimaryAttack(0, false, false);
      return;
    }
    this.executeAttack('P');
  }

  /** Compatibility entry point: P attacks; K now invokes the class ultimate. */
  public executeAttack(input: 'P' | 'K', charge = 0, throwDagger = false): void {
    if (input === 'K') {
      this.useUltimate();
      return;
    }
    // Animation lockout: an attack must play out before the next one can start.
    // Early presses are buffered so combos can be chained fluidly.
    if (this.comboInputLock > 0) {
      this.bufferedInput = input;
      this.bufferedAt = this.scene.time.now;
      return;
    }

    // Combo sequence expires: finishers must be executed within a tight window
    if (this.comboSequence.length > 0 && this.comboWindowStart !== null &&
        this.scene.time.now - this.comboWindowStart > 2600) {
      this.comboSequence = [];
      this.comboWindowStart = null;
    }
    if (this.comboSequence.length === 0) {
      this.comboWindowStart = this.scene.time.now;
    }

    this.comboSequence.push(input);
    this.comboTimer = 0;

    this.comboInputLock = 220;
    this.performPrimaryAttack(charge, throwDagger, false);
  }

  private performPrimaryAttack(charge: number, throwDagger: boolean, isKick: boolean): void {
    if (this.attackCooldown > 0) return;
    if (this.heroClass.primaryStyle === 'orb' && this.magic < Player.MAGIC_BOLT_COST) return;
    this.attackCooldown = this.heroClass.attackCooldown * (isKick ? 1.4 : 1);
    if (this.heroClass.primaryStyle === 'orb') this.magic -= Player.MAGIC_BOLT_COST;
    this.lastAttackKick = isKick;
    this.comboTimer = 0;
    this.playSpriteAction('attack');
    this.playPrimaryAnimation();
    const kickMult = isKick ? 1.6 : 1;
    const aimAngle = Math.atan2(this.facingY, this.facingX);
    if (this.heroClass.primaryStyle === 'melee' || (this.heroClass.primaryStyle === 'daggers' && !throwDagger)) {
      this.scene.time.delayedCall(110, () => {
        if (!this.active) return;
        this.meleeAttackId++;
        this.spawnSlashEffect(isKick);
      });
      SoundManager.playSwordSlash();
    } else if (this.heroClass.primaryStyle === 'daggers') {
      const damage = this.heroClass.baseDamage * Phaser.Math.Linear(1.2, 2.2, charge) * kickMult;
      const speed = Phaser.Math.Linear(this.heroClass.projectileSpeed, 680, charge);
      const lifetime = Phaser.Math.Linear(650, 1250, charge);
      this.scene.time.delayedCall(90, () => {
        if (!this.active) return;
        this.fireProjectile(0, damage, speed, lifetime, Phaser.Math.Linear(0.75, 1.05, charge) * (isKick ? 1.3 : 1), false, 0, aimAngle, isKick);
      });
      SoundManager.playSwordSlash();
    } else if (this.heroClass.primaryStyle === 'orb') {
      // Launch on input; the casting animation must not delay the actual shot.
      const lifetime = (Player.MAGIC_BOLT_RANGE / this.heroClass.projectileSpeed) * 1000;
      this.fireProjectile(0, this.heroClass.baseDamage * kickMult, this.heroClass.projectileSpeed * (isKick ? 0.8 : 1), lifetime, isKick ? 1.4 : 1, false, 0, aimAngle, isKick);
      SoundManager.playGunshot();
    } else {
      const damage = this.heroClass.baseDamage * Phaser.Math.Linear(1, 2.25, charge) * kickMult;
      const speed = Phaser.Math.Linear(this.heroClass.projectileSpeed, 720, charge);
      const lifetime = Phaser.Math.Linear(850, 1600, charge);
      // The bow was drawn while charging: release the projectile with the release pose.
      this.fireProjectile(0, damage, speed, lifetime, Phaser.Math.Linear(0.85, 1.25, charge) * (isKick ? 1.25 : 1), false, 0, aimAngle, isKick);
      SoundManager.playGunshot();
    }
    if (this.heroClass.primaryStyle !== 'orb') this.addMagic(5);
  }

  public useUltimate(): boolean {
    if (!this.combatInputEnabled || this.isDodging || this.magic < this.heroClass.magicCost) return false;
    this.magic -= this.heroClass.magicCost;
    this.comboSequence = [];
    this.comboWindowStart = null;
    this.comboInputLock = 620;
    this.primaryHeld = false;
    this.chargeStartedAt = null;
    this.playSpecialAnimation();
    this.spawnSpecialRing(this.heroClass.accentColor);
    SoundManager.playWickedWeave();
    this.scene.events.emit('playerSummon', this.x, this.y, this.heroClass.id, 'normal');
    return true;
  }

  private fireProjectile(
    angleOffset: number,
    damage: number,
    speed: number,
    lifetime: number,
    scale: number,
    absoluteAngle = false,
    piercingHits = 0,
    aimAngle?: number,
    isKick = false,
  ): void {
    if (!this.bulletGroup) return;
    const baseAngle = aimAngle ?? Math.atan2(this.facingY, this.facingX);
    const angle = absoluteAngle ? angleOffset : baseAngle + angleOffset;
    const origin = this.getAimOrigin();
    const bullet = this.scene.physics.add.sprite(origin.x, origin.y, this.getProjectileTexture()) as CombatProjectile;
    // Keep magic visible immediately instead of hiding its launch behind the hero.
    bullet.setDepth(this.heroClass.primaryStyle === 'orb' || this.heroClass.primaryStyle === 'arrow' ? 12 : 8)
      .setScale(scale).setRotation(angle);
    if (isKick) bullet.setTint(0xff3366);
    bullet.bulletDamage = damage * (this.isWitchTimeActive ? 2 : 1);
    if (piercingHits > 0) {
      bullet.piercingHits = piercingHits;
      bullet.hitTargets = new Set();
    }
    this.bulletGroup.add(bullet);
    // Arcade groups reset body velocity when adding a sprite.
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.scene.time.delayedCall(lifetime, () => bullet.active && bullet.destroy());
  }

  private getProjectileTexture(): string {
    if (this.heroClass.primaryStyle === 'orb') return 'proj_magic_bolt';
    if (this.heroClass.primaryStyle === 'arrow') return 'proj_ranger_arrow';
    if (this.heroClass.primaryStyle === 'daggers') return 'proj_rogue_dagger';
    return 'proj_sword_wave';
  }

  private playSpriteAction(action: 'attack' | 'hurt' | 'dodge'): void {
    if (action === 'attack' && this.archerBow) {
      ++this.animationToken;
      this.animationLocked = false;
      this.bowReleaseUntil = this.scene.time.now + 150;
      this.bowReleaseAngle = Math.atan2(this.facingY, this.facingX);
      this.updateBowChargePose();
      return;
    }
    this.bowReleaseUntil = 0;
    this.archerBow?.hide();
    const token = ++this.animationToken;
    this.animationLocked = true;
    this.setScale(this.baseScaleX, this.baseScaleY);
    this.setAngle(0);
    this.play(`${this.animationPrefix}_${action}`, true);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (token !== this.animationToken) return;
      this.animationLocked = false;
      this.stop();
      this.setTexture(this.animationPrefix, 0);
    });
  }

  private spawnSlashEffect(isKick = false): void {
    const range = this.getMeleeRange();
    const slash = this.scene.add.circle(
      this.x + this.facingX * range * 0.55,
      this.y + this.facingY * range * 0.55,
      isKick ? 30 : 22,
      isKick ? 0xff3366 : this.heroClass.accentColor,
      0.65,
    ).setDepth(9);
    this.scene.tweens.add({ targets: slash, alpha: 0, scaleX: isKick ? 3.4 : 2.8, scaleY: isKick ? 2.0 : 1.5, duration: 190, onComplete: () => slash.destroy() });
  }

  private playPrimaryAnimation(): void {
    const angle = Math.atan2(this.facingY, this.facingX);
    if (this.heroClass.primaryStyle === 'melee') {
      const slash = this.scene.add.graphics({ x: this.x, y: this.y }).setDepth(12).setRotation(angle);
      slash.lineStyle(7, 0xf8e7a4, 0.95);
      slash.beginPath();
      slash.arc(0, 0, 52, -0.8, 0.8, false);
      slash.strokePath();
      this.scene.tweens.add({ targets: slash, alpha: 0, scaleX: 1.25, scaleY: 1.25, duration: 190, onComplete: () => slash.destroy() });
    } else if (this.heroClass.primaryStyle === 'orb') {
      const castX = this.x + this.facingX * 18;
      const castY = this.y + this.facingY * 18;
      const cast = this.scene.add.container(castX, castY).setDepth(12);
      const glow = this.scene.add.circle(0, 0, 9, 0x67e8ff, 0.35);
      const bolt = this.scene.add.circle(0, 0, 4, 0xd9fbff, 0.95);
      cast.add([glow, bolt]);
      cast.setRotation(angle);
      this.scene.tweens.add({
        targets: cast,
        scaleX: 0.4,
        scaleY: 0.4,
        alpha: 0,
        duration: 85,
        ease: 'Cubic.Out',
        onComplete: () => cast.destroy(true),
      });
    } else if (this.heroClass.primaryStyle === 'arrow') {
      const streak = this.scene.add.rectangle(
        this.x + this.facingX * 30,
        this.y + this.facingY * 30,
        34,
        3,
        0xe8f2b0,
        0.9,
      ).setDepth(11).setRotation(angle);
      this.scene.tweens.add({
        targets: streak,
        x: streak.x + this.facingX * 36,
        y: streak.y + this.facingY * 36,
        alpha: 0,
        duration: 130,
        onComplete: () => streak.destroy(),
      });
    } else {
      [-1, 1].forEach(direction => {
        const slash = this.scene.add.graphics({ x: this.x, y: this.y }).setDepth(12).setRotation(angle + direction * 0.18);
        slash.lineStyle(4, direction > 0 ? 0xf2f3ff : 0xe84f75, 0.95);
        slash.beginPath();
        slash.arc(0, 0, 39, -0.55, 0.55, false);
        slash.strokePath();
        this.scene.tweens.add({ targets: slash, alpha: 0, scaleX: 1.3, scaleY: 1.3, duration: 150, onComplete: () => slash.destroy() });
      });
    }
    if (this.heroClass.primaryStyle === 'orb' || this.heroClass.primaryStyle === 'arrow') return;
    this.scene.tweens.add({
      targets: this,
      scaleX: this.baseScaleX * 1.1,
      scaleY: this.baseScaleY * 0.94,
      duration: 80,
      yoyo: true,
      onComplete: () => this.setScale(this.baseScaleX, this.baseScaleY),
    });
  }

  private playSpecialAnimation(): void {
    if (this.heroClass.specialStyle === 'aegis') {
      this.scene.tweens.add({ targets: this, angle: 360, duration: 360, ease: 'Cubic.Out', onComplete: () => this.setAngle(0) });
    } else if (this.heroClass.specialStyle === 'nova') {
      // The staff animation and nova ring provide feedback without moving the body.
      return;
    } else if (this.heroClass.specialStyle === 'volley') {
      this.scene.tweens.add({
        targets: this,
        x: this.x - this.facingX * 16,
        y: this.y - this.facingY * 16,
        duration: 90,
        yoyo: true,
      });
    } else {
      this.scene.tweens.add({
        targets: this,
        angle: 720,
        scaleX: this.baseScaleX * 0.75,
        scaleY: this.baseScaleY * 0.75,
        duration: 430,
        ease: 'Cubic.InOut',
        onComplete: () => this.setAngle(0).setScale(this.baseScaleX, this.baseScaleY),
      });
    }
  }

  private spawnSpecialRing(color: number): void {
    const ring = this.scene.add.circle(this.x, this.y, 24, color, 0.2).setStrokeStyle(5, color, 0.9).setDepth(11);
    this.scene.tweens.add({ targets: ring, alpha: 0, scaleX: 5, scaleY: 5, duration: 450, onComplete: () => ring.destroy() });
  }

  /** Called by ComboManager whenever one of the player's hits connects. */
  public extendComboWindow(): void {
    this.comboWindowStart = this.scene.time.now;
    this.comboTimer = 0;
  }

  public getMeleeDamage(): number {
    const kickMult = this.lastAttackKick ? 1.6 : 1;
    return this.heroClass.baseDamage * kickMult * (this.isWitchTimeActive ? 2 : 1);
  }
  public getMeleeRange(): number { return this.heroClass.primaryStyle === 'daggers' ? 78 : this.heroClass.attackRange; }
  public getDodgeDamage(): number { return Math.max(12, this.heroClass.baseDamage * 0.6) * (this.isWitchTimeActive ? 2 : 1); }
  public isChargingAttack(): boolean {
    return this.active && this.combatInputEnabled && this.chargeStartedAt !== null;
  }

  private aimAtPointer(pointer: Phaser.Input.Pointer): void {
    // Cached worldX/Y only refresh on pointer events; the camera can move between them.
    pointer.updateWorldPoint(this.scene.cameras.main);
    this.aimAt(pointer.worldX, pointer.worldY);
    if (this.heroClass.primaryStyle === 'arrow' && !this.isDodging) {
      this.faceMovement(this.facingX);
    }
  }
  public getChargeRatio(): number {
    if (this.chargeStartedAt === null) return 0;
    return Phaser.Math.Clamp((this.scene.time.now - this.chargeStartedAt) / Player.MAX_CHARGE_MS, 0, 1);
  }

  private spawnFootstepDust(): void {
    const side = this.footstepSide;
    this.footstepSide *= -1;
    const dust = this.scene.add.ellipse(
      this.x + side * 7,
      this.y + 29,
      9,
      4,
      0xc8b5ce,
      0.34,
    ).setDepth(8);
    this.scene.tweens.add({
      targets: dust,
      y: dust.y + 5,
      scaleX: 1.8,
      scaleY: 1.35,
      alpha: 0,
      duration: 170,
      onComplete: () => dust.destroy(),
    });
  }

  private resetMovementPose(): void {
    this.stop();
    this.setTexture(this.animationPrefix, 0);
    this.setScale(this.baseScaleX, this.baseScaleY);
    this.setAngle(0);
  }

  /** Starts a new stage fresh while deliberately preserving collected halos. */
  public resetResourcesForNextStage(): void {
    this.hp = this.maxHp;
    this.magic = this.maxMagic;
    this.shieldCharges = 0;
    this.isWitchTimeActive = false;
    this.witchTimeRemaining = 0;
    this.isShadowActive = false;
    this.isDodging = false;
    this.chargeStartedAt = null;
    this.primaryHeld = false;
    this.bowReleaseUntil = 0;
    this.attackCooldown = 0;
    this.dodgeCooldown = 0;
    this.comboInputLock = 0;
    this.comboWindowStart = null;
    this.bufferedInput = null;
    this.comboSequence = [];
    this.comboTimer = 0;
    this.animationLocked = false;
    ++this.animationToken;
    this.archerBow?.hide();
    this.clearTint();
    this.startSpawnProtection();
    this.resetMovementPose();
  }

  public startSpawnProtection(durationMs = Player.SPAWN_PROTECTION_MS): void {
    this.spawnProtectionRemaining = Math.max(0, durationMs);
    this.setAlpha(1);
  }

  public isSpawnProtected(): boolean {
    return this.spawnProtectionRemaining > 0;
  }

  private spawnDodgeAfterimage(delay: number): void {
    this.scene.time.delayedCall(delay, () => {
      if (!this.active || !this.isDodging) return;
      const ghost = this.scene.add.sprite(this.x, this.y, this.texture.key, this.frame.name)
        .setDisplaySize(this.displayWidth, this.displayHeight)
        .setFlipX(this.flipX)
        .setTint(this.heroClass.accentColor)
        .setAlpha(0.3)
        .setDepth(this.depth - 1);
      this.scene.tweens.add({
        targets: ghost,
        alpha: 0,
        scaleX: ghost.scaleX * 0.92,
        scaleY: ghost.scaleY * 1.08,
        duration: 150,
        onComplete: () => ghost.destroy(),
      });
    });
  }

  public triggerDodge(directionX = this.facingX, directionY = this.facingY): void {
    this.chargeStartedAt = null;
    const length = Math.hypot(directionX, directionY);
    if (length > 0.01) {
      this.dodgeDirectionX = directionX / length;
      this.dodgeDirectionY = directionY / length;
    } else {
      const originalDirection = this.heroClass.spriteFacing === 'right' ? 1 : -1;
      this.dodgeDirectionX = this.flipX ? -originalDirection : originalDirection;
      this.dodgeDirectionY = 0;
    }
    this.isDodging = true;
    this.dodgeAttackId++;
    this.dodgeCooldown = 600;
    this.faceMovement(this.dodgeDirectionX);
    this.setAlpha(0.72);
    this.playSpriteAction('dodge');
    [0, 55, 110, 165].forEach(delay => this.spawnDodgeAfterimage(delay));
    this.spawnFootstepDust();
    SoundManager.playDodgeSwoosh();
    this.scene.time.delayedCall(250, () => {
      if (!this.active) return;
      this.isDodging = false;
      this.setAlpha(1);
      this.resetMovementPose();
    });
  }

  public triggerWitchTime(): void {
    this.isWitchTimeActive = true;
    this.witchTimeRemaining = 4000;
    this.setTint(0x00ffff);
    SoundManager.playWitchTimeActivate();
  }

  public takeDamage(_amount: number): void {
    if (this.isSpawnProtected()) return;
    if (this.isDodging) {
      this.triggerWitchTime();
      return;
    }
    if (this.isShadowActive) return;
    if (this.shieldCharges > 0) {
      this.shieldCharges--;
      this.spawnSpecialRing(0xf5cf5b);
      return;
    }
    this.chargeStartedAt = null;
    this.hp = Math.max(0, this.hp - 1);
    this.playSpriteAction('hurt');
    this.setTint(0xff0000);
    this.scene.cameras.main.shake(90, 0.003);
    this.scene.tweens.add({ targets: this, alpha: 0.35, duration: 60, yoyo: true, repeat: 1 });
    this.scene.time.delayedCall(150, () => {
      if (!this.isWitchTimeActive) this.clearTint();
    });
  }

  public heal(amount: number): void {
    const hearts = Math.max(1, Math.ceil(amount / 20));
    this.hp = Math.min(this.maxHp, this.hp + hearts);
  }
  public addMagic(amount: number): void { this.magic = Math.min(this.maxMagic, this.magic + amount); }
  public addHalos(amount: number): void {
    this.halos += amount;
    SoundManager.playHaloPickup();
  }
}
