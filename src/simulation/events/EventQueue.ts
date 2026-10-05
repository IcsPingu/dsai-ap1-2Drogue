import { PriorityQueue } from '../core/PriorityQueue';
import {
  EventDraft,
  JsonObject,
  JsonValue,
  SimulationEvent,
  Tick,
  asTick,
  cloneJson,
} from '../core/types';

export interface QueuedEvent extends JsonObject {
  queueId: number;
  dueTick: number;
  priority: number;
  cancelled: boolean;
  event: JsonValue;
}

export interface EventQueueSnapshot extends JsonObject {
  nextQueueId: number;
  events: QueuedEvent[];
}

export class EventQueue {
  private readonly queue = new PriorityQueue<QueuedEvent>();
  private readonly byId = new Map<number, QueuedEvent>();
  private nextQueueId = 1;

  public get size(): number {
    return this.byId.size;
  }

  public schedule(event: SimulationEvent, dueTick: Tick, priority = 0): number {
    if (!Number.isFinite(priority)) {
      throw new RangeError('queue priority must be finite');
    }
    const queued: QueuedEvent = {
      queueId: this.nextQueueId++,
      dueTick,
      priority,
      cancelled: false,
      event: cloneJson(event as unknown as JsonValue),
    };
    this.byId.set(queued.queueId, queued);
    this.queue.enqueue(queued, this.compositePriority(dueTick, priority));
    return queued.queueId;
  }

  public scheduleAfter(event: SimulationEvent, currentTick: Tick, delayTicks: number, priority = 0): number {
    if (!Number.isSafeInteger(delayTicks) || delayTicks < 0) {
      throw new RangeError('delayTicks must be a non-negative integer');
    }
    return this.schedule(event, asTick(currentTick + delayTicks), priority);
  }

  public cancel(queueId: number): boolean {
    const queued = this.byId.get(queueId);
    if (!queued || queued.cancelled) {
      return false;
    }
    queued.cancelled = true;
    this.byId.delete(queueId);
    return true;
  }

  public reschedule(queueId: number, dueTick: Tick, priority?: number): boolean {
    const queued = this.byId.get(queueId);
    if (!queued || queued.cancelled) {
      return false;
    }
    queued.cancelled = true;
    this.byId.delete(queueId);
    const replacement: QueuedEvent = {
      ...cloneJson(queued),
      queueId,
      dueTick,
      priority: priority ?? queued.priority,
      cancelled: false,
    };
    this.byId.set(queueId, replacement);
    this.queue.enqueue(replacement, this.compositePriority(dueTick, replacement.priority));
    return true;
  }

  public drain(tick: Tick, limit = Number.POSITIVE_INFINITY): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    while (events.length < limit) {
      const next = this.queue.peek();
      if (!next || next.dueTick > tick) {
        break;
      }
      this.queue.dequeue();
      if (next.cancelled || !this.byId.has(next.queueId)) {
        continue;
      }
      this.byId.delete(next.queueId);
      events.push(cloneJson(next.event) as unknown as SimulationEvent);
    }
    return events;
  }

  public peek(): QueuedEvent | undefined {
    this.discardCancelledHead();
    const next = this.queue.peek();
    return next ? cloneJson(next) : undefined;
  }

  public has(queueId: number): boolean {
    return this.byId.has(queueId);
  }

  public pendingAtOrBefore(tick: Tick): number {
    let count = 0;
    for (const queued of this.byId.values()) {
      if (!queued.cancelled && queued.dueTick <= tick) {
        count++;
      }
    }
    return count;
  }

  public removeType(type: string): number {
    let removed = 0;
    for (const queued of this.byId.values()) {
      const event = queued.event as unknown as EventDraft;
      if (event.type === type && this.cancel(queued.queueId)) {
        removed++;
      }
    }
    return removed;
  }

  public clear(): void {
    this.queue.clear();
    this.byId.clear();
    this.nextQueueId = 1;
  }

  public capture(): EventQueueSnapshot {
    return {
      nextQueueId: this.nextQueueId,
      events: [...this.byId.values()].map(event => cloneJson(event)),
    };
  }

  public restore(snapshot: EventQueueSnapshot): void {
    this.clear();
    this.nextQueueId = snapshot.nextQueueId;
    for (const event of snapshot.events) {
      const restored = cloneJson(event);
      this.byId.set(restored.queueId, restored);
      this.queue.enqueue(restored, this.compositePriority(asTick(restored.dueTick), restored.priority));
    }
  }

  private compositePriority(tick: Tick, priority: number): number {
    const normalizedPriority = Math.max(-999, Math.min(999, priority));
    return tick * 2048 - normalizedPriority;
  }

  private discardCancelledHead(): void {
    while (this.queue.peek()?.cancelled) {
      this.queue.dequeue();
    }
  }
}
