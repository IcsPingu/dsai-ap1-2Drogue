import { DeterministicRandom } from '../../core/DeterministicRandom';
import {
  ScenarioAction,
  ScenarioDescriptor,
  ScenarioExpectation,
  ScenarioState,
  ScheduledScenarioAction,
  SimulationScenario,
  createDefaultScenarioState,
  createScenarioAction,
} from '../types';

export class GeneratedScenario0011 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0011',
    title: 'Resources Ranger 0011',
    description: 'Cenário determinístico 0011 de resources para ranger em cathedral.',
    category: 'resources',
    difficulty: 1,
    durationTicks: 88,
    snapshotInterval: 9,
    tags: ['generated', 'resources', 'ranger', 'cathedral', 'matrix-10'],
    version: 1,
  };

  private readonly maximumHealth = 172;
  private readonly maximumMana = 80;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 75;
  private readonly movementScale = 1.50;
  private readonly damagePerCycle = 2;
  private readonly healingPerCycle = 4;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 3;
  private readonly staminaRecovery = 5;
  private readonly rewardPerDefeat = 5;
  private readonly experiencePerDefeat = 16;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_10'] = 0;
    state.flags['scenario_0011_complete'] = false;
    state.metrics['scenarioIndex'] = 11;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 10 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0011',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 10) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0011' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0011' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0011' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0011' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0011' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0011' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0011' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0011' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0011' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0011' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0011' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_10', amount: 1, label: 'item-0011' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0011',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0011' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0011_complete',
      value: 1,
      label: 'complete-0011',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0011_complete',
    };
  }
}

export class GeneratedScenario0012 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0012',
    title: 'Stress Ranger 0012',
    description: 'Cenário determinístico 0012 de stress para ranger em cathedral.',
    category: 'stress',
    difficulty: 2,
    durationTicks: 92,
    snapshotInterval: 10,
    tags: ['generated', 'stress', 'ranger', 'cathedral', 'matrix-11'],
    version: 1,
  };

  private readonly maximumHealth = 184;
  private readonly maximumMana = 85;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 25;
  private readonly movementScale = 1.57;
  private readonly damagePerCycle = 3;
  private readonly healingPerCycle = 6;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 4;
  private readonly staminaRecovery = 6;
  private readonly rewardPerDefeat = 6;
  private readonly experiencePerDefeat = 17;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_11'] = 0;
    state.flags['scenario_0012_complete'] = false;
    state.metrics['scenarioIndex'] = 12;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 11 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0012',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 11) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0012' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0012' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0012' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0012' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0012' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0012' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0012' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0012' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0012' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0012' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0012' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_11', amount: 1, label: 'item-0012' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0012',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0012' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0012_complete',
      value: 1,
      label: 'complete-0012',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0012_complete',
    };
  }
}

export class GeneratedScenario0013 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0013',
    title: 'Combat Mage 0013',
    description: 'Cenário determinístico 0013 de combat para mage em cathedral.',
    category: 'combat',
    difficulty: 3,
    durationTicks: 48,
    snapshotInterval: 11,
    tags: ['generated', 'combat', 'mage', 'cathedral', 'matrix-12'],
    version: 1,
  };

  private readonly maximumHealth = 196;
  private readonly maximumMana = 90;
  private readonly maximumStamina = 100;
  private readonly initialCurrency = 30;
  private readonly movementScale = 1.64;
  private readonly damagePerCycle = 4;
  private readonly healingPerCycle = 5;
  private readonly manaCost = 2;
  private readonly manaRecovery = 3;
  private readonly staminaCost = 5;
  private readonly staminaRecovery = 7;
  private readonly rewardPerDefeat = 7;
  private readonly experiencePerDefeat = 6;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_12'] = 0;
    state.flags['scenario_0013_complete'] = false;
    state.metrics['scenarioIndex'] = 13;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 12 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0013',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 12) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0013' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0013' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0013' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0013' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0013' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0013' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0013' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0013' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0013' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0013' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0013' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_12', amount: 1, label: 'item-0013' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0013',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0013' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0013_complete',
      value: 1,
      label: 'complete-0013',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0013_complete',
    };
  }
}

