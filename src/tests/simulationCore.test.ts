import {
  ComponentDefinition,
  DeterministicRandom,
  EntityWorld,
  EventBus,
  EventJournal,
  EventQueue,
  FixedStepClock,
  GameSimulationBridge,
  JsonObject,
  PriorityQueue,
  SimulationKernel,
  SnapshotStore,
  TaskScheduler,
  asMilliseconds,
  asTick,
  createDamageAppliedDraft,
  createDamageAppliedPayload,
  createDefaultEventRegistry,
  deserializeDamageAppliedPayload,
  equalDamageAppliedPayload,
  serializeDamageAppliedPayload,
  validateDamageAppliedPayload,
} from '../simulation';

interface PositionComponent extends JsonObject {
  x: number;
  y: number;
}

interface HealthComponent extends JsonObject {
  current: number;
  maximum: number;
}

const positionDefinition: ComponentDefinition<PositionComponent> = {
  key: 'position',
  createDefault: () => ({ x: 0, y: 0 }),
  validate: value => Number.isFinite(value.x) && Number.isFinite(value.y),
};

const healthDefinition: ComponentDefinition<HealthComponent> = {
  key: 'health',
  createDefault: () => ({ current: 5, maximum: 5 }),
  validate: value => (
    Number.isFinite(value.current) &&
    Number.isFinite(value.maximum) &&
    value.maximum > 0 &&
    value.current >= 0 &&
    value.current <= value.maximum
  ),
};

describe('PriorityQueue', () => {
  test('orders by priority and preserves insertion order on ties', () => {
    const queue = new PriorityQueue<string>();
    queue.enqueue('later', 10);
    queue.enqueue('first tie', 2);
    queue.enqueue('second tie', 2);
    queue.enqueue('earliest', 1);

    expect(queue.dequeue()).toBe('earliest');
    expect(queue.dequeue()).toBe('first tie');
    expect(queue.dequeue()).toBe('second tie');
    expect(queue.dequeue()).toBe('later');
    expect(queue.dequeue()).toBeUndefined();
  });

  test('can update and remove queued values', () => {
    const queue = new PriorityQueue<string>();
    queue.enqueue('a', 10);
    queue.enqueue('b', 20);
    queue.enqueue('c', 30);

    expect(queue.updatePriority(value => value === 'c', 1)).toBe(1);
    expect(queue.peek()).toBe('c');
    expect(queue.remove(value => value === 'b')).toBe(1);
    expect(queue.toArray()).toEqual(['c', 'a']);
  });

  test('restores a captured queue without changing its order', () => {
    const queue = new PriorityQueue<number>();
    queue.enqueue(10, 3);
    queue.enqueue(20, 1);
    queue.enqueue(30, 2);
    const snapshot = queue.capture();

    queue.clear();
    queue.restore(snapshot);

    expect(queue.toArray()).toEqual([20, 30, 10]);
  });
});

describe('DeterministicRandom', () => {
  test('produces identical sequences for identical seeds', () => {
    const first = new DeterministicRandom('umbra-trail');
    const second = new DeterministicRandom('umbra-trail');

    const firstSequence = Array.from({ length: 64 }, () => first.nextUint32());
    const secondSequence = Array.from({ length: 64 }, () => second.nextUint32());

    expect(firstSequence).toEqual(secondSequence);
  });

  test('restores the exact next number from a snapshot', () => {
    const random = new DeterministicRandom(91234);
    random.skip(25);
    const snapshot = random.capture();
    const expected = Array.from({ length: 10 }, () => random.next());

    random.restore(snapshot);
    const restored = Array.from({ length: 10 }, () => random.next());

    expect(restored).toEqual(expected);
  });

  test('weighted choice and shuffle remain reproducible', () => {
    const first = new DeterministicRandom(77);
    const second = new DeterministicRandom(77);
    const entries = [
      { value: 'common', weight: 80 },
      { value: 'rare', weight: 18 },
      { value: 'legendary', weight: 2 },
    ];

    expect(first.weighted(entries)).toBe(second.weighted(entries));
    expect(first.shuffle([1, 2, 3, 4, 5, 6])).toEqual(second.shuffle([1, 2, 3, 4, 5, 6]));
  });

  test('forks isolate subsystems without consuming the parent sequence', () => {
    const parent = new DeterministicRandom('root');
    const control = new DeterministicRandom('root');
    const loot = parent.fork('loot');
    const map = parent.fork('map');

    loot.skip(50);
    map.skip(75);

    expect(parent.nextUint32()).toBe(control.nextUint32());
    expect(loot.nextUint32()).not.toBe(map.nextUint32());
  });
});

