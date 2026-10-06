import {
  ExperienceCurve,
  GeneratedContentDirector,
  GENERATED_PROGRESSION_NODE_COUNT,
  GENERATED_PROGRESSION_NODES,
  MemoryProgressionStorage,
  ProgressionService,
  createProgressionState,
} from '../progression';

describe('progressão persistente', () => {
  test('curva de experiência cresce e resolve o nível inversamente', () => {
    const curve = new ExperienceCurve(100);
    expect(curve.totalForLevel(1)).toBe(0);
    expect(curve.requirementForLevel(10)).toBeGreaterThan(curve.requirementForLevel(2));
    for (const level of [1, 2, 5, 10, 25, 50, 99]) {
      expect(curve.levelForTotalExperience(curve.totalForLevel(level))).toBe(level);
      expect(curve.progress(curve.totalForLevel(level)).level).toBe(level);
    }
  });

  test('abates concedem XP, moeda, maestria e níveis', () => {
    const storage = new MemoryProgressionStorage();
    const service = new ProgressionService({ storage, now: () => 1000 });
    const update = service.recordEnemyDefeat({
      role: 'boss',
      enemyType: 'fortitudo',
      maximumHealth: 1600,
      difficulty: 10,
    });
    const snapshot = service.snapshot();
    expect(update.experienceAwarded).toBeGreaterThan(100);
    expect(update.currencyAwarded).toBeGreaterThan(0);
    expect(snapshot.counters.totalKills).toBe(1);
    expect(snapshot.counters.bossKills).toBe(1);
    expect(snapshot.mastery.boss).toBeGreaterThan(0);
    expect(snapshot.level).toBeGreaterThan(1);
    expect(storage.load()).toEqual(snapshot);
  });

  test('conclusão de fase libera capítulo e conteúdo', () => {
    const service = new ProgressionService({ storage: new MemoryProgressionStorage() });
    const update = service.recordStageCompleted({
      stageId: 'cathedral',
      difficulty: 4,
      elapsedSeconds: 80,
      parSeconds: 100,
    });
    const snapshot = service.snapshot();
    expect(update.experienceAwarded).toBeGreaterThan(0);
    expect(snapshot.counters.stagesCompleted).toBe(1);
    expect(snapshot.chapter).toBe(2);
    expect(snapshot.unlockedContent).toContain('stage-cathedral');
    expect(snapshot.unlockedContent).toContain('chapter-2');
  });

  test('snapshots são cópias defensivas', () => {
    const service = new ProgressionService({ storage: new MemoryProgressionStorage() });
    const snapshot = service.snapshot();
    snapshot.currency = 999999;
    snapshot.modifiers.damageMultiplier = 99;
    snapshot.unlockedContent.push('invalid');
    expect(service.snapshot().currency).toBe(0);
    expect(service.snapshot().modifiers.damageMultiplier).toBe(1);
    expect(service.snapshot().unlockedContent).not.toContain('invalid');
  });

  test('storage de memória também devolve cópias defensivas', () => {
    const original = createProgressionState(10);
    const storage = new MemoryProgressionStorage(original);
    const loaded = storage.load()!;
    loaded.level = 50;
    loaded.counters.totalKills = 1000;
    expect(storage.load()!.level).toBe(1);
    expect(storage.load()!.counters.totalKills).toBe(0);
  });
});

describe('conteúdo de progressão gerado', () => {
  test('registra 210 nós únicos', () => {
    expect(GENERATED_PROGRESSION_NODE_COUNT).toBe(210);
    expect(GENERATED_PROGRESSION_NODES).toHaveLength(210);
    expect(new Set(GENERATED_PROGRESSION_NODES.map((node) => node.id)).size).toBe(210);
  });

  test('catálogo distribui nós entre as seis disciplinas', () => {
    const director = new GeneratedContentDirector();
    expect(director.forDiscipline('combat')).toHaveLength(35);
    expect(director.forDiscipline('mobility')).toHaveLength(35);
    expect(director.forDiscipline('defense')).toHaveLength(35);
    expect(director.forDiscipline('arcane')).toHaveLength(35);
    expect(director.forDiscipline('economy')).toHaveLength(35);
    expect(director.forDiscipline('exploration')).toHaveLength(35);
  });

  test('todos os nós produzem previews válidos', () => {
    const snapshot = createProgressionState();
    for (const node of GENERATED_PROGRESSION_NODES) {
      const preview = node.preview(snapshot);
      expect(preview.id).toBe(node.id);
      expect(preview.cost).toBeGreaterThanOrEqual(0);
      expect(preview.maximumRank).toBeGreaterThan(0);
      expect(preview.requirement.progress).toBeGreaterThanOrEqual(0);
      expect(preview.requirement.progress).toBeLessThanOrEqual(1);
      expect(preview.reward.unlocks?.length).toBeGreaterThan(0);
    }
  });

  test('desbloqueio consome pontos e aplica modificador e conteúdo', () => {
    const state = createProgressionState();
    state.skillPoints = 10;
    const director = new GeneratedContentDirector();
    const beforeDamage = state.modifiers.damageMultiplier;
    const reward = director.unlock(state, 'progression-node-0001');
    expect(state.skillPoints).toBeLessThan(10);
    expect(state.unlockedNodes['progression-node-0001']).toBe(1);
    expect(state.modifiers.damageMultiplier).toBeGreaterThan(beforeDamage);
    expect(state.unlockedContent).toEqual(expect.arrayContaining(reward.unlocks!));
  });

  test('diretor recomenda conteúdo elegível de forma determinística', () => {
    const state = createProgressionState();
    state.skillPoints = 20;
    const director = new GeneratedContentDirector();
    expect(director.recommend(state, 'combat')).toEqual(director.recommend(state, 'combat'));
    expect(director.upcoming(state, 5)).toHaveLength(5);
  });
});
