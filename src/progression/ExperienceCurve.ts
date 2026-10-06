export interface LevelProgress {
  level: number;
  current: number;
  required: number;
  ratio: number;
  totalForCurrent: number;
  totalForNext: number;
}

/** Smooth level curve with fast inverse lookup and bounded endgame growth. */
export class ExperienceCurve {
  private readonly thresholds: number[] = [0, 0];

  public constructor(
    public readonly maximumLevel = 100,
    private readonly baseRequirement = 80,
    private readonly exponent = 1.48,
    private readonly linearGrowth = 18,
  ) {
    if (!Number.isSafeInteger(maximumLevel) || maximumLevel < 2) throw new RangeError('maximum level must be at least 2');
    for (let level = 2; level <= maximumLevel + 1; level++) {
      const previous = this.thresholds[level - 1] ?? 0;
      this.thresholds[level] = previous + this.requirementForLevel(level - 1);
    }
  }

  public requirementForLevel(level: number): number {
    if (level >= this.maximumLevel) return 0;
    const normalized = Math.max(1, Math.floor(level));
    return Math.max(1, Math.round(this.baseRequirement * normalized ** this.exponent + this.linearGrowth * normalized));
  }

  public totalForLevel(level: number): number {
    const safe = Math.max(1, Math.min(this.maximumLevel + 1, Math.floor(level)));
    return this.thresholds[safe] ?? this.thresholds[this.thresholds.length - 1];
  }

  public levelForTotalExperience(total: number): number {
    const value = Math.max(0, Math.floor(total));
    let low = 1;
    let high = this.maximumLevel;
    while (low < high) {
      const middle = Math.ceil((low + high) / 2);
      if (this.totalForLevel(middle) <= value) low = middle;
      else high = middle - 1;
    }
    return low;
  }

  public progress(total: number): LevelProgress {
    const level = this.levelForTotalExperience(total);
    const currentThreshold = this.totalForLevel(level);
    if (level >= this.maximumLevel) {
      return {
        level,
        current: 0,
        required: 0,
        ratio: 1,
        totalForCurrent: currentThreshold,
        totalForNext: currentThreshold,
      };
    }
    const nextThreshold = this.totalForLevel(level + 1);
    const current = Math.max(0, Math.floor(total) - currentThreshold);
    const required = Math.max(1, nextThreshold - currentThreshold);
    return {
      level,
      current,
      required,
      ratio: Math.max(0, Math.min(1, current / required)),
      totalForCurrent: currentThreshold,
      totalForNext: nextThreshold,
    };
  }

  public rewardsForLevel(level: number): { skillPoints: number; currency: number } {
    const safe = Math.max(1, Math.min(this.maximumLevel, Math.floor(level)));
    return {
      skillPoints: safe % 5 === 0 ? 2 : 1,
      currency: 75 + safe * 25 + Math.floor(safe / 10) * 100,
    };
  }
}
