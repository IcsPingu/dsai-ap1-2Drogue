// src/content/dungeonMutators/DungeonMutatorPack13.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_13: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_13_1',
    name: 'DungeonMutator 13.1',
    flavor: 'Auto-generated dungeonmutator entry number 5113 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dungeonMutators_13_2',
    name: 'DungeonMutator 13.2',
    flavor: 'Auto-generated dungeonmutator entry number 5114 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dungeonMutators_13_3',
    name: 'DungeonMutator 13.3',
    flavor: 'Auto-generated dungeonmutator entry number 5115 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dungeonMutators_13_4',
    name: 'DungeonMutator 13.4',
    flavor: 'Auto-generated dungeonmutator entry number 5116 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dungeonMutators_13_5',
    name: 'DungeonMutator 13.5',
    flavor: 'Auto-generated dungeonmutator entry number 5117 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dungeonMutators_13_6',
    name: 'DungeonMutator 13.6',
    flavor: 'Auto-generated dungeonmutator entry number 5118 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getDungeonMutatorEntry13(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_13.find(e => e.id === id);
}
