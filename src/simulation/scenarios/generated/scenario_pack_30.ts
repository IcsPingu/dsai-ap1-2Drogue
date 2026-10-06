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

export class GeneratedScenario0291 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0291',
    title: 'Economy Duelist 0291',
    description: 'Cenário determinístico 0291 de economy para duelist em tower.',
    category: 'economy',
    difficulty: 1,
    durationTicks: 56,
    snapshotInterval: 9,
    tags: ['generated', 'economy', 'duelist', 'tower', 'matrix-5'],
    version: 1,
  };

  private readonly maximumHealth = 184;
  private readonly maximumMana = 80;
  private readonly maximumStamina = 120;
  private readonly initialCurrency = 45;
  private readonly movementScale = 1.08;
  private readonly damagePerCycle = 2;
  private readonly healingPerCycle = 5;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 3;
  private readonly staminaRecovery = 5;
  private readonly rewardPerDefeat = 6;
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
    state.inventory['relic_tower_01'] = 0;
    state.flags['scenario_0291_complete'] = false;
    state.metrics['scenarioIndex'] = 291;
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
        label: 'movement-0291',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 290) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0291' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0291' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0291' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0291' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0291' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0291' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0291' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0291' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0291' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0291' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0291' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_01', amount: 1, label: 'item-0291' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0291',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0291' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0291_complete',
      value: 1,
      label: 'complete-0291',
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
      requiredFlag: 'scenario_0291_complete',
    };
  }
}

export class GeneratedScenario0292 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0292',
    title: 'Progression Duelist 0292',
    description: 'Cenário determinístico 0292 de progression para duelist em tower.',
    category: 'progression',
    difficulty: 2,
    durationTicks: 60,
    snapshotInterval: 10,
    tags: ['generated', 'progression', 'duelist', 'tower', 'matrix-6'],
    version: 1,
  };

  private readonly maximumHealth = 196;
  private readonly maximumMana = 85;
  private readonly maximumStamina = 130;
  private readonly initialCurrency = 50;
  private readonly movementScale = 1.15;
  private readonly damagePerCycle = 3;
  private readonly healingPerCycle = 4;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 4;
  private readonly staminaRecovery = 6;
  private readonly rewardPerDefeat = 7;
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
    state.inventory['relic_tower_02'] = 0;
    state.flags['scenario_0292_complete'] = false;
    state.metrics['scenarioIndex'] = 292;
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
        label: 'movement-0292',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 291) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0292' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0292' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0292' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0292' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0292' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0292' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0292' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0292' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0292' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0292' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0292' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_02', amount: 1, label: 'item-0292' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0292',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0292' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0292_complete',
      value: 1,
      label: 'complete-0292',
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
      requiredFlag: 'scenario_0292_complete',
    };
  }
}

export class GeneratedScenario0293 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0293',
    title: 'Resources Duelist 0293',
    description: 'Cenário determinístico 0293 de resources para duelist em tower.',
    category: 'resources',
    difficulty: 3,
    durationTicks: 64,
    snapshotInterval: 11,
    tags: ['generated', 'resources', 'duelist', 'tower', 'matrix-7'],
    version: 1,
  };

  private readonly maximumHealth = 208;
  private readonly maximumMana = 90;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 55;
  private readonly movementScale = 1.22;
  private readonly damagePerCycle = 4;
  private readonly healingPerCycle = 6;
  private readonly manaCost = 2;
  private readonly manaRecovery = 3;
  private readonly staminaCost = 5;
  private readonly staminaRecovery = 7;
  private readonly rewardPerDefeat = 8;
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
    state.inventory['relic_tower_03'] = 0;
    state.flags['scenario_0293_complete'] = false;
    state.metrics['scenarioIndex'] = 293;
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
        label: 'movement-0293',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 292) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0293' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0293' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0293' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0293' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0293' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0293' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0293' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0293' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0293' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0293' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0293' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_03', amount: 1, label: 'item-0293' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0293',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0293' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0293_complete',
      value: 1,
      label: 'complete-0293',
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
      requiredFlag: 'scenario_0293_complete',
    };
  }
}

