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

export class GeneratedScenario0231 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0231',
    title: 'Economy Mage 0231',
    description: 'Cenário determinístico 0231 de economy para mage em cathedral.',
    category: 'economy',
    difficulty: 1,
    durationTicks: 56,
    snapshotInterval: 12,
    tags: ['generated', 'economy', 'mage', 'cathedral', 'matrix-5'],
    version: 1,
  };

  private readonly maximumHealth = 220;
  private readonly maximumMana = 100;
  private readonly maximumStamina = 120;
  private readonly initialCurrency = 75;
  private readonly movementScale = 1.43;
  private readonly damagePerCycle = 2;
  private readonly healingPerCycle = 5;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 3;
  private readonly staminaRecovery = 5;
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
    state.inventory['relic_cathedral_09'] = 0;
    state.flags['scenario_0231_complete'] = false;
    state.metrics['scenarioIndex'] = 231;
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
      const angle = random.angle() + tick * 0.071 + 0 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0231',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 230) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0231' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0231' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0231' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0231' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0231' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0231' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0231' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0231' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0231' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0231' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0231' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_09', amount: 1, label: 'item-0231' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0231',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0231' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0231_complete',
      value: 1,
      label: 'complete-0231',
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
      requiredFlag: 'scenario_0231_complete',
    };
  }
}

export class GeneratedScenario0232 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0232',
    title: 'Progression Mage 0232',
    description: 'Cenário determinístico 0232 de progression para mage em cathedral.',
    category: 'progression',
    difficulty: 2,
    durationTicks: 60,
    snapshotInterval: 6,
    tags: ['generated', 'progression', 'mage', 'cathedral', 'matrix-6'],
    version: 1,
  };

  private readonly maximumHealth = 232;
  private readonly maximumMana = 105;
  private readonly maximumStamina = 130;
  private readonly initialCurrency = 25;
  private readonly movementScale = 1.50;
  private readonly damagePerCycle = 3;
  private readonly healingPerCycle = 4;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 4;
  private readonly staminaRecovery = 6;
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
    state.inventory['relic_cathedral_10'] = 0;
    state.flags['scenario_0232_complete'] = false;
    state.metrics['scenarioIndex'] = 232;
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
      const angle = random.angle() + tick * 0.071 + 1 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0232',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 231) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0232' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0232' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0232' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0232' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0232' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0232' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0232' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0232' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0232' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0232' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0232' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_10', amount: 1, label: 'item-0232' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0232',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0232' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0232_complete',
      value: 1,
      label: 'complete-0232',
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
      requiredFlag: 'scenario_0232_complete',
    };
  }
}

export class GeneratedScenario0233 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0233',
    title: 'Resources Mage 0233',
    description: 'Cenário determinístico 0233 de resources para mage em cathedral.',
    category: 'resources',
    difficulty: 3,
    durationTicks: 64,
    snapshotInterval: 7,
    tags: ['generated', 'resources', 'mage', 'cathedral', 'matrix-7'],
    version: 1,
  };

  private readonly maximumHealth = 244;
  private readonly maximumMana = 70;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 30;
  private readonly movementScale = 1.57;
  private readonly damagePerCycle = 4;
  private readonly healingPerCycle = 6;
  private readonly manaCost = 2;
  private readonly manaRecovery = 3;
  private readonly staminaCost = 5;
  private readonly staminaRecovery = 7;
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
    state.inventory['relic_cathedral_11'] = 0;
    state.flags['scenario_0233_complete'] = false;
    state.metrics['scenarioIndex'] = 233;
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
      const angle = random.angle() + tick * 0.071 + 2 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0233',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 232) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0233' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0233' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0233' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0233' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0233' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0233' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0233' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0233' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0233' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0233' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0233' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_11', amount: 1, label: 'item-0233' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0233',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0233' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0233_complete',
      value: 1,
      label: 'complete-0233',
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
      requiredFlag: 'scenario_0233_complete',
    };
  }
}

