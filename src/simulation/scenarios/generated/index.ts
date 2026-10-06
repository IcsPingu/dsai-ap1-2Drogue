import { SimulationScenario } from '../types';
import * as pack1 from './scenario_pack_01';
import * as pack2 from './scenario_pack_02';
import * as pack3 from './scenario_pack_03';
import * as pack4 from './scenario_pack_04';
import * as pack5 from './scenario_pack_05';
import * as pack6 from './scenario_pack_06';
import * as pack7 from './scenario_pack_07';
import * as pack8 from './scenario_pack_08';
import * as pack9 from './scenario_pack_09';
import * as pack10 from './scenario_pack_10';
import * as pack11 from './scenario_pack_11';
import * as pack12 from './scenario_pack_12';
import * as pack13 from './scenario_pack_13';
import * as pack14 from './scenario_pack_14';
import * as pack15 from './scenario_pack_15';
import * as pack16 from './scenario_pack_16';
import * as pack17 from './scenario_pack_17';
import * as pack18 from './scenario_pack_18';
import * as pack19 from './scenario_pack_19';
import * as pack20 from './scenario_pack_20';
import * as pack21 from './scenario_pack_21';
import * as pack22 from './scenario_pack_22';
import * as pack23 from './scenario_pack_23';
import * as pack24 from './scenario_pack_24';
import * as pack25 from './scenario_pack_25';
import * as pack26 from './scenario_pack_26';
import * as pack27 from './scenario_pack_27';
import * as pack28 from './scenario_pack_28';
import * as pack29 from './scenario_pack_29';
import * as pack30 from './scenario_pack_30';

export * from './scenario_pack_01';
export * from './scenario_pack_02';
export * from './scenario_pack_03';
export * from './scenario_pack_04';
export * from './scenario_pack_05';
export * from './scenario_pack_06';
export * from './scenario_pack_07';
export * from './scenario_pack_08';
export * from './scenario_pack_09';
export * from './scenario_pack_10';
export * from './scenario_pack_11';
export * from './scenario_pack_12';
export * from './scenario_pack_13';
export * from './scenario_pack_14';
export * from './scenario_pack_15';
export * from './scenario_pack_16';
export * from './scenario_pack_17';
export * from './scenario_pack_18';
export * from './scenario_pack_19';
export * from './scenario_pack_20';
export * from './scenario_pack_21';
export * from './scenario_pack_22';
export * from './scenario_pack_23';
export * from './scenario_pack_24';
export * from './scenario_pack_25';
export * from './scenario_pack_26';
export * from './scenario_pack_27';
export * from './scenario_pack_28';
export * from './scenario_pack_29';
export * from './scenario_pack_30';

const constructors = [
  ...Object.values(pack1),
  ...Object.values(pack2),
  ...Object.values(pack3),
  ...Object.values(pack4),
  ...Object.values(pack5),
  ...Object.values(pack6),
  ...Object.values(pack7),
  ...Object.values(pack8),
  ...Object.values(pack9),
  ...Object.values(pack10),
  ...Object.values(pack11),
  ...Object.values(pack12),
  ...Object.values(pack13),
  ...Object.values(pack14),
  ...Object.values(pack15),
  ...Object.values(pack16),
  ...Object.values(pack17),
  ...Object.values(pack18),
  ...Object.values(pack19),
  ...Object.values(pack20),
  ...Object.values(pack21),
  ...Object.values(pack22),
  ...Object.values(pack23),
  ...Object.values(pack24),
  ...Object.values(pack25),
  ...Object.values(pack26),
  ...Object.values(pack27),
  ...Object.values(pack28),
  ...Object.values(pack29),
  ...Object.values(pack30),
].filter(value => typeof value === 'function') as unknown as Array<new () => SimulationScenario>;

export const GENERATED_SIMULATION_SCENARIOS: readonly SimulationScenario[] = constructors.map(
  ScenarioConstructor => new ScenarioConstructor(),
);

export const GENERATED_SIMULATION_SCENARIO_COUNT = GENERATED_SIMULATION_SCENARIOS.length;