export class GeneratedScenario0294 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0294',
    title: 'Stress Duelist 0294',
    description: 'Cenário determinístico 0294 de stress para duelist em tower.',
    category: 'stress',
    difficulty: 4,
    durationTicks: 68,
    snapshotInterval: 12,
    tags: ['generated', 'stress', 'duelist', 'tower', 'matrix-8'],
    version: 1,
  };

  private readonly maximumHealth = 220;
  private readonly maximumMana = 95;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 60;
  private readonly movementScale = 1.29;
  private readonly damagePerCycle = 5;
  private readonly healingPerCycle = 8;
  private readonly manaCost = 3;
  private readonly manaRecovery = 4;
  private readonly staminaCost = 6;
  private readonly staminaRecovery = 8;
  private readonly rewardPerDefeat = 9;
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
    state.inventory['relic_tower_04'] = 0;
    state.flags['scenario_0294_complete'] = false;
    state.metrics['scenarioIndex'] = 294;
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
        label: 'movement-0294',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 293) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0294' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0294' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0294' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0294' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0294' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0294' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0294' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0294' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0294' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0294' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0294' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_04', amount: 1, label: 'item-0294' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0294',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0294' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0294_complete',
      value: 1,
      label: 'complete-0294',
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
      requiredFlag: 'scenario_0294_complete',
    };
  }
}

export class GeneratedScenario0295 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0295',
    title: 'Combat Ranger 0295',
    description: 'Cenário determinístico 0295 de combat para ranger em tower.',
    category: 'combat',
    difficulty: 5,
    durationTicks: 72,
    snapshotInterval: 6,
    tags: ['generated', 'combat', 'ranger', 'tower', 'matrix-9'],
    version: 1,
  };

  private readonly maximumHealth = 232;
  private readonly maximumMana = 100;
  private readonly maximumStamina = 100;
  private readonly initialCurrency = 65;
  private readonly movementScale = 1.36;
  private readonly damagePerCycle = 6;
  private readonly healingPerCycle = 7;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 7;
  private readonly staminaRecovery = 9;
  private readonly rewardPerDefeat = 10;
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
    state.inventory['relic_tower_05'] = 0;
    state.flags['scenario_0295_complete'] = false;
    state.metrics['scenarioIndex'] = 295;
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
        label: 'movement-0295',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 294) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0295' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0295' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0295' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0295' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0295' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0295' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0295' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0295' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0295' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0295' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0295' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_05', amount: 1, label: 'item-0295' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0295',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0295' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0295_complete',
      value: 1,
      label: 'complete-0295',
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
      requiredFlag: 'scenario_0295_complete',
    };
  }
}

export class GeneratedScenario0296 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0296',
    title: 'Navigation Ranger 0296',
    description: 'Cenário determinístico 0296 de navigation para ranger em tower.',
    category: 'navigation',
    difficulty: 6,
    durationTicks: 76,
    snapshotInterval: 7,
    tags: ['generated', 'navigation', 'ranger', 'tower', 'matrix-10'],
    version: 1,
  };

  private readonly maximumHealth = 244;
  private readonly maximumMana = 105;
  private readonly maximumStamina = 110;
  private readonly initialCurrency = 70;
  private readonly movementScale = 1.43;
  private readonly damagePerCycle = 2;
  private readonly healingPerCycle = 4;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 3;
  private readonly staminaRecovery = 5;
  private readonly rewardPerDefeat = 11;
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
    state.inventory['relic_tower_06'] = 0;
    state.flags['scenario_0296_complete'] = false;
    state.metrics['scenarioIndex'] = 296;
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
        label: 'movement-0296',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 295) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0296' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0296' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0296' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0296' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0296' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0296' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0296' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0296' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0296' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0296' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0296' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_06', amount: 1, label: 'item-0296' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0296',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0296' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0296_complete',
      value: 1,
      label: 'complete-0296',
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
      requiredFlag: 'scenario_0296_complete',
    };
  }
}

export class GeneratedScenario0297 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0297',
    title: 'Economy Ranger 0297',
    description: 'Cenário determinístico 0297 de economy para ranger em tower.',
    category: 'economy',
    difficulty: 7,
    durationTicks: 80,
    snapshotInterval: 8,
    tags: ['generated', 'economy', 'ranger', 'tower', 'matrix-11'],
    version: 1,
  };

  private readonly maximumHealth = 256;
  private readonly maximumMana = 70;
  private readonly maximumStamina = 120;
  private readonly initialCurrency = 75;
  private readonly movementScale = 1.50;
  private readonly damagePerCycle = 3;
  private readonly healingPerCycle = 6;
  private readonly manaCost = 2;
  private readonly manaRecovery = 3;
  private readonly staminaCost = 4;
  private readonly staminaRecovery = 6;
  private readonly rewardPerDefeat = 12;
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
    state.inventory['relic_tower_07'] = 0;
    state.flags['scenario_0297_complete'] = false;
    state.metrics['scenarioIndex'] = 297;
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
      const angle = random.angle() + tick * 0.071 + 20 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0297',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 296) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0297' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0297' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0297' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0297' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0297' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0297' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0297' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0297' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0297' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0297' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0297' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_07', amount: 1, label: 'item-0297' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0297',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0297' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0297_complete',
      value: 1,
      label: 'complete-0297',
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
      requiredFlag: 'scenario_0297_complete',
    };
  }
}

