// src/content/dungeonMutators/DungeonMutatorPack3.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_3: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_3_1',
    name: 'DungeonMutator 3.1',
    flavor: 'Auto-generated dungeonmutator entry number 5053 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack3', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_3' },
  },
  {
    id: 'dungeonMutators_3_2',
    name: 'DungeonMutator 3.2',
    flavor: 'Auto-generated dungeonmutator entry number 5054 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack3', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_3' },
  },
  {
    id: 'dungeonMutators_3_3',
    name: 'DungeonMutator 3.3',
    flavor: 'Auto-generated dungeonmutator entry number 5055 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack3', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_3' },
  },
  {
    id: 'dungeonMutators_3_4',
    name: 'DungeonMutator 3.4',
    flavor: 'Auto-generated dungeonmutator entry number 5056 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack3', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_3' },
  },
  {
    id: 'dungeonMutators_3_5',
    name: 'DungeonMutator 3.5',
    flavor: 'Auto-generated dungeonmutator entry number 5057 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack3', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_3' },
  },
  {
    id: 'dungeonMutators_3_6',
    name: 'DungeonMutator 3.6',
    flavor: 'Auto-generated dungeonmutator entry number 5058 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack3', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_3' },
  },
];

export function getDungeonMutatorEntry3(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_3.find(e => e.id === id);
}
