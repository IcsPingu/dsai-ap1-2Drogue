import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = join(process.cwd(), 'src', 'combat');
const files = new Map();
const emit = (name, source) => files.set(name, source.trimStart().replaceAll('\r\n', '\n'));

emit('core/types.ts', String.raw`
export type CombatantId = string;
export type AbilityId = string;
export type EffectId = string;
export type CastId = string;
export type ProjectileId = string;

export type CombatClass = 'knight' | 'mage' | 'ranger' | 'rogue' | 'enemy' | 'boss';
export type CombatTeam = 'player' | 'enemy' | 'neutral';
export type DamageType = 'physical' | 'arcane' | 'fire' | 'frost' | 'lightning' | 'holy' | 'shadow' | 'poison' | 'true';
export type ResourceType = 'health' | 'mana' | 'stamina' | 'guard' | 'combo' | 'ultimate';
export type AbilityCategory = 'primary' | 'secondary' | 'special' | 'ultimate' | 'passive' | 'dodge' | 'reaction';
export type TargetingMode = 'self' | 'single' | 'cone' | 'line' | 'circle' | 'ring' | 'chain' | 'projectile' | 'dash' | 'summon';
export type EffectKind = 'buff' | 'debuff' | 'damage-over-time' | 'heal-over-time' | 'control' | 'shield' | 'aura' | 'mark';
export type StackPolicy = 'replace' | 'refresh' | 'stack-duration' | 'stack-intensity' | 'independent' | 'ignore';
export type ControlKind = 'stun' | 'root' | 'slow' | 'silence' | 'fear' | 'taunt' | 'knockback' | 'pull' | 'airborne';
export type CombatEventKind =
  | 'combat-started' | 'combat-ended' | 'combatant-added' | 'combatant-removed'
  | 'cast-requested' | 'cast-started' | 'cast-interrupted' | 'cast-completed'
  | 'damage-requested' | 'damage-applied' | 'damage-blocked' | 'critical-hit'
  | 'healing-applied' | 'resource-spent' | 'resource-gained'
  | 'effect-applied' | 'effect-stacked' | 'effect-refreshed' | 'effect-ticked' | 'effect-expired' | 'effect-cleansed'
  | 'projectile-spawned' | 'projectile-moved' | 'projectile-hit' | 'projectile-expired'
  | 'combo-started' | 'combo-advanced' | 'combo-broken' | 'combo-finished'
  | 'shield-absorbed' | 'guard-broken' | 'combatant-defeated';

export interface Vec2 { x: number; y: number; }

export interface CombatStats {
  maximumHealth: number;
  maximumMana: number;
  maximumStamina: number;
  maximumGuard: number;
  attackPower: number;
  spellPower: number;
  armor: number;
  resistance: number;
  criticalChance: number;
  criticalMultiplier: number;
  haste: number;
  movementSpeed: number;
  lifeSteal: number;
  manaSteal: number;
  cooldownReduction: number;
  tenacity: number;
  dodgeChance: number;
  blockChance: number;
  blockPower: number;
  healingPower: number;
  effectPower: number;
}

export interface CombatResources {
  health: number;
  mana: number;
  stamina: number;
  guard: number;
  combo: number;
  ultimate: number;
}

export interface ResistanceProfile {
  physical: number;
  arcane: number;
  fire: number;
  frost: number;
  lightning: number;
  holy: number;
  shadow: number;
  poison: number;
  true: number;
}

export interface CombatantSnapshot {
  id: CombatantId;
  name: string;
  classId: CombatClass;
  team: CombatTeam;
  level: number;
  position: Vec2;
  facing: Vec2;
  stats: CombatStats;
  resources: CombatResources;
  resistances: ResistanceProfile;
  tags: string[];
  alive: boolean;
  revision: number;
}

export interface ResourceCost {
  resource: ResourceType;
  amount: number;
  percentage?: boolean;
}

export interface AbilityDefinition {
  id: AbilityId;
  name: string;
  description: string;
  classId: CombatClass;
  category: AbilityCategory;
  targeting: TargetingMode;
  damageType: DamageType;
  baseDamage: number;
  powerRatio: number;
  range: number;
  radius: number;
  angle: number;
  castTime: number;
  recoveryTime: number;
  cooldown: number;
  charges: number;
  costs: ResourceCost[];
  tags: string[];
  interruptible: boolean;
  canMoveWhileCasting: boolean;
  animation: string;
  visualEffect: string;
  soundEffect: string;
}

export interface CastRequest {
  casterId: CombatantId;
  abilityId: AbilityId;
  targetId?: CombatantId;
  targetPosition?: Vec2;
  direction?: Vec2;
  clientSequence?: number;
}

export interface CastContext {
  id: CastId;
  request: CastRequest;
  definition: AbilityDefinition;
  startedAt: number;
  completesAt: number;
  recoveryEndsAt: number;
  targets: CombatantId[];
  interrupted: boolean;
  completed: boolean;
}

export interface DamagePacket {
  sourceId: CombatantId;
  targetId: CombatantId;
  abilityId?: AbilityId;
  damageType: DamageType;
  baseAmount: number;
  powerRatio: number;
  canCrit: boolean;
  canBlock: boolean;
  ignoresArmor: number;
  ignoresResistance: number;
  tags: string[];
  hitIndex: number;
}

export interface DamageResult {
  requested: number;
  amplified: number;
  mitigated: number;
  absorbed: number;
  applied: number;
  overkill: number;
  critical: boolean;
  blocked: boolean;
  dodged: boolean;
  defeated: boolean;
  modifiers: AppliedModifier[];
}

export interface HealPacket {
  sourceId: CombatantId;
  targetId: CombatantId;
  abilityId?: AbilityId;
  baseAmount: number;
  powerRatio: number;
  canCrit: boolean;
  tags: string[];
}

export interface HealResult {
  requested: number;
  applied: number;
  overheal: number;
  critical: boolean;
}

export interface AppliedModifier {
  source: string;
  operation: 'add' | 'multiply' | 'clamp' | 'override';
  value: number;
  before: number;
  after: number;
}

export interface StatModifier {
  id: string;
  stat: keyof CombatStats;
  operation: 'add' | 'multiply' | 'override';
  value: number;
  priority: number;
}

export interface ActiveEffectSnapshot {
  instanceId: string;
  effectId: EffectId;
  sourceId: CombatantId;
  targetId: CombatantId;
  kind: EffectKind;
  stacks: number;
  intensity: number;
  appliedAt: number;
  expiresAt: number;
  nextTickAt: number;
  tags: string[];
  state: Record<string, number | string | boolean>;
}

export interface EffectApplication {
  effectId: EffectId;
  sourceId: CombatantId;
  targetId: CombatantId;
  duration?: number;
  intensity?: number;
  stacks?: number;
  abilityId?: AbilityId;
}

export interface EffectDefinition {
  id: EffectId;
  name: string;
  description: string;
  kind: EffectKind;
  damageType?: DamageType;
  duration: number;
  tickInterval: number;
  maximumStacks: number;
  stackPolicy: StackPolicy;
  dispellable: boolean;
  control?: ControlKind;
  tags: string[];
  statModifiers: StatModifier[];
}

export interface ProjectileDefinition {
  speed: number;
  lifetime: number;
  radius: number;
  piercing: number;
  bounces: number;
  homingStrength: number;
  gravity: number;
  acceleration: number;
  maximumSpeed: number;
  collisionTeams: CombatTeam[];
  tags: string[];
}

export interface ProjectileSnapshot {
  id: ProjectileId;
  sourceId: CombatantId;
  abilityId: AbilityId;
  position: Vec2;
  previousPosition: Vec2;
  velocity: Vec2;
  definition: ProjectileDefinition;
  createdAt: number;
  expiresAt: number;
  remainingPierces: number;
  remainingBounces: number;
  hitTargets: CombatantId[];
  targetId?: CombatantId;
}

export interface AbilityImpact {
  damage: DamagePacket[];
  healing: HealPacket[];
  effects: EffectApplication[];
  projectiles: ProjectileSpawnRequest[];
  displacement: DisplacementRequest[];
  resourceChanges: ResourceChange[];
}

export interface ProjectileSpawnRequest {
  sourceId: CombatantId;
  abilityId: AbilityId;
  origin: Vec2;
  direction: Vec2;
  definition: ProjectileDefinition;
  targetId?: CombatantId;
}

export interface DisplacementRequest {
  targetId: CombatantId;
  direction: Vec2;
  distance: number;
  duration: number;
  kind: 'knockback' | 'pull' | 'dash' | 'teleport';
}

export interface ResourceChange {
  targetId: CombatantId;
  resource: ResourceType;
  amount: number;
  reason: string;
}

export interface CombatEvent<T = unknown> {
  id: number;
  kind: CombatEventKind;
  time: number;
  sourceId?: CombatantId;
  targetId?: CombatantId;
  payload: T;
}

export interface Ability {
  readonly definition: AbilityDefinition;
  canCast(context: AbilityExecutionContext): string | undefined;
  createImpact(context: AbilityExecutionContext): AbilityImpact;
}

export interface CombatEffect {
  readonly definition: EffectDefinition;
  canApply(context: EffectExecutionContext): string | undefined;
  onApply(context: EffectExecutionContext): void;
  onTick(context: EffectExecutionContext): AbilityImpact;
  onExpire(context: EffectExecutionContext): void;
}

export interface AbilityExecutionContext {
  now: number;
  caster: CombatantSnapshot;
  targets: CombatantSnapshot[];
  targetPosition: Vec2;
  direction: Vec2;
  random: RandomSource;
  cast: CastContext;
}

export interface EffectExecutionContext {
  now: number;
  source: CombatantSnapshot;
  target: CombatantSnapshot;
  instance: ActiveEffectSnapshot;
  random: RandomSource;
}

export interface RandomSource {
  next(): number;
  float(minimum?: number, maximum?: number): number;
  integer(minimum: number, maximum: number): number;
  boolean(probability?: number): boolean;
}

export interface CombatWorldView {
  now: number;
  getCombatant(id: CombatantId): CombatantSnapshot | undefined;
  listCombatants(): CombatantSnapshot[];
  emit<T>(kind: CombatEventKind, payload: T, sourceId?: CombatantId, targetId?: CombatantId): void;
}

export function createEmptyImpact(): AbilityImpact {
  return { damage: [], healing: [], effects: [], projectiles: [], displacement: [], resourceChanges: [] };
}

export function createDefaultStats(maximumHealth = 100, maximumMana = 100): CombatStats {
  return {
    maximumHealth,
    maximumMana,
    maximumStamina: 100,
    maximumGuard: 100,
    attackPower: 20,
    spellPower: 20,
    armor: 10,
    resistance: 10,
    criticalChance: 0.05,
    criticalMultiplier: 1.5,
    haste: 0,
    movementSpeed: 200,
    lifeSteal: 0,
    manaSteal: 0,
    cooldownReduction: 0,
    tenacity: 0,
    dodgeChance: 0,
    blockChance: 0,
    blockPower: 0.5,
    healingPower: 0,
    effectPower: 0,
  };
}

export function createDefaultResistances(): ResistanceProfile {
  return { physical: 0, arcane: 0, fire: 0, frost: 0, lightning: 0, holy: 0, shadow: 0, poison: 0, true: 0 };
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

export function vecLength(vector: Vec2): number {
  return Math.hypot(vector.x, vector.y);
}

export function normalize(vector: Vec2, fallback: Vec2 = { x: 1, y: 0 }): Vec2 {
  const length = vecLength(vector);
  return length <= Number.EPSILON ? { ...fallback } : { x: vector.x / length, y: vector.y / length };
}

export function distance(left: Vec2, right: Vec2): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}
`);

emit('core/ResourcePool.ts', String.raw`
import { CombatResources, ResourceCost, ResourceType, clamp } from './types';

export class ResourcePool {
  private readonly values: CombatResources;
  private readonly maximums: CombatResources;

  public constructor(initial: CombatResources, maximums: CombatResources) {
    this.maximums = { ...maximums };
    this.values = { ...initial };
    for (const type of this.types()) this.values[type] = clamp(this.values[type], 0, this.maximums[type]);
  }

  public get(type: ResourceType): number { return this.values[type]; }
  public maximum(type: ResourceType): number { return this.maximums[type]; }
  public ratio(type: ResourceType): number { return this.maximums[type] <= 0 ? 0 : this.values[type] / this.maximums[type]; }

  public set(type: ResourceType, value: number): number {
    const before = this.values[type];
    this.values[type] = clamp(value, 0, this.maximums[type]);
    return this.values[type] - before;
  }

  public setMaximum(type: ResourceType, value: number, preserveRatio = false): void {
    const ratio = this.ratio(type);
    this.maximums[type] = Math.max(0, value);
    this.values[type] = preserveRatio ? this.maximums[type] * ratio : clamp(this.values[type], 0, this.maximums[type]);
  }

  public gain(type: ResourceType, amount: number): number { return this.set(type, this.values[type] + Math.max(0, amount)); }
  public lose(type: ResourceType, amount: number): number { return -this.set(type, this.values[type] - Math.max(0, amount)); }
  public empty(type: ResourceType): number { return this.lose(type, this.values[type]); }
  public fill(type: ResourceType): number { return this.gain(type, this.maximums[type] - this.values[type]); }

  public canAfford(costs: readonly ResourceCost[]): boolean {
    return costs.every((cost) => this.values[cost.resource] >= this.resolveCost(cost));
  }

  public spend(costs: readonly ResourceCost[]): Record<ResourceType, number> | undefined {
    if (!this.canAfford(costs)) return undefined;
    const spent = this.zeroRecord();
    for (const cost of costs) {
      const amount = this.resolveCost(cost);
      this.lose(cost.resource, amount);
      spent[cost.resource] += amount;
    }
    return spent;
  }

  public refund(spent: Partial<Record<ResourceType, number>>, ratio = 1): void {
    for (const type of this.types()) this.gain(type, (spent[type] ?? 0) * clamp(ratio, 0, 1));
  }

  public snapshot(): CombatResources { return { ...this.values }; }
  public maximumSnapshot(): CombatResources { return { ...this.maximums }; }

  public restore(values: CombatResources, maximums?: CombatResources): void {
    if (maximums) Object.assign(this.maximums, maximums);
    for (const type of this.types()) this.values[type] = clamp(values[type], 0, this.maximums[type]);
  }

  private resolveCost(cost: ResourceCost): number {
    const raw = cost.percentage ? this.maximums[cost.resource] * cost.amount : cost.amount;
    return Math.max(0, raw);
  }

  private types(): ResourceType[] { return ['health', 'mana', 'stamina', 'guard', 'combo', 'ultimate']; }

  private zeroRecord(): Record<ResourceType, number> {
    return { health: 0, mana: 0, stamina: 0, guard: 0, combo: 0, ultimate: 0 };
  }
}
`);

emit('core/CooldownBook.ts', String.raw`
export interface CooldownSnapshot {
  id: string;
  startedAt: number;
  duration: number;
  charges: number;
  maximumCharges: number;
  rechargeStartedAt: number;
}

export class CooldownBook {
  private readonly entries = new Map<string, CooldownSnapshot>();

  public configure(id: string, maximumCharges = 1): void {
    if (maximumCharges < 1 || !Number.isSafeInteger(maximumCharges)) throw new RangeError('charges must be a positive integer');
    const current = this.entries.get(id);
    this.entries.set(id, current ? { ...current, maximumCharges, charges: Math.min(current.charges, maximumCharges) } : {
      id, startedAt: 0, duration: 0, charges: maximumCharges, maximumCharges, rechargeStartedAt: 0,
    });
  }

  public isReady(id: string, now: number): boolean { this.updateEntry(id, now); return (this.entries.get(id)?.charges ?? 1) > 0; }

  public consume(id: string, now: number, duration: number, maximumCharges = 1): boolean {
    if (!this.entries.has(id)) this.configure(id, maximumCharges);
    this.updateEntry(id, now);
    const entry = this.entries.get(id)!;
    if (entry.charges <= 0) return false;
    entry.charges--;
    entry.duration = Math.max(0, duration);
    entry.startedAt = now;
    if (entry.charges === entry.maximumCharges - 1) entry.rechargeStartedAt = now;
    return true;
  }

  public reset(id: string): void {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.charges = entry.maximumCharges;
    entry.startedAt = 0;
    entry.rechargeStartedAt = 0;
  }

  public reduce(id: string, milliseconds: number, now: number): void {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.rechargeStartedAt -= Math.max(0, milliseconds);
    this.updateEntry(id, now);
  }

  public remaining(id: string, now: number): number {
    this.updateEntry(id, now);
    const entry = this.entries.get(id);
    if (!entry || entry.charges > 0) return 0;
    return Math.max(0, entry.duration - (now - entry.rechargeStartedAt));
  }

  public charges(id: string, now: number): number { this.updateEntry(id, now); return this.entries.get(id)?.charges ?? 1; }
  public remove(id: string): boolean { return this.entries.delete(id); }
  public clear(): void { this.entries.clear(); }
  public snapshot(): CooldownSnapshot[] { return [...this.entries.values()].map((entry) => ({ ...entry })); }
  public restore(entries: readonly CooldownSnapshot[]): void { this.entries.clear(); for (const entry of entries) this.entries.set(entry.id, { ...entry }); }

  public update(now: number): string[] {
    const recharged: string[] = [];
    for (const id of this.entries.keys()) if (this.updateEntry(id, now)) recharged.push(id);
    return recharged;
  }

  private updateEntry(id: string, now: number): boolean {
    const entry = this.entries.get(id);
    if (!entry || entry.charges >= entry.maximumCharges || entry.duration <= 0) return false;
    let changed = false;
    while (entry.charges < entry.maximumCharges && now - entry.rechargeStartedAt >= entry.duration) {
      entry.charges++;
      entry.rechargeStartedAt += entry.duration;
      changed = true;
    }
    if (entry.charges >= entry.maximumCharges) entry.rechargeStartedAt = 0;
    return changed;
  }
}
`);