describe('FixedStepClock', () => {
  test('converts variable frames into deterministic fixed ticks', () => {
    const clock = new FixedStepClock({
      stepMilliseconds: 10,
      maximumSubSteps: 10,
      maximumFrameMilliseconds: 100,
    });

    expect(clock.advance(6).steps).toHaveLength(0);
    expect(clock.advance(6).steps).toHaveLength(1);
    expect(clock.advance(28).steps).toHaveLength(3);
    expect(clock.tick).toBe(4);
    expect(clock.elapsed).toBe(40);
  });

  test('does not advance simulation time while paused', () => {
    const clock = new FixedStepClock({ stepMilliseconds: 16 });
    clock.advance(16);
    clock.pause();
    const paused = clock.advance(160);

    expect(paused.steps).toHaveLength(0);
    expect(clock.tick).toBe(1);
    expect(clock.elapsed).toBe(16);

    clock.resume();
    expect(clock.advance(16).steps).toHaveLength(1);
  });

  test('reports dropped time when the substep safety limit is reached', () => {
    const clock = new FixedStepClock({
      stepMilliseconds: 10,
      maximumSubSteps: 2,
      maximumFrameMilliseconds: 100,
    });

    const frame = clock.advance(85);

    expect(frame.steps).toHaveLength(2);
    expect(frame.droppedMilliseconds).toBe(60);
    expect(clock.accumulator).toBe(5);
  });
});

describe('EventBus', () => {
  function createBus(): EventBus {
    return new EventBus(() => asTick(12), () => asMilliseconds(200));
  }

  test('delivers higher priorities first and honors stopPropagation', () => {
    const bus = createBus();
    const calls: string[] = [];
    bus.subscribe('combat.hit', () => calls.push('low'), { priority: 1 });
    bus.subscribe('combat.hit', (_event, context) => {
      calls.push('high');
      context.stopPropagation();
    }, { priority: 10 });

    const receipt = bus.publish({ type: 'combat.hit', payload: { damage: 3 } });

    expect(calls).toEqual(['high']);
    expect(receipt.delivered).toBe(1);
    expect(receipt.skipped).toBe(1);
  });

  test('supports once, wildcard and filtered subscriptions', () => {
    const bus = createBus();
    let onceCalls = 0;
    let wildcardCalls = 0;
    let filteredCalls = 0;
    bus.once('score.changed', () => onceCalls++);
    bus.subscribe('*', () => wildcardCalls++);
    bus.subscribe('score.changed', () => filteredCalls++, {
      filter: event => (event.payload as { score: number }).score >= 10,
    });

    bus.publish({ type: 'score.changed', payload: { score: 5 } });
    bus.publish({ type: 'score.changed', payload: { score: 15 } });

    expect(onceCalls).toBe(1);
    expect(wildcardCalls).toBe(2);
    expect(filteredCalls).toBe(1);
  });

  test('queues events while paused and flushes them in order', () => {
    const bus = createBus();
    const values: number[] = [];
    bus.subscribe('queued', event => values.push((event.payload as { value: number }).value));
    bus.pause();
    bus.publish({ type: 'queued', payload: { value: 1 } });
    bus.publish({ type: 'queued', payload: { value: 2 } });

    expect(values).toEqual([]);
    expect(bus.metrics().queuedWhilePaused).toBe(2);

    const receipts = bus.resume();
    expect(receipts).toHaveLength(2);
    expect(values).toEqual([1, 2]);
  });

  test('isolates handler failures and continues delivery', () => {
    const bus = createBus();
    let successfulCalls = 0;
    bus.subscribe('unstable', () => {
      throw new Error('expected failure');
    }, { priority: 10 });
    bus.subscribe('unstable', () => successfulCalls++, { priority: 1 });

    const receipt = bus.publish({ type: 'unstable', payload: {} });

    expect(receipt.errors).toHaveLength(1);
    expect(receipt.errors[0].message).toBe('expected failure');
    expect(successfulCalls).toBe(1);
  });
});

