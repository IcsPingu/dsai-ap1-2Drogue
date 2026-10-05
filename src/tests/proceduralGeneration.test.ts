import {
  GENERATION_PRESETS,
  GeneratorRegistry,
  Grid,
  LevelDefinitionAdapter,
  MapRepairer,
  MapValidator,
  Pathfinder,
  ProceduralLevelFactory,
  ProceduralPipeline,
  TerrainRuleRegistry,
  TileKind,
  TopologyAnalyzer,
  createDefaultOptions,
  optionsFromPreset,
  tileIsPassable,
} from '../procedural';

describe('geração procedural', () => {
  const registry = new GeneratorRegistry();

  test('registra todas as famílias de algoritmos', () => {
    expect(registry.list()).toEqual([
      'bsp',
      'drunkard-walk',
      'cellular-automata',
      'depth-first-maze',
      'prim-maze',
      'kruskal-maze',
      'eller-maze',
      'room-graph',
      'wave-function-collapse',
      'grammar',
      'voronoi-caves',
      'hybrid',
    ]);
  });

  test('registra cem regras combináveis de terreno, dez por bioma', () => {
    const rules = new TerrainRuleRegistry();
    expect(rules.size).toBe(100);
    expect(rules.forBiome('cathedral')).toHaveLength(10);
    expect(rules.forBiome('inferno')).toHaveLength(10);
    expect(rules.forBiome('void')).toHaveLength(10);
  });

  test.each(registry.list())('%s produz matriz válida e determinística', (algorithm) => {
    const options = { ...createDefaultOptions('seed-test', algorithm), width: 40, height: 25 };
    const first = registry.get(algorithm).generate(options);
    const second = registry.get(algorithm).generate(options);
    expect(first.tiles).toEqual(second.tiles);
    expect(first.width).toBe(40);
    expect(first.height).toBe(25);
    expect(first.tiles).toHaveLength(25);
    expect(first.tiles.every((row) => row.length === 40)).toBe(true);
    expect(first.tiles[first.spawn.y][first.spawn.x]).toBe(TileKind.Spawn);
    expect(first.tiles[first.exit.y][first.exit.x]).toBe(TileKind.Exit);
  });

  test.each(registry.list())('%s preserva bordas sólidas', (algorithm) => {
    const map = registry.get(algorithm).generate(createDefaultOptions('sealed-' + algorithm, algorithm));
    expect(map.tiles[0].every((tile) => tile === TileKind.Wall)).toBe(true);
    expect(map.tiles[map.height - 1].every((tile) => tile === TileKind.Wall)).toBe(true);
    expect(map.tiles.every((row) => row[0] === TileKind.Wall && row[row.length - 1] === TileKind.Wall)).toBe(true);
  });

  test.each(GENERATION_PRESETS.map((preset) => preset.id))('pipeline do preset %s entrega saída jogável', (preset) => {
    const pipeline = new ProceduralPipeline();
    const result = pipeline.generate(optionsFromPreset(preset, 'pipeline-' + preset));
    const report = new MapValidator().validate(result.map);
    expect(report.valid).toBe(true);
    expect(report.metrics.mainPathLength).toBeGreaterThan(0);
    expect(result.map.enemies.length).toBeGreaterThan(0);
    expect(result.map.decorations.length).toBeGreaterThan(0);
    expect(Number(result.map.metadata.terrainRuleCount)).toBeGreaterThanOrEqual(2);
  });

  test('sementes diferentes alteram a topologia', () => {
    const generator = registry.get('bsp');
    const first = generator.generate(createDefaultOptions('alpha', 'bsp'));
    const second = generator.generate(createDefaultOptions('beta', 'bsp'));
    expect(first.tiles).not.toEqual(second.tiles);
  });

  test('A* prefere piso e encontra rota de custo mínimo', () => {
    const grid = Grid.fromRows([
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
    ]);
    const path = new Pathfinder().aStar(grid, { x: 1, y: 1 }, { x: 3, y: 1 }, (tile) => tile === 0 ? 1 : Infinity);
    expect(path).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
    ]);
  });

  test('reparador conecta início e saída isolados', () => {
    const base = registry.get('bsp').generate(createDefaultOptions('repair', 'bsp'));
    base.tiles = base.tiles.map((row) => row.map(() => TileKind.Wall));
    base.tiles[base.spawn.y][base.spawn.x] = TileKind.Spawn;
    base.tiles[base.exit.y][base.exit.x] = TileKind.Exit;
    const repaired = new MapRepairer().repair(base).map;
    const grid = Grid.fromRows(repaired.tiles);
    const path = new Pathfinder().breadthFirst(grid, repaired.spawn, repaired.exit, tileIsPassable);
    expect(path.length).toBeGreaterThan(0);
  });

  test('analisador distingue caminho linear de área aberta', () => {
    const analyzer = new TopologyAnalyzer();
    const linear = registry.get('depth-first-maze').generate(createDefaultOptions('linear', 'depth-first-maze'));
    const open = registry.get('bsp').generate({ ...createDefaultOptions('open', 'bsp'), roomMinSize: 8, roomMaxSize: 12 });
    const linearMetrics = analyzer.analyze(linear);
    const openMetrics = analyzer.analyze(open);
    expect(linearMetrics.deadEndCount).toBeGreaterThan(0);
    expect(openMetrics.openness).toBeGreaterThan(0.1);
  });

  test('adaptador cria LevelDefinition compatível com o jogo', () => {
    const result = new ProceduralPipeline().generate(optionsFromPreset('cathedral-intro', 'adapter'));
    const level = new LevelDefinitionAdapter().adapt(result.map, { id: 'generated-test', name: 'Teste Gerado' });
    expect(level.id).toBe('generated-test');
    expect(level.name).toBe('Teste Gerado');
    expect(level.theme).toBe('gothic_cathedral');
    expect(level.tileMap).toHaveLength(25);
    expect(level.enemies.length).toBe(result.map.enemies.length);
  });

  test('fábrica monta uma campanha procedural de vários biomas', () => {
    const levels = new ProceduralLevelFactory().createRun('campaign', [
      'cathedral-intro',
      'crypt-crawl',
      'inferno-caverns',
      'void-fracture',
    ]);
    expect(levels.map((level) => level.id)).toEqual([
      'procedural-floor-1',
      'procedural-floor-2',
      'procedural-floor-3',
      'procedural-floor-4',
    ]);
    expect(new Set(levels.map((level) => level.theme)).size).toBe(4);
    expect(levels.map((level) => level.difficulty)).toEqual([1, 2, 3, 4]);
  });
});