emit('core/CombatClock.ts', String.raw`
export interface CombatClockSnapshot {
  time: number;
  scale: number;
  paused: boolean;
  frame: number;
  accumulated: number;
  fixedStep: number;
}

export class CombatClock {
  private timeValue = 0;
  private scaleValue = 1;
  private pausedValue = false;
  private frameValue = 0;
  private accumulated = 0;

  public constructor(private readonly fixedStep = 1000 / 60, private readonly maximumFrame = 250) {
    if (!Number.isFinite(fixedStep) || fixedStep <= 0) throw new RangeError('fixed step must be positive');
    if (!Number.isFinite(maximumFrame) || maximumFrame < fixedStep) throw new RangeError('maximum frame must cover a fixed step');
  }

  public advance(realDelta: number, callback: (step: number, time: number, frame: number) => void): number {
    if (!Number.isFinite(realDelta) || realDelta < 0) throw new RangeError('delta must be finite and non-negative');
    if (this.pausedValue || this.scaleValue === 0) return 0;
    this.accumulated += Math.min(this.maximumFrame, realDelta) * this.scaleValue;
    let steps = 0;
    while (this.accumulated >= this.fixedStep) {
      this.accumulated -= this.fixedStep;
      this.timeValue += this.fixedStep;
      this.frameValue++;
      steps++;
      callback(this.fixedStep, this.timeValue, this.frameValue);
    }
    return steps;
  }

  public setScale(scale: number): void {
    if (!Number.isFinite(scale) || scale < 0 || scale > 8) throw new RangeError('combat time scale must be between zero and eight');
    this.scaleValue = scale;
  }

  public pause(): void { this.pausedValue = true; }
  public resume(): void { this.pausedValue = false; }
  public toggle(): boolean { this.pausedValue = !this.pausedValue; return this.pausedValue; }
  public reset(time = 0): void { this.timeValue = Math.max(0, time); this.frameValue = 0; this.accumulated = 0; }
  public time(): number { return this.timeValue; }
  public frame(): number { return this.frameValue; }
  public scale(): number { return this.scaleValue; }
  public isPaused(): boolean { return this.pausedValue; }
  public interpolation(): number { return this.accumulated / this.fixedStep; }

  public step(callback: (step: number, time: number, frame: number) => void): void {
    if (this.pausedValue) return;
    this.timeValue += this.fixedStep;
    this.frameValue++;
    callback(this.fixedStep, this.timeValue, this.frameValue);
  }

  public advanceTo(targetTime: number, callback: (step: number, time: number, frame: number) => void): number {
    if (!Number.isFinite(targetTime) || targetTime < this.timeValue) throw new RangeError('target time cannot precede combat time');
    let steps = 0;
    while (this.timeValue + this.fixedStep <= targetTime) {
      this.step(callback);
      steps++;
    }
    return steps;
  }

  public elapsedSince(timestamp: number): number {
    if (!Number.isFinite(timestamp)) throw new RangeError('timestamp must be finite');
    return Math.max(0, this.timeValue - timestamp);
  }

  public formatTime(): string {
    const totalSeconds = Math.floor(this.timeValue / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor(this.timeValue % 1000);
    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0') + '.' + milliseconds.toString().padStart(3, '0');
  }

  public capture(): CombatClockSnapshot {
    return { time: this.timeValue, scale: this.scaleValue, paused: this.pausedValue, frame: this.frameValue, accumulated: this.accumulated, fixedStep: this.fixedStep };
  }

  public restore(snapshot: CombatClockSnapshot): void {
    if (Math.abs(snapshot.fixedStep - this.fixedStep) > Number.EPSILON) throw new Error('clock snapshot fixed step mismatch');
    this.timeValue = Math.max(0, snapshot.time);
    this.scaleValue = Math.max(0, snapshot.scale);
    this.pausedValue = snapshot.paused;
    this.frameValue = Math.max(0, Math.floor(snapshot.frame));
    this.accumulated = Math.max(0, snapshot.accumulated);
  }
}
`);

emit('core/TagSet.ts', String.raw`
export class TagSet {
  private readonly tags = new Set<string>();

  public constructor(initial: Iterable<string> = []) { for (const tag of initial) this.add(tag); }
  public add(tag: string): this { const normalized = this.normalize(tag); if (normalized) this.tags.add(normalized); return this; }
  public addMany(tags: Iterable<string>): this { for (const tag of tags) this.add(tag); return this; }
  public remove(tag: string): boolean { return this.tags.delete(this.normalize(tag)); }
  public has(tag: string): boolean { return this.tags.has(this.normalize(tag)); }
  public hasAny(tags: Iterable<string>): boolean { for (const tag of tags) if (this.has(tag)) return true; return false; }
  public hasAll(tags: Iterable<string>): boolean { for (const tag of tags) if (!this.has(tag)) return false; return true; }
  public clear(): void { this.tags.clear(); }
  public values(): string[] { return [...this.tags].sort(); }
  public clone(): TagSet { return new TagSet(this.tags); }
  public get size(): number { return this.tags.size; }

  public matches(query: string): boolean {
    const alternatives = query.split('|').map((part) => part.trim()).filter(Boolean);
    return alternatives.some((alternative) => alternative.split('&').map((part) => part.trim()).filter(Boolean).every((term) => {
      const negated = term.startsWith('!');
      const present = this.has(negated ? term.slice(1) : term);
      return negated ? !present : present;
    }));
  }

  private normalize(tag: string): string { return tag.trim().toLowerCase().replace(/\s+/g, '-'); }
}
`);

emit('core/StatBlock.ts', String.raw`
import { CombatStats, StatModifier, clamp } from './types';

export class StatBlock {
  private base: CombatStats;
  private readonly modifiers = new Map<string, StatModifier>();
  private cache?: CombatStats;

  public constructor(stats: CombatStats) { this.base = { ...stats }; }

  public get<K extends keyof CombatStats>(stat: K): CombatStats[K] { return this.evaluate()[stat]; }
  public getBase<K extends keyof CombatStats>(stat: K): CombatStats[K] { return this.base[stat]; }

  public setBase<K extends keyof CombatStats>(stat: K, value: CombatStats[K]): void {
    this.base[stat] = value;
    this.cache = undefined;
  }

  public replaceBase(stats: CombatStats): void { this.base = { ...stats }; this.cache = undefined; }

  public addModifier(modifier: StatModifier): void {
    if (!modifier.id) throw new Error('stat modifier id cannot be empty');
    if (!Number.isFinite(modifier.value)) throw new RangeError('stat modifier value must be finite');
    this.modifiers.set(modifier.id, { ...modifier });
    this.cache = undefined;
  }

  public removeModifier(id: string): boolean {
    const removed = this.modifiers.delete(id);
    if (removed) this.cache = undefined;
    return removed;
  }

  public removeByPrefix(prefix: string): number {
    let removed = 0;
    for (const id of this.modifiers.keys()) if (id.startsWith(prefix) && this.removeModifier(id)) removed++;
    return removed;
  }

  public hasModifier(id: string): boolean { return this.modifiers.has(id); }
  public listModifiers(): StatModifier[] { return [...this.modifiers.values()].map((modifier) => ({ ...modifier })); }

  public evaluate(): CombatStats {
    if (this.cache) return { ...this.cache };
    const result = { ...this.base };
    const grouped = new Map<keyof CombatStats, StatModifier[]>();
    for (const modifier of this.modifiers.values()) grouped.set(modifier.stat, [...(grouped.get(modifier.stat) ?? []), modifier]);
    for (const [stat, modifiers] of grouped) {
      let value = result[stat];
      for (const modifier of modifiers.filter((entry) => entry.operation === 'add').sort((a, b) => a.priority - b.priority)) value += modifier.value;
      for (const modifier of modifiers.filter((entry) => entry.operation === 'multiply').sort((a, b) => a.priority - b.priority)) value *= modifier.value;
      const overrides = modifiers.filter((entry) => entry.operation === 'override').sort((a, b) => a.priority - b.priority);
      if (overrides.length > 0) value = overrides[overrides.length - 1].value;
      result[stat] = this.sanitize(stat, value);
    }
    this.cache = result;
    return { ...result };
  }

  public snapshot(): { base: CombatStats; modifiers: StatModifier[] } {
    return { base: { ...this.base }, modifiers: this.listModifiers() };
  }

  public restore(snapshot: { base: CombatStats; modifiers: StatModifier[] }): void {
    this.base = { ...snapshot.base };
    this.modifiers.clear();
    for (const modifier of snapshot.modifiers) this.modifiers.set(modifier.id, { ...modifier });
    this.cache = undefined;
  }

  private sanitize(stat: keyof CombatStats, value: number): number {
    if (stat === 'criticalChance' || stat === 'lifeSteal' || stat === 'manaSteal' || stat === 'cooldownReduction' || stat === 'dodgeChance' || stat === 'blockChance') return clamp(value, 0, 0.95);
    if (stat === 'criticalMultiplier') return Math.max(1, value);
    if (stat === 'blockPower') return clamp(value, 0, 1);
    if (stat === 'tenacity') return clamp(value, 0, 0.9);
    return Math.max(0, value);
  }
}
`);

emit('core/Combatant.ts', String.raw`
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
`);

emit('events/CombatEventStream.ts', String.raw`
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
`);

