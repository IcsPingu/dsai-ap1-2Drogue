import {
  AStarPathfinder,
  BinaryHeap,
  EnemyBrain,
  NavigationAgent,
  NavigationGrid,
  NavigationService,
  PathCache,
  separation,
} from '../ai';

describe('navegação da IA', () => {
  const map = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  test('heap mínimo preserva prioridade e estabilidade', () => {
    const heap = new BinaryHeap<string>();
    heap.push('third', 3);
    heap.push('first-a', 1);
    heap.push('second', 2);
    heap.push('first-b', 1);
    expect([heap.pop(), heap.pop(), heap.pop(), heap.pop()]).toEqual([
      'first-a',
      'first-b',
      'second',
      'third',
    ]);
  });

  test('A* contorna paredes e chega ao destino', () => {
    const grid = new NavigationGrid(map, 32);
    const result = new AStarPathfinder(grid).find(
      { x: 1, y: 1 },
      { x: 5, y: 1 },
      { smooth: false },
    );
    expect(result.reachedGoal).toBe(true);
    expect(result.cells[0]).toEqual({ x: 1, y: 1 });
    expect(result.cells.at(-1)).toEqual({ x: 5, y: 1 });
    expect(result.cells).toContainEqual({ x: 3, y: 3 });
    expect(result.cells.every((cell) => grid.isWalkable(cell))).toBe(true);
  });

  test('movimento diagonal não atravessa quina fechada', () => {
    const grid = new NavigationGrid([
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ]);
    expect(grid.neighbors({ x: 0, y: 0 }, true, true)).toEqual([]);
    expect(grid.hasLineOfSight({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe(false);
  });

  test('suavização remove pontos redundantes sem cruzar obstáculos', () => {
    const grid = new NavigationGrid(map, 32);
    const raw = new AStarPathfinder(grid).find(
      { x: 1, y: 1 },
      { x: 5, y: 1 },
      { smooth: false },
    ).cells;
    const smooth = grid.smoothPath(raw);
    expect(smooth.length).toBeLessThan(raw.length);
    expect(grid.pathIsValid(smooth)).toBe(true);
  });

  test('lava é evitada quando existe rota segura barata', () => {
    const grid = new NavigationGrid([
      [1, 1, 1, 1, 1],
      [1, 0, 4, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ]);
    const result = new AStarPathfinder(grid).find(
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { smooth: false },
    );
    expect(result.cells).not.toContainEqual({ x: 2, y: 1 });
    expect(result.cost).toBeLessThan(7);
  });

  test('serviço converte coordenadas e reaproveita caminhos em cache', () => {
    const service = new NavigationService(map, { tileSize: 32 });
    const start = { x: 48, y: 48 };
    const goal = { x: 176, y: 48 };
    const first = service.findPath(start, goal);
    const second = service.findPath(start, goal);
    expect(first.reachedGoal).toBe(true);
    expect(second).toEqual(first);
    expect(service.diagnostics()).toMatchObject({ searches: 1, cacheHits: 1, cacheSize: 1 });
  });

  test('cache devolve cópias e remove a entrada menos recente', () => {
    const cache = new PathCache(2);
    cache.set('a', { points: [{ x: 1, y: 1 }], reachedGoal: true, visited: 1, cost: 0 });
    cache.set('b', { points: [{ x: 2, y: 2 }], reachedGoal: true, visited: 1, cost: 0 });
    const copy = cache.get('a')!;
    copy.points[0].x = 999;
    cache.set('c', { points: [{ x: 3, y: 3 }], reachedGoal: true, visited: 1, cost: 0 });
    expect(cache.get('a')!.points[0].x).toBe(1);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('c')).toBeDefined();
  });

  test('agente segue waypoints e chega sem oscilar', () => {
    const service = new NavigationService([
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ]);
    const agent = new NavigationAgent(service, { goalTolerance: 5, waypointTolerance: 5 });
    const moving = agent.step({ x: 48, y: 48 }, { x: 112, y: 48 }, 80, 16);
    expect(moving.velocity.x).toBeGreaterThan(0);
    expect(Math.abs(moving.velocity.y)).toBeLessThan(0.001);
    const arrived = agent.step({ x: 110, y: 48 }, { x: 112, y: 48 }, 80, 16);
    expect(arrived.reachedGoal).toBe(true);
    expect(arrived.velocity).toEqual({ x: 0, y: 0 });
  });

  test('separação afasta inimigos próximos', () => {
    const force = separation(
      { x: 0, y: 0 },
      [{ x: 10, y: 0 }, { x: 0, y: 12 }],
      40,
    );
    expect(force.x).toBeLessThan(0);
    expect(force.y).toBeLessThan(0);
    expect(Math.hypot(force.x, force.y)).toBeLessThanOrEqual(1);
  });
});

describe('cérebro de inimigos', () => {
  test('detecta, alerta, persegue e entra em alcance de combate', () => {
    const brain = new EnemyBrain('melee', { x: 0, y: 0 });
    let decision = brain.update({
      self: { x: 0, y: 0 },
      target: { x: 300, y: 0 },
      delta: 16,
      targetVisible: true,
      targetAudible: false,
      distanceToTarget: 300,
    });
    expect(decision.state).toBe('alert');

    decision = brain.update({
      self: { x: 0, y: 0 },
      target: { x: 300, y: 0 },
      delta: 200,
      targetVisible: true,
      targetAudible: false,
      distanceToTarget: 300,
    });
    expect(decision.state).toBe('chase');
    expect(decision.moveTarget).toEqual({ x: 300, y: 0 });

    decision = brain.update({
      self: { x: 220, y: 0 },
      target: { x: 300, y: 0 },
      delta: 16,
      targetVisible: true,
      targetAudible: true,
      distanceToTarget: 80,
    });
    expect(decision.state).toBe('engage');
    expect(decision.wantsAttack).toBe(true);
  });

  test('investiga a última posição após perder visão', () => {
    const brain = new EnemyBrain('melee', { x: 0, y: 0 });
    brain.update({
      self: { x: 0, y: 0 }, target: { x: 200, y: 0 }, delta: 200,
      targetVisible: true, targetAudible: true, distanceToTarget: 200,
    });
    for (let index = 0; index < 3; index++) {
      brain.update({
        self: { x: 20, y: 0 }, target: { x: 500, y: 0 }, delta: 250,
        targetVisible: false, targetAudible: false, distanceToTarget: 480,
      });
    }
    const decision = brain.update({
      self: { x: 20, y: 0 }, target: { x: 500, y: 0 }, delta: 16,
      targetVisible: false, targetAudible: false, distanceToTarget: 480,
    });
    expect(decision.state).toBe('investigate');
    expect(decision.moveTarget).toEqual({ x: 200, y: 0 });
  });

  test('arqueiro recua quando o alvo invade sua distância mínima', () => {
    const brain = new EnemyBrain('ranged', { x: 0, y: 0 });
    brain.update({
      self: { x: 0, y: 0 }, target: { x: 80, y: 0 }, delta: 300,
      targetVisible: true, targetAudible: true, distanceToTarget: 80,
    });
    const decision = brain.update({
      self: { x: 0, y: 0 }, target: { x: 80, y: 0 }, delta: 300,
      targetVisible: true, targetAudible: true, distanceToTarget: 80,
    });
    expect(decision.state).toBe('engage');
    expect(decision.wantsRetreat).toBe(true);
  });

  test('sem estímulo executa rota de patrulha', () => {
    const brain = new EnemyBrain('melee', { x: 0, y: 0 }, [{ x: 0, y: 0 }, { x: 100, y: 0 }]);
    const first = brain.update({
      self: { x: 0, y: 0 }, target: { x: 1000, y: 1000 }, delta: 600,
      targetVisible: false, targetAudible: false, distanceToTarget: 1400,
    });
    expect(first.state).toBe('patrol');
    expect(first.moveTarget).toEqual({ x: 100, y: 0 });
  });
});
