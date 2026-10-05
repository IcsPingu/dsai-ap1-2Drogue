import { CombatEvent, CombatEventKind, CombatantId } from '../core/types';

export type CombatEventListener<T = unknown> = (event: CombatEvent<T>) => void;

export class CombatEventStream {
  private readonly listeners = new Map<CombatEventKind | '*', Set<CombatEventListener>>();
  private readonly journal: CombatEvent[] = [];
  private sequence = 0;

  public emit<T>(kind: CombatEventKind, time: number, payload: T, sourceId?: CombatantId, targetId?: CombatantId): CombatEvent<T> {
    const event: CombatEvent<T> = { id: ++this.sequence, kind, time, sourceId, targetId, payload };
    this.journal.push(event);
    for (const listener of this.listeners.get(kind) ?? []) listener(event);
    for (const listener of this.listeners.get('*') ?? []) listener(event);
    return event;
  }

  public on<T>(kind: CombatEventKind | '*', listener: CombatEventListener<T>): () => void {
    const listeners = this.listeners.get(kind) ?? new Set<CombatEventListener>();
    listeners.add(listener as CombatEventListener);
    this.listeners.set(kind, listeners);
    return () => this.off(kind, listener);
  }

  public once<T>(kind: CombatEventKind | '*', listener: CombatEventListener<T>): () => void {
    const unsubscribe = this.on<T>(kind, (event) => { unsubscribe(); listener(event); });
    return unsubscribe;
  }

  public off<T>(kind: CombatEventKind | '*', listener: CombatEventListener<T>): void {
    const listeners = this.listeners.get(kind);
    listeners?.delete(listener as CombatEventListener);
    if (listeners?.size === 0) this.listeners.delete(kind);
  }

  public events(kind?: CombatEventKind): CombatEvent[] { return this.journal.filter((event) => !kind || event.kind === kind).map((event) => ({ ...event })); }
  public eventsSince(id: number): CombatEvent[] { return this.journal.filter((event) => event.id > id).map((event) => ({ ...event })); }
  public clearJournal(): void { this.journal.length = 0; }
  public clearListeners(): void { this.listeners.clear(); }
  public get lastEventId(): number { return this.sequence; }
}
