import {
  EventContext,
  EventDraft,
  EventHandler,
  EventId,
  EventMetadata,
  EventReceipt,
  JsonValue,
  SimulationEvent,
  Subscription,
  SubscriptionOptions,
  Tick,
  SimulationMilliseconds,
  asEventId,
  cloneJson,
  createCorrelationId,
} from '../core/types';

interface HandlerEntry {
  readonly id: number;
  readonly type: string;
  readonly handler: EventHandler;
  readonly priority: number;
  readonly once: boolean;
  readonly filter?: (event: SimulationEvent) => boolean;
  readonly label: string;
  active: boolean;
  calls: number;
}

interface MutableContext extends EventContext {
  cancelled: boolean;
  propagationStopped: boolean;
}

export interface EventBusMetrics {
  readonly published: number;
  readonly delivered: number;
  readonly skipped: number;
  readonly failed: number;
  readonly activeSubscriptions: number;
  readonly queuedWhilePaused: number;
}

export type EventObserver = (event: SimulationEvent, receipt: EventReceipt) => void;
export type EventErrorHandler = (error: Error, event: SimulationEvent, label: string) => void;

export class EventBus {
  private readonly handlers = new Map<string, HandlerEntry[]>();
  private readonly wildcardHandlers: HandlerEntry[] = [];
  private readonly observers = new Set<EventObserver>();
  private readonly errorHandlers = new Set<EventErrorHandler>();
  private readonly pausedEvents: SimulationEvent[] = [];
  private nextSubscriptionId = 1;
  private nextEventId = 1;
  private publishDepth = 0;
  private paused = false;
  private replaying = false;
  private publishedCount = 0;
  private deliveredCount = 0;
  private skippedCount = 0;
  private failedCount = 0;
  private tickProvider: () => Tick;
  private timeProvider: () => SimulationMilliseconds;

  public constructor(
    tickProvider: () => Tick,
    timeProvider: () => SimulationMilliseconds,
  ) {
    this.tickProvider = tickProvider;
    this.timeProvider = timeProvider;
  }

  public setTimeProviders(
    tickProvider: () => Tick,
    timeProvider: () => SimulationMilliseconds,
  ): void {
    this.tickProvider = tickProvider;
    this.timeProvider = timeProvider;
  }

  public subscribe<Payload extends JsonValue>(
    type: string,
    handler: EventHandler<Payload>,
    options: SubscriptionOptions<Payload> = {},
  ): Subscription {
    if (!type.trim()) {
      throw new TypeError('event type cannot be blank');
    }
    const entry: HandlerEntry = {
      id: this.nextSubscriptionId++,
      type,
      handler: handler as EventHandler,
      priority: options.priority ?? 0,
      once: options.once ?? false,
      filter: options.filter as ((event: SimulationEvent) => boolean) | undefined,
      label: options.label ?? handler.name ?? 'anonymous',
      active: true,
      calls: 0,
    };
    const collection = type === '*' ? this.wildcardHandlers : this.handlers.get(type) ?? [];
    collection.push(entry);
    collection.sort(this.compareEntries);
    if (type !== '*') {
      this.handlers.set(type, collection);
    }
    const subscription: Subscription = {
      id: entry.id,
      type,
      get active() {
        return entry.active;
      },
      unsubscribe: () => this.unsubscribe(entry.id),
    };
    if (options.signal) {
      if (options.signal.aborted) {
        subscription.unsubscribe();
      } else {
        options.signal.addEventListener('abort', subscription.unsubscribe, { once: true });
      }
    }
    return subscription;
  }

  public once<Payload extends JsonValue>(
    type: string,
    handler: EventHandler<Payload>,
    options: Omit<SubscriptionOptions<Payload>, 'once'> = {},
  ): Subscription {
    return this.subscribe(type, handler, { ...options, once: true });
  }

  public unsubscribe(subscriptionId: number): boolean {
    for (const collection of [...this.handlers.values(), this.wildcardHandlers]) {
      const entry = collection.find(candidate => candidate.id === subscriptionId);
      if (!entry) {
        continue;
      }
      entry.active = false;
      this.compactCollection(collection);
      return true;
    }
    return false;
  }

