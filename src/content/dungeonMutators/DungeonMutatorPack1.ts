// src/content/dungeonMutators/DungeonMutatorPack1.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_1: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_1_1',
    name: 'DungeonMutator 1.1',
    flavor: 'Auto-generated dungeonmutator entry number 5041 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dungeonMutators_1_2',
    name: 'DungeonMutator 1.2',
    flavor: 'Auto-generated dungeonmutator entry number 5042 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dungeonMutators_1_3',
    name: 'DungeonMutator 1.3',
    flavor: 'Auto-generated dungeonmutator entry number 5043 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dungeonMutators_1_4',
    name: 'DungeonMutator 1.4',
    flavor: 'Auto-generated dungeonmutator entry number 5044 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dungeonMutators_1_5',
    name: 'DungeonMutator 1.5',
    flavor: 'Auto-generated dungeonmutator entry number 5045 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dungeonMutators_1_6',
    name: 'DungeonMutator 1.6',
    flavor: 'Auto-generated dungeonmutator entry number 5046 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getDungeonMutatorEntry1(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_1.find(e => e.id === id);
}
