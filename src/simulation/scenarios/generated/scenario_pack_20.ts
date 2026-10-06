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

export class GeneratedScenario0191 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0191',
    title: 'Resources Ranger 0191',
    description: 'Cenário determinístico 0191 de resources para ranger em void.',
    category: 'resources',
    difficulty: 1,
    durationTicks: 88,
    snapshotInterval: 7,
    tags: ['generated', 'resources', 'ranger', 'void', 'matrix-10'],
    version: 1,
  };

  private readonly maximumHealth = 172;
  private readonly maximumMana = 100;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 40;
  private readonly movementScale = 1.36;
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
    state.inventory['relic_void_03'] = 0;
    state.flags['scenario_0191_complete'] = false;
    state.metrics['scenarioIndex'] = 191;
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
        label: 'movement-0191',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 190) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0191' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0191' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0191' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0191' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0191' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0191' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0191' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0191' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0191' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0191' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0191' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_03', amount: 1, label: 'item-0191' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0191',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0191' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0191_complete',
      value: 1,
      label: 'complete-0191',
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
      requiredFlag: 'scenario_0191_complete',
    };
  }
}

export class GeneratedScenario0192 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0192',
    title: 'Stress Ranger 0192',
    description: 'Cenário determinístico 0192 de stress para ranger em void.',
    category: 'stress',
    difficulty: 2,
    durationTicks: 92,
    snapshotInterval: 8,
    tags: ['generated', 'stress', 'ranger', 'void', 'matrix-11'],
    version: 1,
  };

  private readonly maximumHealth = 184;
  private readonly maximumMana = 105;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 45;
  private readonly movementScale = 1.43;
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
    state.inventory['relic_void_04'] = 0;
    state.flags['scenario_0192_complete'] = false;
    state.metrics['scenarioIndex'] = 192;
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
        label: 'movement-0192',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 191) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0192' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0192' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0192' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0192' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0192' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0192' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0192' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0192' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0192' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0192' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0192' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_04', amount: 1, label: 'item-0192' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0192',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0192' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0192_complete',
      value: 1,
      label: 'complete-0192',
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
      requiredFlag: 'scenario_0192_complete',
    };
  }
}

export class GeneratedScenario0193 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0193',
    title: 'Combat Mage 0193',
    description: 'Cenário determinístico 0193 de combat para mage em void.',
    category: 'combat',
    difficulty: 3,
    durationTicks: 48,
    snapshotInterval: 9,
    tags: ['generated', 'combat', 'mage', 'void', 'matrix-12'],
    version: 1,
  };

  private readonly maximumHealth = 196;
  private readonly maximumMana = 70;
  private readonly maximumStamina = 100;
  private readonly initialCurrency = 50;
  private readonly movementScale = 1.50;
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
    state.inventory['relic_void_05'] = 0;
    state.flags['scenario_0193_complete'] = false;
    state.metrics['scenarioIndex'] = 193;
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
        label: 'movement-0193',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 192) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0193' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0193' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0193' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0193' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0193' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0193' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0193' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0193' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0193' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0193' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0193' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_05', amount: 1, label: 'item-0193' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0193',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0193' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0193_complete',
      value: 1,
      label: 'complete-0193',
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
      requiredFlag: 'scenario_0193_complete',
    };
  }
}

export class GeneratedScenario0194 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0194',
    title: 'Navigation Mage 0194',
    description: 'Cenário determinístico 0194 de navigation para mage em void.',
    category: 'navigation',
    difficulty: 4,
    durationTicks: 52,
    snapshotInterval: 10,
    tags: ['generated', 'navigation', 'mage', 'void', 'matrix-13'],
    version: 1,
  };

  private readonly maximumHealth = 208;
  private readonly maximumMana = 75;
  private readonly maximumStamina = 110;
  private readonly initialCurrency = 55;
  private readonly movementScale = 1.57;
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
    state.inventory['relic_void_06'] = 0;
    state.flags['scenario_0194_complete'] = false;
    state.metrics['scenarioIndex'] = 194;
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
        label: 'movement-0194',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 193) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0194' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0194' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0194' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0194' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0194' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0194' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0194' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0194' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0194' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0194' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0194' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_06', amount: 1, label: 'item-0194' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0194',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0194' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0194_complete',
      value: 1,
      label: 'complete-0194',
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
      requiredFlag: 'scenario_0194_complete',
    };
  }
}

export class GeneratedScenario0195 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0195',
    title: 'Economy Mage 0195',
    description: 'Cenário determinístico 0195 de economy para mage em void.',
    category: 'economy',
    difficulty: 5,
    durationTicks: 56,
    snapshotInterval: 11,
    tags: ['generated', 'economy', 'mage', 'void', 'matrix-14'],
    version: 1,
  };

  private readonly maximumHealth = 220;
  private readonly maximumMana = 80;
  private readonly maximumStamina = 120;
  private readonly initialCurrency = 60;
  private readonly movementScale = 1.64;
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
    state.inventory['relic_void_07'] = 0;
    state.flags['scenario_0195_complete'] = false;
    state.metrics['scenarioIndex'] = 195;
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
        label: 'movement-0195',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 194) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0195' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0195' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0195' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0195' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0195' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0195' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0195' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0195' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0195' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0195' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0195' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_07', amount: 1, label: 'item-0195' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0195',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0195' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0195_complete',
      value: 1,
      label: 'complete-0195',
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
      requiredFlag: 'scenario_0195_complete',
    };
  }
}

