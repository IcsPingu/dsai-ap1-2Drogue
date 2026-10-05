import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(process.cwd(), 'src/simulation');

function write(relativePath, source) {
  const target = resolve(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${source.trim()}\n`, 'utf8');
}

write('core/types.ts', String.raw`
export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type EntityId = Brand<number, 'EntityId'>;
export type EventId = Brand<number, 'EventId'>;
export type CommandId = Brand<number, 'CommandId'>;
export type Tick = Brand<number, 'Tick'>;
export type SimulationMilliseconds = Brand<number, 'SimulationMilliseconds'>;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function asEntityId(value: number): EntityId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError('EntityId must be a positive safe integer');
  }
  return value as EntityId;
}

export function asEventId(value: number): EventId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError('EventId must be a positive safe integer');
  }
  return value as EventId;
}

export function asCommandId(value: number): CommandId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError('CommandId must be a positive safe integer');
  }
  return value as CommandId;
}

export function asTick(value: number): Tick {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError('Tick must be a non-negative safe integer');
  }
  return value as Tick;
}

export function asMilliseconds(value: number): SimulationMilliseconds {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Simulation time must be finite and non-negative');
  }
  return value as SimulationMilliseconds;
}

export interface Vector2Value extends JsonObject {
  x: number;
  y: number;
}

export interface EventMetadata extends JsonObject {
  source: string;
  correlationId: string;
  causationId: string;
  tags: string[];
  transient: boolean;
}

export interface SimulationEvent<Payload extends JsonValue = JsonValue> {
  readonly id: EventId;
  readonly type: string;
  readonly tick: Tick;
  readonly time: SimulationMilliseconds;
  readonly payload: Payload;
  readonly metadata: EventMetadata;
}

export interface EventDraft<Payload extends JsonValue = JsonValue> {
  readonly type: string;
  readonly payload: Payload;
  readonly metadata?: Partial<EventMetadata>;
}

export interface EventContext {
  readonly depth: number;
  readonly replaying: boolean;
  readonly cancelled: boolean;
  readonly propagationStopped: boolean;
  cancel(): void;
  stopPropagation(): void;
}

export type EventHandler<Payload extends JsonValue = JsonValue> = (
  event: SimulationEvent<Payload>,
  context: EventContext,
) => unknown;

export type EventPredicate<Payload extends JsonValue = JsonValue> = (
  event: SimulationEvent<Payload>,
) => boolean;

export interface SubscriptionOptions<Payload extends JsonValue = JsonValue> {
  priority?: number;
  once?: boolean;
  filter?: EventPredicate<Payload>;
  signal?: AbortSignal;
  label?: string;
}

export interface Subscription {
  readonly id: number;
  readonly type: string;
  readonly active: boolean;
  unsubscribe(): void;
}

export interface EventReceipt {
  readonly eventId: EventId;
  readonly type: string;
  readonly delivered: number;
  readonly skipped: number;
  readonly cancelled: boolean;
  readonly errors: readonly Error[];
}

export interface ClockStep {
  readonly tick: Tick;
  readonly delta: SimulationMilliseconds;
  readonly elapsed: SimulationMilliseconds;
  readonly realElapsed: SimulationMilliseconds;
}

export interface ClockFrame {
  readonly steps: readonly ClockStep[];
  readonly alpha: number;
  readonly droppedMilliseconds: number;
}

export type SystemPhase =
  | 'bootstrap'
  | 'input'
  | 'preUpdate'
  | 'update'
  | 'postUpdate'
  | 'renderSync'
  | 'cleanup';

export interface SimulationSystemContext {
  readonly tick: Tick;
  readonly delta: SimulationMilliseconds;
  readonly elapsed: SimulationMilliseconds;
  readonly alpha: number;
}

export interface SimulationSystem {
  readonly id: string;
  readonly phase: SystemPhase;
  readonly priority: number;
  readonly enabled: boolean;
  initialize?(): void | Promise<void>;
  update(context: SimulationSystemContext): void;
  dispose?(): void;
}

export interface SimulationPlugin {
  readonly id: string;
  readonly version?: string;
  readonly dependencies?: readonly string[];
}

export interface Disposable {
  dispose(): void;
}

export interface Serializable<TSnapshot extends JsonValue = JsonValue> {
  capture(): TSnapshot;
  restore(snapshot: TSnapshot): void;
}

export interface EntitySnapshot extends JsonObject {
  id: number;
  generation: number;
  enabled: boolean;
  tags: string[];
  components: JsonObject;
}

export interface WorldSnapshot extends JsonObject {
  nextEntityId: number;
  entities: EntitySnapshot[];
  resources: JsonObject;
}

export interface ClockSnapshot extends JsonObject {
  tick: number;
  elapsed: number;
  realElapsed: number;
  accumulator: number;
  speed: number;
  paused: boolean;
}

export interface SchedulerSnapshot extends JsonObject {
  nextTaskId: number;
  tasks: JsonValue[];
}

export interface KernelSnapshot extends JsonObject {
  version: number;
  createdAt: number;
  clock: ClockSnapshot;
  world: WorldSnapshot;
  scheduler: SchedulerSnapshot;
  randomState: JsonValue;
  metadata: JsonObject;
}

export interface KernelConfiguration {
  fixedStepMilliseconds: number;
  maximumSubSteps: number;
  maximumFrameMilliseconds: number;
  eventJournalCapacity: number;
  snapshotCapacity: number;
  randomSeed: number | string;
}

export const DEFAULT_KERNEL_CONFIGURATION: Readonly<KernelConfiguration> = Object.freeze({
  fixedStepMilliseconds: 1000 / 60,
  maximumSubSteps: 8,
  maximumFrameMilliseconds: 250,
  eventJournalCapacity: 4096,
  snapshotCapacity: 120,
  randomSeed: 0x51f15e,
});

export function clamp(value: number, minimum: number, maximum: number): number {
  if (minimum > maximum) {
    throw new RangeError('minimum cannot be greater than maximum');
  }
  return Math.max(minimum, Math.min(maximum, value));
}

export function lerp(from: number, to: number, alpha: number): number {
  return from + (to - from) * clamp(alpha, 0, 1);
}

export function approximatelyEqual(a: number, b: number, epsilon = 1e-9): boolean {
  return Math.abs(a - b) <= epsilon;
}

export function stableStringify(value: JsonValue): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(item => stableStringify(item)).join(',') + ']';
  }
  const entries = Object.entries(value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => JSON.stringify(key) + ':' + stableStringify(item));
  return '{' + entries.join(',') + '}';
}

export function cloneJson<T extends JsonValue>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createCorrelationId(prefix: string, sequence: number): string {
  return prefix + '-' + sequence.toString(36).padStart(6, '0');
}
`);

write('core/PriorityQueue.ts', String.raw`
export interface PriorityQueueNode<T> {
  readonly value: T;
  readonly priority: number;
  readonly sequence: number;
}

export interface PriorityQueueSnapshot<T> {
  readonly sequence: number;
  readonly nodes: readonly PriorityQueueNode<T>[];
}

export class PriorityQueue<T> implements Iterable<T> {
  private readonly heap: PriorityQueueNode<T>[] = [];
  private sequence = 0;

  public constructor(private readonly highestFirst = false) {}

  public get size(): number {
    return this.heap.length;
  }

  public get empty(): boolean {
    return this.heap.length === 0;
  }

  public enqueue(value: T, priority: number): PriorityQueueNode<T> {
    if (!Number.isFinite(priority)) {
      throw new RangeError('priority must be finite');
    }
    const node: PriorityQueueNode<T> = {
      value,
      priority,
      sequence: this.sequence++,
    };
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
    return node;
  }

  public dequeue(): T | undefined {
    return this.dequeueNode()?.value;
  }

  public dequeueNode(): PriorityQueueNode<T> | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }
    if (this.heap.length === 1) {
      return this.heap.pop();
    }
    const root = this.heap[0];
    const tail = this.heap.pop()!;
    this.heap[0] = tail;
    this.sinkDown(0);
    return root;
  }

  public peek(): T | undefined {
    return this.heap[0]?.value;
  }

  public peekNode(): PriorityQueueNode<T> | undefined {
    return this.heap[0];
  }

  public clear(): void {
    this.heap.length = 0;
  }

  public remove(predicate: (value: T) => boolean): number {
    let removed = 0;
    for (let index = this.heap.length - 1; index >= 0; index--) {
      if (!predicate(this.heap[index].value)) {
        continue;
      }
      removed++;
      const tail = this.heap.pop()!;
      if (index >= this.heap.length) {
        continue;
      }
      this.heap[index] = tail;
      const parent = Math.floor((index - 1) / 2);
      if (index > 0 && this.compare(this.heap[index], this.heap[parent]) < 0) {
        this.bubbleUp(index);
      } else {
        this.sinkDown(index);
      }
    }
    return removed;
  }

  public updatePriority(predicate: (value: T) => boolean, priority: number): number {
    if (!Number.isFinite(priority)) {
      throw new RangeError('priority must be finite');
    }
    let updated = 0;
    for (const node of this.heap) {
      if (predicate(node.value)) {
        (node as { priority: number }).priority = priority;
        updated++;
      }
    }
    if (updated > 0) {
      this.heapify();
    }
    return updated;
  }

  public toArray(): T[] {
    return this.sortedNodes().map(node => node.value);
  }

  public toNodeArray(): PriorityQueueNode<T>[] {
    return this.sortedNodes();
  }

  public capture(): PriorityQueueSnapshot<T> {
    return {
      sequence: this.sequence,
      nodes: this.heap.map(node => ({ ...node })),
    };
  }

  public restore(snapshot: PriorityQueueSnapshot<T>): void {
    this.sequence = snapshot.sequence;
    this.heap.length = 0;
    this.heap.push(...snapshot.nodes.map(node => ({ ...node })));
    this.heapify();
  }

  public clone(): PriorityQueue<T> {
    const queue = new PriorityQueue<T>(this.highestFirst);
    queue.restore(this.capture());
    return queue;
  }

  public *[Symbol.iterator](): Iterator<T> {
    for (const node of this.sortedNodes()) {
      yield node.value;
    }
  }

  private sortedNodes(): PriorityQueueNode<T>[] {
    const copy = this.cloneWithoutRecursion();
    const nodes: PriorityQueueNode<T>[] = [];
    while (!copy.empty) {
      nodes.push(copy.dequeueNode()!);
    }
    return nodes;
  }

  private cloneWithoutRecursion(): PriorityQueue<T> {
    const queue = new PriorityQueue<T>(this.highestFirst);
    queue.sequence = this.sequence;
    queue.heap.push(...this.heap.map(node => ({ ...node })));
    return queue;
  }

  private compare(left: PriorityQueueNode<T>, right: PriorityQueueNode<T>): number {
    const priorityComparison = this.highestFirst
      ? right.priority - left.priority
      : left.priority - right.priority;
    if (priorityComparison !== 0) {
      return priorityComparison;
    }
    return left.sequence - right.sequence;
  }

  private bubbleUp(startIndex: number): void {
    let index = startIndex;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parent]) >= 0) {
        break;
      }
      this.swap(index, parent);
      index = parent;
    }
  }

  private sinkDown(startIndex: number): void {
    let index = startIndex;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let best = index;
      if (left < this.heap.length && this.compare(this.heap[left], this.heap[best]) < 0) {
        best = left;
      }
      if (right < this.heap.length && this.compare(this.heap[right], this.heap[best]) < 0) {
        best = right;
      }
      if (best === index) {
        break;
      }
      this.swap(index, best);
      index = best;
    }
  }

  private heapify(): void {
    for (let index = Math.floor(this.heap.length / 2) - 1; index >= 0; index--) {
      this.sinkDown(index);
    }
  }

  private swap(left: number, right: number): void {
    const temporary = this.heap[left];
    this.heap[left] = this.heap[right];
    this.heap[right] = temporary;
  }
}
`);

write('core/DeterministicRandom.ts', String.raw`
import { JsonObject, JsonValue, cloneJson, hashString } from './types';