  public unsubscribeType(type: string): number {
    const collection = type === '*' ? this.wildcardHandlers : this.handlers.get(type);
    if (!collection) {
      return 0;
    }
    let removed = 0;
    for (const entry of collection) {
      if (entry.active) {
        entry.active = false;
        removed++;
      }
    }
    if (type === '*') {
      this.compactCollection(this.wildcardHandlers);
    } else {
      this.handlers.delete(type);
    }
    return removed;
  }

  public unsubscribeLabel(label: string): number {
    let removed = 0;
    for (const collection of [...this.handlers.values(), this.wildcardHandlers]) {
      for (const entry of collection) {
        if (entry.label === label && entry.active) {
          entry.active = false;
          removed++;
        }
      }
      this.compactCollection(collection);
    }
    return removed;
  }

  public create<Payload extends JsonValue>(draft: EventDraft<Payload>): SimulationEvent<Payload> {
    const id = asEventId(this.nextEventId++);
    const metadata: EventMetadata = {
      source: draft.metadata?.source ?? 'simulation',
      correlationId: draft.metadata?.correlationId ?? createCorrelationId('event', id),
      causationId: draft.metadata?.causationId ?? '',
      tags: [...(draft.metadata?.tags ?? [])],
      transient: draft.metadata?.transient ?? false,
    };
    return Object.freeze({
      id,
      type: draft.type,
      tick: this.tickProvider(),
      time: this.timeProvider(),
      payload: cloneJson(draft.payload),
      metadata,
    });
  }

  public publish<Payload extends JsonValue>(draft: EventDraft<Payload>): EventReceipt {
    return this.publishEvent(this.create(draft));
  }

  public publishEvent<Payload extends JsonValue>(event: SimulationEvent<Payload>): EventReceipt {
    this.publishedCount++;
    if (this.paused) {
      this.pausedEvents.push(event as SimulationEvent);
      return this.emptyReceipt(event);
    }
    const context = this.createContext();
    const errors: Error[] = [];
    let delivered = 0;
    let skipped = 0;
    this.publishDepth++;
    try {
      const entries = this.collectHandlers(event.type);
      for (const entry of entries) {
        if (!entry.active || context.propagationStopped) {
          skipped++;
          continue;
        }
        if (entry.filter && !entry.filter(event as SimulationEvent)) {
          skipped++;
          continue;
        }
        try {
          const result = entry.handler(event as SimulationEvent, context);
          if (result instanceof Promise) {
            throw new TypeError('publish received an asynchronous handler; use publishAsync');
          }
          entry.calls++;
          delivered++;
          if (entry.once) {
            entry.active = false;
          }
        } catch (error) {
          const normalized = this.normalizeError(error);
          errors.push(normalized);
          this.failedCount++;
          this.notifyError(normalized, event as SimulationEvent, entry.label);
        }
      }
    } finally {
      this.publishDepth--;
      this.compactAll();
    }
    this.deliveredCount += delivered;
    this.skippedCount += skipped;
    const receipt: EventReceipt = {
      eventId: event.id,
      type: event.type,
      delivered,
      skipped,
      cancelled: context.cancelled,
      errors,
    };
    this.notifyObservers(event as SimulationEvent, receipt);
    return receipt;
  }

  public async publishAsync<Payload extends JsonValue>(draft: EventDraft<Payload>): Promise<EventReceipt> {
    return this.publishEventAsync(this.create(draft));
  }