emit('damage/DamagePipeline.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Combatant } from '../core/Combatant';
import { AppliedModifier, DamagePacket, DamageResult, DamageType, HealPacket, HealResult, clamp } from '../core/types';

export interface DamageHookContext {
  packet: DamagePacket;
  source: Combatant;
  target: Combatant;
  amount: number;
  modifiers: AppliedModifier[];
}

export interface DamageHook {
  id: string;
  priority: number;
  phase: 'before-power' | 'after-power' | 'before-mitigation' | 'after-mitigation' | 'before-apply';
  apply(context: DamageHookContext): number;
}

export class DamagePipeline {
  private readonly hooks = new Map<string, DamageHook>();

  public addHook(hook: DamageHook): void { this.hooks.set(hook.id, hook); }
  public removeHook(id: string): boolean { return this.hooks.delete(id); }
  public clearHooks(): void { this.hooks.clear(); }

  public resolve(packet: DamagePacket, source: Combatant, target: Combatant, random: DeterministicRandom): DamageResult {
    const sourceSnapshot = source.snapshot();
    const targetSnapshot = target.snapshot();
    const modifiers: AppliedModifier[] = [];
    if (!sourceSnapshot.alive || !targetSnapshot.alive) return this.empty(packet.baseAmount);
    if (target.tags.has('invulnerable') && !packet.tags.includes('bypass-invulnerability')) return this.empty(packet.baseAmount);
    if (packet.canBlock && random.boolean(targetSnapshot.stats.dodgeChance) && !packet.tags.includes('undodgeable')) {
      return { ...this.empty(packet.baseAmount), dodged: true };
    }
    let amount = Math.max(0, packet.baseAmount);
    amount = this.runHooks('before-power', amount, packet, source, target, modifiers);
    const power = this.powerFor(packet.damageType, sourceSnapshot.stats.attackPower, sourceSnapshot.stats.spellPower);
    amount = this.modify(amount, amount + power * packet.powerRatio, 'power-scaling', 'add', power * packet.powerRatio, modifiers);
    amount = this.runHooks('after-power', amount, packet, source, target, modifiers);
    const critical = packet.canCrit && random.boolean(sourceSnapshot.stats.criticalChance) && !packet.tags.includes('cannot-crit');
    if (critical) amount = this.modify(amount, amount * sourceSnapshot.stats.criticalMultiplier, 'critical-hit', 'multiply', sourceSnapshot.stats.criticalMultiplier, modifiers);
    amount = this.applyVulnerabilityTags(amount, packet.damageType, target, modifiers);
    const amplified = amount;
    amount = this.runHooks('before-mitigation', amount, packet, source, target, modifiers);
    if (packet.damageType !== 'true') {
      const defense = packet.damageType === 'physical' ? targetSnapshot.stats.armor : targetSnapshot.stats.resistance;
      const ignore = packet.damageType === 'physical' ? packet.ignoresArmor : packet.ignoresResistance;
      const effective = Math.max(-80, defense * (1 - clamp(ignore, 0, 1)));
      const multiplier = effective >= 0 ? 100 / (100 + effective) : 2 - 100 / (100 - effective);
      amount = this.modify(amount, amount * multiplier, 'defense-mitigation', 'multiply', multiplier, modifiers);
      const resistance = targetSnapshot.resistances[packet.damageType];
      amount = this.modify(amount, amount * (1 - resistance), 'typed-resistance', 'multiply', 1 - resistance, modifiers);
    }
    const mitigated = Math.max(0, amplified - amount);
    amount = this.runHooks('after-mitigation', amount, packet, source, target, modifiers);
    let blocked = false;
    if (packet.canBlock && targetSnapshot.resources.guard > 0 && random.boolean(targetSnapshot.stats.blockChance) && !packet.tags.includes('unblockable')) {
      blocked = true;
      const blockedAmount = amount * targetSnapshot.stats.blockPower;
      const guardSpent = Math.min(targetSnapshot.resources.guard, blockedAmount);
      target.lose('guard', guardSpent);
      amount = this.modify(amount, amount - blockedAmount, 'active-block', 'add', -blockedAmount, modifiers);
    }
    const absorbed = this.absorbShields(target, amount, modifiers);
    amount = Math.max(0, amount - absorbed);
    amount = this.runHooks('before-apply', amount, packet, source, target, modifiers);
    const healthBefore = target.resources.get('health');
    const applied = Math.min(healthBefore, Math.max(0, amount));
    target.lose('health', applied);
    this.applySteal(source, applied, sourceSnapshot.stats.lifeSteal, sourceSnapshot.stats.manaSteal);
    return {
      requested: packet.baseAmount,
      amplified,
      mitigated,
      absorbed,
      applied,
      overkill: Math.max(0, amount - healthBefore),
      critical,
      blocked,
      dodged: false,
      defeated: !target.isAlive(),
      modifiers,
    };
  }

  public heal(packet: HealPacket, source: Combatant, target: Combatant, random: DeterministicRandom): HealResult {
    const sourceStats = source.snapshot().stats;
    const critical = packet.canCrit && random.boolean(sourceStats.criticalChance);
    let requested = Math.max(0, packet.baseAmount + sourceStats.healingPower * packet.powerRatio);
    if (critical) requested *= sourceStats.criticalMultiplier;
    if (target.tags.has('healing-reduced')) requested *= 0.5;
    if (target.tags.has('healing-blocked')) requested = 0;
    const missing = target.resources.maximum('health') - target.resources.get('health');
    const applied = Math.min(missing, requested);
    target.gain('health', applied);
    return { requested, applied, overheal: Math.max(0, requested - missing), critical };
  }

  private runHooks(phase: DamageHook['phase'], amount: number, packet: DamagePacket, source: Combatant, target: Combatant, modifiers: AppliedModifier[]): number {
    for (const hook of [...this.hooks.values()].filter((entry) => entry.phase === phase).sort((a, b) => a.priority - b.priority)) {
      const before = amount;
      amount = Math.max(0, hook.apply({ packet, source, target, amount, modifiers }));
      modifiers.push({ source: hook.id, operation: 'override', value: amount, before, after: amount });
    }
    return amount;
  }

  private applyVulnerabilityTags(amount: number, type: DamageType, target: Combatant, modifiers: AppliedModifier[]): number {
    if (target.tags.has('vulnerable')) amount = this.modify(amount, amount * 1.2, 'vulnerable', 'multiply', 1.2, modifiers);
    if (target.tags.has('vulnerable-' + type)) amount = this.modify(amount, amount * 1.35, 'vulnerable-' + type, 'multiply', 1.35, modifiers);
    if (target.tags.has('fortified')) amount = this.modify(amount, amount * 0.8, 'fortified', 'multiply', 0.8, modifiers);
    return amount;
  }

  private absorbShields(target: Combatant, amount: number, modifiers: AppliedModifier[]): number {
    const shieldTags = target.tags.values().filter((tag) => tag.startsWith('shield:')).sort();
    let remaining = amount;
    let absorbed = 0;
    for (const tag of shieldTags) {
      const value = Number(tag.split(':')[2] ?? 0);
      if (!Number.isFinite(value) || value <= 0) continue;
      const used = Math.min(remaining, value);
      absorbed += used;
      remaining -= used;
      target.tags.remove(tag);
      const leftover = value - used;
      if (leftover > 0) target.tags.add('shield:value:' + leftover);
      modifiers.push({ source: tag, operation: 'add', value: -used, before: remaining + used, after: remaining });
      if (remaining <= 0) break;
    }
    return absorbed;
  }

  private applySteal(source: Combatant, damage: number, lifeSteal: number, manaSteal: number): void {
    if (lifeSteal > 0) source.gain('health', damage * lifeSteal);
    if (manaSteal > 0) source.gain('mana', damage * manaSteal);
  }

  private powerFor(type: DamageType, attackPower: number, spellPower: number): number {
    return type === 'physical' || type === 'poison' ? attackPower : type === 'true' ? Math.max(attackPower, spellPower) : spellPower;
  }

  private modify(before: number, after: number, source: string, operation: AppliedModifier['operation'], value: number, modifiers: AppliedModifier[]): number {
    modifiers.push({ source, operation, value, before, after });
    return after;
  }

  private empty(requested: number): DamageResult {
    return { requested, amplified: 0, mitigated: 0, absorbed: 0, applied: 0, overkill: 0, critical: false, blocked: false, dodged: false, defeated: false, modifiers: [] };
  }
}
`);

emit('effects/BaseEffect.ts', String.raw`
import { AbilityImpact, CombatEffect, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../core/types';

export abstract class BaseEffect implements CombatEffect {
  public abstract readonly definition: EffectDefinition;

  public canApply(context: EffectExecutionContext): string | undefined {
    if (!context.target.alive) return 'target-defeated';
    if (context.target.tags.includes('effect-immune')) return 'effect-immune';
    if (context.target.tags.includes('immune-' + this.definition.id)) return 'specific-immunity';
    if (this.definition.control && context.target.tags.includes('control-immune')) return 'control-immune';
    return undefined;
  }

  public onApply(context: EffectExecutionContext): void {
    context.instance.state.applied = true;
    context.instance.state.applicationTime = context.now;
  }

  public onTick(_context: EffectExecutionContext): AbilityImpact { return createEmptyImpact(); }

  public onExpire(context: EffectExecutionContext): void {
    context.instance.state.expired = true;
    context.instance.state.expirationTime = context.now;
  }
}
`);

emit('effects/EffectRegistry.ts', String.raw`
import { CombatEffect, EffectId } from '../core/types';

export class EffectRegistry {
  private readonly effects = new Map<EffectId, CombatEffect>();

  public register(effect: CombatEffect, replace = false): this {
    if (this.effects.has(effect.definition.id) && !replace) throw new Error('effect already registered: ' + effect.definition.id);
    this.effects.set(effect.definition.id, effect);
    return this;
  }

  public registerMany(effects: Iterable<CombatEffect>, replace = false): this { for (const effect of effects) this.register(effect, replace); return this; }
  public unregister(id: EffectId): boolean { return this.effects.delete(id); }
  public has(id: EffectId): boolean { return this.effects.has(id); }
  public get(id: EffectId): CombatEffect { const effect = this.effects.get(id); if (!effect) throw new Error('unknown effect: ' + id); return effect; }
  public list(): CombatEffect[] { return [...this.effects.values()]; }
  public byTag(tag: string): CombatEffect[] { return this.list().filter((effect) => effect.definition.tags.includes(tag)); }
  public byKind(kind: CombatEffect['definition']['kind']): CombatEffect[] { return this.list().filter((effect) => effect.definition.kind === kind); }
  public clear(): void { this.effects.clear(); }
  public get size(): number { return this.effects.size; }
}
`);

emit('effects/EffectEngine.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Combatant } from '../core/Combatant';
import { AbilityImpact, ActiveEffectSnapshot, CombatantId, EffectApplication, EffectExecutionContext } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';
import { EffectRegistry } from './EffectRegistry';

export interface EffectEngineSnapshot { active: ActiveEffectSnapshot[]; serial: number; }

export class EffectEngine {
  private readonly active = new Map<string, ActiveEffectSnapshot>();
  private serial = 0;

  public constructor(
    private readonly registry: EffectRegistry,
    private readonly events: CombatEventStream,
    private readonly random: DeterministicRandom,
    private readonly combatants: Map<CombatantId, Combatant>,
  ) {}

  public apply(application: EffectApplication, now: number): ActiveEffectSnapshot | undefined {
    const effect = this.registry.get(application.effectId);
    const source = this.combatants.get(application.sourceId);
    const target = this.combatants.get(application.targetId);
    if (!source || !target) return undefined;
    const existing = this.findMatching(effect.definition.id, application.sourceId, application.targetId);
    if (existing && effect.definition.stackPolicy !== 'independent') {
      const updated = this.stack(existing, application, now);
      this.events.emit('effect-stacked', now, { effectId: effect.definition.id, stacks: updated.stacks, policy: effect.definition.stackPolicy }, application.sourceId, application.targetId);
      return updated;
    }
    const duration = this.adjustDuration(application.duration ?? effect.definition.duration, target);
    const instance: ActiveEffectSnapshot = {
      instanceId: 'effect-instance-' + ++this.serial,
      effectId: effect.definition.id,
      sourceId: application.sourceId,
      targetId: application.targetId,
      kind: effect.definition.kind,
      stacks: Math.max(1, Math.min(effect.definition.maximumStacks, application.stacks ?? 1)),
      intensity: Math.max(0, application.intensity ?? 1),
      appliedAt: now,
      expiresAt: duration <= 0 ? Infinity : now + duration,
      nextTickAt: effect.definition.tickInterval > 0 ? now + effect.definition.tickInterval : Infinity,
      tags: [...effect.definition.tags],
      state: {},
    };
    const context = this.context(instance, now);
    const rejection = effect.canApply(context);
    if (rejection) return undefined;
    this.active.set(instance.instanceId, instance);
    for (const modifier of effect.definition.statModifiers) target.addStatModifier({ ...modifier, id: instance.instanceId + ':' + modifier.id });
    for (const tag of effect.definition.tags.filter((tag) => tag.startsWith('grants:'))) target.tags.add(tag.slice(7));
    effect.onApply(context);
    this.events.emit('effect-applied', now, { instance: { ...instance }, abilityId: application.abilityId }, application.sourceId, application.targetId);
    return instance;
  }

  public update(now: number): AbilityImpact[] {
    const impacts: AbilityImpact[] = [];
    for (const instance of [...this.active.values()]) {
      const effect = this.registry.get(instance.effectId);
      while (effect.definition.tickInterval > 0 && instance.nextTickAt <= now && instance.nextTickAt < instance.expiresAt) {
        const impact = effect.onTick(this.context(instance, instance.nextTickAt));
        impacts.push(impact);
        this.events.emit('effect-ticked', instance.nextTickAt, { instanceId: instance.instanceId, impact }, instance.sourceId, instance.targetId);
        instance.nextTickAt += effect.definition.tickInterval;
      }
      if (instance.expiresAt <= now) this.expire(instance.instanceId, now, 'duration');
    }
    return impacts;
  }

  public expire(instanceId: string, now: number, reason = 'manual'): boolean {
    const instance = this.active.get(instanceId);
    if (!instance) return false;
    const target = this.combatants.get(instance.targetId);
    const effect = this.registry.get(instance.effectId);
    if (target) {
      target.removeStatModifiersByPrefix(instance.instanceId + ':');
      for (const tag of effect.definition.tags.filter((entry) => entry.startsWith('grants:'))) target.tags.remove(tag.slice(7));
      effect.onExpire(this.context(instance, now));
    }
    this.active.delete(instanceId);
    this.events.emit('effect-expired', now, { instanceId, effectId: instance.effectId, reason }, instance.sourceId, instance.targetId);
    return true;
  }

  public cleanse(targetId: CombatantId, now: number, predicate: (effect: ActiveEffectSnapshot) => boolean): string[] {
    const removed: string[] = [];
    for (const instance of this.forTarget(targetId)) {
      const definition = this.registry.get(instance.effectId).definition;
      if (definition.dispellable && predicate(instance) && this.expire(instance.instanceId, now, 'cleanse')) removed.push(instance.instanceId);
    }
    if (removed.length > 0) this.events.emit('effect-cleansed', now, { removed }, undefined, targetId);
    return removed;
  }

  public removeForCombatant(id: CombatantId, now: number): void {
    for (const instance of this.list()) if (instance.sourceId === id || instance.targetId === id) this.expire(instance.instanceId, now, 'combatant-removed');
  }

  public forTarget(targetId: CombatantId): ActiveEffectSnapshot[] { return this.list().filter((instance) => instance.targetId === targetId); }
  public forSource(sourceId: CombatantId): ActiveEffectSnapshot[] { return this.list().filter((instance) => instance.sourceId === sourceId); }
  public has(targetId: CombatantId, effectId: string): boolean { return this.forTarget(targetId).some((instance) => instance.effectId === effectId); }
  public stacks(targetId: CombatantId, effectId: string): number { return this.forTarget(targetId).filter((instance) => instance.effectId === effectId).reduce((sum, instance) => sum + instance.stacks, 0); }
  public list(): ActiveEffectSnapshot[] { return [...this.active.values()].map((instance) => ({ ...instance, tags: [...instance.tags], state: { ...instance.state } })); }
  public capture(): EffectEngineSnapshot { return { active: this.list(), serial: this.serial }; }
  public restore(snapshot: EffectEngineSnapshot): void { this.active.clear(); for (const instance of snapshot.active) this.active.set(instance.instanceId, { ...instance, tags: [...instance.tags], state: { ...instance.state } }); this.serial = snapshot.serial; }

  private stack(existing: ActiveEffectSnapshot, application: EffectApplication, now: number): ActiveEffectSnapshot {
    const definition = this.registry.get(existing.effectId).definition;
    const duration = this.adjustDuration(application.duration ?? definition.duration, this.combatants.get(existing.targetId)!);
    if (definition.stackPolicy === 'ignore') return existing;
    if (definition.stackPolicy === 'replace') { existing.stacks = application.stacks ?? 1; existing.intensity = application.intensity ?? 1; existing.appliedAt = now; existing.expiresAt = now + duration; }
    if (definition.stackPolicy === 'refresh') existing.expiresAt = now + duration;
    if (definition.stackPolicy === 'stack-duration') existing.expiresAt += duration;
    if (definition.stackPolicy === 'stack-intensity') { existing.stacks = Math.min(definition.maximumStacks, existing.stacks + (application.stacks ?? 1)); existing.intensity = Math.max(existing.intensity, application.intensity ?? 1); existing.expiresAt = now + duration; }
    return existing;
  }

  private findMatching(effectId: string, sourceId: string, targetId: string): ActiveEffectSnapshot | undefined {
    return [...this.active.values()].find((instance) => instance.effectId === effectId && instance.sourceId === sourceId && instance.targetId === targetId);
  }

  private adjustDuration(duration: number, target: Combatant): number {
    const definitionIsControl = duration > 0;
    return definitionIsControl ? duration * (1 - target.stats.get('tenacity')) : duration;
  }

  private context(instance: ActiveEffectSnapshot, now: number): EffectExecutionContext {
    const source = this.combatants.get(instance.sourceId);
    const target = this.combatants.get(instance.targetId);
    if (!source || !target) throw new Error('effect references missing combatant');
    return { now, source: source.snapshot(), target: target.snapshot(), instance, random: this.random.fork(instance.instanceId + ':' + now) };
  }
}
`);

const effectSchools = [
  ['fire', 'Fire', 'fire', 'burning', 'spellPower'],
  ['frost', 'Frost', 'frost', 'chilled', 'movementSpeed'],
  ['lightning', 'Lightning', 'lightning', 'shocked', 'haste'],
  ['holy', 'Holy', 'holy', 'radiant', 'healingPower'],
  ['shadow', 'Shadow', 'shadow', 'cursed', 'armor'],
  ['poison', 'Poison', 'poison', 'poisoned', 'attackPower'],
  ['arcane', 'Arcane', 'arcane', 'unstable', 'resistance'],
  ['physical', 'Physical', 'physical', 'bleeding', 'blockChance'],
];

const effectKinds = ['brand', 'exposure', 'surge', 'weakness', 'aura', 'wound', 'echo', 'prison', 'mastery', 'cataclysm'];
const effectImports = [];
const effectInstances = [];

for (const [school, schoolClass, damageType, grantedTag, modifiedStat] of effectSchools) {
  for (let variant = 0; variant < effectKinds.length; variant++) {
    const kind = effectKinds[variant];
    const className = schoolClass + kind.charAt(0).toUpperCase() + kind.slice(1) + 'Effect';
    const effectId = school + '-' + kind;
    const fileName = 'effects/catalog/' + school + '/' + className + '.ts';
    const duration = 2200 + variant * 450;
    const interval = variant % 3 === 1 ? 0 : 500 + (variant % 4) * 250;
    const maximumStacks = 1 + (variant % 5);
    const kindType = variant % 4 === 0 ? 'buff' : variant % 4 === 1 ? 'debuff' : variant % 4 === 2 ? 'damage-over-time' : 'control';
    const stackPolicy = variant % 4 === 0 ? 'refresh' : variant % 4 === 1 ? 'stack-intensity' : variant % 4 === 2 ? 'stack-duration' : 'replace';
    const control = variant % 4 === 3 ? (variant % 2 ? 'slow' : 'root') : undefined;
    const modifierOperation = variant % 2 === 0 ? 'add' : 'multiply';
    const modifierValue = modifierOperation === 'add' ? (2 + variant) : (variant % 4 === 1 ? 0.85 : 1.12);
    const tickDamage = 3 + variant * 2;
    effectImports.push("import { " + className + " } from './catalog/" + school + "/" + className + "';");
    effectInstances.push('new ' + className + '()');
    emit(fileName, String.raw`
import { BaseEffect } from '../../BaseEffect';
import { AbilityImpact, EffectDefinition, EffectExecutionContext, createEmptyImpact } from '../../../core/types';

export class ${className} extends BaseEffect {
  public readonly definition: EffectDefinition = {
    id: '${effectId}',
    name: '${schoolClass} ${kind.charAt(0).toUpperCase() + kind.slice(1)}',
    description: 'A ${school} combat effect that changes tempo, stats, and repeated impact behavior.',
    kind: '${kindType}',
    damageType: '${damageType}',
    duration: ${duration},
    tickInterval: ${interval},
    maximumStacks: ${maximumStacks},
    stackPolicy: '${stackPolicy}',
    dispellable: ${variant !== 9},
    ${control ? `control: '${control}',` : ''}
    tags: ['${school}', '${kind}', 'grants:${grantedTag}'],
    statModifiers: [{
      id: '${effectId}-modifier',
      stat: '${modifiedStat}',
      operation: '${modifierOperation}',
      value: ${modifierValue},
      priority: ${20 + variant},
    }],
  };

  public override canApply(context: EffectExecutionContext): string | undefined {
    const base = super.canApply(context);
    if (base) return base;
    if (context.target.tags.includes('immune-${school}')) return '${school}-immunity';
    if (context.instance.intensity <= 0) return 'zero-intensity';
    return undefined;
  }

  public override onApply(context: EffectExecutionContext): void {
    super.onApply(context);
    context.instance.state.school = '${school}';
    context.instance.state.variant = ${variant};
    context.instance.state.totalTicks = 0;
    context.instance.state.accumulatedPower = context.instance.intensity * context.instance.stacks;
  }

  public override onTick(context: EffectExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const tick = Number(context.instance.state.totalTicks ?? 0) + 1;
    context.instance.state.totalTicks = tick;
    context.instance.state.lastTickAt = context.now;
    const amount = ${tickDamage} * context.instance.intensity * context.instance.stacks * (1 + Math.min(5, tick - 1) * 0.08);
    ${kindType === 'buff' ? `impact.healing.push({ sourceId: context.source.id, targetId: context.target.id, baseAmount: amount, powerRatio: 0.05, canCrit: false, tags: ['effect-tick', '${school}'] });` : `impact.damage.push({ sourceId: context.source.id, targetId: context.target.id, damageType: '${damageType}', baseAmount: amount, powerRatio: 0.04, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: ${variant / 20}, tags: ['effect-tick', '${school}'], hitIndex: tick });`}
    if (tick % ${2 + variant % 3} === 0) impact.resourceChanges.push({ targetId: context.source.id, resource: '${variant % 2 === 0 ? 'mana' : 'stamina'}', amount: ${1 + variant % 4}, reason: '${effectId}-tick' });
    return impact;
  }

  public override onExpire(context: EffectExecutionContext): void {
    super.onExpire(context);
    context.instance.state.finalTicks = Number(context.instance.state.totalTicks ?? 0);
    context.instance.state.completedNaturally = context.now >= context.instance.expiresAt;
  }
}
`);
  }
}

emit('effects/catalog.ts', effectImports.join('\n') + String.raw`
import { CombatEffect } from '../core/types';

export function createCombatEffectCatalog(): CombatEffect[] {
  return [${effectInstances.join(',\n    ')}];
}
`);

emit('targeting/TargetResolver.ts', String.raw`
import { CombatantSnapshot, TargetingMode, Vec2, distance, normalize } from '../core/types';

export interface TargetQuery {
  caster: CombatantSnapshot;
  candidates: CombatantSnapshot[];
  mode: TargetingMode;
  targetId?: string;
  targetPosition: Vec2;
  direction: Vec2;
  range: number;
  radius: number;
  angle: number;
  maximumTargets?: number;
  includeAllies?: boolean;
  includeSelf?: boolean;
  requireLineOfSight?: (from: Vec2, to: Vec2) => boolean;
}

export class TargetResolver {
  public resolve(query: TargetQuery): CombatantSnapshot[] {
    const candidates = query.candidates.filter((candidate) => this.eligible(candidate, query));
    let selected: CombatantSnapshot[];
    switch (query.mode) {
      case 'self': selected = [query.caster]; break;
      case 'single': selected = this.single(candidates, query); break;
      case 'cone': selected = this.cone(candidates, query); break;
      case 'line': selected = this.line(candidates, query); break;
      case 'circle': selected = this.circle(candidates, query); break;
      case 'ring': selected = this.ring(candidates, query); break;
      case 'chain': selected = this.chain(candidates, query); break;
      case 'dash': selected = this.line(candidates, query); break;
      case 'projectile': selected = this.line(candidates, { ...query, radius: Math.max(8, query.radius) }); break;
      case 'summon': selected = []; break;
      default: selected = [];
    }
    return selected.slice(0, query.maximumTargets ?? Infinity);
  }

  public nearest(origin: Vec2, candidates: readonly CombatantSnapshot[], maximumRange = Infinity): CombatantSnapshot | undefined {
    return [...candidates].filter((candidate) => candidate.alive && distance(origin, candidate.position) <= maximumRange)
      .sort((left, right) => distance(origin, left.position) - distance(origin, right.position) || left.id.localeCompare(right.id))[0];
  }

  public farthest(origin: Vec2, candidates: readonly CombatantSnapshot[], maximumRange = Infinity): CombatantSnapshot | undefined {
    return [...candidates].filter((candidate) => candidate.alive && distance(origin, candidate.position) <= maximumRange)
      .sort((left, right) => distance(origin, right.position) - distance(origin, left.position) || left.id.localeCompare(right.id))[0];
  }

  private eligible(candidate: CombatantSnapshot, query: TargetQuery): boolean {
    if (!candidate.alive) return false;
    if (!query.includeSelf && candidate.id === query.caster.id) return false;
    if (!query.includeAllies && candidate.team === query.caster.team) return false;
    if (query.requireLineOfSight && !query.requireLineOfSight(query.caster.position, candidate.position)) return false;
    return true;
  }

  private single(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const explicit = query.targetId ? candidates.find((candidate) => candidate.id === query.targetId) : undefined;
    const target = explicit ?? this.nearest(query.targetPosition, candidates, query.radius || query.range);
    return target && distance(query.caster.position, target.position) <= query.range ? [target] : [];
  }

  private cone(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const direction = normalize(query.direction);
    const minimumDot = Math.cos((query.angle * Math.PI / 180) / 2);
    return candidates.filter((candidate) => {
      const delta = { x: candidate.position.x - query.caster.position.x, y: candidate.position.y - query.caster.position.y };
      const length = Math.hypot(delta.x, delta.y);
      if (length > query.range || length <= Number.EPSILON) return false;
      const unit = { x: delta.x / length, y: delta.y / length };
      return unit.x * direction.x + unit.y * direction.y >= minimumDot;
    }).sort((left, right) => distance(query.caster.position, left.position) - distance(query.caster.position, right.position));
  }

  private line(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const direction = normalize(query.direction);
    return candidates.filter((candidate) => {
      const deltaX = candidate.position.x - query.caster.position.x;
      const deltaY = candidate.position.y - query.caster.position.y;
      const projection = deltaX * direction.x + deltaY * direction.y;
      if (projection < 0 || projection > query.range) return false;
      const perpendicular = Math.abs(deltaX * direction.y - deltaY * direction.x);
      return perpendicular <= Math.max(1, query.radius);
    }).sort((left, right) => distance(query.caster.position, left.position) - distance(query.caster.position, right.position));
  }

  private circle(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    return candidates.filter((candidate) => distance(query.targetPosition, candidate.position) <= query.radius)
      .sort((left, right) => distance(query.targetPosition, left.position) - distance(query.targetPosition, right.position));
  }

  private ring(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const inner = Math.max(0, query.radius * 0.55);
    return candidates.filter((candidate) => {
      const value = distance(query.targetPosition, candidate.position);
      return value >= inner && value <= query.radius;
    }).sort((left, right) => distance(query.targetPosition, left.position) - distance(query.targetPosition, right.position));
  }

  private chain(candidates: CombatantSnapshot[], query: TargetQuery): CombatantSnapshot[] {
    const result: CombatantSnapshot[] = [];
    let origin = query.targetPosition;
    const remaining = [...candidates];
    while (remaining.length > 0 && result.length < (query.maximumTargets ?? 4)) {
      const next = this.nearest(origin, remaining, result.length === 0 ? query.range : query.radius);
      if (!next) break;
      result.push(next);
      origin = next.position;
      remaining.splice(remaining.findIndex((entry) => entry.id === next.id), 1);
    }
    return result;
  }
}
`);

emit('abilities/BaseAbility.ts', String.raw`
import { Ability, AbilityExecutionContext, AbilityImpact, AbilityDefinition, distance } from '../core/types';

export abstract class BaseAbility implements Ability {
  public abstract readonly definition: AbilityDefinition;

  public canCast(context: AbilityExecutionContext): string | undefined {
    if (!context.caster.alive) return 'caster-defeated';
    if (context.caster.tags.includes('silenced') && this.definition.category !== 'primary') return 'silenced';
    if (context.caster.tags.includes('disarmed') && this.definition.damageType === 'physical') return 'disarmed';
    if (this.definition.classId !== context.caster.classId && this.definition.classId !== 'enemy') return 'wrong-class';
    if (this.definition.targeting !== 'self' && this.definition.targeting !== 'summon' && distance(context.caster.position, context.targetPosition) > this.definition.range + this.definition.radius) return 'out-of-range';
    return undefined;
  }

  public abstract createImpact(context: AbilityExecutionContext): AbilityImpact;

  protected falloff(index: number, amount: number, rate = 0.12): number { return amount * Math.max(0.35, 1 - index * rate); }
  protected levelScale(level: number): number { return 1 + Math.max(0, level - 1) * 0.08; }
  protected executeBonus(health: number, maximumHealth: number, threshold = 0.25): number { return maximumHealth > 0 && health / maximumHealth <= threshold ? 1.5 : 1; }
}
`);

emit('abilities/AbilityRegistry.ts', String.raw`
import { Ability, AbilityId, CombatClass } from '../core/types';

export class AbilityRegistry {
  private readonly abilities = new Map<AbilityId, Ability>();

  public register(ability: Ability, replace = false): this {
    if (this.abilities.has(ability.definition.id) && !replace) throw new Error('ability already registered: ' + ability.definition.id);
    this.abilities.set(ability.definition.id, ability);
    return this;
  }
  public registerMany(abilities: Iterable<Ability>, replace = false): this { for (const ability of abilities) this.register(ability, replace); return this; }
  public unregister(id: AbilityId): boolean { return this.abilities.delete(id); }
  public has(id: AbilityId): boolean { return this.abilities.has(id); }
  public get(id: AbilityId): Ability { const ability = this.abilities.get(id); if (!ability) throw new Error('unknown ability: ' + id); return ability; }
  public list(): Ability[] { return [...this.abilities.values()]; }
  public forClass(classId: CombatClass): Ability[] { return this.list().filter((ability) => ability.definition.classId === classId); }
  public byTag(tag: string): Ability[] { return this.list().filter((ability) => ability.definition.tags.includes(tag)); }
  public clear(): void { this.abilities.clear(); }
  public get size(): number { return this.abilities.size; }
}
`);

const abilityClasses = [
  ['knight', 'Knight', 'physical', 'holy', 34, 85, 420, 18],
  ['mage', 'Mage', 'arcane', 'frost', 28, 360, 520, 26],
  ['ranger', 'Ranger', 'physical', 'poison', 31, 440, 620, 20],
  ['rogue', 'Rogue', 'shadow', 'physical', 22, 220, 560, 16],
];

const abilityNames = [
  'opening-strike', 'rising-edge', 'guard-breaker', 'crescent-sweep', 'piercing-line',
  'focused-shot', 'rebounding-bolt', 'storm-cone', 'ground-sigil', 'orbiting-blades',
  'evasive-counter', 'charged-release', 'execution-mark', 'resource-siphon', 'defensive-stance',
  'summoned-ally', 'chain-reaction', 'delayed-burst', 'whirling-zone', 'finishing-blow',
  'mobility-cut', 'protective-ward', 'elemental-infusion', 'rapid-sequence', 'perfect-reaction',
  'area-denial', 'hunter-mark', 'awakening', 'signature-special', 'ultimate-art',
];

const targetingModes = ['single', 'cone', 'line', 'circle', 'projectile', 'self', 'chain', 'ring', 'dash', 'summon'];
const abilityImports = [];
const abilityInstances = [];

for (const [classId, className, primaryType, secondaryType, baseClassDamage, baseRange, projectileSpeed, baseCost] of abilityClasses) {
  for (let variant = 0; variant < abilityNames.length; variant++) {
    const slug = abilityNames[variant];
    const abilityClassName = className + slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Ability';
    const abilityId = classId + '-' + slug;
    const category = variant < 8 ? 'primary' : variant < 15 ? 'secondary' : variant < 25 ? 'special' : variant < 29 ? 'reaction' : 'ultimate';
    const targeting = targetingModes[variant % targetingModes.length];
    const damageType = variant % 3 === 0 ? primaryType : variant % 3 === 1 ? secondaryType : (classId === 'knight' ? 'holy' : classId === 'mage' ? 'lightning' : classId === 'ranger' ? 'frost' : 'poison');
    const baseDamage = Number(baseClassDamage) + variant * 3 + (category === 'ultimate' ? 80 : 0);
    const range = Number(baseRange) + (variant % 5) * 22;
    const radius = 24 + (variant % 7) * 11;
    const angle = 35 + (variant % 5) * 12;
    const castTime = (variant % 4) * 120;
    const recovery = 180 + (variant % 5) * 55;
    const cooldown = category === 'primary' ? 250 + variant * 10 : category === 'ultimate' ? 18000 : 1800 + variant * 180;
    const cost = category === 'primary' ? Math.max(0, Number(baseCost) - 14) : Number(baseCost) + variant;
    const effectSchool = variant % 2 === 0 ? primaryType : secondaryType;
    const matchingSchool = effectSchools.find(([school]) => school === effectSchool)?.[0] ?? (effectSchool === 'physical' ? 'physical' : 'arcane');
    const effectId = matchingSchool + '-' + effectKinds[variant % effectKinds.length];
    const powerRatio = (0.45 + variant * 0.035).toFixed(3);
    const charges = variant % 9 === 0 ? 2 : 1;
    const fileName = 'abilities/catalog/' + classId + '/' + abilityClassName + '.ts';
    abilityImports.push("import { " + abilityClassName + " } from './catalog/" + classId + "/" + abilityClassName + "';");
    abilityInstances.push('new ' + abilityClassName + '()');
    emit(fileName, String.raw`
import { BaseAbility } from '../../BaseAbility';
import { AbilityDefinition, AbilityExecutionContext, AbilityImpact, createEmptyImpact, normalize } from '../../../core/types';

export class ${abilityClassName} extends BaseAbility {
  public readonly definition: AbilityDefinition = {
    id: '${abilityId}',
    name: '${className} ${slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')}',
    description: 'A complete ${classId} technique with targeting, damage, resource, effect and movement behavior.',
    classId: '${classId}',
    category: '${category}',
    targeting: '${targeting}',
    damageType: '${damageType}',
    baseDamage: ${baseDamage},
    powerRatio: ${powerRatio},
    range: ${range},
    radius: ${radius},
    angle: ${angle},
    castTime: ${castTime},
    recoveryTime: ${recovery},
    cooldown: ${cooldown},
    charges: ${charges},
    costs: [${cost > 0 ? `{ resource: '${category === 'primary' ? 'stamina' : category === 'ultimate' ? 'ultimate' : 'mana'}', amount: ${cost} }` : ''}],
    tags: ['${classId}', '${category}', '${targeting}', '${damageType}', 'ability-${variant + 1}'],
    interruptible: ${castTime > 0},
    canMoveWhileCasting: ${classId === 'ranger' || classId === 'rogue'},
    animation: '${classId}_${category}_${(variant % 6) + 1}',
    visualEffect: 'fx_${damageType}_${(variant % 8) + 1}',
    soundEffect: 'sfx_${classId}_${(variant % 7) + 1}',
  };

  public override canCast(context: AbilityExecutionContext): string | undefined {
    const base = super.canCast(context);
    if (base) return base;
    if (context.caster.resources.${category === 'primary' ? 'stamina' : category === 'ultimate' ? 'ultimate' : 'mana'} < ${cost}) return 'insufficient-resource';
    if (${variant % 5 === 0} && context.caster.tags.includes('grounded-disabled')) return 'movement-disabled';
    return undefined;
  }

  public createImpact(context: AbilityExecutionContext): AbilityImpact {
    const impact = createEmptyImpact();
    const direction = normalize(context.direction, context.caster.facing);
    const levelMultiplier = this.levelScale(context.caster.level);
    const targets = context.targets.length > 0 ? context.targets : (${targeting === 'self' ? '[context.caster]' : '[]'});
    targets.forEach((target, index) => {
      const execute = this.executeBonus(target.resources.health, target.stats.maximumHealth, ${0.18 + (variant % 4) * 0.03});
      const amount = this.falloff(index, this.definition.baseDamage * levelMultiplier * execute, ${0.08 + (variant % 5) * 0.025});
      ${targeting === 'self' ? `impact.healing.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, baseAmount: amount * 0.55, powerRatio: this.definition.powerRatio, canCrit: true, tags: [...this.definition.tags, 'self-heal'] });` : `impact.damage.push({ sourceId: context.caster.id, targetId: target.id, abilityId: this.definition.id, damageType: this.definition.damageType, baseAmount: amount, powerRatio: this.definition.powerRatio, canCrit: true, canBlock: ${variant % 4 !== 3}, ignoresArmor: ${Math.min(0.5, variant * 0.012).toFixed(3)}, ignoresResistance: ${Math.min(0.45, variant * 0.01).toFixed(3)}, tags: [...this.definition.tags, 'direct-impact'], hitIndex: index });`}
      impact.effects.push({ effectId: '${effectId}', sourceId: context.caster.id, targetId: target.id, duration: ${1800 + variant * 90}, intensity: ${1 + (variant % 5) * 0.15}, stacks: ${1 + variant % 2}, abilityId: this.definition.id });
      if (${variant % 4 === 0}) impact.displacement.push({ targetId: target.id, direction, distance: ${30 + variant * 2}, duration: ${120 + variant * 3}, kind: '${variant % 8 === 0 ? 'pull' : 'knockback'}' });
    });
    if (this.definition.targeting === 'projectile' || ${variant % 6 === 2}) {
      impact.projectiles.push({ sourceId: context.caster.id, abilityId: this.definition.id, origin: { ...context.caster.position }, direction, targetId: context.targets[0]?.id, definition: { speed: ${projectileSpeed + variant * 8}, lifetime: ${900 + variant * 45}, radius: ${8 + variant % 6}, piercing: ${variant % 4}, bounces: ${variant % 3}, homingStrength: ${variant % 5 === 0 ? 0.08 : 0}, gravity: 0, acceleration: ${variant % 4 === 1 ? 35 : 0}, maximumSpeed: ${Number(projectileSpeed) + 500}, collisionTeams: ['enemy'], tags: [...this.definition.tags, 'ability-projectile'] } });
    }
    if (${targeting === 'dash'}) impact.displacement.push({ targetId: context.caster.id, direction, distance: ${80 + variant * 4}, duration: ${100 + variant * 4}, kind: 'dash' });
    impact.resourceChanges.push({ targetId: context.caster.id, resource: '${variant % 2 === 0 ? 'combo' : 'ultimate'}', amount: ${2 + variant % 7}, reason: this.definition.id });
    return impact;
  }
}
`);
  }
}

