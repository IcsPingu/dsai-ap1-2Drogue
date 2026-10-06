import { EditorToolOperation } from '../types';
import * as set1 from './toolset_01';
import * as set2 from './toolset_02';
import * as set3 from './toolset_03';
import * as set4 from './toolset_04';
import * as set5 from './toolset_05';
import * as set6 from './toolset_06';
import * as set7 from './toolset_07';
import * as set8 from './toolset_08';
import * as set9 from './toolset_09';
import * as set10 from './toolset_10';
import * as set11 from './toolset_11';
import * as set12 from './toolset_12';
import * as set13 from './toolset_13';
import * as set14 from './toolset_14';
import * as set15 from './toolset_15';
import * as set16 from './toolset_16';
import * as set17 from './toolset_17';
import * as set18 from './toolset_18';
import * as set19 from './toolset_19';
import * as set20 from './toolset_20';

export * from './toolset_01';
export * from './toolset_02';
export * from './toolset_03';
export * from './toolset_04';
export * from './toolset_05';
export * from './toolset_06';
export * from './toolset_07';
export * from './toolset_08';
export * from './toolset_09';
export * from './toolset_10';
export * from './toolset_11';
export * from './toolset_12';
export * from './toolset_13';
export * from './toolset_14';
export * from './toolset_15';
export * from './toolset_16';
export * from './toolset_17';
export * from './toolset_18';
export * from './toolset_19';
export * from './toolset_20';
export * from './runtime';

const generatedConstructors = [
  ...Object.values(set1),
  ...Object.values(set2),
  ...Object.values(set3),
  ...Object.values(set4),
  ...Object.values(set5),
  ...Object.values(set6),
  ...Object.values(set7),
  ...Object.values(set8),
  ...Object.values(set9),
  ...Object.values(set10),
  ...Object.values(set11),
  ...Object.values(set12),
  ...Object.values(set13),
  ...Object.values(set14),
  ...Object.values(set15),
  ...Object.values(set16),
  ...Object.values(set17),
  ...Object.values(set18),
  ...Object.values(set19),
  ...Object.values(set20),
].filter((value): value is new () => EditorToolOperation => typeof value === 'function');

export const GENERATED_EDITOR_TOOLS: readonly EditorToolOperation[] = generatedConstructors.map(
  ToolConstructor => new ToolConstructor(),
);

export const GENERATED_EDITOR_TOOL_COUNT = GENERATED_EDITOR_TOOLS.length;