export class GeneratedScenario0234 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0234',
    title: 'Stress Mage 0234',
    description: 'Cenário determinístico 0234 de stress para mage em cathedral.',
    category: 'stress',
    difficulty: 4,
    durationTicks: 68,
    snapshotInterval: 8,
    tags: ['generated', 'stress', 'mage', 'cathedral', 'matrix-8'],
    version: 1,
  };

  private readonly maximumHealth = 256;
  private readonly maximumMana = 75;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 35;
  private readonly movementScale = 1.64;
  private readonly damagePerCycle = 5;
  private readonly healingPerCycle = 8;
  private readonly manaCost = 3;
  private readonly manaRecovery = 4;
  private readonly staminaCost = 6;
  private readonly staminaRecovery = 8;
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
    state.inventory['relic_cathedral_12'] = 0;
    state.flags['scenario_0234_complete'] = false;
    state.metrics['scenarioIndex'] = 234;
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
      const angle = random.angle() + tick * 0.071 + 3 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0234',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 233) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0234' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0234' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0234' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0234' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0234' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0234' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0234' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0234' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0234' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0234' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0234' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_12', amount: 1, label: 'item-0234' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0234',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0234' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0234_complete',
      value: 1,
      label: 'complete-0234',
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
      requiredFlag: 'scenario_0234_complete',
    };
  }
}

export class GeneratedScenario0235 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0235',
    title: 'Combat Guardian 0235',
    description: 'Cenário determinístico 0235 de combat para guardian em cathedral.',
    category: 'combat',
    difficulty: 5,
    durationTicks: 72,
    snapshotInterval: 9,
    tags: ['generated', 'combat', 'guardian', 'cathedral', 'matrix-9'],
    version: 1,
  };

  private readonly maximumHealth = 160;
  private readonly maximumMana = 80;
  private readonly maximumStamina = 100;
  private readonly initialCurrency = 40;
  private readonly movementScale = 0.80;
  private readonly damagePerCycle = 6;
  private readonly healingPerCycle = 7;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 7;
  private readonly staminaRecovery = 9;
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
    state.inventory['relic_cathedral_13'] = 0;
    state.flags['scenario_0235_complete'] = false;
    state.metrics['scenarioIndex'] = 235;
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
      const angle = random.angle() + tick * 0.071 + 4 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0235',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 234) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0235' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0235' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0235' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0235' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0235' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0235' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0235' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0235' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0235' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0235' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0235' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_13', amount: 1, label: 'item-0235' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0235',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0235' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0235_complete',
      value: 1,
      label: 'complete-0235',
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
      requiredFlag: 'scenario_0235_complete',
    };
  }
}

export class GeneratedScenario0236 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0236',
    title: 'Navigation Guardian 0236',
    description: 'Cenário determinístico 0236 de navigation para guardian em cathedral.',
    category: 'navigation',
    difficulty: 6,
    durationTicks: 76,
    snapshotInterval: 10,
    tags: ['generated', 'navigation', 'guardian', 'cathedral', 'matrix-10'],
    version: 1,
  };

  private readonly maximumHealth = 172;
  private readonly maximumMana = 85;
  private readonly maximumStamina = 110;
  private readonly initialCurrency = 45;
  private readonly movementScale = 0.87;
  private readonly damagePerCycle = 2;
  private readonly healingPerCycle = 4;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 3;
  private readonly staminaRecovery = 5;
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
    state.inventory['relic_cathedral_14'] = 0;
    state.flags['scenario_0236_complete'] = false;
    state.metrics['scenarioIndex'] = 236;
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
      const angle = random.angle() + tick * 0.071 + 5 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0236',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 235) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0236' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0236' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0236' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0236' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0236' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0236' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0236' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0236' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0236' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0236' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0236' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_14', amount: 1, label: 'item-0236' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0236',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0236' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0236_complete',
      value: 1,
      label: 'complete-0236',
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
      requiredFlag: 'scenario_0236_complete',
    };
  }
}

export class GeneratedScenario0237 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0237',
    title: 'Economy Guardian 0237',
    description: 'Cenário determinístico 0237 de economy para guardian em cathedral.',
    category: 'economy',
    difficulty: 7,
    durationTicks: 80,
    snapshotInterval: 11,
    tags: ['generated', 'economy', 'guardian', 'cathedral', 'matrix-11'],
    version: 1,
  };

  private readonly maximumHealth = 184;
  private readonly maximumMana = 90;
  private readonly maximumStamina = 120;
  private readonly initialCurrency = 50;
  private readonly movementScale = 0.94;
  private readonly damagePerCycle = 3;
  private readonly healingPerCycle = 6;
  private readonly manaCost = 2;
  private readonly manaRecovery = 3;
  private readonly staminaCost = 4;
  private readonly staminaRecovery = 6;
  private readonly rewardPerDefeat = 6;
  private readonly experiencePerDefeat = 14;

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
    state.flags['scenario_0237_complete'] = false;
    state.metrics['scenarioIndex'] = 237;
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
      const angle = random.angle() + tick * 0.071 + 6 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0237',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 236) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0237' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0237' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0237' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0237' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0237' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0237' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0237' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0237' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0237' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0237' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0237' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_15', amount: 1, label: 'item-0237' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0237',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0237' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0237_complete',
      value: 1,
      label: 'complete-0237',
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
      requiredFlag: 'scenario_0237_complete',
    };
  }
}