  public async publishEventAsync<Payload extends JsonValue>(event: SimulationEvent<Payload>): Promise<EventReceipt> {
    this.publishedCount++;
    if (this.paused) {
      this.pausedEvents.push(event as SimulationEvent);
      return this.emptyReceipt(event);
    }
    const context = this.createContext();
    const errors: Error[] = [];
    let delivered = 0;
    let skipped = 0;
    this.publishDepth++;
    try {
      const entries = this.collectHandlers(event.type);
      for (const entry of entries) {
        if (!entry.active || context.propagationStopped) {
          skipped++;
          continue;
        }
        if (entry.filter && !entry.filter(event as SimulationEvent)) {
          skipped++;
          continue;
        }
        try {
          await entry.handler(event as SimulationEvent, context);
          entry.calls++;
          delivered++;
          if (entry.once) {
            entry.active = false;
          }
        } catch (error) {
          const normalized = this.normalizeError(error);
          errors.push(normalized);
          this.failedCount++;
          this.notifyError(normalized, event as SimulationEvent, entry.label);
        }
      }
    } finally {
      this.publishDepth--;
      this.compactAll();
    }
    this.deliveredCount += delivered;
    this.skippedCount += skipped;
    const receipt: EventReceipt = {
      eventId: event.id,
      type: event.type,
      delivered,
      skipped,
      cancelled: context.cancelled,
      errors,
    };
    this.notifyObservers(event as SimulationEvent, receipt);
    return receipt;
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(flush = true): readonly EventReceipt[] {
    this.paused = false;
    return flush ? this.flushPaused() : [];
  }

  public flushPaused(limit = Number.POSITIVE_INFINITY): readonly EventReceipt[] {
    const receipts: EventReceipt[] = [];
    let processed = 0;
    while (!this.paused && this.pausedEvents.length > 0 && processed < limit) {
      const event = this.pausedEvents.shift()!;
      receipts.push(this.publishEvent(event));
      processed++;
    }
    return receipts;
  }

  public discardPaused(predicate?: (event: SimulationEvent) => boolean): number {
    if (!predicate) {
      const count = this.pausedEvents.length;
      this.pausedEvents.length = 0;
      return count;
    }
    let removed = 0;
    for (let index = this.pausedEvents.length - 1; index >= 0; index--) {
      if (predicate(this.pausedEvents[index])) {
        this.pausedEvents.splice(index, 1);
        removed++;
      }
    }
    return removed;
  }

  public observe(observer: EventObserver): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  public onError(handler: EventErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  public setReplaying(replaying: boolean): void {
    this.replaying = replaying;
  }

  public clear(): void {
    this.handlers.clear();
    this.wildcardHandlers.length = 0;
    this.pausedEvents.length = 0;
    this.observers.clear();
    this.errorHandlers.clear();
  }

  public metrics(): EventBusMetrics {
    let activeSubscriptions = this.wildcardHandlers.filter(entry => entry.active).length;
    for (const collection of this.handlers.values()) {
      activeSubscriptions += collection.filter(entry => entry.active).length;
    }
    return {
      published: this.publishedCount,
      delivered: this.deliveredCount,
      skipped: this.skippedCount,
      failed: this.failedCount,
      activeSubscriptions,
      queuedWhilePaused: this.pausedEvents.length,
    };
  }

  private collectHandlers(type: string): HandlerEntry[] {
    return [...(this.handlers.get(type) ?? []), ...this.wildcardHandlers]
      .filter(entry => entry.active)
      .sort(this.compareEntries);
  }

  private compareEntries(left: HandlerEntry, right: HandlerEntry): number {
    return right.priority - left.priority || left.id - right.id;
  }

  private createContext(): MutableContext {
    return {
      depth: this.publishDepth,
      replaying: this.replaying,
      cancelled: false,
      propagationStopped: false,
      cancel() {
        this.cancelled = true;
      },
      stopPropagation() {
        this.propagationStopped = true;
      },
    };
  }

  private compactAll(): void {
    if (this.publishDepth > 0) {
      return;
    }
    this.compactCollection(this.wildcardHandlers);
    for (const [type, collection] of this.handlers) {
      this.compactCollection(collection);
      if (collection.length === 0) {
        this.handlers.delete(type);
      }
    }
  }

  private compactCollection(collection: HandlerEntry[]): void {
    if (this.publishDepth > 0) {
      return;
    }
    for (let index = collection.length - 1; index >= 0; index--) {
      if (!collection[index].active) {
        collection.splice(index, 1);
      }
    }
  }

  private notifyObservers(event: SimulationEvent, receipt: EventReceipt): void {
    for (const observer of [...this.observers]) {
      observer(event, receipt);
    }
  }

  private notifyError(error: Error, event: SimulationEvent, label: string): void {
    for (const handler of [...this.errorHandlers]) {
      handler(error, event, label);
    }
  }

  private normalizeError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
  }

  private emptyReceipt(event: SimulationEvent): EventReceipt {
    return {
      eventId: event.id,
      type: event.type,
      delivered: 0,
      skipped: 0,
      cancelled: false,
      errors: [],
    };
  }
}
