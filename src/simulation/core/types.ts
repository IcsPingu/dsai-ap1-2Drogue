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