export interface RandomSnapshot extends JsonObject {
  stateA: number;
  stateB: number;
  stateC: number;
  stateD: number;
  calls: number;
}

export interface WeightedEntry<T> {
  readonly value: T;
  readonly weight: number;
}

export class DeterministicRandom {
  private stateA: number;
  private stateB: number;
  private stateC: number;
  private stateD: number;
  private calls = 0;

  public constructor(seed: number | string = 1) {
    const numericSeed = typeof seed === 'string' ? hashString(seed) : seed >>> 0;
    this.stateA = this.mix(numericSeed ^ 0x9e3779b9);
    this.stateB = this.mix(numericSeed ^ 0x243f6a88);
    this.stateC = this.mix(numericSeed ^ 0xb7e15162);
    this.stateD = this.mix(numericSeed ^ 0xdeadbeef);
    if ((this.stateA | this.stateB | this.stateC | this.stateD) === 0) {
      this.stateD = 1;
    }
  }

  public nextUint32(): number {
    const result = Math.imul(this.rotateLeft(Math.imul(this.stateB, 5), 7), 9) >>> 0;
    const temporary = (this.stateB << 9) >>> 0;
    this.stateC ^= this.stateA;
    this.stateD ^= this.stateB;
    this.stateB ^= this.stateC;
    this.stateA ^= this.stateD;
    this.stateC ^= temporary;
    this.stateD = this.rotateLeft(this.stateD, 11);
    this.calls++;
    return result;
  }

  public next(): number {
    return this.nextUint32() / 0x100000000;
  }

  public float(minimum = 0, maximum = 1): number {
    this.assertRange(minimum, maximum);
    return minimum + (maximum - minimum) * this.next();
  }

  public integer(minimum: number, maximum: number): number {
    if (!Number.isSafeInteger(minimum) || !Number.isSafeInteger(maximum)) {
      throw new RangeError('integer bounds must be safe integers');
    }
    this.assertRange(minimum, maximum);
    const span = maximum - minimum + 1;
    if (span <= 0 || span > 0x100000000) {
      throw new RangeError('integer range is too large');
    }
    const limit = Math.floor(0x100000000 / span) * span;
    let value: number;
    do {
      value = this.nextUint32();
    } while (value >= limit);
    return minimum + (value % span);
  }

  public boolean(probability = 0.5): boolean {
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
      throw new RangeError('probability must be between zero and one');
    }
    return this.next() < probability;
  }

  public sign(): -1 | 1 {
    return this.boolean() ? 1 : -1;
  }

  public angle(): number {
    return this.float(-Math.PI, Math.PI);
  }

  public normal(mean = 0, deviation = 1): number {
    if (!Number.isFinite(mean) || !Number.isFinite(deviation) || deviation < 0) {
      throw new RangeError('normal distribution parameters are invalid');
    }
    let first = 0;
    let second = 0;
    while (first === 0) first = this.next();
    while (second === 0) second = this.next();
    const magnitude = Math.sqrt(-2 * Math.log(first));
    return mean + magnitude * Math.cos(Math.PI * 2 * second) * deviation;
  }

  public triangular(minimum: number, maximum: number, mode: number): number {
    this.assertRange(minimum, maximum);
    if (mode < minimum || mode > maximum) {
      throw new RangeError('mode must be inside the requested range');
    }
    const sample = this.next();
    const split = (mode - minimum) / (maximum - minimum);
    if (sample < split) {
      return minimum + Math.sqrt(sample * (maximum - minimum) * (mode - minimum));
    }
    return maximum - Math.sqrt((1 - sample) * (maximum - minimum) * (maximum - mode));
  }

  public pick<T>(values: readonly T[]): T {
    if (values.length === 0) {
      throw new RangeError('cannot pick from an empty collection');
    }
    return values[this.integer(0, values.length - 1)];
  }

  public pickOrUndefined<T>(values: readonly T[]): T | undefined {
    return values.length === 0 ? undefined : this.pick(values);
  }

  public weighted<T>(entries: readonly WeightedEntry<T>[]): T {
    if (entries.length === 0) {
      throw new RangeError('weighted selection requires entries');
    }
    let total = 0;
    for (const entry of entries) {
      if (!Number.isFinite(entry.weight) || entry.weight < 0) {
        throw new RangeError('weights must be finite and non-negative');
      }
      total += entry.weight;
    }
    if (total <= 0) {
      throw new RangeError('at least one weight must be positive');
    }
    let cursor = this.float(0, total);
    for (const entry of entries) {
      cursor -= entry.weight;
      if (cursor <= 0) {
        return entry.value;
      }
    }
    return entries[entries.length - 1].value;
  }

  public shuffle<T>(values: readonly T[]): T[] {
    const result = [...values];
    this.shuffleInPlace(result);
    return result;
  }

  public shuffleInPlace<T>(values: T[]): void {
    for (let index = values.length - 1; index > 0; index--) {
      const other = this.integer(0, index);
      const temporary = values[index];
      values[index] = values[other];
      values[other] = temporary;
    }
  }

  public sample<T>(values: readonly T[], count: number): T[] {
    if (!Number.isSafeInteger(count) || count < 0 || count > values.length) {
      throw new RangeError('sample size is invalid');
    }
    return this.shuffle(values).slice(0, count);
  }

  public uuid(): string {
    const parts = [
      this.nextUint32().toString(16).padStart(8, '0'),
      this.nextUint32().toString(16).padStart(8, '0'),
      this.nextUint32().toString(16).padStart(8, '0'),
      this.nextUint32().toString(16).padStart(8, '0'),
    ];
    return parts[0] + '-' + parts[1].slice(0, 4) + '-4' + parts[1].slice(5) +
      '-a' + parts[2].slice(1, 4) + '-' + parts[2].slice(4) + parts[3];
  }

  public fork(label: string): DeterministicRandom {
    const snapshot = this.capture();
    const seed = hashString(label + ':' + snapshot.stateA + ':' + snapshot.calls);
    return new DeterministicRandom(seed);
  }

  public skip(count: number): void {
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError('skip count must be a non-negative integer');
    }
    for (let index = 0; index < count; index++) {
      this.nextUint32();
    }
  }

  public capture(): RandomSnapshot {
    return {
      stateA: this.stateA,
      stateB: this.stateB,
      stateC: this.stateC,
      stateD: this.stateD,
      calls: this.calls,
    };
  }

  public restore(snapshot: RandomSnapshot): void {
    this.stateA = snapshot.stateA >>> 0;
    this.stateB = snapshot.stateB >>> 0;
    this.stateC = snapshot.stateC >>> 0;
    this.stateD = snapshot.stateD >>> 0;
    this.calls = snapshot.calls;
  }

  public clone(): DeterministicRandom {
    const random = new DeterministicRandom(1);
    random.restore(cloneJson(this.capture() as JsonValue) as RandomSnapshot);
    return random;
  }

  private assertRange(minimum: number, maximum: number): void {
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || maximum < minimum) {
      throw new RangeError('range bounds are invalid');
    }
  }

  private rotateLeft(value: number, shift: number): number {
    return ((value << shift) | (value >>> (32 - shift))) >>> 0;
  }

  private mix(value: number): number {
    let mixed = value >>> 0;
    mixed = Math.imul(mixed ^ (mixed >>> 16), 0x21f0aaad);
    mixed = Math.imul(mixed ^ (mixed >>> 15), 0x735a2d97);
    return (mixed ^ (mixed >>> 15)) >>> 0;
  }
}
`);

write('core/FixedStepClock.ts', String.raw`
import {
  ClockFrame,
  ClockSnapshot,
  ClockStep,
  SimulationMilliseconds,
  Tick,
  asMilliseconds,
  asTick,
  clamp,
} from './types';

export interface FixedStepClockOptions {
  readonly stepMilliseconds?: number;
  readonly maximumSubSteps?: number;
  readonly maximumFrameMilliseconds?: number;
  readonly speed?: number;
}

export type ClockListener = (step: ClockStep) => void;

export class FixedStepClock {
  private currentTick: Tick = asTick(0);
  private elapsedValue: SimulationMilliseconds = asMilliseconds(0);
  private realElapsedValue: SimulationMilliseconds = asMilliseconds(0);
  private accumulatorValue = 0;
  private speedValue: number;
  private pausedValue = false;
  private readonly beforeStepListeners = new Set<ClockListener>();
  private readonly afterStepListeners = new Set<ClockListener>();

  public readonly stepMilliseconds: number;
  public readonly maximumSubSteps: number;
  public readonly maximumFrameMilliseconds: number;

  public constructor(options: FixedStepClockOptions = {}) {
    this.stepMilliseconds = options.stepMilliseconds ?? 1000 / 60;
    this.maximumSubSteps = options.maximumSubSteps ?? 8;
    this.maximumFrameMilliseconds = options.maximumFrameMilliseconds ?? 250;
    this.speedValue = options.speed ?? 1;
    if (!Number.isFinite(this.stepMilliseconds) || this.stepMilliseconds <= 0) {
      throw new RangeError('stepMilliseconds must be finite and positive');
    }
    if (!Number.isSafeInteger(this.maximumSubSteps) || this.maximumSubSteps <= 0) {
      throw new RangeError('maximumSubSteps must be a positive integer');
    }
    if (!Number.isFinite(this.maximumFrameMilliseconds) || this.maximumFrameMilliseconds <= 0) {
      throw new RangeError('maximumFrameMilliseconds must be finite and positive');
    }
    this.setSpeed(this.speedValue);
  }

