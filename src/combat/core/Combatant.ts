import { CooldownBook, CooldownSnapshot } from './CooldownBook';
import { ResourcePool } from './ResourcePool';
import { StatBlock } from './StatBlock';
import { TagSet } from './TagSet';
import {
  CombatClass, CombatResources, CombatStats, CombatTeam, CombatantId, CombatantSnapshot,
  ResistanceProfile, ResourceType, StatModifier, Vec2, clamp, createDefaultResistances, createDefaultStats, normalize,
} from './types';

export interface CombatantOptions {
  id: CombatantId;
  name: string;
  classId: CombatClass;
  team: CombatTeam;
  level?: number;
  position?: Vec2;
  facing?: Vec2;
  stats?: Partial<CombatStats>;
  resources?: Partial<CombatResources>;
  resistances?: Partial<ResistanceProfile>;
  tags?: string[];
}

export interface CombatantState {
  snapshot: CombatantSnapshot;
  cooldowns: CooldownSnapshot[];
  baseStats: CombatStats;
  statModifiers: StatModifier[];
}

export class Combatant {
  public readonly id: CombatantId;
  public readonly name: string;
  public readonly classId: CombatClass;
  public readonly team: CombatTeam;
  public readonly stats: StatBlock;
  public readonly resources: ResourcePool;
  public readonly tags: TagSet;
  public readonly cooldowns = new CooldownBook();
  private position: Vec2;
  private facing: Vec2;
  private resistances: ResistanceProfile;
  private level: number;
  private revision = 0;
  private alive = true;

  public constructor(options: CombatantOptions) {
    if (!options.id.trim()) throw new Error('combatant id cannot be empty');
    this.id = options.id;
    this.name = options.name;
    this.classId = options.classId;
    this.team = options.team;
    this.level = Math.max(1, Math.floor(options.level ?? 1));
    this.position = { ...(options.position ?? { x: 0, y: 0 }) };
    this.facing = normalize(options.facing ?? { x: 1, y: 0 });
    const stats = { ...createDefaultStats(), ...options.stats };
    this.stats = new StatBlock(stats);
    const maximums: CombatResources = {
      health: stats.maximumHealth,
      mana: stats.maximumMana,
      stamina: stats.maximumStamina,
      guard: stats.maximumGuard,
      combo: 100,
      ultimate: 100,
    };
    this.resources = new ResourcePool({ ...maximums, ...options.resources }, maximums);
    this.resistances = { ...createDefaultResistances(), ...options.resistances };
    this.tags = new TagSet(options.tags ?? []).add(options.classId).add(options.team);
  }

  public snapshot(): CombatantSnapshot {
    return {
      id: this.id,
      name: this.name,
      classId: this.classId,
      team: this.team,
      level: this.level,
      position: { ...this.position },
      facing: { ...this.facing },
      stats: this.stats.evaluate(),
      resources: this.resources.snapshot(),
      resistances: { ...this.resistances },
      tags: this.tags.values(),
      alive: this.alive,
      revision: this.revision,
    };
  }

  public capture(): CombatantState {
    const statSnapshot = this.stats.snapshot();
    return { snapshot: this.snapshot(), cooldowns: this.cooldowns.snapshot(), baseStats: statSnapshot.base, statModifiers: statSnapshot.modifiers };
  }

  public restore(state: CombatantState): void {
    if (state.snapshot.id !== this.id) throw new Error('cannot restore state for another combatant');
    this.level = state.snapshot.level;
    this.position = { ...state.snapshot.position };
    this.facing = { ...state.snapshot.facing };
    this.alive = state.snapshot.alive;
    this.revision = state.snapshot.revision;
    this.resistances = { ...state.snapshot.resistances };
    this.tags.clear();
    this.tags.addMany(state.snapshot.tags);
    this.stats.restore({ base: state.baseStats, modifiers: state.statModifiers });
    const evaluated = this.stats.evaluate();
    this.resources.restore(state.snapshot.resources, {
      health: evaluated.maximumHealth, mana: evaluated.maximumMana, stamina: evaluated.maximumStamina,
      guard: evaluated.maximumGuard, combo: 100, ultimate: 100,
    });
    this.cooldowns.restore(state.cooldowns);
  }

  public moveTo(position: Vec2): void { this.position = { ...position }; this.revision++; }
  public translate(delta: Vec2): void { this.position.x += delta.x; this.position.y += delta.y; this.revision++; }
  public face(direction: Vec2): void { this.facing = normalize(direction, this.facing); this.revision++; }
  public setLevel(level: number): void { this.level = Math.max(1, Math.floor(level)); this.revision++; }

  public gain(resource: ResourceType, amount: number): number { const changed = this.resources.gain(resource, amount); if (changed) this.revision++; return changed; }
  public lose(resource: ResourceType, amount: number): number {
    const changed = this.resources.lose(resource, amount);
    if (resource === 'health' && this.resources.get('health') <= 0) this.alive = false;
    if (changed) this.revision++;
    return changed;
  }
  public revive(healthRatio = 1): void { this.alive = true; this.resources.set('health', this.resources.maximum('health') * clamp(healthRatio, 0.01, 1)); this.revision++; }
  public kill(): void { this.resources.empty('health'); this.alive = false; this.revision++; }

  public setResistance(type: keyof ResistanceProfile, value: number): void { this.resistances[type] = clamp(value, -1, 0.95); this.revision++; }
  public getResistance(type: keyof ResistanceProfile): number { return this.resistances[type]; }
  public addStatModifier(modifier: StatModifier): void { this.stats.addModifier(modifier); this.synchronizeMaximums(); this.revision++; }
  public removeStatModifier(id: string): boolean { const removed = this.stats.removeModifier(id); if (removed) { this.synchronizeMaximums(); this.revision++; } return removed; }
  public removeStatModifiersByPrefix(prefix: string): number { const removed = this.stats.removeByPrefix(prefix); if (removed) { this.synchronizeMaximums(); this.revision++; } return removed; }
  public isAlive(): boolean { return this.alive; }

  private synchronizeMaximums(): void {
    const stats = this.stats.evaluate();
    this.resources.setMaximum('health', stats.maximumHealth, true);
    this.resources.setMaximum('mana', stats.maximumMana, true);
    this.resources.setMaximum('stamina', stats.maximumStamina, true);
    this.resources.setMaximum('guard', stats.maximumGuard, true);
  }
}
