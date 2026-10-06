import { HEART_DROP_CHANCE, shouldDropHeart } from '../utils/LootRules';

describe('regras de drop de coração', () => {
  test('usa chance de vinte e cinco por cento', () => {
    expect(HEART_DROP_CHANCE).toBe(0.25);
  });

  test('aceita valores abaixo do limite e rejeita o limite', () => {
    expect(shouldDropHeart(0)).toBe(true);
    expect(shouldDropHeart(0.249999)).toBe(true);
    expect(shouldDropHeart(0.25)).toBe(false);
    expect(shouldDropHeart(0.9)).toBe(false);
  });

  test('rejeita valores aleatórios inválidos', () => {
    expect(shouldDropHeart(Number.NaN)).toBe(false);
    expect(shouldDropHeart(Number.POSITIVE_INFINITY)).toBe(false);
    expect(shouldDropHeart(-0.1)).toBe(false);
  });
});