  public get tick(): Tick {
    return this.currentTick;
  }

  public get elapsed(): SimulationMilliseconds {
    return this.elapsedValue;
  }

  public get realElapsed(): SimulationMilliseconds {
    return this.realElapsedValue;
  }

  public get accumulator(): number {
    return this.accumulatorValue;
  }

  public get alpha(): number {
    return clamp(this.accumulatorValue / this.stepMilliseconds, 0, 1);
  }

  public get speed(): number {
    return this.speedValue;
  }

  public get paused(): boolean {
    return this.pausedValue;
  }

  public setSpeed(speed: number): void {
    if (!Number.isFinite(speed) || speed < 0 || speed > 32) {
      throw new RangeError('clock speed must be between zero and 32');
    }
    this.speedValue = speed;
  }

  public pause(): void {
    this.pausedValue = true;
  }

  public resume(): void {
    this.pausedValue = false;
  }

  public togglePause(): boolean {
    this.pausedValue = !this.pausedValue;
    return this.pausedValue;
  }

  public reset(): void {
    this.currentTick = asTick(0);
    this.elapsedValue = asMilliseconds(0);
    this.realElapsedValue = asMilliseconds(0);
    this.accumulatorValue = 0;
    this.pausedValue = false;
  }

  public advance(realDeltaMilliseconds: number): ClockFrame {
    if (!Number.isFinite(realDeltaMilliseconds) || realDeltaMilliseconds < 0) {
      throw new RangeError('frame delta must be finite and non-negative');
    }
    const clampedRealDelta = Math.min(realDeltaMilliseconds, this.maximumFrameMilliseconds);
    this.realElapsedValue = asMilliseconds(this.realElapsedValue + clampedRealDelta);
    if (this.pausedValue || this.speedValue === 0) {
      return {
        steps: [],
        alpha: this.alpha,
        droppedMilliseconds: Math.max(0, realDeltaMilliseconds - clampedRealDelta),
      };
    }
    this.accumulatorValue += clampedRealDelta * this.speedValue;
    const steps: ClockStep[] = [];
    let executed = 0;
    while (this.accumulatorValue + Number.EPSILON >= this.stepMilliseconds && executed < this.maximumSubSteps) {
      const step = this.executeStep();
      steps.push(step);
      this.accumulatorValue -= this.stepMilliseconds;
      if (this.accumulatorValue < Number.EPSILON) {
        this.accumulatorValue = 0;
      }
      executed++;
    }
    let droppedMilliseconds = Math.max(0, realDeltaMilliseconds - clampedRealDelta);
    if (executed === this.maximumSubSteps && this.accumulatorValue >= this.stepMilliseconds) {
      const retained = this.accumulatorValue % this.stepMilliseconds;
      droppedMilliseconds += this.accumulatorValue - retained;
      this.accumulatorValue = retained;
    }
    return {
      steps,
      alpha: this.alpha,
      droppedMilliseconds,
    };
  }

  public step(count = 1): readonly ClockStep[] {
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError('manual step count must be a non-negative integer');
    }
    const steps: ClockStep[] = [];
    for (let index = 0; index < count; index++) {
      steps.push(this.executeStep());
    }
    return steps;
  }

  public onBeforeStep(listener: ClockListener): () => void {
    this.beforeStepListeners.add(listener);
    return () => this.beforeStepListeners.delete(listener);
  }

  public onAfterStep(listener: ClockListener): () => void {
    this.afterStepListeners.add(listener);
    return () => this.afterStepListeners.delete(listener);
  }

  public capture(): ClockSnapshot {
    return {
      tick: this.currentTick,
      elapsed: this.elapsedValue,
      realElapsed: this.realElapsedValue,
      accumulator: this.accumulatorValue,
      speed: this.speedValue,
      paused: this.pausedValue,
    };
  }

  public restore(snapshot: ClockSnapshot): void {
    this.currentTick = asTick(snapshot.tick);
    this.elapsedValue = asMilliseconds(snapshot.elapsed);
    this.realElapsedValue = asMilliseconds(snapshot.realElapsed);
    this.accumulatorValue = snapshot.accumulator;
    this.setSpeed(snapshot.speed);
    this.pausedValue = snapshot.paused;
  }

  private executeStep(): ClockStep {
    this.currentTick = asTick(this.currentTick + 1);
    this.elapsedValue = asMilliseconds(this.elapsedValue + this.stepMilliseconds);
    const step: ClockStep = {
      tick: this.currentTick,
      delta: asMilliseconds(this.stepMilliseconds),
      elapsed: this.elapsedValue,
      realElapsed: this.realElapsedValue,
    };
    for (const listener of [...this.beforeStepListeners]) {
      listener(step);
    }
    for (const listener of [...this.afterStepListeners]) {
      listener(step);
    }
    return step;
  }
}
`);

write('events/EventBus.ts', String.raw`
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
`);

write('events/EventJournal.ts', String.raw`
import {
  EventReceipt,
  JsonObject,
  JsonValue,
  SimulationEvent,
  Tick,
  cloneJson,
} from '../core/types';

export interface JournalEntry extends JsonObject {
  sequence: number;
  event: JsonValue;
  receipt: JsonValue;
  checksum: number;
}

export interface EventJournalSnapshot extends JsonObject {
  capacity: number;
  nextSequence: number;
  entries: JournalEntry[];
}

export interface JournalQuery {
  readonly types?: readonly string[];
  readonly fromTick?: Tick;
  readonly toTick?: Tick;
  readonly source?: string;
  readonly tags?: readonly string[];
  readonly correlationId?: string;
  readonly includeTransient?: boolean;
  readonly predicate?: (event: SimulationEvent) => boolean;
}

export interface JournalStatistics {
  readonly size: number;
  readonly capacity: number;
  readonly oldestSequence: number | null;
  readonly newestSequence: number | null;
  readonly byType: ReadonlyMap<string, number>;
  readonly delivered: number;
  readonly failed: number;
}

export class EventJournal {
  private readonly entries: JournalEntry[] = [];
  private nextSequence = 1;

  public constructor(public readonly capacity = 4096) {
    if (!Number.isSafeInteger(capacity) || capacity <= 0) {
      throw new RangeError('journal capacity must be a positive integer');
    }
  }

  public get size(): number {
    return this.entries.length;
  }

  public get empty(): boolean {
    return this.entries.length === 0;
  }

  public append(event: SimulationEvent, receipt: EventReceipt): JournalEntry {
    const entry: JournalEntry = {
      sequence: this.nextSequence++,
      event: cloneJson(event as unknown as JsonValue),
      receipt: cloneJson(receipt as unknown as JsonValue),
      checksum: this.checksum(event),
    };
    this.entries.push(entry);
    while (this.entries.length > this.capacity) {
      this.entries.shift();
    }
    return cloneJson(entry);
  }

  public at(sequence: number): JournalEntry | undefined {
    const entry = this.entries.find(candidate => candidate.sequence === sequence);
    return entry ? cloneJson(entry) : undefined;
  }

  public latest(): JournalEntry | undefined {
    const entry = this.entries[this.entries.length - 1];
    return entry ? cloneJson(entry) : undefined;
  }

  public query(query: JournalQuery = {}): JournalEntry[] {
    const typeSet = query.types ? new Set(query.types) : undefined;
    const tagSet = query.tags ? new Set(query.tags) : undefined;
    return this.entries
      .filter(entry => {
        const event = entry.event as unknown as SimulationEvent;
        if (typeSet && !typeSet.has(event.type)) return false;
        if (query.fromTick !== undefined && event.tick < query.fromTick) return false;
        if (query.toTick !== undefined && event.tick > query.toTick) return false;
        if (query.source !== undefined && event.metadata.source !== query.source) return false;
        if (query.correlationId !== undefined && event.metadata.correlationId !== query.correlationId) return false;
        if (!query.includeTransient && event.metadata.transient) return false;
        if (tagSet && ![...tagSet].every(tag => event.metadata.tags.includes(tag))) return false;
        if (query.predicate && !query.predicate(event)) return false;
        return true;
      })
      .map(entry => cloneJson(entry));
  }

  public events(query: JournalQuery = {}): SimulationEvent[] {
    return this.query(query).map(entry => cloneJson(entry.event) as unknown as SimulationEvent);
  }

  public between(startSequence: number, endSequence: number): JournalEntry[] {
    if (endSequence < startSequence) {
      throw new RangeError('endSequence cannot precede startSequence');
    }
    return this.entries
      .filter(entry => entry.sequence >= startSequence && entry.sequence <= endSequence)
      .map(entry => cloneJson(entry));
  }

  public after(sequence: number): JournalEntry[] {
    return this.entries
      .filter(entry => entry.sequence > sequence)
      .map(entry => cloneJson(entry));
  }

  public before(sequence: number): JournalEntry[] {
    return this.entries
      .filter(entry => entry.sequence < sequence)
      .map(entry => cloneJson(entry));
  }

  public truncateAfter(sequence: number): number {
    let removed = 0;
    while (this.entries.length > 0 && this.entries[this.entries.length - 1].sequence > sequence) {
      this.entries.pop();
      removed++;
    }
    this.nextSequence = Math.max(sequence + 1, this.entries[this.entries.length - 1]?.sequence + 1 || 1);
    return removed;
  }

  public removeWhere(predicate: (event: SimulationEvent) => boolean): number {
    let removed = 0;
    for (let index = this.entries.length - 1; index >= 0; index--) {
      const event = this.entries[index].event as unknown as SimulationEvent;
      if (predicate(event)) {
        this.entries.splice(index, 1);
        removed++;
      }
    }
    return removed;
  }

  public clear(): void {
    this.entries.length = 0;
    this.nextSequence = 1;
  }

  public statistics(): JournalStatistics {
    const byType = new Map<string, number>();
    let delivered = 0;
    let failed = 0;
    for (const entry of this.entries) {
      const event = entry.event as unknown as SimulationEvent;
      const receipt = entry.receipt as unknown as EventReceipt;
      byType.set(event.type, (byType.get(event.type) ?? 0) + 1);
      delivered += receipt.delivered;
      failed += receipt.errors.length;
    }
    return {
      size: this.entries.length,
      capacity: this.capacity,
      oldestSequence: this.entries[0]?.sequence ?? null,
      newestSequence: this.entries[this.entries.length - 1]?.sequence ?? null,
      byType,
      delivered,
      failed,
    };
  }

  public capture(): EventJournalSnapshot {
    return {
      capacity: this.capacity,
      nextSequence: this.nextSequence,
      entries: this.entries.map(entry => cloneJson(entry)),
    };
  }

  public restore(snapshot: EventJournalSnapshot): void {
    this.entries.length = 0;
    const retained = snapshot.entries.slice(-this.capacity);
    this.entries.push(...retained.map(entry => cloneJson(entry)));
    this.nextSequence = snapshot.nextSequence;
  }

