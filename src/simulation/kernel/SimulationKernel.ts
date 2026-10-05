import {
  DEFAULT_KERNEL_CONFIGURATION,
  EventDraft,
  EventReceipt,
  JsonObject,
  JsonValue,
  KernelConfiguration,
  KernelSnapshot,
  SimulationEvent,
  SimulationPlugin,
  SimulationSystem,
  Tick,
  asTick,
  cloneJson,
} from '../core/types';
import { FixedStepClock } from '../core/FixedStepClock';
import { DeterministicRandom, RandomSnapshot } from '../core/DeterministicRandom';
import { EventBus } from '../events/EventBus';
import { EventJournal } from '../events/EventJournal';
import { EventQueue } from '../events/EventQueue';
import { EntityWorld } from '../ecs/EntityWorld';
import { CommandBus } from '../commands/CommandBus';
import { TaskScheduler } from '../scheduler/TaskScheduler';
import { SnapshotStore } from '../state/SnapshotStore';
import { SystemExecution, SystemPipeline } from './SystemPipeline';

export interface KernelFrameResult {
  readonly ticksExecuted: number;
  readonly droppedMilliseconds: number;
  readonly interpolationAlpha: number;
  readonly systems: readonly SystemExecution[];
  readonly eventsDelivered: number;
  readonly scheduledTasksExecuted: number;
}

export interface KernelPlugin extends SimulationPlugin {
  install(kernel: SimulationKernel): void | Promise<void>;
  uninstall?(kernel: SimulationKernel): void;
}

export interface KernelMetrics {
  readonly tick: Tick;
  readonly elapsed: number;
  readonly entities: number;
  readonly systems: number;
  readonly scheduledTasks: number;
  readonly journalEntries: number;
  readonly snapshots: number;
  readonly publishedEvents: number;
  readonly deliveredEvents: number;
  readonly failedEvents: number;
}

export class SimulationKernel {
  public readonly configuration: Readonly<KernelConfiguration>;
  public readonly clock: FixedStepClock;
  public readonly random: DeterministicRandom;
  public readonly events: EventBus;
  public readonly journal: EventJournal;
  public readonly eventQueue: EventQueue;
  public readonly world: EntityWorld;
  public readonly commands: CommandBus;
  public readonly scheduler: TaskScheduler;
  public readonly snapshots: SnapshotStore;
  public readonly systems: SystemPipeline;

  private readonly plugins = new Map<string, KernelPlugin>();
  private readonly metadata: JsonObject = {};
  private initialized = false;
  private disposed = false;
  private replaying = false;
  private frameSequence = 0;

  public constructor(configuration: Partial<KernelConfiguration> = {}) {
    this.configuration = Object.freeze({
      ...DEFAULT_KERNEL_CONFIGURATION,
      ...configuration,
    });
    this.clock = new FixedStepClock({
      stepMilliseconds: this.configuration.fixedStepMilliseconds,
      maximumSubSteps: this.configuration.maximumSubSteps,
      maximumFrameMilliseconds: this.configuration.maximumFrameMilliseconds,
    });
    this.random = new DeterministicRandom(this.configuration.randomSeed);
    this.events = new EventBus(() => this.clock.tick, () => this.clock.elapsed);
    this.journal = new EventJournal(this.configuration.eventJournalCapacity);
    this.eventQueue = new EventQueue();
    this.world = new EntityWorld();
    this.commands = new CommandBus();
    this.scheduler = new TaskScheduler();
    this.snapshots = new SnapshotStore(this.configuration.snapshotCapacity);
    this.systems = new SystemPipeline();
    this.events.observe((event, receipt) => {
      if (!event.metadata.transient) {
        this.journal.append(event, receipt);
      }
    });
  }

  public get tick(): Tick {
    return this.clock.tick;
  }

  public get isInitialized(): boolean {
    return this.initialized;
  }

  public get isDisposed(): boolean {
    return this.disposed;
  }

  public get isReplaying(): boolean {
    return this.replaying;
  }

