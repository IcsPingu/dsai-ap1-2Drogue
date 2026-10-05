import { JsonObject, JsonValue, SchedulerSnapshot, Tick, cloneJson } from '../core/types';
import { PriorityQueue } from '../core/PriorityQueue';

export type ScheduledTaskCallback = (context: ScheduledTaskContext) => void;

export interface ScheduledTaskContext {
  readonly taskId: number;
  readonly tick: Tick;
  readonly runs: number;
  readonly lateness: number;
  cancel(): void;
}

export interface TaskScheduleOptions {
  readonly delayTicks?: number;
  readonly intervalTicks?: number;
  readonly repeat?: number;
  readonly priority?: number;
  readonly label?: string;
  readonly group?: string;
  readonly catchUp?: boolean;
}

export interface ScheduledTaskRecord extends JsonObject {
  id: number;
  dueTick: number;
  intervalTicks: number;
  remainingRuns: number;
  priority: number;
  label: string;
  group: string;
  catchUp: boolean;
  cancelled: boolean;
  paused: boolean;
  runs: number;
}

interface InternalTask {
  readonly record: ScheduledTaskRecord;
  readonly callback: ScheduledTaskCallback;
}

export interface TaskHandle {
  readonly id: number;
  readonly active: boolean;
  cancel(): void;
  pause(): void;
  resume(): void;
}

export class TaskScheduler {
  private readonly queue = new PriorityQueue<InternalTask>();
  private readonly tasks = new Map<number, InternalTask>();
  private readonly callbackRegistry = new Map<string, ScheduledTaskCallback>();
  private nextTaskId = 1;
  private currentTick: Tick = 0 as Tick;

  public get size(): number {
    return this.tasks.size;
  }

  public registerCallback(label: string, callback: ScheduledTaskCallback): () => void {
    if (!label.trim()) {
      throw new TypeError('callback label cannot be blank');
    }
    this.callbackRegistry.set(label, callback);
    return () => this.callbackRegistry.delete(label);
  }

  public schedule(callback: ScheduledTaskCallback, options: TaskScheduleOptions = {}): TaskHandle {
    const delayTicks = options.delayTicks ?? 0;
    const intervalTicks = options.intervalTicks ?? 0;
    const repeat = options.repeat ?? 0;
    if (!Number.isSafeInteger(delayTicks) || delayTicks < 0) {
      throw new RangeError('delayTicks must be a non-negative integer');
    }
    if (!Number.isSafeInteger(intervalTicks) || intervalTicks < 0) {
      throw new RangeError('intervalTicks must be a non-negative integer');
    }
    if (!Number.isSafeInteger(repeat) || repeat < -1) {
      throw new RangeError('repeat must be -1 or a non-negative integer');
    }
    if (repeat !== 0 && intervalTicks === 0) {
      throw new RangeError('repeating tasks require a positive interval');
    }
    const record: ScheduledTaskRecord = {
      id: this.nextTaskId++,
      dueTick: this.currentTick + delayTicks,
      intervalTicks,
      remainingRuns: repeat,
      priority: options.priority ?? 0,
      label: options.label ?? '',
      group: options.group ?? 'default',
      catchUp: options.catchUp ?? false,
      cancelled: false,
      paused: false,
      runs: 0,
    };
    const task: InternalTask = { record, callback };
    this.tasks.set(record.id, task);
    this.queue.enqueue(task, this.priority(record));
    return this.handle(task);
  }

  public scheduleRegistered(label: string, options: TaskScheduleOptions = {}): TaskHandle {
    const callback = this.callbackRegistry.get(label);
    if (!callback) {
      throw new Error('no scheduled callback registered as ' + label);
    }
    return this.schedule(callback, { ...options, label });
  }

