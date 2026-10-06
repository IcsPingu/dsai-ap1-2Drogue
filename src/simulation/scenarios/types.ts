import { JsonObject } from '../core/types';

export type ScenarioCategory = 'combat' | 'navigation' | 'economy' | 'progression' | 'resources' | 'stress';

export type ScenarioActionKind =
  | 'move' | 'damage' | 'heal' | 'spendMana' | 'restoreMana'
  | 'spendStamina' | 'restoreStamina' | 'spawnEnemy' | 'defeatEnemy'
  | 'grantCurrency' | 'spendCurrency' | 'grantExperience' | 'advanceCombo'
  | 'breakCombo' | 'addItem' | 'removeItem' | 'setFlag' | 'sampleMetric';

export interface ScenarioVector extends JsonObject { x: number; y: number; }

export interface ScenarioAction extends JsonObject {
  kind: ScenarioActionKind;
  amount: number;
  x: number;
  y: number;
  key: string;
  value: number;
  label: string;
}

export interface ScheduledScenarioAction extends JsonObject {
  tick: number;
  order: number;
  action: ScenarioAction;
}

export interface ScenarioState extends JsonObject {
  tick: number;
  health: number;
  maximumHealth: number;
  mana: number;
  maximumMana: number;
  stamina: number;
  maximumStamina: number;
  currency: number;
  experience: number;
  level: number;
  score: number;
  combo: number;
  maximumCombo: number;
  enemiesAlive: number;
  enemiesDefeated: number;
  distanceTravelled: number;
  position: ScenarioVector;
  inventory: JsonObject;
  flags: JsonObject;
  metrics: JsonObject;
}

export interface ScenarioDescriptor extends JsonObject {
  id: string;
  title: string;
  description: string;
  category: ScenarioCategory;
  difficulty: number;
  durationTicks: number;
  snapshotInterval: number;
  tags: string[];
  version: number;
}

export interface ScenarioInvariantViolation extends JsonObject {
  id: string;
  tick: number;
  severity: 'warning' | 'error';
  message: string;
  path: string;
  actual: number;
  expected: number;
}

export interface ScenarioTraceEntry extends JsonObject {
  tick: number;
  order: number;
  kind: ScenarioActionKind;
  label: string;
  accepted: boolean;
  before: number;
  after: number;
}

export interface ScenarioSnapshot extends JsonObject {
  tick: number;
  checksum: number;
  state: ScenarioState;
}

export interface ScenarioRunMetrics extends JsonObject {
  ticksExecuted: number;
  actionsScheduled: number;
  actionsExecuted: number;
  actionsRejected: number;
  snapshotsCaptured: number;
  invariantChecks: number;
  distanceTravelled: number;
  damageTaken: number;
  healingReceived: number;
  manaSpent: number;
  staminaSpent: number;
  currencyEarned: number;
  currencySpent: number;
  experienceEarned: number;
  enemiesDefeated: number;
  itemsAdded: number;
  finalScore: number;
}

export interface ScenarioExpectation extends JsonObject {
  minimumScore: number;
  minimumDistance: number;
  minimumDefeats: number;
  minimumExperience: number;
  maximumRejectedActions: number;
  requireAlive: boolean;
  requiredFlag: string;
}

export interface ScenarioRunResult extends JsonObject {
  scenarioId: string;
  seed: number;
  passed: boolean;
  checksum: number;
  initialState: ScenarioState;
  finalState: ScenarioState;
  metrics: ScenarioRunMetrics;
  violations: ScenarioInvariantViolation[];
  traces: ScenarioTraceEntry[];
  snapshots: ScenarioSnapshot[];
}

export interface ScenarioComparison extends JsonObject {
  equal: boolean;
  leftChecksum: number;
  rightChecksum: number;
  scoreDelta: number;
  healthDelta: number;
  experienceDelta: number;
  distanceDelta: number;
  violationDelta: number;
}

export interface SimulationScenario {
  readonly descriptor: ScenarioDescriptor;
  createInitialState(): ScenarioState;
  createSchedule(random: import('../core/DeterministicRandom').DeterministicRandom): ScheduledScenarioAction[];
  expectation(): ScenarioExpectation;
}

export interface ScenarioBatchResult extends JsonObject {
  name: string;
  total: number;
  passed: number;
  failed: number;
  aggregateChecksum: number;
  totalTicks: number;
  totalActions: number;
  totalViolations: number;
  categoryCounts: JsonObject;
  results: ScenarioRunResult[];
}

export interface ScenarioRunnerOptions {
  traceLimit?: number;
  snapshotLimit?: number;
  stopOnInvariantError?: boolean;
  strictSchedule?: boolean;
}

export interface ScenarioActionValues {
  amount?: number;
  x?: number;
  y?: number;
  key?: string;
  value?: number;
  label?: string;
}

export function createScenarioAction(kind: ScenarioActionKind, values: ScenarioActionValues = {}): ScenarioAction {
  return {
    kind,
    amount: values.amount ?? 0,
    x: values.x ?? 0,
    y: values.y ?? 0,
    key: values.key ?? '',
    value: values.value ?? 0,
    label: values.label ?? kind,
  };
}

export function createDefaultScenarioState(): ScenarioState {
  return {
    tick: 0, health: 100, maximumHealth: 100, mana: 50, maximumMana: 50,
    stamina: 100, maximumStamina: 100, currency: 0, experience: 0, level: 1,
    score: 0, combo: 0, maximumCombo: 0, enemiesAlive: 0, enemiesDefeated: 0,
    distanceTravelled: 0, position: { x: 0, y: 0 }, inventory: {}, flags: {}, metrics: {},
  };
}
