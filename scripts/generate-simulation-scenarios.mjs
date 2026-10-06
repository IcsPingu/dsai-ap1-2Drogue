import { mkdir, rm, writeFile } from 'node:fs/promises';

const output = new URL('../src/simulation/scenarios/generated/', import.meta.url);
const scenarioCount = 300;
const scenariosPerModule = 10;
const categories = ['combat', 'navigation', 'economy', 'progression', 'resources', 'stress'];
const archetypes = ['duelist', 'ranger', 'mage', 'guardian', 'rogue', 'summoner'];
const environments = ['cathedral', 'inferno', 'tower', 'streets', 'crypt', 'void'];

function titleCase(value) {
  return value.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join(' ');
}

function classSource(index) {
  const number = index + 1;
  const suffix = String(number).padStart(4, '0');
  const category = categories[index % categories.length];
  const archetype = archetypes[Math.floor(index / categories.length) % archetypes.length];
  const environment = environments[Math.floor(index / (categories.length * archetypes.length)) % environments.length];
  const difficulty = index % 10 + 1;
  const duration = 48 + (index % 12) * 4;
  const snapshotInterval = 6 + index % 7;
  const maximumHealth = 160 + index % 9 * 12;
  const maximumMana = 70 + index % 8 * 5;
  const maximumStamina = 100 + index % 6 * 10;
  const initialCurrency = 25 + index % 11 * 5;
  const movementScale = (0.8 + index % 13 * 0.07).toFixed(2);
  const damage = 2 + index % 5;
  const healing = damage + 1 + index % 3;
  const manaCost = 2 + index % 4;
  const manaRecovery = manaCost + 1;
  const staminaCost = 3 + index % 5;
  const staminaRecovery = staminaCost + 2;
  const reward = 4 + index % 9;
  const experience = 6 + index % 12;
  const itemKey = `relic_${environment}_${String(index % 17).padStart(2, '0')}`;
  const completionFlag = `scenario_${suffix}_complete`;

  return `export class GeneratedScenario${suffix} implements SimulationScenario {
  public readonly descriptor: ScenarioDescriptor = {
    id: 'generated-scenario-${suffix}',
    title: '${titleCase(category)} ${titleCase(archetype)} ${suffix}',
    description: 'Cenário determinístico ${suffix} de ${category} para ${archetype} em ${environment}.',
    category: '${category}',
    difficulty: ${difficulty},
    durationTicks: ${duration},
    snapshotInterval: ${snapshotInterval},
    tags: ['generated', '${category}', '${archetype}', '${environment}', 'matrix-${index % 15}'],
    version: 1,
  };

  private readonly maximumHealth = ${maximumHealth};
  private readonly maximumMana = ${maximumMana};
  private readonly maximumStamina = ${maximumStamina};
  private readonly initialCurrency = ${initialCurrency};
  private readonly movementScale = ${movementScale};
  private readonly damagePerCycle = ${damage};
  private readonly healingPerCycle = ${healing};
  private readonly manaCost = ${manaCost};
  private readonly manaRecovery = ${manaRecovery};
  private readonly staminaCost = ${staminaCost};
  private readonly staminaRecovery = ${staminaRecovery};
  private readonly rewardPerDefeat = ${reward};
  private readonly experiencePerDefeat = ${experience};

  public createInitialState(): ScenarioState {
    const state = createDefaultScenarioState();
    state.maximumHealth = this.maximumHealth;
    state.health = this.maximumHealth;
    state.maximumMana = this.maximumMana;
    state.mana = this.maximumMana;
    state.maximumStamina = this.maximumStamina;
    state.stamina = this.maximumStamina;
    state.currency = this.initialCurrency;
    state.inventory['${itemKey}'] = 0;
    state.flags['${completionFlag}'] = false;
    state.metrics['scenarioIndex'] = ${number};
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
      const angle = random.angle() + tick * 0.071 + ${index % 23} * 0.013;
      const stride = this.movementScale * (0.75 + random.next() * 0.5);
      push(tick, createScenarioAction('move', {
        x: Math.cos(angle) * stride,
        y: Math.sin(angle) * stride,
        label: 'movement-${suffix}',
      }));
      if (tick % 4 === 0) {
        const groupSize = 1 + (tick + ${index}) % 3;
        push(tick, createScenarioAction('spawnEnemy', { amount: groupSize, label: 'spawn-${suffix}' }));
        push(tick, createScenarioAction('advanceCombo', { amount: 1, label: 'combo-${suffix}' }));
        push(tick, createScenarioAction('defeatEnemy', { amount: groupSize, label: 'defeat-${suffix}' }));
        push(tick, createScenarioAction('grantCurrency', { amount: this.rewardPerDefeat * groupSize, label: 'reward-${suffix}' }));
        push(tick, createScenarioAction('grantExperience', { amount: this.experiencePerDefeat * groupSize, label: 'experience-${suffix}' }));
      }
      if (tick % 5 === 0) {
        push(tick, createScenarioAction('spendMana', { amount: this.manaCost, label: 'mana-spend-${suffix}' }));
        push(tick, createScenarioAction('restoreMana', { amount: this.manaRecovery, label: 'mana-restore-${suffix}' }));
      }
      if (tick % 6 === 0) {
        push(tick, createScenarioAction('spendStamina', { amount: this.staminaCost, label: 'stamina-spend-${suffix}' }));
        push(tick, createScenarioAction('restoreStamina', { amount: this.staminaRecovery, label: 'stamina-restore-${suffix}' }));
      }
      if (tick % 7 === 0) {
        push(tick, createScenarioAction('damage', { amount: this.damagePerCycle, label: 'damage-${suffix}' }));
        push(tick, createScenarioAction('heal', { amount: this.healingPerCycle, label: 'healing-${suffix}' }));
      }
      if (tick % 11 === 0) {
        push(tick, createScenarioAction('addItem', { key: '${itemKey}', amount: 1, label: 'item-${suffix}' }));
      }
      if (tick % 13 === 0) {
        push(tick, createScenarioAction('sampleMetric', {
          key: 'pressure',
          value: Math.round(random.float(0, 1000)) / 10,
          label: 'metric-${suffix}',
        }));
      }
      if (tick % 17 === 0) {
        push(tick, createScenarioAction('breakCombo', { label: 'combo-break-${suffix}' }));
      }
    }
    push(this.descriptor.durationTicks, createScenarioAction('setFlag', {
      key: '${completionFlag}',
      value: 1,
      label: 'complete-${suffix}',
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
      requiredFlag: '${completionFlag}',
    };
  }
}`;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const modules = [];
for (let offset = 0; offset < scenarioCount; offset += scenariosPerModule) {
  const moduleName = `scenario_pack_${String(offset / scenariosPerModule + 1).padStart(2, '0')}`;
  modules.push(moduleName);
  const header = `import { DeterministicRandom } from '../../core/DeterministicRandom';
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
`;
  const classes = Array.from({ length: scenariosPerModule }, (_, local) => classSource(offset + local)).join('\n\n');
  await writeFile(new URL(`${moduleName}.ts`, output), `${header}\n${classes}\n`, 'utf8');
}

const imports = modules.map((name, index) => `import * as pack${index + 1} from './${name}';`).join('\n');
const exports = modules.map(name => `export * from './${name}';`).join('\n');
const values = modules.map((_, index) => `  ...Object.values(pack${index + 1}),`).join('\n');
const indexSource = `import { SimulationScenario } from '../types';
${imports}

${exports}

const constructors = [
${values}
].filter(value => typeof value === 'function') as unknown as Array<new () => SimulationScenario>;

export const GENERATED_SIMULATION_SCENARIOS: readonly SimulationScenario[] = constructors.map(
  ScenarioConstructor => new ScenarioConstructor(),
);

export const GENERATED_SIMULATION_SCENARIO_COUNT = GENERATED_SIMULATION_SCENARIOS.length;
`;
await writeFile(new URL('index.ts', output), indexSource, 'utf8');

console.log(`Generated ${scenarioCount} deterministic simulation scenarios in ${modules.length} modules.`);
