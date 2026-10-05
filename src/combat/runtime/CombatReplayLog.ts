import { CastRequest, CombatEvent, CombatantId, Vec2 } from '../core/types';
import { CombatRuntimeSnapshot } from './CombatRuntime';

export type ReplayCommandKind = 'cast' | 'move' | 'face' | 'combo-input' | 'add-combatant' | 'remove-combatant' | 'custom';

export interface ReplayCommand {
  id: number;
  time: number;
  kind: ReplayCommandKind;
  combatantId?: CombatantId;
  payload: unknown;
}

export interface ReplayCheckpoint {
  id: number;
  time: number;
  label: string;
  snapshot: CombatRuntimeSnapshot;
  commandIndex: number;
  eventIndex: number;
  checksum: string;
}

export interface CombatReplayData {
  version: number;
  seed: string;
  duration: number;
  commands: ReplayCommand[];
  events: CombatEvent[];
  checkpoints: ReplayCheckpoint[];
  metadata: Record<string, string | number | boolean>;
  checksum: string;
}

export class CombatReplayLog {
  private readonly commands: ReplayCommand[] = [];
  private readonly events: CombatEvent[] = [];
  private readonly checkpoints: ReplayCheckpoint[] = [];
  private readonly metadata: Record<string, string | number | boolean> = {};
  private commandSequence = 0;
  private checkpointSequence = 0;
  private duration = 0;

  public constructor(private readonly seed: string) {}

  public recordCommand(time: number, kind: ReplayCommandKind, payload: unknown, combatantId?: CombatantId): ReplayCommand {
    this.assertTime(time);
    const command: ReplayCommand = { id: ++this.commandSequence, time, kind, combatantId, payload: this.clone(payload) };
    this.commands.push(command);
    this.duration = Math.max(this.duration, time);
    return this.clone(command);
  }

  public recordCast(time: number, request: CastRequest): ReplayCommand {
    return this.recordCommand(time, 'cast', { ...request, targetPosition: request.targetPosition ? { ...request.targetPosition } : undefined, direction: request.direction ? { ...request.direction } : undefined }, request.casterId);
  }

  public recordMove(time: number, combatantId: CombatantId, position: Vec2): ReplayCommand {
    return this.recordCommand(time, 'move', { position: { ...position } }, combatantId);
  }

  public recordFace(time: number, combatantId: CombatantId, direction: Vec2): ReplayCommand {
    return this.recordCommand(time, 'face', { direction: { ...direction } }, combatantId);
  }

  public recordEvent(event: CombatEvent): void {
    this.assertTime(event.time);
    this.events.push(this.clone(event));
    this.duration = Math.max(this.duration, event.time);
  }

  public recordEvents(events: readonly CombatEvent[]): void { for (const event of events) this.recordEvent(event); }

  public checkpoint(time: number, label: string, snapshot: CombatRuntimeSnapshot): ReplayCheckpoint {
    this.assertTime(time);
    const checkpoint: ReplayCheckpoint = {
      id: ++this.checkpointSequence,
      time,
      label,
      snapshot: this.clone(snapshot),
      commandIndex: this.commands.length,
      eventIndex: this.events.length,
      checksum: this.hash(this.stableStringify(snapshot)),
    };
    this.checkpoints.push(checkpoint);
    this.duration = Math.max(this.duration, time);
    return this.clone(checkpoint);
  }

  public setMetadata(key: string, value: string | number | boolean): void {
    if (!key.trim()) throw new Error('metadata key cannot be empty');
    this.metadata[key] = value;
  }

  public commandsBetween(start: number, end: number): ReplayCommand[] {
    this.assertRange(start, end);
    return this.commands.filter((command) => command.time >= start && command.time <= end).map((command) => this.clone(command));
  }

  public eventsBetween(start: number, end: number): CombatEvent[] {
    this.assertRange(start, end);
    return this.events.filter((event) => event.time >= start && event.time <= end).map((event) => this.clone(event));
  }