export class GeneratedScenario0196 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0196',
    title: 'Progression Mage 0196',
    description: 'Cenário determinístico 0196 de progression para mage em void.',
    category: 'progression',
    difficulty: 6,
    durationTicks: 60,
    snapshotInterval: 12,
    tags: ['generated', 'progression', 'mage', 'void', 'matrix-0'],
    version: 1,
  };

  private readonly maximumHealth = 232;
  private readonly maximumMana = 85;
  private readonly maximumStamina = 130;
  private readonly initialCurrency = 65;
  private readonly movementScale = 0.80;
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
    state.inventory['relic_void_08'] = 0;
    state.flags['scenario_0196_complete'] = false;
    state.metrics['scenarioIndex'] = 196;
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
        label: 'movement-0196',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 195) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0196' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0196' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0196' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0196' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0196' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0196' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0196' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0196' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0196' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0196' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0196' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_08', amount: 1, label: 'item-0196' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0196',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0196' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0196_complete',
      value: 1,
      label: 'complete-0196',
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
      requiredFlag: 'scenario_0196_complete',
    };
  }
}

export class GeneratedScenario0197 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0197',
    title: 'Resources Mage 0197',
    description: 'Cenário determinístico 0197 de resources para mage em void.',
    category: 'resources',
    difficulty: 7,
    durationTicks: 64,
    snapshotInterval: 6,
    tags: ['generated', 'resources', 'mage', 'void', 'matrix-1'],
    version: 1,
  };

  private readonly maximumHealth = 244;
  private readonly maximumMana = 90;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 70;
  private readonly movementScale = 0.87;
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
    state.inventory['relic_void_09'] = 0;
    state.flags['scenario_0197_complete'] = false;
    state.metrics['scenarioIndex'] = 197;
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
        label: 'movement-0197',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 196) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0197' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0197' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0197' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0197' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0197' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0197' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0197' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0197' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0197' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0197' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0197' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_09', amount: 1, label: 'item-0197' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0197',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0197' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0197_complete',
      value: 1,
      label: 'complete-0197',
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
      requiredFlag: 'scenario_0197_complete',
    };
  }
}

export class GeneratedScenario0198 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0198',
    title: 'Stress Mage 0198',
    description: 'Cenário determinístico 0198 de stress para mage em void.',
    category: 'stress',
    difficulty: 8,
    durationTicks: 68,
    snapshotInterval: 7,
    tags: ['generated', 'stress', 'mage', 'void', 'matrix-2'],
    version: 1,
  };

  private readonly maximumHealth = 256;
  private readonly maximumMana = 95;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 75;
  private readonly movementScale = 0.94;
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
    state.inventory['relic_void_10'] = 0;
    state.flags['scenario_0198_complete'] = false;
    state.metrics['scenarioIndex'] = 198;
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
        label: 'movement-0198',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 197) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0198' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0198' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0198' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0198' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0198' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0198' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0198' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0198' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0198' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0198' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0198' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_10', amount: 1, label: 'item-0198' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0198',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0198' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0198_complete',
      value: 1,
      label: 'complete-0198',
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
      requiredFlag: 'scenario_0198_complete',
    };
  }
}

export class GeneratedScenario0199 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0199',
    title: 'Combat Guardian 0199',
    description: 'Cenário determinístico 0199 de combat para guardian em void.',
    category: 'combat',
    difficulty: 9,
    durationTicks: 72,
    snapshotInterval: 8,
    tags: ['generated', 'combat', 'guardian', 'void', 'matrix-3'],
    version: 1,
  };

  private readonly maximumHealth = 160;
  private readonly maximumMana = 100;
  private readonly maximumStamina = 100;
  private readonly initialCurrency = 25;
  private readonly movementScale = 1.01;
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
    state.inventory['relic_void_11'] = 0;
    state.flags['scenario_0199_complete'] = false;
    state.metrics['scenarioIndex'] = 199;
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
        label: 'movement-0199',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 198) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0199' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0199' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0199' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0199' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0199' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0199' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0199' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0199' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0199' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0199' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0199' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_11', amount: 1, label: 'item-0199' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0199',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0199' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0199_complete',
      value: 1,
      label: 'complete-0199',
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
      requiredFlag: 'scenario_0199_complete',
    };
  }
}

export class GeneratedScenario0200 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0200',
    title: 'Navigation Guardian 0200',
    description: 'Cenário determinístico 0200 de navigation para guardian em void.',
    category: 'navigation',
    difficulty: 10,
    durationTicks: 76,
    snapshotInterval: 9,
    tags: ['generated', 'navigation', 'guardian', 'void', 'matrix-4'],
    version: 1,
  };

  private readonly maximumHealth = 172;
  private readonly maximumMana = 105;
  private readonly maximumStamina = 110;
  private readonly initialCurrency = 30;
  private readonly movementScale = 1.08;
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
    state.inventory['relic_void_12'] = 0;
    state.flags['scenario_0200_complete'] = false;
    state.metrics['scenarioIndex'] = 200;
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
        label: 'movement-0200',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 199) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0200' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0200' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0200' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0200' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0200' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0200' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0200' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0200' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0200' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0200' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0200' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_void_12', amount: 1, label: 'item-0200' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0200',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0200' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0200_complete',
      value: 1,
      label: 'complete-0200',
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
      requiredFlag: 'scenario_0200_complete',
    };
  }
}