emit('abilities/catalog.ts', abilityImports.join('\n') + String.raw`
import { Ability } from '../core/types';

export function createAbilityCatalog(): Ability[] {
  return [${abilityInstances.join(',\n    ')}];
}
`);

emit('projectiles/ProjectileSystem.ts', String.raw`
import { Combatant } from '../core/Combatant';
import { CombatantId, ProjectileId, ProjectileSnapshot, ProjectileSpawnRequest, Vec2, distance, normalize } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';

export interface ProjectileCollision { projectile: ProjectileSnapshot; targetId: CombatantId; position: Vec2; }
export interface ProjectileUpdateResult { collisions: ProjectileCollision[]; expired: ProjectileId[]; }
export interface ProjectileSystemSnapshot { projectiles: ProjectileSnapshot[]; serial: number; }

export class ProjectileSystem {
  private readonly projectiles = new Map<ProjectileId, ProjectileSnapshot>();
  private serial = 0;

  public constructor(private readonly events: CombatEventStream, private readonly combatants: Map<CombatantId, Combatant>) {}

  public spawn(request: ProjectileSpawnRequest, now: number): ProjectileSnapshot {
    const direction = normalize(request.direction);
    const projectile: ProjectileSnapshot = {
      id: 'projectile-' + ++this.serial,
      sourceId: request.sourceId,
      abilityId: request.abilityId,
      position: { ...request.origin },
      previousPosition: { ...request.origin },
      velocity: { x: direction.x * request.definition.speed, y: direction.y * request.definition.speed },
      definition: { ...request.definition, collisionTeams: [...request.definition.collisionTeams], tags: [...request.definition.tags] },
      createdAt: now,
      expiresAt: now + request.definition.lifetime,
      remainingPierces: request.definition.piercing,
      remainingBounces: request.definition.bounces,
      hitTargets: [],
      targetId: request.targetId,
    };
    this.projectiles.set(projectile.id, projectile);
    this.events.emit('projectile-spawned', now, { projectile: this.clone(projectile) }, request.sourceId);
    return this.clone(projectile);
  }

  public update(now: number, deltaMilliseconds: number, obstacleTest?: (from: Vec2, to: Vec2) => Vec2 | undefined): ProjectileUpdateResult {
    const delta = Math.max(0, Math.min(100, deltaMilliseconds)) / 1000;
    const collisions: ProjectileCollision[] = [];
    const expired: ProjectileId[] = [];
    for (const projectile of [...this.projectiles.values()]) {
      if (now >= projectile.expiresAt) { this.expire(projectile.id, now, 'lifetime'); expired.push(projectile.id); continue; }
      projectile.previousPosition = { ...projectile.position };
      this.applyHoming(projectile, delta);
      const speed = Math.hypot(projectile.velocity.x, projectile.velocity.y);
      if (projectile.definition.acceleration !== 0 && speed > 0) {
        const nextSpeed = Math.min(projectile.definition.maximumSpeed, speed + projectile.definition.acceleration * delta);
        projectile.velocity.x = projectile.velocity.x / speed * nextSpeed;
        projectile.velocity.y = projectile.velocity.y / speed * nextSpeed;
      }
      projectile.velocity.y += projectile.definition.gravity * delta;
      const next = { x: projectile.position.x + projectile.velocity.x * delta, y: projectile.position.y + projectile.velocity.y * delta };
      const normal = obstacleTest?.(projectile.position, next);
      if (normal) {
        if (projectile.remainingBounces <= 0) { this.expire(projectile.id, now, 'obstacle'); expired.push(projectile.id); continue; }
        this.reflect(projectile, normal);
        projectile.remainingBounces--;
      } else {
        projectile.position = next;
      }
      for (const target of this.combatants.values()) {
        const snapshot = target.snapshot();
        if (!snapshot.alive || target.id === projectile.sourceId || projectile.hitTargets.includes(target.id)) continue;
        if (!projectile.definition.collisionTeams.includes(snapshot.team)) continue;
        if (this.segmentDistance(snapshot.position, projectile.previousPosition, projectile.position) > projectile.definition.radius) continue;
        projectile.hitTargets.push(target.id);
        collisions.push({ projectile: this.clone(projectile), targetId: target.id, position: { ...projectile.position } });
        this.events.emit('projectile-hit', now, { projectileId: projectile.id, abilityId: projectile.abilityId }, projectile.sourceId, target.id);
        if (projectile.remainingPierces <= 0) { this.expire(projectile.id, now, 'hit'); expired.push(projectile.id); break; }
        projectile.remainingPierces--;
      }
      if (this.projectiles.has(projectile.id)) this.events.emit('projectile-moved', now, { id: projectile.id, position: { ...projectile.position }, velocity: { ...projectile.velocity } }, projectile.sourceId);
    }
    return { collisions, expired };
  }

  public expire(id: ProjectileId, now: number, reason: string): boolean {
    const projectile = this.projectiles.get(id);
    if (!projectile) return false;
    this.projectiles.delete(id);
    this.events.emit('projectile-expired', now, { id, reason }, projectile.sourceId);
    return true;
  }

  public removeBySource(sourceId: CombatantId, now: number): number {
    let removed = 0;
    for (const projectile of this.list()) if (projectile.sourceId === sourceId && this.expire(projectile.id, now, 'source-removed')) removed++;
    return removed;
  }

  public get(id: ProjectileId): ProjectileSnapshot | undefined { const value = this.projectiles.get(id); return value ? this.clone(value) : undefined; }
  public list(): ProjectileSnapshot[] { return [...this.projectiles.values()].map((projectile) => this.clone(projectile)); }
  public capture(): ProjectileSystemSnapshot { return { projectiles: this.list(), serial: this.serial }; }
  public restore(snapshot: ProjectileSystemSnapshot): void { this.projectiles.clear(); for (const projectile of snapshot.projectiles) this.projectiles.set(projectile.id, this.clone(projectile)); this.serial = snapshot.serial; }

  private applyHoming(projectile: ProjectileSnapshot, delta: number): void {
    if (!projectile.targetId || projectile.definition.homingStrength <= 0) return;
    const target = this.combatants.get(projectile.targetId)?.snapshot();
    if (!target?.alive) return;
    const desired = normalize({ x: target.position.x - projectile.position.x, y: target.position.y - projectile.position.y });
    const speed = Math.hypot(projectile.velocity.x, projectile.velocity.y);
    const current = normalize(projectile.velocity);
    const blend = Math.min(1, projectile.definition.homingStrength * delta * 60);
    const direction = normalize({ x: current.x + (desired.x - current.x) * blend, y: current.y + (desired.y - current.y) * blend });
    projectile.velocity = { x: direction.x * speed, y: direction.y * speed };
  }

  private reflect(projectile: ProjectileSnapshot, normal: Vec2): void {
    const unit = normalize(normal);
    const dot = projectile.velocity.x * unit.x + projectile.velocity.y * unit.y;
    projectile.velocity = { x: projectile.velocity.x - 2 * dot * unit.x, y: projectile.velocity.y - 2 * dot * unit.y };
  }

  private segmentDistance(point: Vec2, start: Vec2, end: Vec2): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared <= Number.EPSILON) return distance(point, start);
    const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
    return distance(point, { x: start.x + dx * ratio, y: start.y + dy * ratio });
  }

  private clone(projectile: ProjectileSnapshot): ProjectileSnapshot {
    return { ...projectile, position: { ...projectile.position }, previousPosition: { ...projectile.previousPosition }, velocity: { ...projectile.velocity }, definition: { ...projectile.definition, collisionTeams: [...projectile.definition.collisionTeams], tags: [...projectile.definition.tags] }, hitTargets: [...projectile.hitTargets] };
  }
}
`);

