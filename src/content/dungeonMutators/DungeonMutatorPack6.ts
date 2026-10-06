// src/content/dungeonMutators/DungeonMutatorPack6.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_6: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_6_1',
    name: 'DungeonMutator 6.1',
    flavor: 'Auto-generated dungeonmutator entry number 5071 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack6', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
  {
    id: 'dungeonMutators_6_2',
    name: 'DungeonMutator 6.2',
    flavor: 'Auto-generated dungeonmutator entry number 5072 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack6', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_6' },
  },
  {
    id: 'dungeonMutators_6_3',
    name: 'DungeonMutator 6.3',
    flavor: 'Auto-generated dungeonmutator entry number 5073 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack6', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_6' },
  },
  {
    id: 'dungeonMutators_6_4',
    name: 'DungeonMutator 6.4',
    flavor: 'Auto-generated dungeonmutator entry number 5074 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack6', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_6' },
  },
  {
    id: 'dungeonMutators_6_5',
    name: 'DungeonMutator 6.5',
    flavor: 'Auto-generated dungeonmutator entry number 5075 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack6', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_6' },
  },
  {
    id: 'dungeonMutators_6_6',
    name: 'DungeonMutator 6.6',
    flavor: 'Auto-generated dungeonmutator entry number 5076 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack6', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
];

export function getDungeonMutatorEntry6(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_6.find(e => e.id === id);
}