describe('Event contracts and registry', () => {
  test('creates, validates and round-trips a combat payload', () => {
    const payload = createDamageAppliedPayload({
      sourceId: 8,
      targetId: 9,
      amount: 17,
      damageType: 'arcane',
      critical: true,
    });

    expect(validateDamageAppliedPayload(payload)).toBe(true);
    const serialized = serializeDamageAppliedPayload(payload);
    const restored = deserializeDamageAppliedPayload(serialized);
    expect(equalDamageAppliedPayload(payload, restored)).toBe(true);
  });

  test('default registry knows every generated event contract', () => {
    const registry = createDefaultEventRegistry();
    const draft = createDamageAppliedDraft(createDamageAppliedPayload({ amount: 4 }));

    expect(registry.types().length).toBeGreaterThanOrEqual(90);
    expect(registry.validateDraft(draft)).toBe(true);
    expect(registry.validateDraft({ type: 'unknown.event', payload: {} })).toBe(false);
  });
});

describe('EventQueue and EventJournal', () => {
  test('releases scheduled events only on or after their due tick', () => {
    const bus = new EventBus(() => asTick(2), () => asMilliseconds(20));
    const queue = new EventQueue();
    const later = bus.create({ type: 'later', payload: { order: 2 } });
    const sooner = bus.create({ type: 'sooner', payload: { order: 1 } });
    queue.schedule(later, asTick(8));
    queue.schedule(sooner, asTick(4));

    expect(queue.drain(asTick(3))).toEqual([]);
    expect(queue.drain(asTick(4)).map(event => event.type)).toEqual(['sooner']);
    expect(queue.drain(asTick(8)).map(event => event.type)).toEqual(['later']);
  });

  test('journals receipts and supports tick and type queries', () => {
    const bus = new EventBus(() => asTick(7), () => asMilliseconds(70));
    const journal = new EventJournal(10);
    bus.observe((event, receipt) => journal.append(event, receipt));
    bus.publish({ type: 'first', payload: { value: 1 } });
    bus.publish({ type: 'second', payload: { value: 2 } });

    expect(journal.size).toBe(2);
    expect(journal.events({ types: ['second'] }).map(event => event.type)).toEqual(['second']);
    expect(journal.query({ fromTick: asTick(7), toTick: asTick(7) })).toHaveLength(2);
    expect(journal.verify().valid).toBe(true);
  });
});

describe('EntityWorld and ComponentStore', () => {
  function createWorld(): EntityWorld {
    const world = new EntityWorld();
    world.register(positionDefinition);
    world.register(healthDefinition);
    return world;
  }

  test('creates entities and queries component/tag intersections', () => {
    const world = createWorld();
    const player = world.create(['player', 'living']);
    const enemy = world.create(['enemy', 'living']);
    const decoration = world.create(['decoration']);
    world.add(player, 'position', { x: 2, y: 3 });
    world.add(player, 'health', { current: 5, maximum: 5 });
    world.add(enemy, 'position', { x: 8, y: 4 });
    world.add(enemy, 'health', { current: 2, maximum: 3 });
    world.add(decoration, 'position', { x: 1, y: 1 });

    expect(world.query({ all: ['position', 'health'], tagsAny: ['player', 'enemy'] }))
      .toEqual([player, enemy]);
    expect(world.query({ all: ['position'], none: ['health'] })).toEqual([decoration]);
  });

  test('invalidates stale references when an entity id is recycled', () => {
    const world = createWorld();
    const first = world.create();
    const staleReference = world.reference(first);
    world.destroy(first);
    const recycled = world.create();

    expect(recycled).toBe(first);
    expect(world.resolve(staleReference)).toBeUndefined();
    expect(world.reference(recycled).generation).toBeGreaterThan(staleReference.generation);
  });

  test('captures and restores entities, components, tags and resources', () => {
    const world = createWorld();
    const entity = world.create(['player']);
    world.add(entity, 'position', { x: 12, y: 14 });
    world.add(entity, 'health', { current: 4, maximum: 5 });
    world.setResource('chapter', { name: 'Passagem Esquecida', index: 1 });
    const snapshot = world.capture();

    world.destroy(entity);
    world.deleteResource('chapter');
    world.restore(snapshot);

    expect(world.exists(entity)).toBe(true);
    expect(world.requireComponent<PositionComponent>(entity, 'position')).toEqual({ x: 12, y: 14 });
    expect(world.hasTag(entity, 'player')).toBe(true);
    expect(world.requireResource('chapter')).toEqual({ name: 'Passagem Esquecida', index: 1 });
  });
});