emit('combo/ComboEngine.ts', String.raw`
import { CombatantId } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';

export type ComboInput = 'light' | 'heavy' | 'ranged' | 'dodge' | 'special' | 'delay' | 'hold';

export interface ComboMove {
  id: string;
  name: string;
  sequence: ComboInput[];
  maximumGap: number;
  score: number;
  damageMultiplier: number;
  resourceReward: number;
  tags: string[];
}

export interface ComboState {
  combatantId: CombatantId;
  inputs: Array<{ input: ComboInput; time: number }>;
  hitCount: number;
  score: number;
  rank: string;
  multiplier: number;
  lastHitAt: number;
  activeMoveId?: string;
}

interface TrieNode { children: Map<ComboInput, TrieNode>; moves: ComboMove[]; }

export class ComboEngine {
  private readonly root: TrieNode = { children: new Map(), moves: [] };
  private readonly moves = new Map<string, ComboMove>();
  private readonly states = new Map<CombatantId, ComboState>();
  private readonly ranks = [
    { threshold: 0, name: 'D', multiplier: 1 },
    { threshold: 100, name: 'C', multiplier: 1.08 },
    { threshold: 250, name: 'B', multiplier: 1.16 },
    { threshold: 500, name: 'A', multiplier: 1.25 },
    { threshold: 850, name: 'S', multiplier: 1.38 },
    { threshold: 1300, name: 'SS', multiplier: 1.52 },
    { threshold: 2000, name: 'SSS', multiplier: 1.7 },
  ];

  public constructor(private readonly events: CombatEventStream, private readonly timeout = 2800) {}

  public register(move: ComboMove): void {
    if (this.moves.has(move.id)) throw new Error('combo move already registered: ' + move.id);
    if (move.sequence.length === 0) throw new Error('combo move sequence cannot be empty');
    this.moves.set(move.id, { ...move, sequence: [...move.sequence], tags: [...move.tags] });
    let node = this.root;
    for (const input of move.sequence) {
      const child = node.children.get(input) ?? { children: new Map<ComboInput, TrieNode>(), moves: [] };
      node.children.set(input, child);
      node = child;
    }
    node.moves.push(move);
  }

  public input(combatantId: CombatantId, input: ComboInput, now: number): ComboMove | undefined {
    const state = this.state(combatantId);
    if (state.inputs.length > 0 && now - state.inputs[state.inputs.length - 1].time > this.maximumGapForPrefix(state.inputs.map((entry) => entry.input))) state.inputs = [];
    state.inputs.push({ input, time: now });
    if (state.inputs.length > 12) state.inputs.shift();
    const match = this.bestMatch(state.inputs);
    if (match) {
      state.activeMoveId = match.id;
      state.score += match.score;
      this.recalculate(state);
      this.events.emit('combo-advanced', now, { moveId: match.id, score: state.score, rank: state.rank }, combatantId);
    } else if (!this.hasPrefix(state.inputs.map((entry) => entry.input))) {
      const last = state.inputs[state.inputs.length - 1];
      state.inputs = [last];
      if (!this.hasPrefix([last.input])) state.inputs = [];
    }
    return match;
  }

  public registerHit(combatantId: CombatantId, now: number, damage: number, varietyTag?: string): ComboState {
    const state = this.state(combatantId);
    const wasEmpty = state.hitCount === 0;
    state.hitCount++;
    state.lastHitAt = now;
    state.score += Math.max(1, Math.round(damage)) + Math.min(100, state.hitCount * 2) + (varietyTag ? 15 : 0);
    this.recalculate(state);
    this.events.emit(wasEmpty ? 'combo-started' : 'combo-advanced', now, { hitCount: state.hitCount, score: state.score, rank: state.rank }, combatantId);
    return this.cloneState(state);
  }

  public update(now: number): CombatantId[] {
    const broken: CombatantId[] = [];
    for (const state of this.states.values()) {
      if (state.hitCount > 0 && now - state.lastHitAt > this.timeout) { this.break(state.combatantId, now, 'timeout'); broken.push(state.combatantId); }
    }
    return broken;
  }

  public break(combatantId: CombatantId, now: number, reason: string): void {
    const state = this.state(combatantId);
    this.events.emit('combo-broken', now, { reason, finalHits: state.hitCount, finalScore: state.score, finalRank: state.rank }, combatantId);
    this.states.set(combatantId, this.emptyState(combatantId));
  }

  public finish(combatantId: CombatantId, now: number): ComboState {
    const final = this.cloneState(this.state(combatantId));
    this.events.emit('combo-finished', now, final, combatantId);
    this.states.set(combatantId, this.emptyState(combatantId));
    return final;
  }

  public get(combatantId: CombatantId): ComboState { return this.cloneState(this.state(combatantId)); }
  public damageMultiplier(combatantId: CombatantId): number { return this.state(combatantId).multiplier; }
  public listMoves(): ComboMove[] { return [...this.moves.values()].map((move) => ({ ...move, sequence: [...move.sequence], tags: [...move.tags] })); }

  private state(id: CombatantId): ComboState { const current = this.states.get(id) ?? this.emptyState(id); this.states.set(id, current); return current; }
  private emptyState(id: CombatantId): ComboState { return { combatantId: id, inputs: [], hitCount: 0, score: 0, rank: 'D', multiplier: 1, lastHitAt: 0 }; }

  private recalculate(state: ComboState): void {
    const rank = [...this.ranks].reverse().find((entry) => state.score >= entry.threshold) ?? this.ranks[0];
    state.rank = rank.name;
    state.multiplier = rank.multiplier;
  }

  private bestMatch(inputs: Array<{ input: ComboInput; time: number }>): ComboMove | undefined {
    return this.listMoves().filter((move) => move.sequence.length <= inputs.length).filter((move) => {
      const slice = inputs.slice(-move.sequence.length);
      return move.sequence.every((input, index) => input === slice[index].input) && slice.every((entry, index) => index === 0 || entry.time - slice[index - 1].time <= move.maximumGap);
    }).sort((left, right) => right.sequence.length - left.sequence.length || right.score - left.score)[0];
  }

  private hasPrefix(inputs: ComboInput[]): boolean {
    return this.listMoves().some((move) => inputs.length <= move.sequence.length && inputs.every((input, index) => move.sequence[index] === input));
  }

  private maximumGapForPrefix(inputs: ComboInput[]): number {
    return Math.max(250, ...this.listMoves().filter((move) => inputs.length <= move.sequence.length && inputs.every((input, index) => move.sequence[index] === input)).map((move) => move.maximumGap));
  }

  private cloneState(state: ComboState): ComboState { return { ...state, inputs: state.inputs.map((entry) => ({ ...entry })) }; }
}
`);

emit('abilities/AbilityEngine.ts', String.raw`
import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Combatant } from '../core/Combatant';
import { AbilityImpact, CastContext, CastId, CastRequest, CombatantId, Vec2, normalize } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';
import { TargetResolver } from '../targeting/TargetResolver';
import { AbilityRegistry } from './AbilityRegistry';

export interface CastRequestResult { accepted: boolean; reason?: string; cast?: CastContext; }
export interface AbilityEngineSnapshot { casts: CastContext[]; serial: number; }

export class AbilityEngine {
  private readonly casts = new Map<CastId, CastContext>();
  private readonly targets = new TargetResolver();
  private serial = 0;

  public constructor(
    private readonly registry: AbilityRegistry,
    private readonly events: CombatEventStream,
    private readonly random: DeterministicRandom,
    private readonly combatants: Map<CombatantId, Combatant>,
  ) {}

  public request(request: CastRequest, now: number): CastRequestResult {
    const caster = this.combatants.get(request.casterId);
    if (!caster) return { accepted: false, reason: 'unknown-caster' };
    const ability = this.registry.get(request.abilityId);
    const definition = ability.definition;
    if (!caster.cooldowns.isReady(definition.id, now)) return { accepted: false, reason: 'cooldown' };
    if (!caster.resources.canAfford(definition.costs)) return { accepted: false, reason: 'insufficient-resource' };
    const casterSnapshot = caster.snapshot();
    const direction = normalize(request.direction ?? casterSnapshot.facing);
    const targetPosition = request.targetPosition ?? this.combatants.get(request.targetId ?? '')?.snapshot().position ?? {
      x: casterSnapshot.position.x + direction.x * definition.range,
      y: casterSnapshot.position.y + direction.y * definition.range,
    };
    const targetSnapshots = this.targets.resolve({
      caster: casterSnapshot,
      candidates: [...this.combatants.values()].map((entry) => entry.snapshot()),
      mode: definition.targeting,
      targetId: request.targetId,
      targetPosition,
      direction,
      range: definition.range,
      radius: definition.radius,
      angle: definition.angle,
      maximumTargets: definition.targeting === 'single' ? 1 : 12,
      includeAllies: definition.targeting === 'self',
      includeSelf: definition.targeting === 'self',
    });
    const cast: CastContext = {
      id: 'cast-' + ++this.serial,
      request: { ...request, targetPosition: { ...targetPosition }, direction: { ...direction } },
      definition,
      startedAt: now,
      completesAt: now + definition.castTime,
      recoveryEndsAt: now + definition.castTime + definition.recoveryTime,
      targets: targetSnapshots.map((entry) => entry.id),
      interrupted: false,
      completed: false,
    };
    const execution = { now, caster: casterSnapshot, targets: targetSnapshots, targetPosition, direction, random: this.random.fork(cast.id), cast };
    const rejection = ability.canCast(execution);
    if (rejection) return { accepted: false, reason: rejection };
    const haste = casterSnapshot.stats.haste;
    cast.completesAt = now + definition.castTime / Math.max(0.1, 1 + haste);
    cast.recoveryEndsAt = cast.completesAt + definition.recoveryTime / Math.max(0.1, 1 + haste);
    caster.resources.spend(definition.costs);
    const cooldown = definition.cooldown * (1 - casterSnapshot.stats.cooldownReduction);
    caster.cooldowns.consume(definition.id, now, cooldown, definition.charges);
    this.casts.set(cast.id, cast);
    this.events.emit('cast-started', now, { cast: this.clone(cast) }, caster.id, request.targetId);
    return { accepted: true, cast: this.clone(cast) };
  }

  public update(now: number): AbilityImpact[] {
    const impacts: AbilityImpact[] = [];
    for (const cast of this.casts.values()) {
      if (!cast.completed && !cast.interrupted && now >= cast.completesAt) {
        const impact = this.complete(cast.id, now);
        if (impact) impacts.push(impact);
      }
      if ((cast.completed || cast.interrupted) && now >= cast.recoveryEndsAt) this.casts.delete(cast.id);
    }
    for (const combatant of this.combatants.values()) combatant.cooldowns.update(now);
    return impacts;
  }

  public complete(castId: CastId, now: number): AbilityImpact | undefined {
    const cast = this.casts.get(castId);
    if (!cast || cast.completed || cast.interrupted) return undefined;
    const caster = this.combatants.get(cast.request.casterId);
    if (!caster?.isAlive()) { this.interrupt(castId, now, 'caster-defeated'); return undefined; }
    const ability = this.registry.get(cast.definition.id);
    const direction = normalize(cast.request.direction ?? caster.snapshot().facing);
    const targetPosition = cast.request.targetPosition ?? caster.snapshot().position;
    const targets = cast.targets.map((id) => this.combatants.get(id)?.snapshot()).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry?.alive));
    const impact = ability.createImpact({ now, caster: caster.snapshot(), targets, targetPosition, direction, random: this.random.fork(cast.id + ':complete'), cast });
    cast.completed = true;
    this.events.emit('cast-completed', now, { cast: this.clone(cast), impact }, caster.id, cast.request.targetId);
    return impact;
  }

  public interrupt(castId: CastId, now: number, reason: string): boolean {
    const cast = this.casts.get(castId);
    if (!cast || cast.completed || cast.interrupted || !cast.definition.interruptible) return false;
    cast.interrupted = true;
    cast.recoveryEndsAt = now + Math.min(300, cast.definition.recoveryTime);
    this.events.emit('cast-interrupted', now, { castId, abilityId: cast.definition.id, reason }, cast.request.casterId, cast.request.targetId);
    return true;
  }

  public interruptCombatant(combatantId: CombatantId, now: number, reason: string): number {
    let interrupted = 0;
    for (const cast of this.casts.values()) if (cast.request.casterId === combatantId && this.interrupt(cast.id, now, reason)) interrupted++;
    return interrupted;
  }

  public activeCasts(): CastContext[] { return [...this.casts.values()].map((cast) => this.clone(cast)); }
  public capture(): AbilityEngineSnapshot { return { casts: this.activeCasts(), serial: this.serial }; }
  public restore(snapshot: AbilityEngineSnapshot): void { this.casts.clear(); for (const cast of snapshot.casts) this.casts.set(cast.id, this.clone(cast)); this.serial = snapshot.serial; }

  private clone(cast: CastContext): CastContext {
    return { ...cast, request: { ...cast.request, targetPosition: cast.request.targetPosition ? { ...cast.request.targetPosition } : undefined, direction: cast.request.direction ? { ...cast.request.direction } : undefined }, definition: { ...cast.definition, costs: cast.definition.costs.map((cost) => ({ ...cost })), tags: [...cast.definition.tags] }, targets: [...cast.targets] };
  }
}
`);

const comboClassInputs = {
  knight: ['light', 'heavy', 'dodge', 'special'],
  mage: ['ranged', 'light', 'hold', 'special'],
  ranger: ['ranged', 'hold', 'dodge', 'special'],
  rogue: ['light', 'dodge', 'heavy', 'special'],
};

emit('combo/catalog.ts', String.raw`
import { ComboMove } from './ComboEngine';

export function createComboCatalog(): ComboMove[] {
  return [
${Object.entries(comboClassInputs).flatMap(([classId, inputs]) => Array.from({ length: 12 }, (_, index) => {
  const length = 2 + index % 5;
  const sequence = Array.from({ length }, (_, step) => `'${inputs[(step + index) % inputs.length]}'`).join(', ');
  return `    { id: '${classId}-combo-${index + 1}', name: '${classId.toUpperCase()} Technique ${index + 1}', sequence: [${sequence}], maximumGap: ${420 + index * 25}, score: ${40 + index * 18}, damageMultiplier: ${(1.1 + index * 0.06).toFixed(2)}, resourceReward: ${3 + index}, tags: ['${classId}', 'length-${length}'] },`;
})).join('\n')}
  ];
}
`);