  public verify(): { valid: boolean; invalidSequences: number[] } {
    const invalidSequences: number[] = [];
    for (const entry of this.entries) {
      const event = entry.event as unknown as SimulationEvent;
      if (entry.checksum !== this.checksum(event)) {
        invalidSequences.push(entry.sequence);
      }
    }
    return { valid: invalidSequences.length === 0, invalidSequences };
  }

  private checksum(event: SimulationEvent): number {
    const text = JSON.stringify(event);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
}
`);

write('events/EventQueue.ts', String.raw`
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
`);

// Remaining modules are defined below. Keeping the generator in source control
// makes every mechanically generated event contract reproducible.

write('ecs/ComponentStore.ts', String.raw`
import { EntityId, JsonObject, JsonValue, cloneJson } from '../core/types';

export interface ComponentDefinition<T extends JsonValue> {
  readonly key: string;
  readonly createDefault: () => T;
  readonly validate?: (value: T) => boolean;
  readonly clone?: (value: T) => T;
  readonly transient?: boolean;
}

export interface ComponentStoreSnapshot extends JsonObject {
  key: string;
  version: number;
  entries: JsonValue[];
}

export interface ComponentChange<T extends JsonValue> {
  readonly entity: EntityId;
  readonly previous: T | undefined;
  readonly current: T | undefined;
  readonly version: number;
}

export type ComponentListener<T extends JsonValue> = (change: ComponentChange<T>) => void;

export class ComponentStore<T extends JsonValue> implements Iterable<readonly [EntityId, T]> {
  private readonly values = new Map<EntityId, T>();
  private readonly entityVersions = new Map<EntityId, number>();
  private readonly listeners = new Set<ComponentListener<T>>();
  private versionValue = 0;

  public constructor(public readonly definition: ComponentDefinition<T>) {
    if (!definition.key.trim()) {
      throw new TypeError('component key cannot be blank');
    }
  }

  public get key(): string {
    return this.definition.key;
  }

  public get size(): number {
    return this.values.size;
  }

  public get version(): number {
    return this.versionValue;
  }

  public has(entity: EntityId): boolean {
    return this.values.has(entity);
  }

  public get(entity: EntityId): T | undefined {
    return this.values.get(entity);
  }

  public require(entity: EntityId): T {
    const value = this.values.get(entity);
    if (value === undefined) {
      throw new Error('entity ' + entity + ' does not have component ' + this.key);
    }
    return value;
  }

  public getOrCreate(entity: EntityId): T {
    const existing = this.values.get(entity);
    if (existing !== undefined) {
      return existing;
    }
    const value = this.definition.createDefault();
    this.set(entity, value);
    return this.values.get(entity)!;
  }

  public set(entity: EntityId, value: T): T | undefined {
    this.validate(value);
    const previous = this.values.get(entity);
    const stored = this.clone(value);
    this.values.set(entity, stored);
    this.bump(entity);
    this.notify({ entity, previous, current: stored, version: this.versionValue });
    return previous;
  }

  public update(entity: EntityId, updater: (value: T) => T): T {
    const previous = this.require(entity);
    const next = updater(this.clone(previous));
    this.set(entity, next);
    return this.require(entity);
  }

  public patch(entity: EntityId, patch: Partial<T>): T {
    const previous = this.require(entity);
    if (previous === null || Array.isArray(previous) || typeof previous !== 'object') {
      throw new TypeError('patch can only be used with object components');
    }
    const next = { ...previous, ...patch } as T;
    this.set(entity, next);
    return this.require(entity);
  }

  public remove(entity: EntityId): T | undefined {
    const previous = this.values.get(entity);
    if (previous === undefined) {
      return undefined;
    }
    this.values.delete(entity);
    this.bump(entity);
    this.notify({ entity, previous, current: undefined, version: this.versionValue });
    return previous;
  }

  public clear(): void {
    const entities = [...this.values.keys()];
    for (const entity of entities) {
      this.remove(entity);
    }
  }

  public deleteEntities(entities: Iterable<EntityId>): number {
    let removed = 0;
    for (const entity of entities) {
      if (this.remove(entity) !== undefined) {
        removed++;
      }
    }
    return removed;
  }

  public entities(): EntityId[] {
    return [...this.values.keys()];
  }

  public valuesArray(): T[] {
    return [...this.values.values()];
  }

  public entriesArray(): Array<readonly [EntityId, T]> {
    return [...this.values.entries()];
  }

  public filter(predicate: (value: T, entity: EntityId) => boolean): EntityId[] {
    const entities: EntityId[] = [];
    for (const [entity, value] of this.values) {
      if (predicate(value, entity)) {
        entities.push(entity);
      }
    }
    return entities;
  }

  public map<R>(mapper: (value: T, entity: EntityId) => R): R[] {
    const results: R[] = [];
    for (const [entity, value] of this.values) {
      results.push(mapper(value, entity));
    }
    return results;
  }

  public reduce<R>(reducer: (accumulator: R, value: T, entity: EntityId) => R, initial: R): R {
    let accumulator = initial;
    for (const [entity, value] of this.values) {
      accumulator = reducer(accumulator, value, entity);
    }
    return accumulator;
  }

  public versionOf(entity: EntityId): number {
    return this.entityVersions.get(entity) ?? 0;
  }

  public onChange(listener: ComponentListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public capture(): ComponentStoreSnapshot {
    const entries: JsonValue[] = [];
    if (!this.definition.transient) {
      for (const [entity, value] of this.values) {
        entries.push([entity, this.clone(value)] as JsonValue);
      }
    }
    return {
      key: this.key,
      version: this.versionValue,
      entries,
    };
  }

  public restore(snapshot: ComponentStoreSnapshot): void {
    if (snapshot.key !== this.key) {
      throw new Error('cannot restore ' + snapshot.key + ' into store ' + this.key);
    }
    this.values.clear();
    this.entityVersions.clear();
    this.versionValue = snapshot.version;
    for (const rawEntry of snapshot.entries) {
      const [rawEntity, rawValue] = rawEntry as JsonValue[];
      const entity = rawEntity as EntityId;
      const value = rawValue as T;
      this.validate(value);
      this.values.set(entity, this.clone(value));
      this.entityVersions.set(entity, snapshot.version);
    }
  }

  public *[Symbol.iterator](): Iterator<readonly [EntityId, T]> {
    yield* this.values.entries();
  }

  private validate(value: T): void {
    if (this.definition.validate && !this.definition.validate(value)) {
      throw new TypeError('invalid value for component ' + this.key);
    }
  }

  private clone(value: T): T {
    return this.definition.clone ? this.definition.clone(value) : cloneJson(value);
  }

  private bump(entity: EntityId): void {
    this.versionValue++;
    this.entityVersions.set(entity, this.versionValue);
  }

  private notify(change: ComponentChange<T>): void {
    for (const listener of [...this.listeners]) {
      listener(change);
    }
  }
}
`);

write('ecs/EntityWorld.ts', String.raw`
import {
  EntityId,
  EntitySnapshot,
  JsonObject,
  JsonValue,
  WorldSnapshot,
  asEntityId,
  cloneJson,
} from '../core/types';
import {
  ComponentDefinition,
  ComponentStore,
  ComponentStoreSnapshot,
} from './ComponentStore';

export interface EntityRecord {
  readonly id: EntityId;
  generation: number;
  enabled: boolean;
  readonly tags: Set<string>;
}

export interface EntityReference extends JsonObject {
  id: number;
  generation: number;
}

export interface EntityQuery {
  readonly all?: readonly string[];
  readonly any?: readonly string[];
  readonly none?: readonly string[];
  readonly tagsAll?: readonly string[];
  readonly tagsAny?: readonly string[];
  readonly enabled?: boolean;
  readonly predicate?: (entity: EntityId, world: EntityWorld) => boolean;
}

export interface WorldChange {
  readonly kind: 'created' | 'destroyed' | 'enabled' | 'disabled' | 'tagged' | 'untagged';
  readonly entity: EntityId;
  readonly value?: string;
}

export class EntityWorld {
  private readonly entitiesById = new Map<EntityId, EntityRecord>();
  private readonly generations = new Map<EntityId, number>();
  private readonly stores = new Map<string, ComponentStore<JsonValue>>();
  private readonly resources = new Map<string, JsonValue>();
  private readonly listeners = new Set<(change: WorldChange) => void>();
  private readonly recycledIds: EntityId[] = [];
  private nextEntityId = 1;
  private mutationVersion = 0;

  public get size(): number {
    return this.entitiesById.size;
  }

  public get version(): number {
    return this.mutationVersion;
  }

  public create(tags: Iterable<string> = []): EntityId {
    const id = this.recycledIds.pop() ?? asEntityId(this.nextEntityId++);
    const existingGeneration = this.generations.get(id) ?? 0;
    const record: EntityRecord = {
      id,
      generation: existingGeneration + 1,
      enabled: true,
      tags: new Set(tags),
    };
    this.generations.set(id, record.generation);
    this.entitiesById.set(id, record);
    this.bump();
    this.notify({ kind: 'created', entity: id });
    return id;
  }

  public createMany(count: number, tags: Iterable<string> = []): EntityId[] {
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError('entity count must be a non-negative integer');
    }
    const result: EntityId[] = [];
    const materializedTags = [...tags];
    for (let index = 0; index < count; index++) {
      result.push(this.create(materializedTags));
    }
    return result;
  }

  public destroy(entity: EntityId): boolean {
    const record = this.entitiesById.get(entity);
    if (!record) {
      return false;
    }
    for (const store of this.stores.values()) {
      store.remove(entity);
    }
    this.entitiesById.delete(entity);
    this.recycledIds.push(entity);
    this.bump();
    this.notify({ kind: 'destroyed', entity });
    return true;
  }

  public destroyMany(entities: Iterable<EntityId>): number {
    let destroyed = 0;
    for (const entity of entities) {
      if (this.destroy(entity)) {
        destroyed++;
      }
    }
    return destroyed;
  }

  public clear(): void {
    const entities = [...this.entitiesById.keys()];
    this.destroyMany(entities);
    this.resources.clear();
  }

  public exists(entity: EntityId): boolean {
    return this.entitiesById.has(entity);
  }

  public require(entity: EntityId): EntityRecord {
    const record = this.entitiesById.get(entity);
    if (!record) {
      throw new Error('unknown entity ' + entity);
    }
    return record;
  }

  public reference(entity: EntityId): EntityReference {
    const record = this.require(entity);
    return { id: record.id, generation: record.generation };
  }

  public resolve(reference: EntityReference): EntityId | undefined {
    const id = reference.id as EntityId;
    const record = this.entitiesById.get(id);
    return record && record.generation === reference.generation ? id : undefined;
  }

