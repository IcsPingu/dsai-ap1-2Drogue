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