emit('runtime/CombatRuntime.ts', String.raw`
import { DeterministicRandom, RandomSnapshot } from '../../simulation/core/DeterministicRandom';
import { AbilityEngine, AbilityEngineSnapshot, CastRequestResult } from '../abilities/AbilityEngine';
import { AbilityRegistry } from '../abilities/AbilityRegistry';
import { createAbilityCatalog } from '../abilities/catalog';
import { ComboEngine, ComboInput, ComboState } from '../combo/ComboEngine';
import { createComboCatalog } from '../combo/catalog';
import { Combatant, CombatantOptions, CombatantState } from '../core/Combatant';
import {
  AbilityImpact, CastRequest, CombatEvent, CombatEventKind, CombatantId, DamagePacket,
  DamageResult, EffectApplication, HealResult, ProjectileSpawnRequest, ResourceChange, Vec2,
} from '../core/types';
import { DamagePipeline } from '../damage/DamagePipeline';
import { CombatEventStream } from '../events/CombatEventStream';
import { EffectEngine, EffectEngineSnapshot } from '../effects/EffectEngine';
import { EffectRegistry } from '../effects/EffectRegistry';
import { createCombatEffectCatalog } from '../effects/catalog';
import { ProjectileSystem, ProjectileSystemSnapshot } from '../projectiles/ProjectileSystem';
import { CombatZoneDefinition, CombatZoneSnapshot, CombatZoneSystem } from '../zones/CombatZoneSystem';
import { ElementalReactionEngine, ReactionResult } from '../reactions/ElementalReactionEngine';
import { CombatMetricsCollector } from '../telemetry/CombatMetrics';

export interface CombatRuntimeSnapshot {
  now: number;
  combatants: CombatantState[];
  effects: EffectEngineSnapshot;
  abilities: AbilityEngineSnapshot;
  projectiles: ProjectileSystemSnapshot;
  zones: { zones: CombatZoneSnapshot[]; serial: number };
  random: RandomSnapshot;
}

export interface RuntimeUpdateResult {
  damage: DamageResult[];
  healing: HealResult[];
  events: CombatEvent[];
  projectileCollisions: number;
}

export class CombatRuntime {
  public readonly events = new CombatEventStream();
  public readonly abilities = new AbilityRegistry();
  public readonly effects = new EffectRegistry();
  public readonly damage = new DamagePipeline();
  public readonly combo: ComboEngine;
  public readonly abilityEngine: AbilityEngine;
  public readonly effectEngine: EffectEngine;
  public readonly projectiles: ProjectileSystem;
  public readonly zones: CombatZoneSystem;
  public readonly reactions = new ElementalReactionEngine();
  public readonly metrics: CombatMetricsCollector;
  private readonly combatants = new Map<CombatantId, Combatant>();
  private readonly random: DeterministicRandom;
  private now = 0;

  public constructor(seed: string | number = 'combat-runtime') {
    this.random = new DeterministicRandom(seed);
    this.abilities.registerMany(createAbilityCatalog());
    this.effects.registerMany(createCombatEffectCatalog());
    this.combo = new ComboEngine(this.events);
    for (const move of createComboCatalog()) this.combo.register(move);
    this.abilityEngine = new AbilityEngine(this.abilities, this.events, this.random.fork('abilities'), this.combatants);
    this.effectEngine = new EffectEngine(this.effects, this.events, this.random.fork('effects'), this.combatants);
    this.projectiles = new ProjectileSystem(this.events, this.combatants);
    this.zones = new CombatZoneSystem(this.combatants, this.events);
    this.metrics = new CombatMetricsCollector(this.events);
    this.events.emit('combat-started', 0, { seed: String(seed) });
  }

  public addCombatant(options: CombatantOptions): Combatant {
    if (this.combatants.has(options.id)) throw new Error('combatant already exists: ' + options.id);
    const combatant = new Combatant(options);
    this.combatants.set(combatant.id, combatant);
    this.events.emit('combatant-added', this.now, { snapshot: combatant.snapshot() }, combatant.id);
    return combatant;
  }

  public removeCombatant(id: CombatantId): boolean {
    const combatant = this.combatants.get(id);
    if (!combatant) return false;
    this.abilityEngine.interruptCombatant(id, this.now, 'combatant-removed');
    this.effectEngine.removeForCombatant(id, this.now);
    this.projectiles.removeBySource(id, this.now);
    this.zones.removeBySource(id, this.now);
    this.combatants.delete(id);
    this.events.emit('combatant-removed', this.now, { snapshot: combatant.snapshot() }, id);
    return true;
  }

  public getCombatant(id: CombatantId): Combatant | undefined { return this.combatants.get(id); }
  public listCombatants(): Combatant[] { return [...this.combatants.values()]; }

  public cast(request: CastRequest): CastRequestResult {
    this.events.emit('cast-requested', this.now, { request }, request.casterId, request.targetId);
    return this.abilityEngine.request(request, this.now);
  }

  public applyEffect(application: EffectApplication): void { this.effectEngine.apply(application, this.now); }

  public createZone(definition: CombatZoneDefinition): CombatZoneSnapshot { return this.zones.create(definition, this.now); }

  public triggerReaction(sourceId: CombatantId, targetId: CombatantId, triggeringTags: readonly string[]): ReactionResult | undefined {
    const result = this.reactions.resolve(sourceId, targetId, this.effectEngine.list(), triggeringTags);
    if (!result) return undefined;
    for (const instanceId of result.consumedInstances) this.effectEngine.expire(instanceId, this.now, 'elemental-reaction');
    this.resolveImpact(result.impact);
    return result;
  }

  public applyDamage(packet: DamagePacket): DamageResult | undefined {
    const source = this.combatants.get(packet.sourceId);
    const target = this.combatants.get(packet.targetId);
    if (!source || !target) return undefined;
    this.events.emit('damage-requested', this.now, { packet }, packet.sourceId, packet.targetId);
    const result = this.damage.resolve(packet, source, target, this.random.fork('damage:' + this.events.lastEventId));
    this.events.emit(result.applied > 0 ? 'damage-applied' : 'damage-blocked', this.now, { packet, result }, packet.sourceId, packet.targetId);
    if (result.critical) this.events.emit('critical-hit', this.now, { packet, result }, packet.sourceId, packet.targetId);
    if (result.absorbed > 0) this.events.emit('shield-absorbed', this.now, { amount: result.absorbed }, packet.sourceId, packet.targetId);
    if (result.defeated) this.events.emit('combatant-defeated', this.now, { by: packet.sourceId, abilityId: packet.abilityId }, packet.sourceId, packet.targetId);
    if (result.applied > 0) {
      this.combo.registerHit(packet.sourceId, this.now, result.applied, packet.tags[0]);
      source.gain('ultimate', Math.min(10, result.applied * 0.08));
    }
    return result;
  }

  public previewDamage(packet: DamagePacket): DamageResult | undefined {
    const source = this.combatants.get(packet.sourceId);
    const target = this.combatants.get(packet.targetId);
    if (!source || !target) return undefined;
    const sourceState = source.capture();
    const targetState = target.capture();
    const result = this.damage.resolve(packet, source, target, this.random.fork('preview:' + packet.sourceId + ':' + packet.targetId + ':' + packet.baseAmount + ':' + packet.hitIndex + ':' + (packet.abilityId ?? 'basic')));
    source.restore(sourceState);
    target.restore(targetState);
    return result;
  }

  public inputCombo(combatantId: CombatantId, input: ComboInput): void { this.combo.input(combatantId, input, this.now); }
  public comboState(combatantId: CombatantId): ComboState { return this.combo.get(combatantId); }

  public update(deltaMilliseconds: number, obstacleTest?: (from: Vec2, to: Vec2) => Vec2 | undefined): RuntimeUpdateResult {
    const previousEvent = this.events.lastEventId;
    const delta = Math.max(0, Math.min(250, deltaMilliseconds));
    this.now += delta;
    const damage: DamageResult[] = [];
    const healing: HealResult[] = [];
    for (const impact of this.abilityEngine.update(this.now)) this.resolveImpact(impact, damage, healing);
    for (const impact of this.effectEngine.update(this.now)) this.resolveImpact(impact, damage, healing);
    for (const impact of this.zones.update(this.now)) this.resolveImpact(impact, damage, healing);
    const projectileUpdate = this.projectiles.update(this.now, delta, obstacleTest);
    for (const collision of projectileUpdate.collisions) {
      const ability = this.abilities.get(collision.projectile.abilityId).definition;
      const result = this.applyDamage({
        sourceId: collision.projectile.sourceId,
        targetId: collision.targetId,
        abilityId: ability.id,
        damageType: ability.damageType,
        baseAmount: ability.baseDamage,
        powerRatio: ability.powerRatio,
        canCrit: true,
        canBlock: true,
        ignoresArmor: 0,
        ignoresResistance: 0,
        tags: [...ability.tags, 'projectile-hit'],
        hitIndex: collision.projectile.hitTargets.length - 1,
      });
      if (result) damage.push(result);
    }
    this.combo.update(this.now);
    return { damage, healing, events: this.events.eventsSince(previousEvent), projectileCollisions: projectileUpdate.collisions.length };
  }

  public resolveImpact(impact: AbilityImpact, damageResults: DamageResult[] = [], healResults: HealResult[] = []): void {
    for (const packet of impact.damage) { const result = this.applyDamage(packet); if (result) damageResults.push(result); }
    for (const packet of impact.healing) {
      const source = this.combatants.get(packet.sourceId);
      const target = this.combatants.get(packet.targetId);
      if (!source || !target) continue;
      const result = this.damage.heal(packet, source, target, this.random.fork('heal:' + this.events.lastEventId));
      healResults.push(result);
      this.events.emit('healing-applied', this.now, { packet, result }, packet.sourceId, packet.targetId);
    }
    for (const effect of impact.effects) this.effectEngine.apply(effect, this.now);
    for (const projectile of impact.projectiles) this.projectiles.spawn(this.correctProjectileTeams(projectile), this.now);
    for (const displacement of impact.displacement) {
      const target = this.combatants.get(displacement.targetId);
      if (!target) continue;
      const factor = displacement.kind === 'pull' ? -1 : 1;
      target.translate({ x: displacement.direction.x * displacement.distance * factor, y: displacement.direction.y * displacement.distance * factor });
    }
    for (const change of impact.resourceChanges) this.applyResourceChange(change);
  }

  public capture(): CombatRuntimeSnapshot {
    return { now: this.now, combatants: this.listCombatants().map((entry) => entry.capture()), effects: this.effectEngine.capture(), abilities: this.abilityEngine.capture(), projectiles: this.projectiles.capture(), zones: this.zones.capture(), random: this.random.capture() };
  }

  public restore(snapshot: CombatRuntimeSnapshot): void {
    this.now = snapshot.now;
    for (const state of snapshot.combatants) {
      const combatant = this.combatants.get(state.snapshot.id);
      if (combatant) combatant.restore(state);
      else {
        const created = this.addCombatant({ id: state.snapshot.id, name: state.snapshot.name, classId: state.snapshot.classId, team: state.snapshot.team });
        created.restore(state);
      }
    }
    for (const id of [...this.combatants.keys()]) if (!snapshot.combatants.some((state) => state.snapshot.id === id)) this.combatants.delete(id);
    this.effectEngine.restore(snapshot.effects);
    this.abilityEngine.restore(snapshot.abilities);
    this.projectiles.restore(snapshot.projectiles);
    this.zones.restore(snapshot.zones);
    this.random.restore(snapshot.random);
  }

  public time(): number { return this.now; }
  public dispose(): void { this.events.emit('combat-ended', this.now, { combatants: this.combatants.size }); this.metrics.dispose(); this.events.clearListeners(); }

  private applyResourceChange(change: ResourceChange): void {
    const target = this.combatants.get(change.targetId);
    if (!target) return;
    const applied = change.amount >= 0 ? target.gain(change.resource, change.amount) : -target.lose(change.resource, -change.amount);
    this.events.emit(applied >= 0 ? 'resource-gained' : 'resource-spent', this.now, { ...change, applied }, change.targetId);
  }

  private correctProjectileTeams(request: ProjectileSpawnRequest): ProjectileSpawnRequest {
    const source = this.combatants.get(request.sourceId)?.snapshot();
    if (!source) return request;
    return { ...request, definition: { ...request.definition, collisionTeams: source.team === 'player' ? ['enemy'] : ['player'] } };
  }
}
`);

emit('integration/GameCombatBridge.ts', String.raw`
import type { PlayerClassDefinition } from '../../data/ClassDatabase';
import { CombatRuntime } from '../runtime/CombatRuntime';
import { CombatClass, DamageType } from '../core/types';

export interface GameCombatBridgeOptions {
  classDefinition: PlayerClassDefinition;
  seed?: string | number;
}

export class GameCombatBridge {
  public readonly runtime: CombatRuntime;
  private readonly playerId = 'game-player';
  private readonly targetId = 'game-target-proxy';
  private readonly enemyId = 'game-enemy-proxy';
  private hitSequence = 0;

  public constructor(options: GameCombatBridgeOptions) {
    const definition = options.classDefinition;
    this.runtime = new CombatRuntime(options.seed ?? 'game-combat');
    this.runtime.addCombatant({
      id: this.playerId,
      name: definition.name,
      classId: definition.id as CombatClass,
      team: 'player',
      stats: {
        maximumHealth: definition.maxHp * 100,
        maximumMana: definition.maxMagic,
        attackPower: definition.baseDamage,
        spellPower: definition.baseDamage,
        movementSpeed: definition.speed,
        armor: definition.id === 'knight' ? 24 : 8,
        resistance: definition.id === 'mage' ? 22 : 10,
        criticalChance: definition.id === 'rogue' ? 0.18 : definition.id === 'ranger' ? 0.12 : 0.08,
        criticalMultiplier: definition.id === 'rogue' ? 1.8 : 1.55,
      },
    });
    this.runtime.addCombatant({ id: this.targetId, name: 'Target Proxy', classId: 'enemy', team: 'enemy', stats: { maximumHealth: 100000, armor: 0, resistance: 0, dodgeChance: 0, blockChance: 0 } });
    this.runtime.addCombatant({ id: this.enemyId, name: 'Enemy Proxy', classId: 'enemy', team: 'enemy', stats: { maximumHealth: 100000, attackPower: 20, spellPower: 20 } });
  }

  public synchronizePlayer(health: number, maximumHealth: number, mana: number, maximumMana: number): void {
    const player = this.runtime.getCombatant(this.playerId);
    if (!player) return;
    player.stats.setBase('maximumHealth', maximumHealth * 100);
    player.stats.setBase('maximumMana', maximumMana);
    player.resources.setMaximum('health', maximumHealth * 100);
    player.resources.setMaximum('mana', maximumMana);
    player.resources.set('health', health * 100);
    player.resources.set('mana', mana);
  }

  public calculatePlayerDamage(baseAmount: number, type: DamageType, comboMultiplier = 1): number {
    const result = this.runtime.previewDamage({
      sourceId: this.playerId,
      targetId: this.targetId,
      damageType: type,
      baseAmount: baseAmount * comboMultiplier,
      powerRatio: 0,
      canCrit: true,
      canBlock: false,
      ignoresArmor: 0,
      ignoresResistance: 0,
      tags: ['game-hit', type],
      hitIndex: ++this.hitSequence,
    });
    return Math.max(0, result?.applied ?? baseAmount * comboMultiplier);
  }

  public calculateIncomingDamage(baseAmount: number, type: DamageType = 'physical'): number {
    const result = this.runtime.previewDamage({
      sourceId: this.enemyId,
      targetId: this.playerId,
      damageType: type,
      baseAmount,
      powerRatio: 0,
      canCrit: false,
      canBlock: true,
      ignoresArmor: 0,
      ignoresResistance: 0,
      tags: ['enemy-hit'],
      hitIndex: ++this.hitSequence,
    });
    return Math.max(0, result?.applied ?? baseAmount);
  }

  public advance(deltaMilliseconds: number): void { this.runtime.update(deltaMilliseconds); }
  public abilitiesForPlayer(): string[] { return this.runtime.abilities.forClass(this.runtime.getCombatant(this.playerId)?.snapshot().classId ?? 'knight').map((ability) => ability.definition.id); }
  public dispose(): void { this.runtime.dispose(); }
}
`);

