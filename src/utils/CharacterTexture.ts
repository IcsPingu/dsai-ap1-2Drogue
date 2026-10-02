import Phaser from 'phaser';
import {
  CharacterAppearance,
  EYE_COLORS,
  HAIR_COLORS,
  OUTFIT_COLORS,
  SHOE_COLORS,
  SKIN_COLORS,
} from '../data/PlayerProfile';
import { getPlayerClass } from '../data/ClassDatabase';

export function getCharacterTextureKey(appearance: CharacterAppearance): string {
  return `class_${appearance.classId}_${appearance.gender}`;
}

export function getCharacterAnimationKey(appearance: CharacterAppearance): string {
  return `anim_${appearance.classId}_${appearance.gender}`;
}

function recolorPixel(data: Uint8ClampedArray, index: number, color: number, strength: number): void {
  const targetR = (color >> 16) & 0xff;
  const targetG = (color >> 8) & 0xff;
  const targetB = color & 0xff;
  const light = Math.max(data[index], data[index + 1], data[index + 2]) / 255;
  const shade = 0.28 + light * 0.92;
  data[index] = Phaser.Math.Clamp(Phaser.Math.Linear(data[index], targetR * shade, strength), 0, 255);
  data[index + 1] = Phaser.Math.Clamp(Phaser.Math.Linear(data[index + 1], targetG * shade, strength), 0, 255);
  data[index + 2] = Phaser.Math.Clamp(Phaser.Math.Linear(data[index + 2], targetB * shade, strength), 0, 255);
}

export function generateDetailedCharacterTexture(
  scene: Phaser.Scene,
  appearance: CharacterAppearance,
  key: string,
): string {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const sourceKey = getCharacterTextureKey(appearance);
  const source = scene.textures.get(sourceKey).getSourceImage() as CanvasImageSource;
  const texture = scene.textures.createCanvas(key, 384, 384);
  if (!texture) return sourceKey;
  const context = texture.context;
  context.clearRect(0, 0, 384, 384);
  context.drawImage(source, 0, 0, 384, 384);

  const image = context.getImageData(0, 0, 384, 384);
  const data = image.data;
  const skinColor = SKIN_COLORS[appearance.skin % SKIN_COLORS.length];
  const hairColor = HAIR_COLORS[appearance.hair % HAIR_COLORS.length];
  const eyeColor = EYE_COLORS[appearance.eyes % EYE_COLORS.length];
  const outfitColor = OUTFIT_COLORS[appearance.outfit % OUTFIT_COLORS.length];
  const shoeColor = SHOE_COLORS[appearance.shoes % SHOE_COLORS.length];

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 20) continue;
    const pixel = index / 4;
    const x = pixel % 384;
    const y = Math.floor(pixel / 384);
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];

    const faceRegion = x > 105 && x < 290 && y > 70 && y < 205;
    const skinPixel = faceRegion && red > 155 && green > 85 && blue > 58
      && red > green && green > blue * 0.82 && red - blue < 125;
    if (skinPixel) {
      recolorPixel(data, index, skinColor, 0.62);
      continue;
    }

    const colorfulEyePixel = faceRegion && y > 105 && y < 175
      && Math.max(red, green, blue) - Math.min(red, green, blue) > 55
      && Math.max(red, green, blue) < 235;
    if (colorfulEyePixel && !skinPixel) {
      recolorPixel(data, index, eyeColor, 0.55);
    }

    const brownHair = y < 210 && x > 65 && x < 320 && red > green * 1.08 && green > blue * 1.12 && red > 55;
    if (brownHair) {
      recolorPixel(data, index, hairColor, 0.62);
      continue;
    }

    const isClassFabric = appearance.classId === 'knight'
      ? blue > red * 1.12 && blue > green * 1.08
      : appearance.classId === 'mage'
        ? blue > green * 1.18 && red > green * 1.02
        : appearance.classId === 'ranger'
          ? green > red * 0.82 && green > blue * 1.12
          : (blue > green * 1.12 && blue > red * 0.9) || (red > green * 1.25 && red > blue * 1.05);
    if (isClassFabric) {
      recolorPixel(data, index, outfitColor, 0.42);
      continue;
    }

    const leatherBoot = y > 285 && red > green * 1.08 && green > blue * 1.08;
    if (leatherBoot) recolorPixel(data, index, shoeColor, 0.7);
  }

  context.putImageData(image, 0, 0);
  texture.refresh();
  return key;
}

