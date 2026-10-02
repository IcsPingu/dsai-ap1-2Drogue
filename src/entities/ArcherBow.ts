import type Phaser from 'phaser';
import { drawArcherBow, getArcherBodyTextureKey } from '../utils/ArcherAimTextures';

export class ArcherBow {
  public readonly bodyKey: string;
  private readonly image: Phaser.GameObjects.Image;
  private readonly texture: Phaser.Textures.CanvasTexture;
  private readonly textureKey: string;
  private aimAngle = 0;
  private charge = 0;
  private releasing = false;
  private visible = false;

  constructor(private readonly scene: Phaser.Scene, sourceKey: string) {
    this.bodyKey = getArcherBodyTextureKey(sourceKey);
    this.textureKey = `${sourceKey}_articulated_bow`;
    const texture = scene.textures.createCanvas(this.textureKey, 128, 114);
    if (!texture) throw new Error(`Unable to create bow texture: ${this.textureKey}`);
    this.texture = texture;
    this.image = scene.add.image(0, 0, this.textureKey).setDepth(11).setVisible(false);
  }

  public setPose(frame: number, aimAngle: number, charge = frame === 1 ? 1 : 0): void {
    this.aimAngle = aimAngle;
    this.charge = charge;
    this.releasing = frame === 2;
    this.visible = true;
    this.image.setVisible(true);
  }

  public sync(x: number, y: number, scaleX: number, scaleY: number, flipX: boolean, alpha: number): void {
    if (!this.visible) return;
    drawArcherBow(this.texture.context, this.aimAngle, this.charge, flipX, this.releasing);
    this.texture.refresh();
    // Geometry already contains the aiming angle. Never rotate or mirror the whole layer.
    const scale = Math.min(scaleX, scaleY);
    this.image.setPosition(x, y).setScale(scale, scale).setAlpha(alpha);
  }

  public hide(): void { this.visible = false; this.image.setVisible(false); }
  public destroy(): void {
    this.image.destroy();
    this.scene.textures.remove(this.textureKey);
  }
}
