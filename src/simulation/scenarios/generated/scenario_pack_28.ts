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

export class GeneratedScenario0271 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0271',
    title: 'Combat Guardian 0271',
    description: 'Cenário determinístico 0271 de combat para guardian em inferno.',
    category: 'combat',
    difficulty: 1,
    durationTicks: 72,
    snapshotInterval: 10,
    tags: ['generated', 'combat', 'guardian', 'inferno', 'matrix-0'],
    version: 1,
  };

  private readonly maximumHealth = 160;
  private readonly maximumMana = 100;
  private readonly maximumStamina = 100;
  private readonly initialCurrency = 55;
  private readonly movementScale = 1.50;
  private readonly damagePerCycle = 2;
  private readonly healingPerCycle = 3;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 3;
  private readonly staminaRecovery = 5;
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
    state.inventory['relic_inferno_15'] = 0;
    state.flags['scenario_0271_complete'] = false;
    state.metrics['scenarioIndex'] = 271;
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
        label: 'movement-0271',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 270) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0271' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0271' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0271' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0271' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0271' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0271' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0271' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0271' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0271' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0271' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0271' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_15', amount: 1, label: 'item-0271' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0271',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0271' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0271_complete',
      value: 1,
      label: 'complete-0271',
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
      requiredFlag: 'scenario_0271_complete',
    };
  }
}

export class GeneratedScenario0272 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0272',
    title: 'Navigation Guardian 0272',
    description: 'Cenário determinístico 0272 de navigation para guardian em inferno.',
    category: 'navigation',
    difficulty: 2,
    durationTicks: 76,
    snapshotInterval: 11,
    tags: ['generated', 'navigation', 'guardian', 'inferno', 'matrix-1'],
    version: 1,
  };

  private readonly maximumHealth = 172;
  private readonly maximumMana = 105;
  private readonly maximumStamina = 110;
  private readonly initialCurrency = 60;
  private readonly movementScale = 1.57;
  private readonly damagePerCycle = 3;
  private readonly healingPerCycle = 5;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 4;
  private readonly staminaRecovery = 6;
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
    state.inventory['relic_inferno_16'] = 0;
    state.flags['scenario_0272_complete'] = false;
    state.metrics['scenarioIndex'] = 272;
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
        label: 'movement-0272',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 271) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0272' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0272' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0272' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0272' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0272' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0272' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0272' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0272' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0272' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0272' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0272' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_16', amount: 1, label: 'item-0272' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0272',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0272' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0272_complete',
      value: 1,
      label: 'complete-0272',
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
      requiredFlag: 'scenario_0272_complete',
    };
  }
}

export class GeneratedScenario0273 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0273',
    title: 'Economy Guardian 0273',
    description: 'Cenário determinístico 0273 de economy para guardian em inferno.',
    category: 'economy',
    difficulty: 3,
    durationTicks: 80,
    snapshotInterval: 12,
    tags: ['generated', 'economy', 'guardian', 'inferno', 'matrix-2'],
    version: 1,
  };

  private readonly maximumHealth = 184;
  private readonly maximumMana = 70;
  private readonly maximumStamina = 120;
  private readonly initialCurrency = 65;
  private readonly movementScale = 1.64;
  private readonly damagePerCycle = 4;
  private readonly healingPerCycle = 7;
  private readonly manaCost = 2;
  private readonly manaRecovery = 3;
  private readonly staminaCost = 5;
  private readonly staminaRecovery = 7;
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
    state.inventory['relic_inferno_00'] = 0;
    state.flags['scenario_0273_complete'] = false;
    state.metrics['scenarioIndex'] = 273;
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
        label: 'movement-0273',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 272) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0273' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0273' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0273' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0273' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0273' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0273' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0273' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0273' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0273' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0273' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0273' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_00', amount: 1, label: 'item-0273' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0273',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0273' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0273_complete',
      value: 1,
      label: 'complete-0273',
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
      requiredFlag: 'scenario_0273_complete',
    };
  }
}

