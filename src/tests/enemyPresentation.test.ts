import {
  ENEMY_PRESENTATIONS,
  IMPLEMENTED_ENEMY_IDS,
  getEnemyPresentation,
} from '../data/EnemyPresentation';

describe('apresentação dos monstros implementados', () => {
  test('cataloga somente os três monstros disponíveis', () => {
    expect(IMPLEMENTED_ENEMY_IDS).toEqual(['affinity', 'applaud', 'fortitudo']);
  });

  test('usa nomes, títulos e descrições em português', () => {
    expect(ENEMY_PRESENTATIONS.affinity.name).toBe('Afinidade');
    expect(ENEMY_PRESENTATIONS.applaud.name).toBe('Aplauso');
    IMPLEMENTED_ENEMY_IDS.forEach(id => {
      const enemy = getEnemyPresentation(id);
      expect(enemy?.title.length).toBeGreaterThan(5);
      expect(enemy?.description.length).toBeGreaterThan(20);
      expect(enemy?.lore.length).toBeGreaterThan(20);
    });
  });

  test('atribui uma cor exclusiva a cada espécie', () => {
    const colors = IMPLEMENTED_ENEMY_IDS.map(id => ENEMY_PRESENTATIONS[id].tint);
    expect(new Set(colors).size).toBe(IMPLEMENTED_ENEMY_IDS.length);
  });

  test('não inventa apresentação para monstro sem implementação', () => {
    expect(getEnemyPresentation('joy')).toBeUndefined();
  });
});