export class GeneratedScenario0298 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0298',
    title: 'Progression Ranger 0298',
    description: 'Cenário determinístico 0298 de progression para ranger em tower.',
    category: 'progression',
    difficulty: 8,
    durationTicks: 84,
    snapshotInterval: 9,
    tags: ['generated', 'progression', 'ranger', 'tower', 'matrix-12'],
    version: 1,
  };

  private readonly maximumHealth = 160;
  private readonly maximumMana = 75;
  private readonly maximumStamina = 130;
  private readonly initialCurrency = 25;
  private readonly movementScale = 1.57;
  private readonly damagePerCycle = 4;
  private readonly healingPerCycle = 5;
  private readonly manaCost = 3;
  private readonly manaRecovery = 4;
  private readonly staminaCost = 5;
  private readonly staminaRecovery = 7;
  private readonly rewardPerDefeat = 4;
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
    state.inventory['relic_tower_08'] = 0;
    state.flags['scenario_0298_complete'] = false;
    state.metrics['scenarioIndex'] = 298;
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
      const angle = random.angle() + tick * 0.071 + 21 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0298',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 297) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0298' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0298' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0298' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0298' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0298' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0298' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0298' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0298' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0298' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0298' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0298' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_08', amount: 1, label: 'item-0298' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0298',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0298' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0298_complete',
      value: 1,
      label: 'complete-0298',
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
      requiredFlag: 'scenario_0298_complete',
    };
  }
}

export class GeneratedScenario0299 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0299',
    title: 'Resources Ranger 0299',
    description: 'Cenário determinístico 0299 de resources para ranger em tower.',
    category: 'resources',
    difficulty: 9,
    durationTicks: 88,
    snapshotInterval: 10,
    tags: ['generated', 'resources', 'ranger', 'tower', 'matrix-13'],
    version: 1,
  };

  private readonly maximumHealth = 172;
  private readonly maximumMana = 80;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 30;
  private readonly movementScale = 1.64;
  private readonly damagePerCycle = 5;
  private readonly healingPerCycle = 7;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 6;
  private readonly staminaRecovery = 8;
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
    state.inventory['relic_tower_09'] = 0;
    state.flags['scenario_0299_complete'] = false;
    state.metrics['scenarioIndex'] = 299;
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
      const angle = random.angle() + tick * 0.071 + 22 * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-0299',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 298) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0299' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0299' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0299' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0299' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0299' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0299' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0299' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0299' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0299' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0299' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0299' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_09', amount: 1, label: 'item-0299' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0299',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0299' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0299_complete',
      value: 1,
      label: 'complete-0299',
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
      requiredFlag: 'scenario_0299_complete',
    };
  }
}

export class GeneratedScenario0300 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0300',
    title: 'Stress Ranger 0300',
    description: 'Cenário determinístico 0300 de stress para ranger em tower.',
    category: 'stress',
    difficulty: 10,
    durationTicks: 92,
    snapshotInterval: 11,
    tags: ['generated', 'stress', 'ranger', 'tower', 'matrix-14'],
    version: 1,
  };

  private readonly maximumHealth = 184;
  private readonly maximumMana = 85;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 35;
  private readonly movementScale = 0.80;
  private readonly damagePerCycle = 6;
  private readonly healingPerCycle = 9;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 7;
  private readonly staminaRecovery = 9;
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
    state.inventory['relic_tower_10'] = 0;
    state.flags['scenario_0300_complete'] = false;
    state.metrics['scenarioIndex'] = 300;
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
        label: 'movement-0300',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 299) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0300' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0300' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0300' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0300' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0300' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0300' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0300' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0300' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0300' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0300' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0300' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_tower_10', amount: 1, label: 'item-0300' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0300',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0300' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0300_complete',
      value: 1,
      label: 'complete-0300',
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
      requiredFlag: 'scenario_0300_complete',
    };
  }
}
