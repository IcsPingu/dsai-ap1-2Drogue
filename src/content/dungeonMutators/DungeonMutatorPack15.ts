// src/content/dungeonMutators/DungeonMutatorPack15.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_15: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_15_1',
    name: 'DungeonMutator 15.1',
    flavor: 'Auto-generated dungeonmutator entry number 5125 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack15', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dungeonMutators_15_2',
    name: 'DungeonMutator 15.2',
    flavor: 'Auto-generated dungeonmutator entry number 5126 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack15', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dungeonMutators_15_3',
    name: 'DungeonMutator 15.3',
    flavor: 'Auto-generated dungeonmutator entry number 5127 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack15', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dungeonMutators_15_4',
    name: 'DungeonMutator 15.4',
    flavor: 'Auto-generated dungeonmutator entry number 5128 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack15', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dungeonMutators_15_5',
    name: 'DungeonMutator 15.5',
    flavor: 'Auto-generated dungeonmutator entry number 5129 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack15', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dungeonMutators_15_6',
    name: 'DungeonMutator 15.6',
    flavor: 'Auto-generated dungeonmutator entry number 5130 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack15', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_15' },
  },
];

export function getDungeonMutatorEntry15(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_15.find(e => e.id === id);
}