export class GeneratedScenario0238 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0238',
    title: 'Progression Guardian 0238',
    description: 'Cenário determinístico 0238 de progression para guardian em cathedral.',
    category: 'progression',
    difficulty: 8,
    durationTicks: 84,
    snapshotInterval: 12,
    tags: ['generated', 'progression', 'guardian', 'cathedral', 'matrix-12'],
    version: 1,
  };

  private readonly maximumHealth = 196;
  private readonly maximumMana = 95;
  private readonly maximumStamina = 130;
  private readonly initialCurrency = 55;
  private readonly movementScale = 1.01;
  private readonly damagePerCycle = 4;
  private readonly healingPerCycle = 5;
  private readonly manaCost = 3;
  private readonly manaRecovery = 4;
  private readonly staminaCost = 5;
  private readonly staminaRecovery = 7;
  private readonly rewardPerDefeat = 7;
  private readonly experiencePerDefeat = 15;

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
    state.flags['scenario_0238_complete'] = false;
    state.metrics['scenarioIndex'] = 238;
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
      const angle = random.angle() + tick * 0.071 + 7 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0238',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 237) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0238' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0238' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0238' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0238' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0238' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0238' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0238' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0238' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0238' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0238' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0238' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_16', amount: 1, label: 'item-0238' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0238',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0238' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0238_complete',
      value: 1,
      label: 'complete-0238',
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
      requiredFlag: 'scenario_0238_complete',
    };
  }
}

export class GeneratedScenario0239 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0239',
    title: 'Resources Guardian 0239',
    description: 'Cenário determinístico 0239 de resources para guardian em cathedral.',
    category: 'resources',
    difficulty: 9,
    durationTicks: 88,
    snapshotInterval: 6,
    tags: ['generated', 'resources', 'guardian', 'cathedral', 'matrix-13'],
    version: 1,
  };

  private readonly maximumHealth = 208;
  private readonly maximumMana = 100;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 60;
  private readonly movementScale = 1.08;
  private readonly damagePerCycle = 5;
  private readonly healingPerCycle = 7;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 6;
  private readonly staminaRecovery = 8;
  private readonly rewardPerDefeat = 8;
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
    state.inventory['relic_cathedral_00'] = 0;
    state.flags['scenario_0239_complete'] = false;
    state.metrics['scenarioIndex'] = 239;
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
      const angle = random.angle() + tick * 0.071 + 8 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0239',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 238) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0239' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0239' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0239' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0239' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0239' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0239' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0239' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0239' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0239' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0239' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0239' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_00', amount: 1, label: 'item-0239' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0239',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0239' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0239_complete',
      value: 1,
      label: 'complete-0239',
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
      requiredFlag: 'scenario_0239_complete',
    };
  }
}

export class GeneratedScenario0240 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0240',
    title: 'Stress Guardian 0240',
    description: 'Cenário determinístico 0240 de stress para guardian em cathedral.',
    category: 'stress',
    difficulty: 10,
    durationTicks: 92,
    snapshotInterval: 7,
    tags: ['generated', 'stress', 'guardian', 'cathedral', 'matrix-14'],
    version: 1,
  };

  private readonly maximumHealth = 220;
  private readonly maximumMana = 105;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 65;
  private readonly movementScale = 1.15;
  private readonly damagePerCycle = 6;
  private readonly healingPerCycle = 9;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 7;
  private readonly staminaRecovery = 9;
  private readonly rewardPerDefeat = 9;
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
    state.inventory['relic_cathedral_01'] = 0;
    state.flags['scenario_0240_complete'] = false;
    state.metrics['scenarioIndex'] = 240;
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
      const angle = random.angle() + tick * 0.071 + 9 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0240',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 239) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0240' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0240' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0240' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0240' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0240' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0240' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0240' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0240' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0240' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0240' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0240' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_cathedral_01', amount: 1, label: 'item-0240' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0240',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0240' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0240_complete',
      value: 1,
      label: 'complete-0240',
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
      requiredFlag: 'scenario_0240_complete',
    };
  }
}