emit('zones/CombatZoneSystem.ts', String.raw`
import { Combatant } from '../core/Combatant';
import { AbilityImpact, CombatantId, DamageType, EffectId, Vec2, createEmptyImpact, distance } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';

export type ZoneShape = 'circle' | 'ring' | 'rectangle' | 'line';

export interface CombatZoneDefinition {
  id: string;
  sourceId: CombatantId;
  abilityId: string;
  position: Vec2;
  direction: Vec2;
  shape: ZoneShape;
  radius: number;
  innerRadius: number;
  width: number;
  length: number;
  duration: number;
  tickInterval: number;
  damageType?: DamageType;
  damagePerTick: number;
  powerRatio: number;
  effectId?: EffectId;
  effectDuration: number;
  affectsTeams: Array<'player' | 'enemy' | 'neutral'>;
  maximumTargets: number;
  hitOnce: boolean;
  tags: string[];
}

export interface CombatZoneSnapshot extends CombatZoneDefinition {
  instanceId: string;
  createdAt: number;
  expiresAt: number;
  nextTickAt: number;
  hitTargets: CombatantId[];
  ticks: number;
}

export class CombatZoneSystem {
  private readonly zones = new Map<string, CombatZoneSnapshot>();
  private serial = 0;

  public constructor(private readonly combatants: Map<CombatantId, Combatant>, private readonly events: CombatEventStream) {}

  public create(definition: CombatZoneDefinition, now: number): CombatZoneSnapshot {
    if (definition.duration <= 0) throw new RangeError('zone duration must be positive');
    if (definition.tickInterval <= 0) throw new RangeError('zone tick interval must be positive');
    const zone: CombatZoneSnapshot = {
      ...definition,
      position: { ...definition.position },
      direction: this.normalize(definition.direction),
      affectsTeams: [...definition.affectsTeams],
      tags: [...definition.tags],
      instanceId: 'combat-zone-' + ++this.serial,
      createdAt: now,
      expiresAt: now + definition.duration,
      nextTickAt: now,
      hitTargets: [],
      ticks: 0,
    };
    this.zones.set(zone.instanceId, zone);
    return this.clone(zone);
  }

  public update(now: number): AbilityImpact[] {
    const impacts: AbilityImpact[] = [];
    for (const zone of [...this.zones.values()]) {
      while (zone.nextTickAt <= now && zone.nextTickAt < zone.expiresAt) {
        impacts.push(this.tick(zone, zone.nextTickAt));
        zone.ticks++;
        zone.nextTickAt += zone.tickInterval;
      }
      if (now >= zone.expiresAt) this.remove(zone.instanceId, now, 'duration');
    }
    return impacts;
  }

  public remove(instanceId: string, now: number, reason = 'manual'): boolean {
    const zone = this.zones.get(instanceId);
    if (!zone) return false;
    this.zones.delete(instanceId);
    this.events.emit('effect-expired', now, { zoneId: instanceId, abilityId: zone.abilityId, reason }, zone.sourceId);
    return true;
  }

  public removeBySource(sourceId: CombatantId, now: number): number {
    let removed = 0;
    for (const zone of this.list()) if (zone.sourceId === sourceId && this.remove(zone.instanceId, now, 'source-removed')) removed++;
    return removed;
  }

  public list(): CombatZoneSnapshot[] { return [...this.zones.values()].map((zone) => this.clone(zone)); }
  public at(point: Vec2): CombatZoneSnapshot[] { return this.list().filter((zone) => this.contains(zone, point)); }
  public capture(): { zones: CombatZoneSnapshot[]; serial: number } { return { zones: this.list(), serial: this.serial }; }

  public restore(snapshot: { zones: CombatZoneSnapshot[]; serial: number }): void {
    this.zones.clear();
    for (const zone of snapshot.zones) this.zones.set(zone.instanceId, this.clone(zone));
    this.serial = snapshot.serial;
  }

  private tick(zone: CombatZoneSnapshot, now: number): AbilityImpact {
    const impact = createEmptyImpact();
    const targets = [...this.combatants.values()].map((entry) => entry.snapshot())
      .filter((target) => target.alive && target.id !== zone.sourceId)
      .filter((target) => zone.affectsTeams.includes(target.team))
      .filter((target) => this.contains(zone, target.position))
      .filter((target) => !zone.hitOnce || !zone.hitTargets.includes(target.id))
      .sort((left, right) => distance(zone.position, left.position) - distance(zone.position, right.position))
      .slice(0, zone.maximumTargets);
    targets.forEach((target, index) => {
      if (zone.damageType && zone.damagePerTick > 0) {
        impact.damage.push({ sourceId: zone.sourceId, targetId: target.id, abilityId: zone.abilityId, damageType: zone.damageType, baseAmount: zone.damagePerTick, powerRatio: zone.powerRatio, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0, tags: [...zone.tags, 'zone-tick'], hitIndex: zone.ticks * zone.maximumTargets + index });
      }
      if (zone.effectId) impact.effects.push({ effectId: zone.effectId, sourceId: zone.sourceId, targetId: target.id, duration: zone.effectDuration, abilityId: zone.abilityId });
      if (!zone.hitTargets.includes(target.id)) zone.hitTargets.push(target.id);
    });
    this.events.emit('effect-ticked', now, { zoneId: zone.instanceId, tick: zone.ticks, targets: targets.map((entry) => entry.id) }, zone.sourceId);
    return impact;
  }

  private contains(zone: CombatZoneSnapshot, point: Vec2): boolean {
    const dx = point.x - zone.position.x;
    const dy = point.y - zone.position.y;
    if (zone.shape === 'circle') return dx * dx + dy * dy <= zone.radius * zone.radius;
    if (zone.shape === 'ring') { const value = Math.hypot(dx, dy); return value >= zone.innerRadius && value <= zone.radius; }
    const forward = dx * zone.direction.x + dy * zone.direction.y;
    const side = Math.abs(dx * zone.direction.y - dy * zone.direction.x);
    if (zone.shape === 'line') return forward >= 0 && forward <= zone.length && side <= zone.width / 2;
    return Math.abs(forward) <= zone.length / 2 && side <= zone.width / 2;
  }

  private normalize(vector: Vec2): Vec2 { const length = Math.hypot(vector.x, vector.y); return length <= 0 ? { x: 1, y: 0 } : { x: vector.x / length, y: vector.y / length }; }
  private clone(zone: CombatZoneSnapshot): CombatZoneSnapshot { return { ...zone, position: { ...zone.position }, direction: { ...zone.direction }, affectsTeams: [...zone.affectsTeams], tags: [...zone.tags], hitTargets: [...zone.hitTargets] }; }
}
`);

emit('reactions/ElementalReactionEngine.ts', String.raw`
import { AbilityImpact, ActiveEffectSnapshot, CombatantId, DamageType, createEmptyImpact } from '../core/types';

export interface ElementalReaction {
  id: string;
  name: string;
  requiredTags: string[];
  consumedTags: string[];
  damageType: DamageType;
  baseDamage: number;
  powerRatio: number;
  bonusPerStack: number;
  effectId?: string;
  effectDuration?: number;
  resourceReward: number;
  priority: number;
}

export interface ReactionResult {
  reaction: ElementalReaction;
  sourceId: CombatantId;
  targetId: CombatantId;
  consumedInstances: string[];
  impact: AbilityImpact;
}

export class ElementalReactionEngine {
  private readonly reactions = new Map<string, ElementalReaction>();

  public constructor(registerDefaults = true) {
    if (registerDefaults) this.registerDefaults();
  }

  public register(reaction: ElementalReaction): void {
    if (this.reactions.has(reaction.id)) throw new Error('reaction already registered: ' + reaction.id);
    if (reaction.requiredTags.length < 2) throw new Error('reaction requires at least two elemental tags');
    this.reactions.set(reaction.id, { ...reaction, requiredTags: [...reaction.requiredTags], consumedTags: [...reaction.consumedTags] });
  }

  public resolve(sourceId: CombatantId, targetId: CombatantId, activeEffects: readonly ActiveEffectSnapshot[], triggeringTags: readonly string[]): ReactionResult | undefined {
    const targetEffects = activeEffects.filter((effect) => effect.targetId === targetId);
    const availableTags = new Set([...triggeringTags, ...targetEffects.flatMap((effect) => effect.tags)]);
    const reaction = [...this.reactions.values()]
      .filter((candidate) => candidate.requiredTags.every((tag) => availableTags.has(tag)))
      .sort((left, right) => right.priority - left.priority || right.baseDamage - left.baseDamage)[0];
    if (!reaction) return undefined;
    const consumed = targetEffects.filter((effect) => effect.tags.some((tag) => reaction.consumedTags.includes(tag)));
    const stacks = consumed.reduce((sum, effect) => sum + effect.stacks, 0);
    const impact = createEmptyImpact();
    impact.damage.push({
      sourceId,
      targetId,
      abilityId: 'reaction-' + reaction.id,
      damageType: reaction.damageType,
      baseAmount: reaction.baseDamage + stacks * reaction.bonusPerStack,
      powerRatio: reaction.powerRatio,
      canCrit: false,
      canBlock: false,
      ignoresArmor: 0.25,
      ignoresResistance: 0.25,
      tags: ['elemental-reaction', reaction.id, ...reaction.requiredTags],
      hitIndex: 0,
    });
    if (reaction.effectId) impact.effects.push({ effectId: reaction.effectId, sourceId, targetId, duration: reaction.effectDuration, intensity: 1 + stacks * 0.1, abilityId: 'reaction-' + reaction.id });
    impact.resourceChanges.push({ targetId: sourceId, resource: 'ultimate', amount: reaction.resourceReward, reason: 'elemental-reaction-' + reaction.id });
    return { reaction: { ...reaction, requiredTags: [...reaction.requiredTags], consumedTags: [...reaction.consumedTags] }, sourceId, targetId, consumedInstances: consumed.map((effect) => effect.instanceId), impact };
  }

  public list(): ElementalReaction[] { return [...this.reactions.values()].map((reaction) => ({ ...reaction, requiredTags: [...reaction.requiredTags], consumedTags: [...reaction.consumedTags] })); }

  private registerDefaults(): void {
    const defaults: ElementalReaction[] = [
      { id: 'melt', name: 'Melt', requiredTags: ['fire', 'frost'], consumedTags: ['fire', 'frost'], damageType: 'true', baseDamage: 35, powerRatio: 0.45, bonusPerStack: 8, effectId: 'fire-exposure', effectDuration: 2200, resourceReward: 8, priority: 80 },
      { id: 'overload', name: 'Overload', requiredTags: ['fire', 'lightning'], consumedTags: ['fire', 'lightning'], damageType: 'fire', baseDamage: 42, powerRatio: 0.5, bonusPerStack: 6, effectId: 'lightning-weakness', effectDuration: 1800, resourceReward: 10, priority: 75 },
      { id: 'superconduct', name: 'Superconduct', requiredTags: ['frost', 'lightning'], consumedTags: ['frost'], damageType: 'lightning', baseDamage: 24, powerRatio: 0.32, bonusPerStack: 5, effectId: 'physical-exposure', effectDuration: 3500, resourceReward: 7, priority: 65 },
      { id: 'purge', name: 'Radiant Purge', requiredTags: ['holy', 'shadow'], consumedTags: ['shadow'], damageType: 'holy', baseDamage: 50, powerRatio: 0.6, bonusPerStack: 10, effectId: 'holy-surge', effectDuration: 2000, resourceReward: 12, priority: 90 },
      { id: 'decay', name: 'Arcane Decay', requiredTags: ['arcane', 'poison'], consumedTags: ['poison'], damageType: 'poison', baseDamage: 30, powerRatio: 0.4, bonusPerStack: 7, effectId: 'arcane-weakness', effectDuration: 3200, resourceReward: 9, priority: 70 },
      { id: 'hemorrhage', name: 'Hemorrhage', requiredTags: ['physical', 'poison'], consumedTags: ['physical'], damageType: 'physical', baseDamage: 38, powerRatio: 0.55, bonusPerStack: 9, effectId: 'physical-wound', effectDuration: 2600, resourceReward: 8, priority: 72 },
      { id: 'eclipse', name: 'Eclipse', requiredTags: ['arcane', 'shadow'], consumedTags: ['arcane', 'shadow'], damageType: 'shadow', baseDamage: 46, powerRatio: 0.58, bonusPerStack: 8, effectId: 'shadow-prison', effectDuration: 1400, resourceReward: 11, priority: 85 },
      { id: 'consecration', name: 'Consecration', requiredTags: ['holy', 'fire'], consumedTags: ['fire'], damageType: 'holy', baseDamage: 32, powerRatio: 0.42, bonusPerStack: 6, effectId: 'holy-aura', effectDuration: 4000, resourceReward: 9, priority: 68 },
    ];
    for (const reaction of defaults) this.register(reaction);
  }
}
`);

emit('ai/ThreatTable.ts', String.raw`
import { CombatantId } from '../core/types';

export interface ThreatEntry {
  combatantId: CombatantId;
  threat: number;
  lastChangedAt: number;
  tauntedUntil: number;
  modifiers: Record<string, number>;
}

export class ThreatTable {
  private readonly entries = new Map<CombatantId, ThreatEntry>();
  private forcedTarget?: CombatantId;
  private forcedUntil = 0;

  public add(combatantId: CombatantId, amount: number, now: number, source = 'generic'): number {
    const entry = this.getOrCreate(combatantId, now);
    const multiplier = Object.values(entry.modifiers).reduce((value, modifier) => value * modifier, 1);
    const applied = Math.max(0, amount) * multiplier;
    entry.threat += applied;
    entry.lastChangedAt = now;
    entry.modifiers[source] ??= 1;
    return applied;
  }

  public subtract(combatantId: CombatantId, amount: number, now: number): number {
    const entry = this.getOrCreate(combatantId, now);
    const removed = Math.min(entry.threat, Math.max(0, amount));
    entry.threat -= removed;
    entry.lastChangedAt = now;
    return removed;
  }

  public multiply(combatantId: CombatantId, multiplier: number, now: number): void {
    const entry = this.getOrCreate(combatantId, now);
    entry.threat = Math.max(0, entry.threat * Math.max(0, multiplier));
    entry.lastChangedAt = now;
  }

  public setModifier(combatantId: CombatantId, id: string, multiplier: number, now: number): void {
    const entry = this.getOrCreate(combatantId, now);
    entry.modifiers[id] = Math.max(0, multiplier);
  }

  public removeModifier(combatantId: CombatantId, id: string): boolean {
    return delete this.entries.get(combatantId)?.modifiers[id];
  }

  public taunt(combatantId: CombatantId, now: number, duration: number, bonus = 1): void {
    const entry = this.getOrCreate(combatantId, now);
    const maximum = Math.max(0, ...this.list().map((candidate) => candidate.threat));
    entry.threat = Math.max(entry.threat, maximum + bonus);
    entry.tauntedUntil = now + Math.max(0, duration);
    this.forcedTarget = combatantId;
    this.forcedUntil = entry.tauntedUntil;
  }

  public target(now: number, eligible?: (combatantId: CombatantId) => boolean): CombatantId | undefined {
    if (this.forcedTarget && now < this.forcedUntil && (!eligible || eligible(this.forcedTarget))) return this.forcedTarget;
    this.forcedTarget = undefined;
    return this.list().filter((entry) => !eligible || eligible(entry.combatantId))
      .sort((left, right) => right.threat - left.threat || right.lastChangedAt - left.lastChangedAt || left.combatantId.localeCompare(right.combatantId))[0]?.combatantId;
  }

  public decay(now: number, elapsedMilliseconds: number, percentagePerSecond: number, flatPerSecond = 0): void {
    const seconds = Math.max(0, elapsedMilliseconds) / 1000;
    const multiplier = Math.pow(Math.max(0, 1 - percentagePerSecond), seconds);
    for (const entry of this.entries.values()) {
      entry.threat = Math.max(0, entry.threat * multiplier - flatPerSecond * seconds);
      if (entry.threat === 0 && now - entry.lastChangedAt > 10000) this.entries.delete(entry.combatantId);
    }
  }

  public transfer(from: CombatantId, to: CombatantId, ratio: number, now: number): number {
    const source = this.getOrCreate(from, now);
    const amount = source.threat * Math.max(0, Math.min(1, ratio));
    source.threat -= amount;
    this.add(to, amount, now, 'transfer');
    return amount;
  }

  public remove(combatantId: CombatantId): boolean { if (this.forcedTarget === combatantId) this.forcedTarget = undefined; return this.entries.delete(combatantId); }
  public clear(): void { this.entries.clear(); this.forcedTarget = undefined; this.forcedUntil = 0; }
  public get(combatantId: CombatantId): ThreatEntry | undefined { const entry = this.entries.get(combatantId); return entry ? this.clone(entry) : undefined; }
  public list(): ThreatEntry[] { return [...this.entries.values()].map((entry) => this.clone(entry)); }
  public restore(entries: readonly ThreatEntry[]): void { this.entries.clear(); for (const entry of entries) this.entries.set(entry.combatantId, this.clone(entry)); }

  private getOrCreate(combatantId: CombatantId, now: number): ThreatEntry {
    const entry = this.entries.get(combatantId) ?? { combatantId, threat: 0, lastChangedAt: now, tauntedUntil: 0, modifiers: {} };
    this.entries.set(combatantId, entry);
    return entry;
  }

  private clone(entry: ThreatEntry): ThreatEntry { return { ...entry, modifiers: { ...entry.modifiers } }; }
}
`);

