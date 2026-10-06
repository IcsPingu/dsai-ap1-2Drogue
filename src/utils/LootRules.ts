export const HEART_DROP_CHANCE = 0.25;

export function shouldDropHeart(randomValue: number): boolean {
  return Number.isFinite(randomValue) && randomValue >= 0 && randomValue < HEART_DROP_CHANCE;
}