  public isAlive(reference: EntityReference): boolean {
    return this.resolve(reference) !== undefined;
  }

  public enable(entity: EntityId): void {
    const record = this.require(entity);
    if (!record.enabled) {
      record.enabled = true;
      this.bump();
      this.notify({ kind: 'enabled', entity });
    }
  }

  public disable(entity: EntityId): void {
    const record = this.require(entity);
    if (record.enabled) {
      record.enabled = false;
      this.bump();
      this.notify({ kind: 'disabled', entity });
    }
  }

  public isEnabled(entity: EntityId): boolean {
    return this.require(entity).enabled;
  }

  public addTag(entity: EntityId, tag: string): boolean {
    if (!tag.trim()) {
      throw new TypeError('tag cannot be blank');
    }
    const added = !this.require(entity).tags.has(tag);
    if (added) {
      this.require(entity).tags.add(tag);
      this.bump();
      this.notify({ kind: 'tagged', entity, value: tag });
    }
    return added;
  }

  public removeTag(entity: EntityId, tag: string): boolean {
    const removed = this.require(entity).tags.delete(tag);
    if (removed) {
      this.bump();
      this.notify({ kind: 'untagged', entity, value: tag });
    }
    return removed;
  }

  public hasTag(entity: EntityId, tag: string): boolean {
    return this.require(entity).tags.has(tag);
  }

  public tags(entity: EntityId): readonly string[] {
    return [...this.require(entity).tags].sort();
  }

  public register<T extends JsonValue>(definition: ComponentDefinition<T>): ComponentStore<T> {
    if (this.stores.has(definition.key)) {
      throw new Error('component already registered: ' + definition.key);
    }
    const store = new ComponentStore(definition);
    this.stores.set(definition.key, store as unknown as ComponentStore<JsonValue>);
    store.onChange(() => this.bump());
    return store;
  }

  public unregister(key: string): boolean {
    const removed = this.stores.delete(key);
    if (removed) {
      this.bump();
    }
    return removed;
  }

  public store<T extends JsonValue>(key: string): ComponentStore<T> {
    const store = this.stores.get(key);
    if (!store) {
      throw new Error('component is not registered: ' + key);
    }
    return store as unknown as ComponentStore<T>;
  }

  public hasStore(key: string): boolean {
    return this.stores.has(key);
  }

  public add<T extends JsonValue>(entity: EntityId, key: string, value: T): void {
    this.require(entity);
    this.store<T>(key).set(entity, value);
  }

  public get<T extends JsonValue>(entity: EntityId, key: string): T | undefined {
    this.require(entity);
    return this.store<T>(key).get(entity);
  }

  public requireComponent<T extends JsonValue>(entity: EntityId, key: string): T {
    this.require(entity);
    return this.store<T>(key).require(entity);
  }

  public remove(entity: EntityId, key: string): JsonValue | undefined {
    this.require(entity);
    return this.store(key).remove(entity);
  }

  public has(entity: EntityId, key: string): boolean {
    return this.exists(entity) && this.store(key).has(entity);
  }

  public setResource<T extends JsonValue>(key: string, value: T): void {
    if (!key.trim()) {
      throw new TypeError('resource key cannot be blank');
    }
    this.resources.set(key, cloneJson(value));
    this.bump();
  }

  public getResource<T extends JsonValue>(key: string): T | undefined {
    return this.resources.get(key) as T | undefined;
  }

  public requireResource<T extends JsonValue>(key: string): T {
    const value = this.getResource<T>(key);
    if (value === undefined) {
      throw new Error('resource is not registered: ' + key);
    }
    return value;
  }

  public deleteResource(key: string): boolean {
    const deleted = this.resources.delete(key);
    if (deleted) {
      this.bump();
    }
    return deleted;
  }

  public entities(): EntityId[] {
    return [...this.entitiesById.keys()].sort((left, right) => left - right);
  }

  public query(query: EntityQuery = {}): EntityId[] {
    const all = query.all ?? [];
    const any = query.any ?? [];
    const none = query.none ?? [];
    const tagsAll = query.tagsAll ?? [];
    const tagsAny = query.tagsAny ?? [];
    const result: EntityId[] = [];
    for (const record of this.entitiesById.values()) {
      if (query.enabled !== undefined && record.enabled !== query.enabled) continue;
      if (!all.every(key => this.has(record.id, key))) continue;
      if (any.length > 0 && !any.some(key => this.has(record.id, key))) continue;
      if (none.some(key => this.has(record.id, key))) continue;
      if (!tagsAll.every(tag => record.tags.has(tag))) continue;
      if (tagsAny.length > 0 && !tagsAny.some(tag => record.tags.has(tag))) continue;
      if (query.predicate && !query.predicate(record.id, this)) continue;
      result.push(record.id);
    }
    return result.sort((left, right) => left - right);
  }

  public count(query: EntityQuery = {}): number {
    return this.query(query).length;
  }

  public first(query: EntityQuery = {}): EntityId | undefined {
    return this.query(query)[0];
  }

  public onChange(listener: (change: WorldChange) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public capture(): WorldSnapshot {
    const entities: EntitySnapshot[] = [];
    for (const record of this.entitiesById.values()) {
      const components: JsonObject = {};
      for (const [key, store] of this.stores) {
        const value = store.get(record.id);
        if (value !== undefined && !store.definition.transient) {
          components[key] = cloneJson(value);
        }
      }
      entities.push({
        id: record.id,
        generation: record.generation,
        enabled: record.enabled,
        tags: [...record.tags],
        components,
      });
    }
    const resources: JsonObject = {};
    for (const [key, value] of this.resources) {
      resources[key] = cloneJson(value);
    }
    return {
      nextEntityId: this.nextEntityId,
      entities,
      resources,
    };
  }

  public restore(snapshot: WorldSnapshot): void {
    this.entitiesById.clear();
    this.generations.clear();
    this.recycledIds.length = 0;
    for (const store of this.stores.values()) {
      store.clear();
    }
    this.resources.clear();
    this.nextEntityId = snapshot.nextEntityId;
    for (const entitySnapshot of snapshot.entities) {
      const id = asEntityId(entitySnapshot.id);
      this.entitiesById.set(id, {
        id,
        generation: entitySnapshot.generation,
        enabled: entitySnapshot.enabled,
        tags: new Set(entitySnapshot.tags),
      });
      this.generations.set(id, entitySnapshot.generation);
      for (const [key, value] of Object.entries(entitySnapshot.components)) {
        if (this.stores.has(key)) {
          this.store(key).set(id, cloneJson(value));
        }
      }
    }
    for (const [key, value] of Object.entries(snapshot.resources)) {
      this.resources.set(key, cloneJson(value));
    }
    this.bump();
  }

  public captureStores(): ComponentStoreSnapshot[] {
    return [...this.stores.values()].map(store => store.capture());
  }

  private bump(): void {
    this.mutationVersion++;
  }

  private notify(change: WorldChange): void {
    for (const listener of [...this.listeners]) {
      listener(change);
    }
  }
}
`);

write('commands/CommandBus.ts', String.raw`
import {
  CommandId,
  JsonObject,
  JsonValue,
  Result,
  asCommandId,
  cloneJson,
  err,
  ok,
} from '../core/types';

export interface Command<Payload extends JsonValue = JsonValue> {
  readonly id: CommandId;
  readonly type: string;
  readonly payload: Payload;
  readonly issuedBy: string;
  readonly correlationId: string;
}

export interface CommandDraft<Payload extends JsonValue = JsonValue> {
  readonly type: string;
  readonly payload: Payload;
  readonly issuedBy?: string;
  readonly correlationId?: string;
}

export interface CommandExecutionContext {
  readonly depth: number;
  readonly replaying: boolean;
  readonly now: number;
}

export interface CommandOutcome<Value extends JsonValue = JsonValue> extends JsonObject {
  commandId: number;
  commandType: string;
  accepted: boolean;
  value: Value | null;
  error: string | null;
  durationMilliseconds: number;
}

export type CommandHandler<Payload extends JsonValue, Value extends JsonValue> = (
  command: Command<Payload>,
  context: CommandExecutionContext,
) => Value;

export type CommandValidator<Payload extends JsonValue> = (
  command: Command<Payload>,
) => Result<void, Error>;

export type CommandInterceptor = (
  command: Command,
  next: (command: Command) => CommandOutcome,
) => CommandOutcome;

interface HandlerEntry {
  readonly type: string;
  readonly handler: CommandHandler<JsonValue, JsonValue>;
  readonly validators: CommandValidator<JsonValue>[];
}

export class CommandBus {
  private readonly handlers = new Map<string, HandlerEntry>();
  private readonly interceptors: CommandInterceptor[] = [];
  private readonly history: CommandOutcome[] = [];
  private nextCommandId = 1;
  private depth = 0;
  private replaying = false;

  public register<Payload extends JsonValue, Value extends JsonValue>(
    type: string,
    handler: CommandHandler<Payload, Value>,
    validators: readonly CommandValidator<Payload>[] = [],
  ): () => void {
    if (!type.trim()) {
      throw new TypeError('command type cannot be blank');
    }
    if (this.handlers.has(type)) {
      throw new Error('command handler already registered: ' + type);
    }
    this.handlers.set(type, {
      type,
      handler: handler as unknown as CommandHandler<JsonValue, JsonValue>,
      validators: [...validators] as CommandValidator<JsonValue>[],
    });
    return () => this.handlers.delete(type);
  }

  public addValidator<Payload extends JsonValue>(
    type: string,
    validator: CommandValidator<Payload>,
  ): () => void {
    const entry = this.handlers.get(type);
    if (!entry) {
      throw new Error('cannot add validator to unknown command ' + type);
    }
    const normalized = validator as CommandValidator<JsonValue>;
    entry.validators.push(normalized);
    return () => {
      const index = entry.validators.indexOf(normalized);
      if (index >= 0) entry.validators.splice(index, 1);
    };
  }

  public use(interceptor: CommandInterceptor): () => void {
    this.interceptors.push(interceptor);
    return () => {
      const index = this.interceptors.indexOf(interceptor);
      if (index >= 0) this.interceptors.splice(index, 1);
    };
  }

  public create<Payload extends JsonValue>(draft: CommandDraft<Payload>): Command<Payload> {
    const id = asCommandId(this.nextCommandId++);
    return Object.freeze({
      id,
      type: draft.type,
      payload: cloneJson(draft.payload),
      issuedBy: draft.issuedBy ?? 'simulation',
      correlationId: draft.correlationId ?? 'command-' + id.toString(36),
    });
  }

  public execute<Payload extends JsonValue, Value extends JsonValue>(
    draft: CommandDraft<Payload>,
  ): CommandOutcome<Value> {
    return this.executeCommand(this.create(draft)) as CommandOutcome<Value>;
  }

