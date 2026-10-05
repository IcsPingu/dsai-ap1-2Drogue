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
