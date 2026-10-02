import type Phaser from 'phaser';
import { createArcherAimTextures, getArcherBowTransform } from '../utils/ArcherAimTextures';

export class ArcherBow {
  public readonly bodyKey: string;
  private readonly image: Phaser.GameObjects.Image;
  private aimAngle = 0;

  constructor(scene: Phaser.Scene, sourceKey: string) {
    const textures = createArcherAimTextures(scene, sourceKey);
    this.bodyKey = textures.bodyKey;
    this.image = scene.add.image(0, 0, textures.bowKey, 0).setDepth(11).setVisible(false);
  }

  public setPose(frame: number, aimAngle: number): void {
    this.aimAngle = aimAngle;
    this.image.setFrame(frame).setVisible(true);
  }

  public sync(x: number, y: number, scaleX: number, scaleY: number, flipX: boolean, alpha: number): void {
    const transform = getArcherBowTransform(x, y, scaleX, scaleY, this.aimAngle, flipX);
    this.image.setPosition(transform.x, transform.y).setScale(scaleX, scaleY)
      .setFlipX(flipX).setRotation(transform.rotation).setAlpha(alpha);
  }

  public hide(): void { this.image.setVisible(false); }
  public destroy(): void { this.image.destroy(); }
}