export class GeneratedScenario0274 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0274',
    title: 'Progression Guardian 0274',
    description: 'Cenário determinístico 0274 de progression para guardian em inferno.',
    category: 'progression',
    difficulty: 4,
    durationTicks: 84,
    snapshotInterval: 6,
    tags: ['generated', 'progression', 'guardian', 'inferno', 'matrix-3'],
    version: 1,
  };

  private readonly maximumHealth = 196;
  private readonly maximumMana = 75;
  private readonly maximumStamina = 130;
  private readonly initialCurrency = 70;
  private readonly movementScale = 0.80;
  private readonly damagePerCycle = 5;
  private readonly healingPerCycle = 6;
  private readonly manaCost = 3;
  private readonly manaRecovery = 4;
  private readonly staminaCost = 6;
  private readonly staminaRecovery = 8;
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
    state.inventory['relic_inferno_01'] = 0;
    state.flags['scenario_0274_complete'] = false;
    state.metrics['scenarioIndex'] = 274;
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
        label: 'movement-0274',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 273) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0274' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0274' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0274' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0274' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0274' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0274' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0274' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0274' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0274' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0274' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0274' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_01', amount: 1, label: 'item-0274' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0274',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0274' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0274_complete',
      value: 1,
      label: 'complete-0274',
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
      requiredFlag: 'scenario_0274_complete',
    };
  }
}

export class GeneratedScenario0275 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0275',
    title: 'Resources Guardian 0275',
    description: 'Cenário determinístico 0275 de resources para guardian em inferno.',
    category: 'resources',
    difficulty: 5,
    durationTicks: 88,
    snapshotInterval: 7,
    tags: ['generated', 'resources', 'guardian', 'inferno', 'matrix-4'],
    version: 1,
  };

  private readonly maximumHealth = 208;
  private readonly maximumMana = 80;
  private readonly maximumStamina = 140;
  private readonly initialCurrency = 75;
  private readonly movementScale = 0.87;
  private readonly damagePerCycle = 6;
  private readonly healingPerCycle = 8;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 7;
  private readonly staminaRecovery = 9;
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
    state.inventory['relic_inferno_02'] = 0;
    state.flags['scenario_0275_complete'] = false;
    state.metrics['scenarioIndex'] = 275;
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
        label: 'movement-0275',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 274) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0275' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0275' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0275' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0275' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0275' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0275' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0275' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0275' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0275' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0275' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0275' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_02', amount: 1, label: 'item-0275' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0275',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0275' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0275_complete',
      value: 1,
      label: 'complete-0275',
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
      requiredFlag: 'scenario_0275_complete',
    };
  }
}

export class GeneratedScenario0276 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0276',
    title: 'Stress Guardian 0276',
    description: 'Cenário determinístico 0276 de stress para guardian em inferno.',
    category: 'stress',
    difficulty: 6,
    durationTicks: 92,
    snapshotInterval: 8,
    tags: ['generated', 'stress', 'guardian', 'inferno', 'matrix-5'],
    version: 1,
  };

  private readonly maximumHealth = 220;
  private readonly maximumMana = 85;
  private readonly maximumStamina = 150;
  private readonly initialCurrency = 25;
  private readonly movementScale = 0.94;
  private readonly damagePerCycle = 2;
  private readonly healingPerCycle = 5;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 3;
  private readonly staminaRecovery = 5;
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
    state.inventory['relic_inferno_03'] = 0;
    state.flags['scenario_0276_complete'] = false;
    state.metrics['scenarioIndex'] = 276;
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
        label: 'movement-0276',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 275) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0276' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0276' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0276' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0276' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0276' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0276' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0276' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0276' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0276' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0276' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0276' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_03', amount: 1, label: 'item-0276' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0276',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0276' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0276_complete',
      value: 1,
      label: 'complete-0276',
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
      requiredFlag: 'scenario_0276_complete',
    };
  }
}

export class GeneratedScenario0277 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0277',
    title: 'Combat Rogue 0277',
    description: 'Cenário determinístico 0277 de combat para rogue em inferno.',
    category: 'combat',
    difficulty: 7,
    durationTicks: 48,
    snapshotInterval: 9,
    tags: ['generated', 'combat', 'rogue', 'inferno', 'matrix-6'],
    version: 1,
  };

  private readonly maximumHealth = 232;
  private readonly maximumMana = 90;
  private readonly maximumStamina = 100;
  private readonly initialCurrency = 30;
  private readonly movementScale = 1.01;
  private readonly damagePerCycle = 3;
  private readonly healingPerCycle = 4;
  private readonly manaCost = 2;
  private readonly manaRecovery = 3;
  private readonly staminaCost = 4;
  private readonly staminaRecovery = 6;
  private readonly rewardPerDefeat = 10;
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
    state.inventory['relic_inferno_04'] = 0;
    state.flags['scenario_0277_complete'] = false;
    state.metrics['scenarioIndex'] = 277;
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
        label: 'movement-0277',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 276) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0277' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0277' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0277' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0277' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0277' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0277' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0277' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0277' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0277' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0277' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0277' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_04', amount: 1, label: 'item-0277' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0277',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0277' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0277_complete',
      value: 1,
      label: 'complete-0277',
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
      requiredFlag: 'scenario_0277_complete',
    };
  }
}