  public update(tick: Tick, executionLimit = 10000): number {
    this.currentTick = tick;
    let executions = 0;
    while (executions < executionLimit) {
      const task = this.queue.peek();
      if (!task || task.record.dueTick > tick) {
        break;
      }
      this.queue.dequeue();
      const record = task.record;
      if (record.cancelled || !this.tasks.has(record.id)) {
        continue;
      }
      if (record.paused) {
        record.dueTick = tick + 1;
        this.queue.enqueue(task, this.priority(record));
        continue;
      }
      let cancelledByContext = false;
      task.callback({
        taskId: record.id,
        tick,
        runs: record.runs,
        lateness: Math.max(0, tick - record.dueTick),
        cancel: () => {
          cancelledByContext = true;
          this.cancel(record.id);
        },
      });
      record.runs++;
      executions++;
      if (cancelledByContext || record.cancelled) {
        continue;
      }
      if (record.remainingRuns === 0) {
        this.tasks.delete(record.id);
        continue;
      }
      if (record.remainingRuns > 0) {
        record.remainingRuns--;
      }
      record.dueTick = record.catchUp
        ? record.dueTick + record.intervalTicks
        : tick + record.intervalTicks;
      this.queue.enqueue(task, this.priority(record));
    }
    const nextTask = this.queue.peek();
    if (executions >= executionLimit && nextTask !== undefined && nextTask.record.dueTick <= tick) {
      throw new Error('task scheduler execution limit exceeded');
    }
    return executions;
  }

  public cancel(taskId: number): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.record.cancelled) {
      return false;
    }
    task.record.cancelled = true;
    this.tasks.delete(taskId);
    return true;
  }

  public cancelGroup(group: string): number {
    let cancelled = 0;
    for (const task of [...this.tasks.values()]) {
      if (task.record.group === group && this.cancel(task.record.id)) {
        cancelled++;
      }
    }
    return cancelled;
  }

  public pause(taskId: number): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.record.cancelled) return false;
    task.record.paused = true;
    return true;
  }

  public resume(taskId: number): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.record.cancelled) return false;
    task.record.paused = false;
    return true;
  }

  public pauseGroup(group: string): number {
    let paused = 0;
    for (const task of this.tasks.values()) {
      if (task.record.group === group && !task.record.paused) {
        task.record.paused = true;
        paused++;
      }
    }
    return paused;
  }

  public resumeGroup(group: string): number {
    let resumed = 0;
    for (const task of this.tasks.values()) {
      if (task.record.group === group && task.record.paused) {
        task.record.paused = false;
        resumed++;
      }
    }
    return resumed;
  }

  public has(taskId: number): boolean {
    return this.tasks.has(taskId);
  }

  public inspect(taskId: number): ScheduledTaskRecord | undefined {
    const record = this.tasks.get(taskId)?.record;
    return record ? cloneJson(record) : undefined;
  }

  public list(group?: string): ScheduledTaskRecord[] {
    return [...this.tasks.values()]
      .filter(task => group === undefined || task.record.group === group)
      .map(task => cloneJson(task.record))
      .sort((left, right) => left.dueTick - right.dueTick || right.priority - left.priority);
  }

  public clear(): void {
    this.queue.clear();
    this.tasks.clear();
    this.nextTaskId = 1;
  }

  public capture(): SchedulerSnapshot {
    return {
      nextTaskId: this.nextTaskId,
      tasks: this.list().map(task => task as JsonValue),
    };
  }

  public restore(snapshot: SchedulerSnapshot): void {
    this.clear();
    this.nextTaskId = snapshot.nextTaskId;
    for (const rawTask of snapshot.tasks) {
      const record = cloneJson(rawTask) as ScheduledTaskRecord;
      const callback = this.callbackRegistry.get(record.label);
      if (!callback) {
        continue;
      }
      const task: InternalTask = { record, callback };
      this.tasks.set(record.id, task);
      this.queue.enqueue(task, this.priority(record));
    }
  }

  private handle(task: InternalTask): TaskHandle {
    return {
      id: task.record.id,
      get active() {
        return !task.record.cancelled;
      },
      cancel: () => this.cancel(task.record.id),
      pause: () => this.pause(task.record.id),
      resume: () => this.resume(task.record.id),
    };
  }

  private priority(record: ScheduledTaskRecord): number {
    return record.dueTick * 2048 - Math.max(-999, Math.min(999, record.priority));
  }
}