  public executeCommand(command: Command): CommandOutcome {
    const dispatch = this.interceptors.reduceRight<(command: Command) => CommandOutcome>(
      (next, interceptor) => current => interceptor(current, next),
      current => this.invoke(current),
    );
    this.depth++;
    try {
      const outcome = dispatch(command);
      this.history.push(cloneJson(outcome));
      return outcome;
    } finally {
      this.depth--;
    }
  }

  public validate(command: Command): Result<void, Error> {
    const entry = this.handlers.get(command.type);
    if (!entry) {
      return err(new Error('no handler registered for command ' + command.type));
    }
    for (const validator of entry.validators) {
      const result = validator(command);
      if (!result.ok) {
        return result;
      }
    }
    return ok(undefined);
  }

  public canExecute(draft: CommandDraft): boolean {
    const command = this.create(draft);
    return this.validate(command).ok;
  }

  public setReplaying(replaying: boolean): void {
    this.replaying = replaying;
  }

  public outcomes(type?: string): readonly CommandOutcome[] {
    return this.history
      .filter(outcome => type === undefined || outcome.commandType === type)
      .map(outcome => cloneJson(outcome));
  }

  public failures(): readonly CommandOutcome[] {
    return this.history.filter(outcome => !outcome.accepted).map(outcome => cloneJson(outcome));
  }

  public clearHistory(): void {
    this.history.length = 0;
  }

  public clearHandlers(): void {
    this.handlers.clear();
    this.interceptors.length = 0;
  }

  private invoke(command: Command): CommandOutcome {
    const started = this.now();
    const validation = this.validate(command);
    if (!validation.ok) {
      return {
        commandId: command.id,
        commandType: command.type,
        accepted: false,
        value: null,
        error: validation.error.message,
        durationMilliseconds: this.now() - started,
      };
    }
    const entry = this.handlers.get(command.type)!;
    try {
      const value = entry.handler(command, {
        depth: this.depth,
        replaying: this.replaying,
        now: started,
      });
      return {
        commandId: command.id,
        commandType: command.type,
        accepted: true,
        value,
        error: null,
        durationMilliseconds: this.now() - started,
      };
    } catch (error) {
      return {
        commandId: command.id,
        commandType: command.type,
        accepted: false,
        value: null,
        error: error instanceof Error ? error.message : String(error),
        durationMilliseconds: this.now() - started,
      };
    }
  }

  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }
}
`);

write('scheduler/TaskScheduler.ts', String.raw`
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
`);

write('state/SnapshotStore.ts', String.raw`
import { JsonObject, KernelSnapshot, Tick, cloneJson, stableStringify } from '../core/types';

export interface StoredSnapshot {
  readonly tick: Tick;
  readonly label: string;
  readonly checksum: number;
  readonly snapshot: KernelSnapshot;
}

export interface SnapshotDifference extends JsonObject {
  path: string;
  before: string;
  after: string;
}

export class SnapshotStore {
  private readonly snapshots: StoredSnapshot[] = [];

  public constructor(public readonly capacity = 120) {
    if (!Number.isSafeInteger(capacity) || capacity <= 0) {
      throw new RangeError('snapshot capacity must be a positive integer');
    }
  }

  public get size(): number {
    return this.snapshots.length;
  }

  public save(tick: Tick, snapshot: KernelSnapshot, label = ''): StoredSnapshot {
    const stored: StoredSnapshot = {
      tick,
      label,
      checksum: this.checksum(snapshot),
      snapshot: cloneJson(snapshot),
    };
    const existingIndex = this.snapshots.findIndex(candidate => candidate.tick === tick);
    if (existingIndex >= 0) {
      this.snapshots.splice(existingIndex, 1, stored);
    } else {
      this.snapshots.push(stored);
      this.snapshots.sort((left, right) => left.tick - right.tick);
    }
    while (this.snapshots.length > this.capacity) {
      this.snapshots.shift();
    }
    return this.clone(stored);
  }

  public exact(tick: Tick): StoredSnapshot | undefined {
    const snapshot = this.snapshots.find(candidate => candidate.tick === tick);
    return snapshot ? this.clone(snapshot) : undefined;
  }

  public nearestAtOrBefore(tick: Tick): StoredSnapshot | undefined {
    for (let index = this.snapshots.length - 1; index >= 0; index--) {
      if (this.snapshots[index].tick <= tick) {
        return this.clone(this.snapshots[index]);
      }
    }
    return undefined;
  }

  public nearestAtOrAfter(tick: Tick): StoredSnapshot | undefined {
    for (const snapshot of this.snapshots) {
      if (snapshot.tick >= tick) {
        return this.clone(snapshot);
      }
    }
    return undefined;
  }

  public oldest(): StoredSnapshot | undefined {
    const snapshot = this.snapshots[0];
    return snapshot ? this.clone(snapshot) : undefined;
  }

  public newest(): StoredSnapshot | undefined {
    const snapshot = this.snapshots[this.snapshots.length - 1];
    return snapshot ? this.clone(snapshot) : undefined;
  }

  public list(): StoredSnapshot[] {
    return this.snapshots.map(snapshot => this.clone(snapshot));
  }

  public remove(tick: Tick): boolean {
    const index = this.snapshots.findIndex(snapshot => snapshot.tick === tick);
    if (index < 0) return false;
    this.snapshots.splice(index, 1);
    return true;
  }

  public removeBefore(tick: Tick): number {
    let removed = 0;
    while (this.snapshots.length > 0 && this.snapshots[0].tick < tick) {
      this.snapshots.shift();
      removed++;
    }
    return removed;
  }

  public removeAfter(tick: Tick): number {
    let removed = 0;
    while (this.snapshots.length > 0 && this.snapshots[this.snapshots.length - 1].tick > tick) {
      this.snapshots.pop();
      removed++;
    }
    return removed;
  }

  public clear(): void {
    this.snapshots.length = 0;
  }

  public verify(stored: StoredSnapshot): boolean {
    return stored.checksum === this.checksum(stored.snapshot);
  }

  public compare(leftTick: Tick, rightTick: Tick): SnapshotDifference[] {
    const left = this.exact(leftTick);
    const right = this.exact(rightTick);
    if (!left || !right) {
      throw new Error('both snapshots must exist before they can be compared');
    }
    const differences: SnapshotDifference[] = [];
    this.diffValue(left.snapshot, right.snapshot, '', differences);
    return differences;
  }

  private diffValue(
    before: unknown,
    after: unknown,
    path: string,
    differences: SnapshotDifference[],
  ): void {
    if (Object.is(before, after)) {
      return;
    }
    if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object') {
      differences.push({ path: path || '/', before: String(before), after: String(after) });
      return;
    }
    if (Array.isArray(before) || Array.isArray(after)) {
      if (!Array.isArray(before) || !Array.isArray(after)) {
        differences.push({ path: path || '/', before: JSON.stringify(before), after: JSON.stringify(after) });
        return;
      }
      const length = Math.max(before.length, after.length);
      for (let index = 0; index < length; index++) {
        this.diffValue(before[index], after[index], path + '/' + index, differences);
      }
      return;
    }
    const beforeObject = before as Record<string, unknown>;
    const afterObject = after as Record<string, unknown>;
    const keys = new Set([...Object.keys(beforeObject), ...Object.keys(afterObject)]);
    for (const key of [...keys].sort()) {
      this.diffValue(beforeObject[key], afterObject[key], path + '/' + key, differences);
    }
  }

  private checksum(snapshot: KernelSnapshot): number {
    const text = stableStringify(snapshot);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  private clone(snapshot: StoredSnapshot): StoredSnapshot {
    return {
      tick: snapshot.tick,
      label: snapshot.label,
      checksum: snapshot.checksum,
      snapshot: cloneJson(snapshot.snapshot),
    };
  }
}
`);

write('kernel/SystemPipeline.ts', String.raw`
import { SimulationSystem, SimulationSystemContext, SystemPhase } from '../core/types';

const PHASES: readonly SystemPhase[] = [
  'bootstrap',
  'input',
  'preUpdate',
  'update',
  'postUpdate',
  'renderSync',
  'cleanup',
];

export interface SystemExecution {
  readonly systemId: string;
  readonly phase: SystemPhase;
  readonly durationMilliseconds: number;
  readonly succeeded: boolean;
  readonly error?: Error;
}

export class SystemPipeline {
  private readonly systems = new Map<string, SimulationSystem>();
  private ordered: SimulationSystem[] = [];
  private dirty = false;
  private initialized = false;

  public get size(): number {
    return this.systems.size;
  }

  public add(system: SimulationSystem): () => void {
    if (!system.id.trim()) {
      throw new TypeError('system id cannot be blank');
    }
    if (this.systems.has(system.id)) {
      throw new Error('system already exists: ' + system.id);
    }
    this.systems.set(system.id, system);
    this.dirty = true;
    if (this.initialized) {
      void system.initialize?.();
    }
    return () => this.remove(system.id);
  }

  public remove(systemId: string): boolean {
    const system = this.systems.get(systemId);
    if (!system) return false;
    system.dispose?.();
    this.systems.delete(systemId);
    this.dirty = true;
    return true;
  }

  public get(systemId: string): SimulationSystem | undefined {
    return this.systems.get(systemId);
  }

  public has(systemId: string): boolean {
    return this.systems.has(systemId);
  }

  public list(phase?: SystemPhase): readonly SimulationSystem[] {
    this.sortIfNeeded();
    return this.ordered.filter(system => phase === undefined || system.phase === phase);
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    this.sortIfNeeded();
    for (const system of this.ordered) {
      await system.initialize?.();
    }
    this.initialized = true;
  }