export class GeneratedScenario0014 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0014',
    title: 'Navigation Mage 0014',
    description: 'Cenário determinístico 0014 de navigation para mage em cathedral.',
    category: 'navigation',
    difficulty: 4,
    durationTicks: 52,
    snapshotInterval: 12,
    tags: ['generated', 'navigation', 'mage', 'cathedral', 'matrix-13'],
    version: 1,
  };

  private readonly maximumHealth = 208;
  private readonly maximumMana = 95;
  private readonly maximumStamina = 110;
  private readonly initialCurrency = 35;
  private readonly movementScale = 0.80;
  private readonly damagePerCycle = 5;
  private readonly healingPerCycle = 7;
  private readonly manaCost = 3;
  private readonly manaRecovery = 4;
  private readonly staminaCost = 6;
  private readonly staminaRecovery = 8;
  private readonly rewardPerDefeat = 8;
  private readonly experiencePerDefeat = 7;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_13'] = 0;
    state.flags['scenario_0014_complete'] = false;
    state.metrics['scenarioIndex'] = 14;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 13 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0014',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 13) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0014' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0014' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0014' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0014' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0014' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0014' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0014' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0014' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0014' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0014' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0014' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_13', amount: 1, label: 'item-0014' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0014',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0014' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0014_complete',
      value: 1,
      label: 'complete-0014',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0014_complete',
    };
  }
}

export class GeneratedScenario0015 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0015',
    title: 'Economy Mage 0015',
    description: 'Cenário determinístico 0015 de economy para mage em cathedral.',
    category: 'economy',
    difficulty: 5,
    durationTicks: 56,
    snapshotInterval: 6,
    tags: ['generated', 'economy', 'mage', 'cathedral', 'matrix-14'],
    version: 1,
  };

  private readonly maximumHealth = 220;
  private readonly maximumMana = 100;
  private readonly maximumStamina = 120;
  private readonly initialCurrency = 40;
  private readonly movementScale = 0.87;
  private readonly damagePerCycle = 6;
  private readonly healingPerCycle = 9;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 7;
  private readonly staminaRecovery = 9;
  private readonly rewardPerDefeat = 9;
  private readonly experiencePerDefeat = 8;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_14'] = 0;
    state.flags['scenario_0015_complete'] = false;
    state.metrics['scenarioIndex'] = 15;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 14 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0015',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 14) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0015' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0015' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0015' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0015' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0015' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0015' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0015' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0015' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0015' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0015' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0015' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_14', amount: 1, label: 'item-0015' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0015',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0015' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0015_complete',
      value: 1,
      label: 'complete-0015',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0015_complete',
    };
  }
}

export class GeneratedScenario0016 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0016',
    title: 'Progression Mage 0016',
    description: 'Cenário determinístico 0016 de progression para mage em cathedral.',
    category: 'progression',
    difficulty: 6,
    durationTicks: 60,
    snapshotInterval: 7,
    tags: ['generated', 'progression', 'mage', 'cathedral', 'matrix-0'],
    version: 1,
  };

  private readonly maximumHealth = 232;
  private readonly maximumMana = 105;
  private readonly maximumStamina = 130;
  private readonly initialCurrency = 45;
  private readonly movementScale = 0.94;
  private readonly damagePerCycle = 2;
  private readonly healingPerCycle = 3;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 3;
  private readonly staminaRecovery = 5;
  private readonly rewardPerDefeat = 10;
  private readonly experiencePerDefeat = 9;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_15'] = 0;
    state.flags['scenario_0016_complete'] = false;
    state.metrics['scenarioIndex'] = 16;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 15 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0016',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 15) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0016' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0016' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0016' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0016' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0016' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0016' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0016' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0016' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0016' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0016' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0016' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_15', amount: 1, label: 'item-0016' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0016',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0016' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0016_complete',
      value: 1,
      label: 'complete-0016',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0016_complete',
    };
  }
}

export class GeneratedScenario0017 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0017',
    title: 'Resources Mage 0017',
    description: 'Cenário determinístico 0017 de resources para mage em cathedral.',
    category: 'resources',
    difficulty: 7,
    durationTicks: 64,
    snapshotInterval: 8,
    tags: ['generated', 'resources', 'mage', 'cathedral', 'matrix-1'],
    version: 1,
  };

  private readonly maximumHealth = 244;
  private readonly maximumMana = 70;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 50;
  private readonly movementScale = 1.01;
  private readonly damagePerCycle = 3;
  private readonly healingPerCycle = 5;
  private readonly manaCost = 2;
  private readonly manaRecovery = 3;
  private readonly staminaCost = 4;
  private readonly staminaRecovery = 6;
  private readonly rewardPerDefeat = 11;
  private readonly experiencePerDefeat = 10;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_16'] = 0;
    state.flags['scenario_0017_complete'] = false;
    state.metrics['scenarioIndex'] = 17;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 16 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0017',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 16) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0017' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0017' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0017' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0017' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0017' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0017' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0017' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0017' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0017' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0017' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0017' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_16', amount: 1, label: 'item-0017' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0017',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0017' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0017_complete',
      value: 1,
      label: 'complete-0017',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0017_complete',
    };
  }
}