  public async initialize(): Promise<void> {
    this.assertUsable();
    if (this.initialized) return;
    for (const plugin of this.plugins.values()) {
      await plugin.install(this);
    }
    await this.systems.initialize();
    this.initialized = true;
    this.publish({
      type: 'simulation.initialized',
      payload: { pluginCount: this.plugins.size, systemCount: this.systems.size },
      metadata: { source: 'kernel' },
    });
  }

  public frame(deltaMilliseconds: number): KernelFrameResult {
    this.assertUsable();
    const frame = this.clock.advance(deltaMilliseconds);
    const systemExecutions: SystemExecution[] = [];
    let eventsDelivered = 0;
    let scheduledTasksExecuted = 0;
    for (const step of frame.steps) {
      const queuedEvents = this.eventQueue.drain(step.tick);
      for (const event of queuedEvents) {
        eventsDelivered += this.events.publishEvent(event).delivered;
      }
      scheduledTasksExecuted += this.scheduler.update(step.tick);
      const context = {
        tick: step.tick,
        delta: step.delta,
        elapsed: step.elapsed,
        alpha: frame.alpha,
      };
      const executions = this.systems.executeAll(context);
      systemExecutions.push(...executions);
      this.publish({
        type: 'simulation.tick.completed',
        payload: {
          tick: step.tick,
          delta: step.delta,
          systemsExecuted: executions.length,
          systemsFailed: executions.filter(execution => !execution.succeeded).length,
        },
        metadata: { source: 'kernel', transient: true },
      });
    }
    this.frameSequence++;
    return {
      ticksExecuted: frame.steps.length,
      droppedMilliseconds: frame.droppedMilliseconds,
      interpolationAlpha: frame.alpha,
      systems: systemExecutions,
      eventsDelivered,
      scheduledTasksExecuted,
    };
  }

