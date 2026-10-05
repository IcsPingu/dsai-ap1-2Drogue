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