export class GeneratedScenario0278 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0278',
    title: 'Navigation Rogue 0278',
    description: 'Cenário determinístico 0278 de navigation para rogue em inferno.',
    category: 'navigation',
    difficulty: 8,
    durationTicks: 52,
    snapshotInterval: 10,
    tags: ['generated', 'navigation', 'rogue', 'inferno', 'matrix-7'],
    version: 1,
  };

  private readonly maximumHealth = 244;
  private readonly maximumMana = 95;
  private readonly maximumStamina = 110;
  private readonly initialCurrency = 35;
  private readonly movementScale = 1.08;
  private readonly damagePerCycle = 4;
  private readonly healingPerCycle = 6;
  private readonly manaCost = 3;
  private readonly manaRecovery = 4;
  private readonly staminaCost = 5;
  private readonly staminaRecovery = 7;
  private readonly rewardPerDefeat = 11;
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
    state.inventory['relic_inferno_05'] = 0;
    state.flags['scenario_0278_complete'] = false;
    state.metrics['scenarioIndex'] = 278;
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
        label: 'movement-0278',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 277) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0278' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0278' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0278' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0278' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0278' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0278' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0278' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0278' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0278' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0278' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0278' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_05', amount: 1, label: 'item-0278' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0278',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0278' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0278_complete',
      value: 1,
      label: 'complete-0278',
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
      requiredFlag: 'scenario_0278_complete',
    };
  }
}

export class GeneratedScenario0279 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0279',
    title: 'Economy Rogue 0279',
    description: 'Cenário determinístico 0279 de economy para rogue em inferno.',
    category: 'economy',
    difficulty: 9,
    durationTicks: 56,
    snapshotInterval: 11,
    tags: ['generated', 'economy', 'rogue', 'inferno', 'matrix-8'],
    version: 1,
  };

  private readonly maximumHealth = 256;
  private readonly maximumMana = 100;
  private readonly maximumStamina = 120;
  private readonly initialCurrency = 40;
  private readonly movementScale = 1.15;
  private readonly damagePerCycle = 5;
  private readonly healingPerCycle = 8;
  private readonly manaCost = 4;
  private readonly manaRecovery = 5;
  private readonly staminaCost = 6;
  private readonly staminaRecovery = 8;
  private readonly rewardPerDefeat = 12;
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
    state.inventory['relic_inferno_06'] = 0;
    state.flags['scenario_0279_complete'] = false;
    state.metrics['scenarioIndex'] = 279;
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
        label: 'movement-0279',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 278) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0279' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0279' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0279' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0279' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0279' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0279' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0279' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0279' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0279' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0279' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0279' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_06', amount: 1, label: 'item-0279' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0279',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0279' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0279_complete',
      value: 1,
      label: 'complete-0279',
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
      requiredFlag: 'scenario_0279_complete',
    };
  }
}

export class GeneratedScenario0280 implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-0280',
    title: 'Progression Rogue 0280',
    description: 'Cenário determinístico 0280 de progression para rogue em inferno.',
    category: 'progression',
    difficulty: 10,
    durationTicks: 60,
    snapshotInterval: 12,
    tags: ['generated', 'progression', 'rogue', 'inferno', 'matrix-9'],
    version: 1,
  };

  private readonly maximumHealth = 160;
  private readonly maximumMana = 105;
  private readonly maximumStamina = 130;
  private readonly initialCurrency = 45;
  private readonly movementScale = 1.22;
  private readonly damagePerCycle = 6;
  private readonly healingPerCycle = 7;
  private readonly manaCost = 5;
  private readonly manaRecovery = 6;
  private readonly staminaCost = 7;
  private readonly staminaRecovery = 9;
  private readonly rewardPerDefeat = 4;
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
    state.inventory['relic_inferno_07'] = 0;
    state.flags['scenario_0280_complete'] = false;
    state.metrics['scenarioIndex'] = 280;
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
        label: 'movement-0280',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + 279) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-0280' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-0280' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-0280' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-0280' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-0280' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-0280' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-0280' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-0280' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-0280' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-0280' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-0280' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: 'relic_inferno_07', amount: 1, label: 'item-0280' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-0280',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-0280' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: 'scenario_0280_complete',
      value: 1,
      label: 'complete-0280',
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
      requiredFlag: 'scenario_0280_complete',
    };
  }
}