describe('TaskScheduler', () => {
  test('executes delayed and repeating tasks on deterministic ticks', () => {
    const scheduler = new TaskScheduler();
    const ticks: number[] = [];
    scheduler.schedule(context => ticks.push(context.tick), {
      delayTicks: 2,
      intervalTicks: 3,
      repeat: 2,
      label: 'pulse',
    });

    for (let tick = 0; tick <= 9; tick++) {
      scheduler.update(asTick(tick));
    }

    expect(ticks).toEqual([2, 5, 8]);
    expect(scheduler.size).toBe(0);
  });

  test('pauses and cancels task groups', () => {
    const scheduler = new TaskScheduler();
    let calls = 0;
    scheduler.schedule(() => calls++, { delayTicks: 1, group: 'combat' });
    scheduler.schedule(() => calls++, { delayTicks: 1, group: 'combat' });
    scheduler.schedule(() => calls++, { delayTicks: 1, group: 'world' });
    expect(scheduler.pauseGroup('combat')).toBe(2);

    scheduler.update(asTick(1));
    expect(calls).toBe(1);
    expect(scheduler.cancelGroup('combat')).toBe(2);
    expect(scheduler.size).toBe(0);
  });
});

describe('SimulationKernel', () => {
  test('runs systems in deterministic phase and priority order', () => {
    const kernel = new SimulationKernel({ fixedStepMilliseconds: 10 });
    const calls: string[] = [];
    kernel.addSystem({
      id: 'update-low',
      phase: 'update',
      priority: 1,
      enabled: true,
      update: () => calls.push('update-low'),
    });
    kernel.addSystem({
      id: 'input',
      phase: 'input',
      priority: 1,
      enabled: true,
      update: () => calls.push('input'),
    });
    kernel.addSystem({
      id: 'update-high',
      phase: 'update',
      priority: 10,
      enabled: true,
      update: () => calls.push('update-high'),
    });

    const frame = kernel.frame(10);

    expect(frame.ticksExecuted).toBe(1);
    expect(calls).toEqual(['input', 'update-high', 'update-low']);
  });

  test('coordinates scheduled tasks and delayed events', () => {
    const kernel = new SimulationKernel({ fixedStepMilliseconds: 10 });
    let taskCalls = 0;
    let eventCalls = 0;
    kernel.scheduler.schedule(() => taskCalls++, { delayTicks: 2 });
    kernel.events.subscribe('delayed', () => eventCalls++);
    kernel.scheduleEvent({ type: 'delayed', payload: { ready: true } }, 3);

    kernel.step(2);
    expect(taskCalls).toBe(1);
    expect(eventCalls).toBe(0);

    kernel.step(1);
    expect(eventCalls).toBe(1);
  });

  test('restores world, clock and random state from a snapshot', () => {
    const kernel = new SimulationKernel({ fixedStepMilliseconds: 10, randomSeed: 42 });
    const position = kernel.world.register(positionDefinition);
    const entity = kernel.world.create(['player']);
    position.set(entity, { x: 1, y: 2 });
    kernel.step(5);
    const snapshot = kernel.capture('checkpoint');
    const expectedRandom = kernel.random.nextUint32();

    position.set(entity, { x: 99, y: 99 });
    kernel.step(10);
    kernel.random.skip(20);
    kernel.restore(snapshot);

    expect(kernel.tick).toBe(5);
    expect(position.require(entity)).toEqual({ x: 1, y: 2 });
    expect(kernel.random.nextUint32()).toBe(expectedRandom);
  });

  test('rolls back to the nearest stored tick', () => {
    const kernel = new SimulationKernel({ fixedStepMilliseconds: 10 });
    const health = kernel.world.register(healthDefinition);
    const entity = kernel.world.create(['player']);
    health.set(entity, { current: 5, maximum: 5 });
    kernel.step(3);
    kernel.capture('before damage');
    health.set(entity, { current: 1, maximum: 5 });
    kernel.step(4);
    kernel.capture('after damage');

    expect(kernel.rollback(asTick(4))).toBe(true);
    expect(kernel.tick).toBe(3);
    expect(health.require(entity).current).toBe(5);
  });

  test('produces useful aggregate metrics', () => {
    const kernel = new SimulationKernel({ fixedStepMilliseconds: 10 });
    kernel.world.create(['player']);
    kernel.events.subscribe('metric.event', () => undefined);
    kernel.publish({ type: 'metric.event', payload: { value: 1 } });
    kernel.step(2);
    kernel.capture('metrics');
    const metrics = kernel.metrics();

    expect(metrics.tick).toBe(2);
    expect(metrics.entities).toBe(1);
    expect(metrics.snapshots).toBe(1);
    expect(metrics.publishedEvents).toBeGreaterThanOrEqual(1);
    expect(metrics.deliveredEvents).toBeGreaterThanOrEqual(1);
  });
});