  public execute(context: SimulationSystemContext, phase?: SystemPhase): readonly SystemExecution[] {
    this.sortIfNeeded();
    const executions: SystemExecution[] = [];
    for (const system of this.ordered) {
      if (!system.enabled || (phase !== undefined && system.phase !== phase)) {
        continue;
      }
      const started = this.now();
      try {
        system.update(context);
        executions.push({
          systemId: system.id,
          phase: system.phase,
          durationMilliseconds: this.now() - started,
          succeeded: true,
        });
      } catch (error) {
        executions.push({
          systemId: system.id,
          phase: system.phase,
          durationMilliseconds: this.now() - started,
          succeeded: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }
    return executions;
  }

  public executeAll(context: SimulationSystemContext): readonly SystemExecution[] {
    return this.execute(context);
  }

  public clear(): void {
    for (const system of this.systems.values()) {
      system.dispose?.();
    }
    this.systems.clear();
    this.ordered = [];
    this.dirty = false;
    this.initialized = false;
  }

  private sortIfNeeded(): void {
    if (!this.dirty) return;
    this.ordered = [...this.systems.values()].sort((left, right) => {
      const phaseComparison = PHASES.indexOf(left.phase) - PHASES.indexOf(right.phase);
      return phaseComparison || right.priority - left.priority || left.id.localeCompare(right.id);
    });
    this.dirty = false;
  }

  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }
}
`);

write('kernel/SimulationKernel.ts', String.raw`
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
`);

const eventDefinitions = [
  ['SimulationStarted', 'simulation.started', [['sessionId', 'string'], ['seed', 'number'], ['difficulty', 'string']]],
  ['SimulationStopped', 'simulation.stopped', [['sessionId', 'string'], ['reason', 'string'], ['finalTick', 'number']]],
  ['SimulationPaused', 'simulation.paused', [['reason', 'string'], ['tick', 'number'], ['requestedBy', 'string']]],
  ['SimulationResumed', 'simulation.resumed', [['tick', 'number'], ['requestedBy', 'string'], ['pauseDuration', 'number']]],
  ['TickStarted', 'simulation.tick.started', [['tick', 'number'], ['delta', 'number'], ['elapsed', 'number']]],
  ['TickCompleted', 'simulation.tick.completed', [['tick', 'number'], ['delta', 'number'], ['systemsExecuted', 'number'], ['systemsFailed', 'number']]],
  ['FrameStarted', 'simulation.frame.started', [['frame', 'number'], ['realDelta', 'number'], ['speed', 'number']]],
  ['FrameCompleted', 'simulation.frame.completed', [['frame', 'number'], ['steps', 'number'], ['alpha', 'number'], ['dropped', 'number']]],
  ['RollbackRequested', 'simulation.rollback.requested', [['targetTick', 'number'], ['reason', 'string'], ['requestedBy', 'string']]],
  ['RollbackCompleted', 'simulation.rollback.completed', [['requestedTick', 'number'], ['restoredTick', 'number'], ['eventsReplayed', 'number']]],
  ['EntityCreated', 'entity.created', [['entityId', 'number'], ['archetype', 'string'], ['tags', 'string[]']]],
  ['EntityDestroyed', 'entity.destroyed', [['entityId', 'number'], ['reason', 'string'], ['killerId', 'number']]],
  ['EntityEnabled', 'entity.enabled', [['entityId', 'number'], ['source', 'string']]],
  ['EntityDisabled', 'entity.disabled', [['entityId', 'number'], ['source', 'string']]],
  ['EntityTagged', 'entity.tagged', [['entityId', 'number'], ['tag', 'string']]],
  ['EntityUntagged', 'entity.untagged', [['entityId', 'number'], ['tag', 'string']]],
  ['ComponentAdded', 'component.added', [['entityId', 'number'], ['component', 'string'], ['version', 'number']]],
  ['ComponentChanged', 'component.changed', [['entityId', 'number'], ['component', 'string'], ['version', 'number']]],
  ['ComponentRemoved', 'component.removed', [['entityId', 'number'], ['component', 'string'], ['version', 'number']]],
  ['ResourceChanged', 'resource.changed', [['resource', 'string'], ['version', 'number'], ['source', 'string']]],
  ['MoveRequested', 'movement.requested', [['entityId', 'number'], ['fromX', 'number'], ['fromY', 'number'], ['toX', 'number'], ['toY', 'number']]],
  ['MoveStarted', 'movement.started', [['entityId', 'number'], ['directionX', 'number'], ['directionY', 'number'], ['speed', 'number']]],
  ['MoveCompleted', 'movement.completed', [['entityId', 'number'], ['x', 'number'], ['y', 'number'], ['distance', 'number']]],
  ['MoveBlocked', 'movement.blocked', [['entityId', 'number'], ['x', 'number'], ['y', 'number'], ['obstacleId', 'number'], ['reason', 'string']]],
  ['VelocityChanged', 'movement.velocity.changed', [['entityId', 'number'], ['velocityX', 'number'], ['velocityY', 'number'], ['source', 'string']]],
  ['PositionChanged', 'movement.position.changed', [['entityId', 'number'], ['previousX', 'number'], ['previousY', 'number'], ['x', 'number'], ['y', 'number']]],
  ['TeleportStarted', 'movement.teleport.started', [['entityId', 'number'], ['targetX', 'number'], ['targetY', 'number'], ['portalId', 'number']]],
  ['TeleportCompleted', 'movement.teleport.completed', [['entityId', 'number'], ['x', 'number'], ['y', 'number'], ['portalId', 'number']]],
  ['DodgeStarted', 'movement.dodge.started', [['entityId', 'number'], ['directionX', 'number'], ['directionY', 'number'], ['duration', 'number']]],
  ['DodgeCompleted', 'movement.dodge.completed', [['entityId', 'number'], ['distance', 'number'], ['perfect', 'boolean']]],
  ['AttackRequested', 'combat.attack.requested', [['attackerId', 'number'], ['targetId', 'number'], ['abilityId', 'string'], ['sequence', 'number']]],
  ['AttackStarted', 'combat.attack.started', [['attackerId', 'number'], ['targetId', 'number'], ['abilityId', 'string'], ['windup', 'number']]],
  ['AttackReleased', 'combat.attack.released', [['attackerId', 'number'], ['abilityId', 'string'], ['x', 'number'], ['y', 'number'], ['angle', 'number']]],
  ['AttackCompleted', 'combat.attack.completed', [['attackerId', 'number'], ['abilityId', 'string'], ['hits', 'number'], ['damage', 'number']]],
  ['AttackCancelled', 'combat.attack.cancelled', [['attackerId', 'number'], ['abilityId', 'string'], ['reason', 'string']]],
  ['DamageCalculated', 'combat.damage.calculated', [['sourceId', 'number'], ['targetId', 'number'], ['base', 'number'], ['multiplier', 'number'], ['result', 'number']]],
  ['DamageApplied', 'combat.damage.applied', [['sourceId', 'number'], ['targetId', 'number'], ['amount', 'number'], ['damageType', 'string'], ['critical', 'boolean']]],
  ['DamagePrevented', 'combat.damage.prevented', [['sourceId', 'number'], ['targetId', 'number'], ['amount', 'number'], ['reason', 'string']]],
  ['HealingApplied', 'combat.healing.applied', [['sourceId', 'number'], ['targetId', 'number'], ['amount', 'number'], ['overheal', 'number']]],
  ['ShieldChanged', 'combat.shield.changed', [['entityId', 'number'], ['previous', 'number'], ['current', 'number'], ['source', 'string']]],
  ['HealthChanged', 'combat.health.changed', [['entityId', 'number'], ['previous', 'number'], ['current', 'number'], ['maximum', 'number']]],
  ['ManaChanged', 'combat.mana.changed', [['entityId', 'number'], ['previous', 'number'], ['current', 'number'], ['maximum', 'number']]],
  ['EntityDefeated', 'combat.entity.defeated', [['entityId', 'number'], ['killerId', 'number'], ['abilityId', 'string'], ['overkill', 'number']]],
  ['ProjectileSpawned', 'combat.projectile.spawned', [['projectileId', 'number'], ['ownerId', 'number'], ['abilityId', 'string'], ['speed', 'number']]],
  ['ProjectileMoved', 'combat.projectile.moved', [['projectileId', 'number'], ['x', 'number'], ['y', 'number'], ['remainingLifetime', 'number']]],
  ['ProjectileHit', 'combat.projectile.hit', [['projectileId', 'number'], ['targetId', 'number'], ['damage', 'number'], ['piercingRemaining', 'number']]],
  ['ProjectileExpired', 'combat.projectile.expired', [['projectileId', 'number'], ['reason', 'string'], ['x', 'number'], ['y', 'number']]],
  ['ComboStarted', 'combat.combo.started', [['entityId', 'number'], ['comboId', 'string'], ['input', 'string']]],
  ['ComboAdvanced', 'combat.combo.advanced', [['entityId', 'number'], ['comboId', 'string'], ['step', 'number'], ['input', 'string']]],
  ['ComboCompleted', 'combat.combo.completed', [['entityId', 'number'], ['comboId', 'string'], ['hits', 'number'], ['score', 'number']]],
  ['ComboBroken', 'combat.combo.broken', [['entityId', 'number'], ['comboId', 'string'], ['reason', 'string']]],
  ['StatusApplied', 'status.applied', [['entityId', 'number'], ['statusId', 'string'], ['stacks', 'number'], ['duration', 'number']]],
  ['StatusRefreshed', 'status.refreshed', [['entityId', 'number'], ['statusId', 'string'], ['stacks', 'number'], ['duration', 'number']]],
  ['StatusTicked', 'status.ticked', [['entityId', 'number'], ['statusId', 'string'], ['stacks', 'number'], ['remaining', 'number']]],
  ['StatusRemoved', 'status.removed', [['entityId', 'number'], ['statusId', 'string'], ['reason', 'string']]],
  ['BuffApplied', 'status.buff.applied', [['entityId', 'number'], ['attribute', 'string'], ['amount', 'number'], ['duration', 'number']]],
  ['DebuffApplied', 'status.debuff.applied', [['entityId', 'number'], ['attribute', 'string'], ['amount', 'number'], ['duration', 'number']]],
  ['ImmunityGranted', 'status.immunity.granted', [['entityId', 'number'], ['immunity', 'string'], ['duration', 'number']]],
  ['ImmunityExpired', 'status.immunity.expired', [['entityId', 'number'], ['immunity', 'string']]],
  ['ItemSpawned', 'inventory.item.spawned', [['itemId', 'number'], ['itemType', 'string'], ['x', 'number'], ['y', 'number']]],
  ['ItemPickedUp', 'inventory.item.pickedUp', [['entityId', 'number'], ['itemId', 'number'], ['itemType', 'string'], ['quantity', 'number']]],
  ['ItemDropped', 'inventory.item.dropped', [['entityId', 'number'], ['itemId', 'number'], ['quantity', 'number'], ['x', 'number'], ['y', 'number']]],
  ['ItemConsumed', 'inventory.item.consumed', [['entityId', 'number'], ['itemId', 'number'], ['quantity', 'number'], ['effect', 'string']]],
  ['ItemEquipped', 'inventory.item.equipped', [['entityId', 'number'], ['itemId', 'number'], ['slot', 'string']]],
  ['ItemUnequipped', 'inventory.item.unequipped', [['entityId', 'number'], ['itemId', 'number'], ['slot', 'string']]],
  ['InventoryChanged', 'inventory.changed', [['entityId', 'number'], ['slotsUsed', 'number'], ['capacity', 'number'], ['reason', 'string']]],
  ['CurrencyChanged', 'inventory.currency.changed', [['entityId', 'number'], ['currency', 'string'], ['previous', 'number'], ['current', 'number']]],
  ['PurchaseRequested', 'inventory.purchase.requested', [['entityId', 'number'], ['itemType', 'string'], ['quantity', 'number'], ['price', 'number']]],
  ['PurchaseCompleted', 'inventory.purchase.completed', [['entityId', 'number'], ['itemType', 'string'], ['quantity', 'number'], ['price', 'number']]],
  ['RoomEntered', 'world.room.entered', [['entityId', 'number'], ['roomId', 'string'], ['fromRoomId', 'string']]],
  ['RoomExited', 'world.room.exited', [['entityId', 'number'], ['roomId', 'string'], ['toRoomId', 'string']]],
  ['DoorOpened', 'world.door.opened', [['doorId', 'number'], ['entityId', 'number'], ['roomId', 'string']]],
  ['DoorClosed', 'world.door.closed', [['doorId', 'number'], ['entityId', 'number'], ['roomId', 'string']]],
  ['DoorLocked', 'world.door.locked', [['doorId', 'number'], ['lockId', 'string'], ['roomId', 'string']]],
  ['DoorUnlocked', 'world.door.unlocked', [['doorId', 'number'], ['keyId', 'string'], ['entityId', 'number']]],
  ['WaveStarted', 'world.wave.started', [['roomId', 'string'], ['wave', 'number'], ['enemyCount', 'number']]],
  ['WaveCompleted', 'world.wave.completed', [['roomId', 'string'], ['wave', 'number'], ['duration', 'number']]],
  ['EncounterStarted', 'world.encounter.started', [['encounterId', 'string'], ['roomId', 'string'], ['difficulty', 'number']]],
  ['EncounterCompleted', 'world.encounter.completed', [['encounterId', 'string'], ['roomId', 'string'], ['score', 'number'], ['duration', 'number']]],
  ['ObjectiveStarted', 'progression.objective.started', [['objectiveId', 'string'], ['description', 'string'], ['target', 'number']]],
  ['ObjectiveProgressed', 'progression.objective.progressed', [['objectiveId', 'string'], ['previous', 'number'], ['current', 'number'], ['target', 'number']]],
  ['ObjectiveCompleted', 'progression.objective.completed', [['objectiveId', 'string'], ['rewardId', 'string'], ['score', 'number']]],
  ['ExperienceChanged', 'progression.experience.changed', [['entityId', 'number'], ['previous', 'number'], ['current', 'number'], ['source', 'string']]],
  ['LevelGained', 'progression.level.gained', [['entityId', 'number'], ['previousLevel', 'number'], ['currentLevel', 'number'], ['points', 'number']]],
  ['AchievementUnlocked', 'progression.achievement.unlocked', [['achievementId', 'string'], ['entityId', 'number'], ['title', 'string']]],
  ['CheckpointReached', 'progression.checkpoint.reached', [['checkpointId', 'string'], ['roomId', 'string'], ['tick', 'number']]],
  ['RunCompleted', 'progression.run.completed', [['result', 'string'], ['score', 'number'], ['duration', 'number'], ['roomsCleared', 'number']]],
  ['InputPressed', 'input.pressed', [['device', 'string'], ['action', 'string'], ['value', 'number'], ['player', 'number']]],
  ['InputReleased', 'input.released', [['device', 'string'], ['action', 'string'], ['value', 'number'], ['player', 'number']]],
  ['PointerMoved', 'input.pointer.moved', [['x', 'number'], ['y', 'number'], ['worldX', 'number'], ['worldY', 'number']]],
  ['PointerPressed', 'input.pointer.pressed', [['button', 'number'], ['worldX', 'number'], ['worldY', 'number']]],
  ['PointerReleased', 'input.pointer.released', [['button', 'number'], ['worldX', 'number'], ['worldY', 'number']]],
  ['MenuOpened', 'ui.menu.opened', [['menuId', 'string'], ['source', 'string'], ['pausesSimulation', 'boolean']]],
  ['MenuClosed', 'ui.menu.closed', [['menuId', 'string'], ['source', 'string'], ['duration', 'number']]],
  ['NotificationShown', 'ui.notification.shown', [['notificationId', 'string'], ['message', 'string'], ['severity', 'string'], ['duration', 'number']]],
  ['SettingChanged', 'ui.setting.changed', [['setting', 'string'], ['previous', 'string'], ['current', 'string']]],
  ['DiagnosticMeasured', 'diagnostic.measured', [['metric', 'string'], ['value', 'number'], ['unit', 'string'], ['tick', 'number']]],
  ['InvariantViolated', 'diagnostic.invariant.violated', [['invariant', 'string'], ['message', 'string'], ['entityId', 'number'], ['fatal', 'boolean']]],
  ['SystemFailed', 'diagnostic.system.failed', [['systemId', 'string'], ['phase', 'string'], ['message', 'string'], ['tick', 'number']]],
  ['PerformanceBudgetExceeded', 'diagnostic.performance.exceeded', [['systemId', 'string'], ['duration', 'number'], ['budget', 'number'], ['tick', 'number']]],
];

function defaultExpression(type) {
  if (type === 'string') return "''";
  if (type === 'number') return '0';
  if (type === 'boolean') return 'false';
  if (type === 'string[]') return '[]';
  return 'null';
}

function validationExpression(name, type) {
  if (type === 'string') return `typeof payload.${name} === 'string'`;
  if (type === 'number') return `typeof payload.${name} === 'number' && Number.isFinite(payload.${name})`;
  if (type === 'boolean') return `typeof payload.${name} === 'boolean'`;
  if (type === 'string[]') return `Array.isArray(payload.${name}) && payload.${name}.every(value => typeof value === 'string')`;
  return `payload.${name} !== undefined`;
}

for (const [name, type, fields] of eventDefinitions) {
  const interfaceFields = fields.map(([field, fieldType]) => `  ${field}: ${fieldType};`).join('\n');
  const defaults = fields.map(([field, fieldType]) => `    ${field}: ${defaultExpression(fieldType)},`).join('\n');
  const validations = fields.map(([field, fieldType]) => `    ${validationExpression(field, fieldType)}`).join(' &&\n');
  const comparisons = fields.map(([field, fieldType]) => fieldType.endsWith('[]')
    ? `    JSON.stringify(left.${field}) === JSON.stringify(right.${field})`
    : `    left.${field} === right.${field}`).join(' &&\n');
  write(`events/contracts/${name}.ts`, `
import {
  EventDraft,
  EventMetadata,
  JsonObject,
  SimulationEvent,
  cloneJson,
} from '../../core/types';

export const ${name}Type = '${type}' as const;

export interface ${name}Payload extends JsonObject {
${interfaceFields}
}

export type ${name}Event = SimulationEvent<${name}Payload>;

export function create${name}Payload(
  overrides: Partial<${name}Payload> = {},
): ${name}Payload {
  return {
${defaults}
    ...overrides,
  };
}

export function create${name}Draft(
  payload: ${name}Payload,
  metadata: Partial<EventMetadata> = {},
): EventDraft<${name}Payload> {
  if (!validate${name}Payload(payload)) {
    throw new TypeError('Invalid payload for ${type}');
  }
  return {
    type: ${name}Type,
    payload: clone${name}Payload(payload),
    metadata,
  };
}

export function is${name}Event(
  event: SimulationEvent,
): event is ${name}Event {
  return event.type === ${name}Type && validate${name}Payload(event.payload);
}

export function validate${name}Payload(
  value: unknown,
): value is ${name}Payload {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const payload = value as Partial<${name}Payload>;
  return (
${validations}
  );
}

export function clone${name}Payload(
  payload: ${name}Payload,
): ${name}Payload {
  return cloneJson(payload);
}

export function equal${name}Payload(
  left: ${name}Payload,
  right: ${name}Payload,
): boolean {
  return (
${comparisons}
  );
}

export function serialize${name}Payload(
  payload: ${name}Payload,
): string {
  if (!validate${name}Payload(payload)) {
    throw new TypeError('Cannot serialize invalid ${type} payload');
  }
  return JSON.stringify(payload);
}

export function deserialize${name}Payload(
  serialized: string,
): ${name}Payload {
  const value: unknown = JSON.parse(serialized);
  if (!validate${name}Payload(value)) {
    throw new TypeError('Serialized value is not a ${type} payload');
  }
  return clone${name}Payload(value);
}
`);
}

const contractExports = eventDefinitions
  .map(([name]) => `export * from './contracts/${name}';`)
  .join('\n');
write('events/catalog.ts', contractExports);

const registryImports = eventDefinitions
  .map(([name]) => `import { ${name}Type, validate${name}Payload } from './contracts/${name}';`)
  .join('\n');
const registryEntries = eventDefinitions
  .map(([name]) => `  [${name}Type, validate${name}Payload],`)
  .join('\n');
write('events/EventRegistry.ts', `
import { EventDraft, JsonValue, SimulationEvent } from '../core/types';
${registryImports}

export type EventPayloadValidator = (value: unknown) => value is JsonValue;

export class EventRegistry {
  private readonly validators = new Map<string, EventPayloadValidator>();

  public register(type: string, validator: EventPayloadValidator): () => void {
    if (this.validators.has(type)) {
      throw new Error('event type already registered: ' + type);
    }
    this.validators.set(type, validator);
    return () => this.validators.delete(type);
  }

  public replace(type: string, validator: EventPayloadValidator): void {
    this.validators.set(type, validator);
  }

  public unregister(type: string): boolean {
    return this.validators.delete(type);
  }

  public has(type: string): boolean {
    return this.validators.has(type);
  }

  public validateDraft(draft: EventDraft): boolean {
    return this.validators.get(draft.type)?.(draft.payload) ?? false;
  }

  public validateEvent(event: SimulationEvent): boolean {
    return this.validators.get(event.type)?.(event.payload) ?? false;
  }

  public types(): readonly string[] {
    return [...this.validators.keys()].sort();
  }

  public clear(): void {
    this.validators.clear();
  }
}

export function createDefaultEventRegistry(): EventRegistry {
  const registry = new EventRegistry();
  const definitions: ReadonlyArray<readonly [string, EventPayloadValidator]> = [
${registryEntries}
  ];
  for (const [type, validator] of definitions) {
    registry.register(type, validator);
  }
  return registry;
}
`);

write('index.ts', `
export * from './core/types';
export * from './core/PriorityQueue';
export * from './core/DeterministicRandom';
export * from './core/FixedStepClock';
export * from './events/EventBus';
export * from './events/EventJournal';
export * from './events/EventQueue';
export * from './events/EventRegistry';
export * from './events/catalog';
export * from './ecs/ComponentStore';
export * from './ecs/EntityWorld';
export * from './commands/CommandBus';
export * from './scheduler/TaskScheduler';
export * from './state/SnapshotStore';
export * from './kernel/SystemPipeline';
export * from './kernel/SimulationKernel';
export * from './integration/GameSimulationBridge';
`);

console.log('Simulation core generated at ' + root);