  public step(count = 1): KernelFrameResult {
    this.assertUsable();
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError('step count must be a non-negative integer');
    }
    const systems: SystemExecution[] = [];
    let eventsDelivered = 0;
    let scheduledTasksExecuted = 0;
    const steps = this.clock.step(count);
    for (const step of steps) {
      for (const event of this.eventQueue.drain(step.tick)) {
        eventsDelivered += this.events.publishEvent(event).delivered;
      }
      scheduledTasksExecuted += this.scheduler.update(step.tick);
      systems.push(...this.systems.executeAll({
        tick: step.tick,
        delta: step.delta,
        elapsed: step.elapsed,
        alpha: 0,
      }));
    }
    return {
      ticksExecuted: steps.length,
      droppedMilliseconds: 0,
      interpolationAlpha: 0,
      systems,
      eventsDelivered,
      scheduledTasksExecuted,
    };
  }

  public publish<Payload extends JsonValue>(draft: EventDraft<Payload>): EventReceipt {
    this.assertUsable();
    return this.events.publish(draft);
  }

  public createEvent<Payload extends JsonValue>(draft: EventDraft<Payload>): SimulationEvent<Payload> {
    return this.events.create(draft);
  }

  public scheduleEvent<Payload extends JsonValue>(
    draft: EventDraft<Payload>,
    delayTicks: number,
    priority = 0,
  ): number {
    const event = this.createEvent(draft);
    return this.eventQueue.scheduleAfter(event, this.tick, delayTicks, priority);
  }

  public addSystem(system: SimulationSystem): () => void {
    this.assertUsable();
    return this.systems.add(system);
  }

  public addPlugin(plugin: KernelPlugin): () => void {
    this.assertUsable();
    if (this.initialized) {
      throw new Error('plugins must be added before kernel initialization');
    }
    if (this.plugins.has(plugin.id)) {
      throw new Error('plugin already exists: ' + plugin.id);
    }
    this.plugins.set(plugin.id, plugin);
    return () => this.plugins.delete(plugin.id);
  }

  public setMetadata(key: string, value: JsonValue): void {
    this.metadata[key] = cloneJson(value);
  }

  public getMetadata<T extends JsonValue>(key: string): T | undefined {
    return this.metadata[key] as T | undefined;
  }

  public capture(label = ''): KernelSnapshot {
    this.assertUsable();
    const snapshot: KernelSnapshot = {
      version: 1,
      createdAt: Date.now(),
      clock: this.clock.capture(),
      world: this.world.capture(),
      scheduler: this.scheduler.capture(),
      randomState: this.random.capture(),
      metadata: cloneJson(this.metadata),
    };
    this.snapshots.save(this.tick, snapshot, label);
    return cloneJson(snapshot);
  }

  public restore(snapshot: KernelSnapshot): void {
    this.assertUsable();
    if (snapshot.version !== 1) {
      throw new Error('unsupported kernel snapshot version ' + snapshot.version);
    }
    this.clock.restore(snapshot.clock);
    this.world.restore(snapshot.world);
    this.scheduler.restore(snapshot.scheduler);
    this.random.restore(snapshot.randomState as RandomSnapshot);
    for (const key of Object.keys(this.metadata)) {
      delete this.metadata[key];
    }
    Object.assign(this.metadata, cloneJson(snapshot.metadata));
  }

  public rollback(tick: Tick): boolean {
    const stored = this.snapshots.nearestAtOrBefore(tick);
    if (!stored || !this.snapshots.verify(stored)) {
      return false;
    }
    this.restore(stored.snapshot);
    this.snapshots.removeAfter(stored.tick);
    this.journal.removeWhere(event => event.tick > stored.tick);
    this.publish({
      type: 'simulation.rollback.completed',
      payload: { requestedTick: tick, restoredTick: stored.tick },
      metadata: { source: 'kernel' },
    });
    return true;
  }

  public replay(events: readonly SimulationEvent[]): readonly EventReceipt[] {
    this.assertUsable();
    this.replaying = true;
    this.events.setReplaying(true);
    this.commands.setReplaying(true);
    const receipts: EventReceipt[] = [];
    try {
      for (const event of events) {
        receipts.push(this.events.publishEvent(event));
      }
    } finally {
      this.commands.setReplaying(false);
      this.events.setReplaying(false);
      this.replaying = false;
    }
    return receipts;
  }

  public metrics(): KernelMetrics {
    const eventMetrics = this.events.metrics();
    return {
      tick: this.tick,
      elapsed: this.clock.elapsed,
      entities: this.world.size,
      systems: this.systems.size,
      scheduledTasks: this.scheduler.size,
      journalEntries: this.journal.size,
      snapshots: this.snapshots.size,
      publishedEvents: eventMetrics.published,
      deliveredEvents: eventMetrics.delivered,
      failedEvents: eventMetrics.failed,
    };
  }

  public pause(): void {
    this.clock.pause();
    this.publish({
      type: 'simulation.paused',
      payload: { tick: this.tick },
      metadata: { source: 'kernel' },
    });
  }

  public resume(): void {
    this.clock.resume();
    this.publish({
      type: 'simulation.resumed',
      payload: { tick: this.tick },
      metadata: { source: 'kernel' },
    });
  }

  public reset(seed: number | string = this.configuration.randomSeed): void {
    this.clock.reset();
    this.world.clear();
    this.eventQueue.clear();
    this.scheduler.clear();
    this.snapshots.clear();
    this.journal.clear();
    this.random.restore(new DeterministicRandom(seed).capture());
    this.frameSequence = 0;
  }

  public dispose(): void {
    if (this.disposed) return;
    for (const plugin of [...this.plugins.values()].reverse()) {
      plugin.uninstall?.(this);
    }
    this.systems.clear();
    this.events.clear();
    this.scheduler.clear();
    this.eventQueue.clear();
    this.world.clear();
    this.plugins.clear();
    this.disposed = true;
  }

  private assertUsable(): void {
    if (this.disposed) {
      throw new Error('simulation kernel has been disposed');
    }
  }
}
