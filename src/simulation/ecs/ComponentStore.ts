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
