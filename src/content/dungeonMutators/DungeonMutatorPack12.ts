// src/content/dungeonMutators/DungeonMutatorPack12.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_12: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_12_1',
    name: 'DungeonMutator 12.1',
    flavor: 'Auto-generated dungeonmutator entry number 5107 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack12', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_12' },
  },
  {
    id: 'dungeonMutators_12_2',
    name: 'DungeonMutator 12.2',
    flavor: 'Auto-generated dungeonmutator entry number 5108 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack12', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_12' },
  },
  {
    id: 'dungeonMutators_12_3',
    name: 'DungeonMutator 12.3',
    flavor: 'Auto-generated dungeonmutator entry number 5109 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack12', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_12' },
  },
  {
    id: 'dungeonMutators_12_4',
    name: 'DungeonMutator 12.4',
    flavor: 'Auto-generated dungeonmutator entry number 5110 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack12', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_12' },
  },
  {
    id: 'dungeonMutators_12_5',
    name: 'DungeonMutator 12.5',
    flavor: 'Auto-generated dungeonmutator entry number 5111 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack12', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_12' },
  },
  {
    id: 'dungeonMutators_12_6',
    name: 'DungeonMutator 12.6',
    flavor: 'Auto-generated dungeonmutator entry number 5112 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack12', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_12' },
  },
];

export function getDungeonMutatorEntry12(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_12.find(e => e.id === id);
}
