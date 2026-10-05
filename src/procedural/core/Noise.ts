import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';

export interface NoiseOptions {
  octaves: number;
  frequency: number;
  amplitude: number;
  lacunarity: number;
  persistence: number;
}

export class NoiseField {
  private readonly permutation: number[];

  public constructor(seed: string | number) {
    const random = new DeterministicRandom(seed);
    const source = Array.from({ length: 256 }, (_, index) => index);
    this.permutation = [...random.shuffle(source), ...random.shuffle(source)];
  }

  public value(x: number, y: number): number {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = this.fade(x - x0);
    const ty = this.fade(y - y0);
    const a = this.hashValue(x0, y0);
    const b = this.hashValue(x0 + 1, y0);
    const c = this.hashValue(x0, y0 + 1);
    const d = this.hashValue(x0 + 1, y0 + 1);
    return this.lerp(this.lerp(a, b, tx), this.lerp(c, d, tx), ty);
  }

  public perlin(x: number, y: number): number {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = x - x0;
    const ty = y - y0;
    const u = this.fade(tx);
    const v = this.fade(ty);
    const aa = this.gradient(this.hash(x0, y0), tx, ty);
    const ba = this.gradient(this.hash(x0 + 1, y0), tx - 1, ty);
    const ab = this.gradient(this.hash(x0, y0 + 1), tx, ty - 1);
    const bb = this.gradient(this.hash(x0 + 1, y0 + 1), tx - 1, ty - 1);
    return this.lerp(this.lerp(aa, ba, u), this.lerp(ab, bb, u), v) * 0.5 + 0.5;
  }

  public fractal(x: number, y: number, options: Partial<NoiseOptions> = {}): number {
    const settings: NoiseOptions = {
      octaves: options.octaves ?? 4,
      frequency: options.frequency ?? 0.04,
      amplitude: options.amplitude ?? 1,
      lacunarity: options.lacunarity ?? 2,
      persistence: options.persistence ?? 0.5,
    };
    let frequency = settings.frequency;
    let amplitude = settings.amplitude;
    let total = 0;
    let normalizer = 0;
    for (let octave = 0; octave < settings.octaves; octave++) {
      total += this.perlin(x * frequency, y * frequency) * amplitude;
      normalizer += amplitude;
      frequency *= settings.lacunarity;
      amplitude *= settings.persistence;
    }
    return normalizer === 0 ? 0 : total / normalizer;
  }

  public ridged(x: number, y: number, options: Partial<NoiseOptions> = {}): number {
    const base = this.fractal(x, y, options);
    return 1 - Math.abs(base * 2 - 1);
  }

  public billow(x: number, y: number, options: Partial<NoiseOptions> = {}): number {
    const base = this.fractal(x, y, options);
    return Math.abs(base * 2 - 1);
  }

  public domainWarp(x: number, y: number, strength = 8, frequency = 0.03): number {
    const offsetX = this.fractal(x + 31.7, y - 18.2, { frequency });
    const offsetY = this.fractal(x - 12.9, y + 47.1, { frequency });
    return this.fractal(x + (offsetX - 0.5) * strength, y + (offsetY - 0.5) * strength, { frequency });
  }

  public turbulence(x: number, y: number, octaves = 5): number {
    let value = 0;
    let size = 1;
    let weight = 1;
    let totalWeight = 0;
    for (let octave = 0; octave < octaves; octave++) {
      value += Math.abs(this.perlin(x / size, y / size) * 2 - 1) * weight;
      totalWeight += weight;
      size *= 0.5;
      weight *= 0.5;
    }
    return value / totalWeight;
  }

  public curl(x: number, y: number, epsilon = 0.01): { x: number; y: number } {
    const dy = (this.perlin(x, y + epsilon) - this.perlin(x, y - epsilon)) / (epsilon * 2);
    const dx = (this.perlin(x + epsilon, y) - this.perlin(x - epsilon, y)) / (epsilon * 2);
    return { x: dy, y: -dx };
  }

  private hash(x: number, y: number): number {
    return this.permutation[(this.permutation[x & 255] + y) & 255];
  }

  private hashValue(x: number, y: number): number {
    return this.hash(x, y) / 255;
  }

  private gradient(hash: number, x: number, y: number): number {
    switch (hash & 7) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      case 3: return -x - y;
      case 4: return x;
      case 5: return -x;
      case 6: return y;
      default: return -y;
    }
  }

  private fade(value: number): number {
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  private lerp(left: number, right: number, amount: number): number {
    return left + (right - left) * amount;
  }
}