  public nearestCheckpoint(time: number): ReplayCheckpoint | undefined {
    this.assertTime(time);
    const checkpoint = [...this.checkpoints].filter((entry) => entry.time <= time).sort((left, right) => right.time - left.time)[0];
    return checkpoint ? this.clone(checkpoint) : undefined;
  }

  public branch(time: number, newSeed: string): CombatReplayLog {
    this.assertTime(time);
    const result = new CombatReplayLog(newSeed);
    for (const command of this.commands.filter((entry) => entry.time <= time)) result.recordCommand(command.time, command.kind, command.payload, command.combatantId);
    for (const event of this.events.filter((entry) => entry.time <= time)) result.recordEvent(event);
    for (const checkpoint of this.checkpoints.filter((entry) => entry.time <= time)) result.checkpoint(checkpoint.time, checkpoint.label, checkpoint.snapshot);
    for (const [key, value] of Object.entries(this.metadata)) result.setMetadata(key, value);
    result.setMetadata('branchedAt', time);
    result.setMetadata('parentChecksum', this.toData().checksum);
    return result;
  }

  public truncate(time: number): void {
    this.assertTime(time);
    this.removeAfter(this.commands, time);
    this.removeAfter(this.events, time);
    this.removeAfter(this.checkpoints, time);
    this.duration = time;
  }

  public verifyCheckpoints(): Array<{ id: number; valid: boolean; expected: string; actual: string }> {
    return this.checkpoints.map((checkpoint) => {
      const actual = this.hash(this.stableStringify(checkpoint.snapshot));
      return { id: checkpoint.id, valid: actual === checkpoint.checksum, expected: checkpoint.checksum, actual };
    });
  }

  public toData(): CombatReplayData {
    const withoutChecksum = {
      version: 1,
      seed: this.seed,
      duration: this.duration,
      commands: this.commands.map((command) => this.clone(command)),
      events: this.events.map((event) => this.clone(event)),
      checkpoints: this.checkpoints.map((checkpoint) => this.clone(checkpoint)),
      metadata: { ...this.metadata },
    };
    return { ...withoutChecksum, checksum: this.hash(this.stableStringify(withoutChecksum)) };
  }

  public serialize(pretty = false): string { return JSON.stringify(this.toData(), null, pretty ? 2 : 0); }

  public static deserialize(serialized: string): CombatReplayLog {
    const data = JSON.parse(serialized) as CombatReplayData;
    if (data.version !== 1) throw new Error('unsupported combat replay version: ' + data.version);
    const replay = new CombatReplayLog(data.seed);
    for (const command of data.commands) replay.recordCommand(command.time, command.kind, command.payload, command.combatantId);
    for (const event of data.events) replay.recordEvent(event);
    for (const checkpoint of data.checkpoints) replay.checkpoint(checkpoint.time, checkpoint.label, checkpoint.snapshot);
    for (const [key, value] of Object.entries(data.metadata)) replay.setMetadata(key, value);
    const actual = replay.toData().checksum;
    if (actual !== data.checksum) throw new Error('combat replay checksum mismatch');
    return replay;
  }

  private removeAfter<T extends { time: number }>(values: T[], time: number): void {
    for (let index = values.length - 1; index >= 0; index--) if (values[index].time > time) values.splice(index, 1);
  }

  private assertTime(time: number): void { if (!Number.isFinite(time) || time < 0) throw new RangeError('replay time must be finite and non-negative'); }
  private assertRange(start: number, end: number): void { this.assertTime(start); this.assertTime(end); if (end < start) throw new RangeError('replay range is reversed'); }
  private clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

  private stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map((entry) => this.stableStringify(entry)).join(',') + ']';
    const object = value as Record<string, unknown>;
    return '{' + Object.keys(object).sort().map((key) => JSON.stringify(key) + ':' + this.stableStringify(object[key])).join(',') + '}';
  }

  private hash(value: string): string {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) { hash ^= value.charCodeAt(index); hash = Math.imul(hash, 16777619); }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }
}