describe('SnapshotStore', () => {
  test('retains capacity and finds nearest snapshots', () => {
    const kernel = new SimulationKernel({ fixedStepMilliseconds: 10 });
    const store = new SnapshotStore(2);
    const first = kernel.capture('first');
    store.save(asTick(1), first, 'one');
    store.save(asTick(2), { ...first, createdAt: 2 }, 'two');
    store.save(asTick(3), { ...first, createdAt: 3 }, 'three');

    expect(store.size).toBe(2);
    expect(store.oldest()?.tick).toBe(2);
    expect(store.nearestAtOrBefore(asTick(2))?.label).toBe('two');
    expect(store.nearestAtOrAfter(asTick(2))?.label).toBe('two');
  });
});

describe('GameSimulationBridge', () => {
  test('mirrors player state and records gameplay events in the journal', () => {
    const bridge = new GameSimulationBridge({
      seed: 123,
      classId: 'mage',
      section: 'Entrada',
      fixedStepMilliseconds: 10,
    });

    bridge.synchronizePlayer({
      x: 100,
      y: 200,
      health: 4,
      maximumHealth: 5,
      mana: 80,
      maximumMana: 100,
    });
    bridge.recordDamage(1, 99);
    bridge.recordItem('item_magic');
    bridge.recordWaveStarted('Entrada', 1, 4);
    bridge.recordWaveCompleted('Entrada', 1);
    bridge.recordRoomEntered('Galeria', 'Entrada');
    bridge.advance(30);

    const eventTypes = bridge.kernel.journal.events({ includeTransient: true })
      .map(event => event.type);
    expect(eventTypes).toContain('simulation.started');
    expect(eventTypes).toContain('combat.health.changed');
    expect(eventTypes).toContain('combat.mana.changed');
    expect(eventTypes).toContain('combat.damage.applied');
    expect(eventTypes).toContain('inventory.item.pickedUp');
    expect(eventTypes).toContain('world.wave.started');
    expect(eventTypes).toContain('world.wave.completed');
    expect(eventTypes).toContain('world.room.entered');
    expect(bridge.kernel.tick).toBe(3);

    bridge.dispose();
  });

  test('pauses fixed-step advancement without losing synchronized state', () => {
    const bridge = new GameSimulationBridge({
      seed: 321,
      classId: 'knight',
      section: 'Pátio',
      fixedStepMilliseconds: 10,
    });
    bridge.synchronizePlayer({
      x: 12,
      y: 18,
      health: 5,
      maximumHealth: 5,
      mana: 30,
      maximumMana: 60,
    });
    bridge.setPaused(true);
    bridge.advance(100);
    expect(bridge.kernel.tick).toBe(0);

    bridge.setPaused(false);
    bridge.advance(20);
    expect(bridge.kernel.tick).toBe(2);

    bridge.dispose();
  });
});
