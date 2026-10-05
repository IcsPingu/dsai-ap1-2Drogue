import { JsonObject, JsonValue, cloneJson, hashString } from './types';

export interface RandomSnapshot extends JsonObject {
  stateA: number;
  stateB: number;
  stateC: number;
  stateD: number;
  calls: number;
}

export interface WeightedEntry<T> {
  readonly value: T;
  readonly weight: number;
}

export class DeterministicRandom {
  private stateA: number;
  private stateB: number;
  private stateC: number;
  private stateD: number;
  private calls = 0;

  public constructor(seed: number | string = 1) {
    const numericSeed = typeof seed === 'string' ? hashString(seed) : seed >>> 0;
    this.stateA = this.mix(numericSeed ^ 0x9e3779b9);
    this.stateB = this.mix(numericSeed ^ 0x243f6a88);
    this.stateC = this.mix(numericSeed ^ 0xb7e15162);
    this.stateD = this.mix(numericSeed ^ 0xdeadbeef);
    if ((this.stateA | this.stateB | this.stateC | this.stateD) === 0) {
      this.stateD = 1;
    }
  }

  public nextUint32(): number {
    const result = Math.imul(this.rotateLeft(Math.imul(this.stateB, 5), 7), 9) >>> 0;
    const temporary = (this.stateB << 9) >>> 0;
    this.stateC ^= this.stateA;
    this.stateD ^= this.stateB;
    this.stateB ^= this.stateC;
    this.stateA ^= this.stateD;
    this.stateC ^= temporary;
    this.stateD = this.rotateLeft(this.stateD, 11);
    this.calls++;
    return result;
  }

  public next(): number {
    return this.nextUint32() / 0x100000000;
  }

  public float(minimum = 0, maximum = 1): number {
    this.assertRange(minimum, maximum);
    return minimum + (maximum - minimum) * this.next();
  }

  public integer(minimum: number, maximum: number): number {
    if (!Number.isSafeInteger(minimum) || !Number.isSafeInteger(maximum)) {
      throw new RangeError('integer bounds must be safe integers');
    }
    this.assertRange(minimum, maximum);
    const span = maximum - minimum + 1;
    if (span <= 0 || span > 0x100000000) {
      throw new RangeError('integer range is too large');
    }
    const limit = Math.floor(0x100000000 / span) * span;
    let value: number;
    do {
      value = this.nextUint32();
    } while (value >= limit);
    return minimum + (value % span);
  }

  public boolean(probability = 0.5): boolean {
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
      throw new RangeError('probability must be between zero and one');
    }
    return this.next() < probability;
  }

  public sign(): -1 | 1 {
    return this.boolean() ? 1 : -1;
  }

  public angle(): number {
    return this.float(-Math.PI, Math.PI);
  }

  public normal(mean = 0, deviation = 1): number {
    if (!Number.isFinite(mean) || !Number.isFinite(deviation) || deviation < 0) {
      throw new RangeError('normal distribution parameters are invalid');
    }
    let first = 0;
    let second = 0;
    while (first === 0) first = this.next();
    while (second === 0) second = this.next();
    const magnitude = Math.sqrt(-2 * Math.log(first));
    return mean + magnitude * Math.cos(Math.PI * 2 * second) * deviation;
  }

  public triangular(minimum: number, maximum: number, mode: number): number {
    this.assertRange(minimum, maximum);
    if (mode < minimum || mode > maximum) {
      throw new RangeError('mode must be inside the requested range');
    }
    const sample = this.next();
    const split = (mode - minimum) / (maximum - minimum);
    if (sample < split) {
      return minimum + Math.sqrt(sample * (maximum - minimum) * (mode - minimum));
    }
    return maximum - Math.sqrt((1 - sample) * (maximum - minimum) * (maximum - mode));
  }

  public pick<T>(values: readonly T[]): T {
    if (values.length === 0) {
      throw new RangeError('cannot pick from an empty collection');
    }
    return values[this.integer(0, values.length - 1)];
  }

  public pickOrUndefined<T>(values: readonly T[]): T | undefined {
    return values.length === 0 ? undefined : this.pick(values);
  }

  public weighted<T>(entries: readonly WeightedEntry<T>[]): T {
    if (entries.length === 0) {
      throw new RangeError('weighted selection requires entries');
    }
    let total = 0;
    for (const entry of entries) {
      if (!Number.isFinite(entry.weight) || entry.weight < 0) {
        throw new RangeError('weights must be finite and non-negative');
      }
      total += entry.weight;
    }
    if (total <= 0) {
      throw new RangeError('at least one weight must be positive');
    }
    let cursor = this.float(0, total);
    for (const entry of entries) {
      cursor -= entry.weight;
      if (cursor <= 0) {
        return entry.value;
      }
    }
    return entries[entries.length - 1].value;
  }

  public shuffle<T>(values: readonly T[]): T[] {
    const result = [...values];
    this.shuffleInPlace(result);
    return result;
  }

  public shuffleInPlace<T>(values: T[]): void {
    for (let index = values.length - 1; index > 0; index--) {
      const other = this.integer(0, index);
      const temporary = values[index];
      values[index] = values[other];
      values[other] = temporary;
    }
  }

  public sample<T>(values: readonly T[], count: number): T[] {
    if (!Number.isSafeInteger(count) || count < 0 || count > values.length) {
      throw new RangeError('sample size is invalid');
    }
    return this.shuffle(values).slice(0, count);
  }

  public uuid(): string {
    const parts = [
      this.nextUint32().toString(16).padStart(8, '0'),
      this.nextUint32().toString(16).padStart(8, '0'),
      this.nextUint32().toString(16).padStart(8, '0'),
      this.nextUint32().toString(16).padStart(8, '0'),
    ];
    return parts[0] + '-' + parts[1].slice(0, 4) + '-4' + parts[1].slice(5) +
      '-a' + parts[2].slice(1, 4) + '-' + parts[2].slice(4) + parts[3];
  }

  public fork(label: string): DeterministicRandom {
    const snapshot = this.capture();
    const seed = hashString(label + ':' + snapshot.stateA + ':' + snapshot.calls);
    return new DeterministicRandom(seed);
  }

  public skip(count: number): void {
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError('skip count must be a non-negative integer');
    }
    for (let index = 0; index < count; index++) {
      this.nextUint32();
    }
  }

  public capture(): RandomSnapshot {
    return {
      stateA: this.stateA,
      stateB: this.stateB,
      stateC: this.stateC,
      stateD: this.stateD,
      calls: this.calls,
    };
  }

  public restore(snapshot: RandomSnapshot): void {
    this.stateA = snapshot.stateA >>> 0;
    this.stateB = snapshot.stateB >>> 0;
    this.stateC = snapshot.stateC >>> 0;
    this.stateD = snapshot.stateD >>> 0;
    this.calls = snapshot.calls;
  }

  public clone(): DeterministicRandom {
    const random = new DeterministicRandom(1);
    random.restore(cloneJson(this.capture() as JsonValue) as RandomSnapshot);
    return random;
  }

  private assertRange(minimum: number, maximum: number): void {
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || maximum < minimum) {
      throw new RangeError('range bounds are invalid');
    }
  }

  private rotateLeft(value: number, shift: number): number {
    return ((value << shift) | (value >>> (32 - shift))) >>> 0;
  }

  private mix(value: number): number {
    let mixed = value >>> 0;
    mixed = Math.imul(mixed ^ (mixed >>> 16), 0x21f0aaad);
    mixed = Math.imul(mixed ^ (mixed >>> 15), 0x735a2d97);
    return (mixed ^ (mixed >>> 15)) >>> 0;
  }
}