emit('telemetry/CombatMetrics.ts', String.raw`
import { CombatEvent, CombatEventKind, CombatantId, DamageResult, HealResult } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';

export interface CombatantMetrics {
  combatantId: CombatantId;
  damageDealt: number;
  damageTaken: number;
  healingDone: number;
  healingReceived: number;
  effectiveHealing: number;
  overhealing: number;
  criticalHits: number;
  blockedHits: number;
  dodgedHits: number;
  absorbedDamage: number;
  castsStarted: number;
  castsCompleted: number;
  castsInterrupted: number;
  effectsApplied: number;
  targetsDefeated: number;
  deaths: number;
  comboPeak: number;
  comboScorePeak: number;
}

export interface CombatMetricsSnapshot {
  startedAt: number;
  endedAt?: number;
  eventCount: number;
  byCombatant: CombatantMetrics[];
  byAbility: Array<{ abilityId: string; casts: number; hits: number; damage: number; healing: number }>;
  byDamageType: Array<{ damageType: string; amount: number; hits: number }>;
}

export class CombatMetricsCollector {
  private readonly combatants = new Map<CombatantId, CombatantMetrics>();
  private readonly abilities = new Map<string, { abilityId: string; casts: number; hits: number; damage: number; healing: number }>();
  private readonly damageTypes = new Map<string, { damageType: string; amount: number; hits: number }>();
  private readonly unsubscribe: () => void;
  private eventCount = 0;
  private endedAt?: number;

  public constructor(events: CombatEventStream, private readonly startedAt = 0) {
    this.unsubscribe = events.on('*', (event) => this.consume(event));
  }

  public consume(event: CombatEvent): void {
    this.eventCount++;
    if (event.kind === 'combat-ended') this.endedAt = event.time;
    if (event.sourceId) this.ensure(event.sourceId);
    if (event.targetId) this.ensure(event.targetId);
    switch (event.kind) {
      case 'damage-applied': this.consumeDamage(event); break;
      case 'healing-applied': this.consumeHealing(event); break;
      case 'cast-started': if (event.sourceId) this.ensure(event.sourceId).castsStarted++; this.abilityFromEvent(event).casts++; break;
      case 'cast-completed': if (event.sourceId) this.ensure(event.sourceId).castsCompleted++; break;
      case 'cast-interrupted': if (event.sourceId) this.ensure(event.sourceId).castsInterrupted++; break;
      case 'effect-applied': if (event.sourceId) this.ensure(event.sourceId).effectsApplied++; break;
      case 'combatant-defeated': if (event.sourceId) this.ensure(event.sourceId).targetsDefeated++; if (event.targetId) this.ensure(event.targetId).deaths++; break;
      case 'combo-advanced': this.consumeCombo(event); break;
    }
  }

  public snapshot(): CombatMetricsSnapshot {
    return {
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      eventCount: this.eventCount,
      byCombatant: [...this.combatants.values()].map((entry) => ({ ...entry })),
      byAbility: [...this.abilities.values()].map((entry) => ({ ...entry })),
      byDamageType: [...this.damageTypes.values()].map((entry) => ({ ...entry })),
    };
  }

  public reset(): void { this.combatants.clear(); this.abilities.clear(); this.damageTypes.clear(); this.eventCount = 0; this.endedAt = undefined; }
  public dispose(): void { this.unsubscribe(); }

  private consumeDamage(event: CombatEvent): void {
    const payload = event.payload as { packet?: { abilityId?: string; damageType?: string }; result?: DamageResult };
    const result = payload.result;
    if (!result) return;
    if (event.sourceId) { const source = this.ensure(event.sourceId); source.damageDealt += result.applied; source.criticalHits += result.critical ? 1 : 0; }
    if (event.targetId) { const target = this.ensure(event.targetId); target.damageTaken += result.applied; target.blockedHits += result.blocked ? 1 : 0; target.dodgedHits += result.dodged ? 1 : 0; target.absorbedDamage += result.absorbed; }
    const ability = this.ability(payload.packet?.abilityId ?? 'basic-attack');
    ability.hits++;
    ability.damage += result.applied;
    const type = payload.packet?.damageType ?? 'unknown';
    const damageType = this.damageTypes.get(type) ?? { damageType: type, amount: 0, hits: 0 };
    damageType.amount += result.applied;
    damageType.hits++;
    this.damageTypes.set(type, damageType);
  }

  private consumeHealing(event: CombatEvent): void {
    const payload = event.payload as { packet?: { abilityId?: string }; result?: HealResult };
    const result = payload.result;
    if (!result) return;
    if (event.sourceId) { const source = this.ensure(event.sourceId); source.healingDone += result.requested; source.effectiveHealing += result.applied; source.overhealing += result.overheal; }
    if (event.targetId) this.ensure(event.targetId).healingReceived += result.applied;
    this.ability(payload.packet?.abilityId ?? 'basic-heal').healing += result.applied;
  }

  private consumeCombo(event: CombatEvent): void {
    if (!event.sourceId) return;
    const payload = event.payload as { hitCount?: number; score?: number };
    const metrics = this.ensure(event.sourceId);
    metrics.comboPeak = Math.max(metrics.comboPeak, payload.hitCount ?? 0);
    metrics.comboScorePeak = Math.max(metrics.comboScorePeak, payload.score ?? 0);
  }

  private abilityFromEvent(event: CombatEvent): { abilityId: string; casts: number; hits: number; damage: number; healing: number } {
    const payload = event.payload as { cast?: { definition?: { id?: string } }; abilityId?: string };
    return this.ability(payload.cast?.definition?.id ?? payload.abilityId ?? 'unknown');
  }

  private ability(id: string): { abilityId: string; casts: number; hits: number; damage: number; healing: number } {
    const entry = this.abilities.get(id) ?? { abilityId: id, casts: 0, hits: 0, damage: 0, healing: 0 };
    this.abilities.set(id, entry);
    return entry;
  }

  private ensure(id: CombatantId): CombatantMetrics {
    const current = this.combatants.get(id) ?? { combatantId: id, damageDealt: 0, damageTaken: 0, healingDone: 0, healingReceived: 0, effectiveHealing: 0, overhealing: 0, criticalHits: 0, blockedHits: 0, dodgedHits: 0, absorbedDamage: 0, castsStarted: 0, castsCompleted: 0, castsInterrupted: 0, effectsApplied: 0, targetsDefeated: 0, deaths: 0, comboPeak: 0, comboScorePeak: 0 };
    this.combatants.set(id, current);
    return current;
  }
}
`);

emit('collision/HitboxGeometry.ts', String.raw`
import { Vec2, normalize } from '../core/types';

export interface CircleHitbox { kind: 'circle'; center: Vec2; radius: number; }
export interface RectangleHitbox { kind: 'rectangle'; center: Vec2; halfWidth: number; halfHeight: number; rotation: number; }
export interface CapsuleHitbox { kind: 'capsule'; start: Vec2; end: Vec2; radius: number; }
export interface SectorHitbox { kind: 'sector'; center: Vec2; direction: Vec2; radius: number; angle: number; }
export type Hitbox = CircleHitbox | RectangleHitbox | CapsuleHitbox | SectorHitbox;

export interface SweepResult { hit: boolean; time: number; position: Vec2; normal: Vec2; }

export class HitboxGeometry {
  public contains(hitbox: Hitbox, point: Vec2): boolean {
    if (hitbox.kind === 'circle') return this.distanceSquared(hitbox.center, point) <= hitbox.radius * hitbox.radius;
    if (hitbox.kind === 'rectangle') return this.rectangleContains(hitbox, point);
    if (hitbox.kind === 'capsule') return this.segmentDistance(point, hitbox.start, hitbox.end) <= hitbox.radius;
    return this.sectorContains(hitbox, point);
  }

  public intersects(left: Hitbox, right: Hitbox): boolean {
    if (left.kind === 'circle' && right.kind === 'circle') {
      const radius = left.radius + right.radius;
      return this.distanceSquared(left.center, right.center) <= radius * radius;
    }
    if (left.kind === 'circle') return this.circleIntersects(left, right as Exclude<Hitbox, CircleHitbox>);
    if (right.kind === 'circle') return this.circleIntersects(right, left as Exclude<Hitbox, CircleHitbox>);
    const leftPoints = this.sampleBoundary(left, 24);
    const rightPoints = this.sampleBoundary(right, 24);
    return leftPoints.some((point) => this.contains(right, point)) || rightPoints.some((point) => this.contains(left, point));
  }

  public sweepCircle(circle: CircleHitbox, velocity: Vec2, duration: number, obstacle: Hitbox, steps = 24): SweepResult {
    const count = Math.max(1, Math.floor(steps));
    let previous = { ...circle.center };
    for (let index = 1; index <= count; index++) {
      const time = duration * index / count;
      const position = { x: circle.center.x + velocity.x * time, y: circle.center.y + velocity.y * time };
      if (this.intersects({ ...circle, center: position }, obstacle)) {
        const normal = normalize({ x: previous.x - position.x, y: previous.y - position.y }, { x: -1, y: 0 });
        return { hit: true, time, position, normal };
      }
      previous = position;
    }
    return { hit: false, time: duration, position: { x: circle.center.x + velocity.x * duration, y: circle.center.y + velocity.y * duration }, normal: { x: 0, y: 0 } };
  }

  public closestPoint(hitbox: Hitbox, point: Vec2): Vec2 {
    if (hitbox.kind === 'circle') {
      const direction = normalize({ x: point.x - hitbox.center.x, y: point.y - hitbox.center.y });
      return { x: hitbox.center.x + direction.x * hitbox.radius, y: hitbox.center.y + direction.y * hitbox.radius };
    }
    if (hitbox.kind === 'capsule') {
      const segment = this.closestOnSegment(point, hitbox.start, hitbox.end);
      const direction = normalize({ x: point.x - segment.x, y: point.y - segment.y });
      return { x: segment.x + direction.x * hitbox.radius, y: segment.y + direction.y * hitbox.radius };
    }
    const samples = this.sampleBoundary(hitbox, 48);
    return samples.sort((left, right) => this.distanceSquared(left, point) - this.distanceSquared(right, point))[0] ?? { ...point };
  }

  public sampleBoundary(hitbox: Hitbox, samples: number): Vec2[] {
    const result: Vec2[] = [];
    const count = Math.max(4, Math.floor(samples));
    if (hitbox.kind === 'circle') {
      for (let index = 0; index < count; index++) {
        const angle = Math.PI * 2 * index / count;
        result.push({ x: hitbox.center.x + Math.cos(angle) * hitbox.radius, y: hitbox.center.y + Math.sin(angle) * hitbox.radius });
      }
    } else if (hitbox.kind === 'rectangle') {
      const corners = [
        { x: -hitbox.halfWidth, y: -hitbox.halfHeight }, { x: hitbox.halfWidth, y: -hitbox.halfHeight },
        { x: hitbox.halfWidth, y: hitbox.halfHeight }, { x: -hitbox.halfWidth, y: hitbox.halfHeight },
      ].map((point) => this.rotateAndTranslate(point, hitbox.center, hitbox.rotation));
      for (let edge = 0; edge < corners.length; edge++) {
        const start = corners[edge];
        const end = corners[(edge + 1) % corners.length];
        for (let index = 0; index < Math.ceil(count / 4); index++) {
          const ratio = index / Math.ceil(count / 4);
          result.push({ x: start.x + (end.x - start.x) * ratio, y: start.y + (end.y - start.y) * ratio });
        }
      }
    } else if (hitbox.kind === 'capsule') {
      const direction = normalize({ x: hitbox.end.x - hitbox.start.x, y: hitbox.end.y - hitbox.start.y });
      const normal = { x: -direction.y, y: direction.x };
      for (let index = 0; index <= count / 2; index++) {
        const ratio = index / (count / 2);
        const center = { x: hitbox.start.x + (hitbox.end.x - hitbox.start.x) * ratio, y: hitbox.start.y + (hitbox.end.y - hitbox.start.y) * ratio };
        result.push({ x: center.x + normal.x * hitbox.radius, y: center.y + normal.y * hitbox.radius });
        result.push({ x: center.x - normal.x * hitbox.radius, y: center.y - normal.y * hitbox.radius });
      }
    } else {
      const directionAngle = Math.atan2(hitbox.direction.y, hitbox.direction.x);
      const half = hitbox.angle * Math.PI / 360;
      result.push({ ...hitbox.center });
      for (let index = 0; index <= count; index++) {
        const angle = directionAngle - half + half * 2 * index / count;
        result.push({ x: hitbox.center.x + Math.cos(angle) * hitbox.radius, y: hitbox.center.y + Math.sin(angle) * hitbox.radius });
      }
    }
    return result;
  }

  private circleIntersects(circle: CircleHitbox, other: Exclude<Hitbox, CircleHitbox>): boolean {
    return this.distanceSquared(circle.center, this.closestPoint(other, circle.center)) <= circle.radius * circle.radius || this.contains(other, circle.center);
  }

  private rectangleContains(rectangle: RectangleHitbox, point: Vec2): boolean {
    const cosine = Math.cos(-rectangle.rotation);
    const sine = Math.sin(-rectangle.rotation);
    const dx = point.x - rectangle.center.x;
    const dy = point.y - rectangle.center.y;
    const local = { x: dx * cosine - dy * sine, y: dx * sine + dy * cosine };
    return Math.abs(local.x) <= rectangle.halfWidth && Math.abs(local.y) <= rectangle.halfHeight;
  }

  private sectorContains(sector: SectorHitbox, point: Vec2): boolean {
    const delta = { x: point.x - sector.center.x, y: point.y - sector.center.y };
    const length = Math.hypot(delta.x, delta.y);
    if (length > sector.radius) return false;
    if (length <= Number.EPSILON) return true;
    const direction = normalize(sector.direction);
    const dot = (delta.x / length) * direction.x + (delta.y / length) * direction.y;
    return dot >= Math.cos(sector.angle * Math.PI / 360);
  }

  private closestOnSegment(point: Vec2, start: Vec2, end: Vec2): Vec2 {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const denominator = dx * dx + dy * dy;
    if (denominator <= Number.EPSILON) return { ...start };
    const ratio = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / denominator));
    return { x: start.x + dx * ratio, y: start.y + dy * ratio };
  }

  private segmentDistance(point: Vec2, start: Vec2, end: Vec2): number {
    const closest = this.closestOnSegment(point, start, end);
    return Math.hypot(point.x - closest.x, point.y - closest.y);
  }

  private rotateAndTranslate(point: Vec2, center: Vec2, rotation: number): Vec2 {
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    return { x: center.x + point.x * cosine - point.y * sine, y: center.y + point.x * sine + point.y * cosine };
  }

  private distanceSquared(left: Vec2, right: Vec2): number { const dx = left.x - right.x; const dy = left.y - right.y; return dx * dx + dy * dy; }
}
`);

emit('ai/CombatDecisionScorer.ts', String.raw`
import { Ability, CombatantSnapshot, Vec2, distance } from '../core/types';

export interface CombatDecisionContext {
  actor: CombatantSnapshot;
  allies: CombatantSnapshot[];
  enemies: CombatantSnapshot[];
  abilities: Ability[];
  cooldownReady: (abilityId: string) => boolean;
  targetPosition?: Vec2;
}

export interface ScoredCombatDecision {
  abilityId: string;
  targetId?: string;
  targetPosition: Vec2;
  score: number;
  factors: Array<{ name: string; value: number }>;
}

export class CombatDecisionScorer {
  public score(context: CombatDecisionContext): ScoredCombatDecision[] {
    const decisions: ScoredCombatDecision[] = [];
    for (const ability of context.abilities) {
      if (!context.cooldownReady(ability.definition.id)) continue;
      if (!this.canAfford(context.actor, ability)) continue;
      const targets = this.targetsFor(ability, context);
      if (targets.length === 0 && ability.definition.targeting !== 'self' && ability.definition.targeting !== 'summon') continue;
      if (ability.definition.targeting === 'self' || ability.definition.targeting === 'summon') {
        decisions.push(this.evaluate(ability, context.actor, context.actor, context));
      } else {
        for (const target of targets) decisions.push(this.evaluate(ability, context.actor, target, context));
      }
    }
    return decisions.sort((left, right) => right.score - left.score || left.abilityId.localeCompare(right.abilityId));
  }

  public best(context: CombatDecisionContext): ScoredCombatDecision | undefined { return this.score(context)[0]; }

  private evaluate(ability: Ability, actor: CombatantSnapshot, target: CombatantSnapshot, context: CombatDecisionContext): ScoredCombatDecision {
    const definition = ability.definition;
    const factors: Array<{ name: string; value: number }> = [];
    const targetDistance = distance(actor.position, target.position);
    const rangeFit = definition.range <= 0 ? 1 : Math.max(-1, 1 - Math.abs(targetDistance - definition.range * 0.65) / definition.range);
    factors.push({ name: 'range-fit', value: rangeFit * 30 });
    const expectedDamage = definition.baseDamage + (definition.damageType === 'physical' ? actor.stats.attackPower : actor.stats.spellPower) * definition.powerRatio;
    factors.push({ name: 'expected-damage', value: Math.min(80, expectedDamage * 0.35) });
    const healthRatio = target.stats.maximumHealth <= 0 ? 0 : target.resources.health / target.stats.maximumHealth;
    factors.push({ name: 'execute-pressure', value: healthRatio < 0.25 ? 35 : (1 - healthRatio) * 10 });
    const actorHealth = actor.resources.health / Math.max(1, actor.stats.maximumHealth);
    if (definition.targeting === 'self') factors.push({ name: 'self-preservation', value: (1 - actorHealth) * 65 });
    if (definition.category === 'ultimate') factors.push({ name: 'ultimate-conservation', value: context.enemies.length >= 3 || healthRatio < 0.2 ? 25 : -30 });
    if (definition.targeting === 'circle' || definition.targeting === 'cone' || definition.targeting === 'ring') {
      const nearby = context.enemies.filter((enemy) => distance(target.position, enemy.position) <= definition.radius).length;
      factors.push({ name: 'area-targets', value: nearby * 16 });
    }
    if (target.tags.includes('vulnerable-' + definition.damageType)) factors.push({ name: 'typed-vulnerability', value: 24 });
    if (target.tags.includes('fortified')) factors.push({ name: 'fortified-target', value: -12 });
    const cost = definition.costs.reduce((sum, entry) => sum + entry.amount, 0);
    factors.push({ name: 'resource-efficiency', value: -cost * 0.35 });
    const castRisk = definition.castTime / 1000 * (actorHealth < 0.35 ? -24 : -8);
    factors.push({ name: 'cast-risk', value: castRisk });
    const score = factors.reduce((sum, factor) => sum + factor.value, 0);
    return { abilityId: definition.id, targetId: definition.targeting === 'self' ? actor.id : target.id, targetPosition: { ...target.position }, score, factors };
  }

  private targetsFor(ability: Ability, context: CombatDecisionContext): CombatantSnapshot[] {
    const definition = ability.definition;
    const candidates = definition.targeting === 'self' ? context.allies : context.enemies;
    return candidates.filter((target) => target.alive && distance(context.actor.position, target.position) <= definition.range + definition.radius)
      .sort((left, right) => distance(context.actor.position, left.position) - distance(context.actor.position, right.position));
  }

  private canAfford(actor: CombatantSnapshot, ability: Ability): boolean {
    return ability.definition.costs.every((cost) => {
      const required = cost.percentage ? actor.resources[cost.resource] * cost.amount : cost.amount;
      return actor.resources[cost.resource] >= required;
    });
  }
}
`);

emit('runtime/CombatReplayLog.ts', String.raw`
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
`);

emit('index.ts', String.raw`
export * from './core/types';
export * from './core/ResourcePool';
export * from './core/CooldownBook';
export * from './core/CombatClock';
export * from './core/TagSet';
export * from './core/StatBlock';
export * from './core/Combatant';
export * from './events/CombatEventStream';
export * from './damage/DamagePipeline';
export * from './effects/BaseEffect';
export * from './effects/EffectRegistry';
export * from './effects/EffectEngine';
export * from './effects/catalog';
export * from './targeting/TargetResolver';
export * from './abilities/BaseAbility';
export * from './abilities/AbilityRegistry';
export * from './abilities/AbilityEngine';
export * from './abilities/catalog';
export * from './projectiles/ProjectileSystem';
export * from './combo/ComboEngine';
export * from './combo/catalog';
export * from './runtime/CombatRuntime';
export * from './integration/GameCombatBridge';
export * from './zones/CombatZoneSystem';
export * from './reactions/ElementalReactionEngine';
export * from './ai/ThreatTable';
export * from './telemetry/CombatMetrics';
export * from './collision/HitboxGeometry';
export * from './ai/CombatDecisionScorer';
export * from './runtime/CombatReplayLog';
`);

for (const [name, source] of files) {
  const target = join(root, name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, source, 'utf8');
}

console.log('Generated ' + files.size + ' combat source files.');