export class GeneratedScenario0018 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0018',
    title: 'Stress Mage 0018',
    description: 'Cenário determinístico 0018 de stress para mage em cathedral.',
    category: 'stress',
    difficulty: 8,
    durationTicks: 68,
    snapshotInterval: 9,
    tags: ['generated', 'stress', 'mage', 'cathedral', 'matrix-2'],
    version: 1,
  };

  private readonly maximumHealth = 256;
  private readonly maximumMana = 75;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 55;
  private readonly movementScale = 1.08;
  private readonly damagePerCycle = 4;
  private readonly healingPerCycle = 7;
  private readonly manaCost = 3;
  private readonly manaRecovery = 4;
  private readonly staminaCost = 5;
  private readonly staminaRecovery = 7;
  private readonly rewardPerDefeat = 12;
  private readonly experiencePerDefeat = 11;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_00'] = 0;
    state.flags['scenario_0018_complete'] = false;
    state.metrics['scenarioIndex'] = 18;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 17 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0018',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 17) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0018' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0018' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0018' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0018' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0018' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0018' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0018' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0018' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0018' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0018' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0018' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_00', amount: 1, label: 'item-0018' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0018',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0018' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0018_complete',
      value: 1,
      label: 'complete-0018',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0018_complete',
    };
  }
}

export class GeneratedScenario0019 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0019',
    title: 'Combat Guardian 0019',
    description: 'Cenário determinístico 0019 de combat para guardian em cathedral.',
    category: 'combat',
    difficulty: 9,
    durationTicks: 72,
    snapshotInterval: 10,
    tags: ['generated', 'combat', 'guardian', 'cathedral', 'matrix-3'],
    version: 1,
  };

  private readonly maximumHealth = 160;
  private readonly maximumMana = 80;
  private readonly maximumStamina = 100;
  private readonly initialCurrency = 60;
  private readonly movementScale = 1.15;
  private readonly damagePerCycle = 5;
  private readonly healingPerCycle = 6;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 6;
  private readonly staminaRecovery = 8;
  private readonly rewardPerDefeat = 4;
  private readonly experiencePerDefeat = 12;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_01'] = 0;
    state.flags['scenario_0019_complete'] = false;
    state.metrics['scenarioIndex'] = 19;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 18 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0019',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 18) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0019' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0019' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0019' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0019' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0019' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0019' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0019' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0019' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0019' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0019' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0019' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_01', amount: 1, label: 'item-0019' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0019',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0019' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0019_complete',
      value: 1,
      label: 'complete-0019',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0019_complete',
    };
  }
}

export class GeneratedScenario0020 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0020',
    title: 'Navigation Guardian 0020',
    description: 'Cenário determinístico 0020 de navigation para guardian em cathedral.',
    category: 'navigation',
    difficulty: 10,
    durationTicks: 76,
    snapshotInterval: 11,
    tags: ['generated', 'navigation', 'guardian', 'cathedral', 'matrix-4'],
    version: 1,
  };

  private readonly maximumHealth = 172;
  private readonly maximumMana = 85;
  private readonly maximumStamina = 110;
  private readonly initialCurrency = 65;
  private readonly movementScale = 1.22;
  private readonly damagePerCycle = 6;
  private readonly healingPerCycle = 8;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 7;
  private readonly staminaRecovery = 9;
  private readonly rewardPerDefeat = 5;
  private readonly experiencePerDefeat = 13;

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['relic_cathedral_02'] = 0;
    state.flags['scenario_0020_complete'] = false;
    state.metrics['scenarioIndex'] = 20;
    state.metrics['difficulty'] = this.descriptor.difficulty;
    return state;
  }

  public createSchedule(random: DeterministicRandom): ScheduledScenarioAction[] {
    const schedule: ScheduledScenarioAction[] = [];
    let order = 0;
    const push = (tick: number, action: ScenarioAction): void => {
      schedule.push({ tick, order, action });
      order += 1;
    };
    for (let tick = 1; tick <= this.descriptor.durationTicks; tick += 1) {
      const angle = random.angle() + tick * 0.071 + 19 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0020',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 19) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0020' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0020' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0020' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0020' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0020' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0020' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0020' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0020' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0020' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0020' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0020' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_02', amount: 1, label: 'item-0020' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0020',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0020' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0020_complete',
      value: 1,
      label: 'complete-0020',
    }));
    return schedule;
  }

  public expectation(): ScenarioExpectation {
    return {
      minimumScore: 100,
      minimumDistance: this.descriptor.durationTicks * this.movementScale * 0.5,
      minimumDefeats: Math.floor(this.descriptor.durationTicks / 4),
      minimumExperience: Math.floor(this.descriptor.durationTicks / 4) * this.experiencePerDefeat,
      maximumRejectedActions: 2,
      requireAlive: true,
      requiredFlag: 'scenario_0020_complete',
    };
  }
}