export function generateCharacterTexture(
  scene: Phaser.Scene,
  appearance: CharacterAppearance,
  key: string,
): string {
  if (scene.textures.exists(key)) scene.textures.remove(key);

  const g = scene.make.graphics({ x: 0, y: 0 });
  const skin = SKIN_COLORS[appearance.skin % SKIN_COLORS.length];
  const hair = HAIR_COLORS[appearance.hair % HAIR_COLORS.length];
  const eyes = EYE_COLORS[appearance.eyes % EYE_COLORS.length];
  const outfit = OUTFIT_COLORS[appearance.outfit % OUTFIT_COLORS.length];
  const shoes = SHOE_COLORS[appearance.shoes % SHOE_COLORS.length];
  const heroClass = getPlayerClass(appearance.classId);

  g.fillStyle(0x000000, 0.22);
  g.fillEllipse(24, 58, 30, 8);
  g.fillStyle(shoes, 1);
  g.fillRect(11, 51, 12, 8);
  g.fillRect(27, 51, 12, 8);
  g.fillStyle(outfit, 1);
  g.fillRoundedRect(10, 30, 30, 25, 5);
  g.fillStyle(skin, 1);
  g.fillRect(5, 33, 7, 17);
  g.fillRect(38, 33, 7, 17);
  g.fillCircle(25, 22, appearance.gender === 'woman' ? 15 : 14);
  g.fillStyle(hair, 1);
  if (appearance.gender === 'woman') {
    g.fillRoundedRect(9, 6, 32, 20, 9);
    g.fillRect(8, 16, 7, 24);
    g.fillRect(35, 16, 7, 24);
  } else {
    g.fillRoundedRect(10, 6, 30, 14, 7);
    g.fillTriangle(10, 12, 15, 2, 20, 12);
    g.fillTriangle(22, 10, 29, 1, 32, 12);
  }
  g.fillStyle(skin, 1);
  g.fillRoundedRect(13, 14, 24, 19, 7);
  g.fillStyle(eyes, 1);
  g.fillRect(17, 21, 5, 5);
  g.fillRect(29, 21, 5, 5);
  g.fillStyle(0xffffff, 1);
  g.fillRect(18, 21, 2, 2);
  g.fillRect(30, 21, 2, 2);
  g.fillStyle(0x7a3d35, 1);
  g.fillRect(23, 28, 6, 2);
  g.fillStyle(0xf4c542, 1);
  g.fillRect(23, 35, 4, 13);

  // Class equipment is deliberately oversized so the role is readable at game scale.
  g.fillStyle(heroClass.accentColor, 1);
  g.fillCircle(25, 39, 3);
  if (heroClass.id === 'knight') {
    g.fillStyle(heroClass.color, 1);
    g.fillCircle(5, 40, 9);
    g.lineStyle(2, heroClass.accentColor, 1);
    g.strokeCircle(5, 40, 7);
    g.fillStyle(0xdfe8ef, 1);
    g.fillRect(43, 25, 3, 25);
    g.fillTriangle(41, 25, 47, 25, 44, 18);
  } else if (heroClass.id === 'mage') {
    g.fillStyle(0x5c3a78, 1);
    g.fillTriangle(7, 13, 25, 0, 42, 13);
    g.fillStyle(0x5d3821, 1);
    g.fillRect(43, 20, 3, 34);
    g.fillStyle(heroClass.accentColor, 1);
    g.fillCircle(44, 17, 6);
  } else if (heroClass.id === 'ranger') {
    g.lineStyle(3, 0x8b5a2b, 1);
    g.strokeCircle(43, 38, 11);
    g.lineStyle(1, 0xf0e1b5, 1);
    g.lineBetween(43, 27, 43, 49);
    g.fillStyle(heroClass.accentColor, 1);
    g.fillTriangle(7, 31, 12, 35, 7, 39);
  } else {
    g.fillStyle(heroClass.accentColor, 1);
    g.fillTriangle(3, 28, 10, 34, 4, 47);
    g.fillTriangle(47, 28, 40, 34, 46, 47);
    g.fillStyle(0x171526, 1);
    g.fillRect(13, 12, 24, 5);
  }

  g.generateTexture(key, 50, 64);
  g.destroy();
  return key;
}
