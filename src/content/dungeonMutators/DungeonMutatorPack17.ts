// src/content/dungeonMutators/DungeonMutatorPack17.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_17: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_17_1',
    name: 'DungeonMutator 17.1',
    flavor: 'Auto-generated dungeonmutator entry number 5137 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack17', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dungeonMutators_17_2',
    name: 'DungeonMutator 17.2',
    flavor: 'Auto-generated dungeonmutator entry number 5138 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack17', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dungeonMutators_17_3',
    name: 'DungeonMutator 17.3',
    flavor: 'Auto-generated dungeonmutator entry number 5139 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack17', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dungeonMutators_17_4',
    name: 'DungeonMutator 17.4',
    flavor: 'Auto-generated dungeonmutator entry number 5140 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack17', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dungeonMutators_17_5',
    name: 'DungeonMutator 17.5',
    flavor: 'Auto-generated dungeonmutator entry number 5141 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack17', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dungeonMutators_17_6',
    name: 'DungeonMutator 17.6',
    flavor: 'Auto-generated dungeonmutator entry number 5142 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack17', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
];

export function getDungeonMutatorEntry17(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_17.find(e => e.id === id);
}
