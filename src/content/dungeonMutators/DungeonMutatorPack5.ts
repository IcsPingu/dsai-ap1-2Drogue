// src/content/dungeonMutators/DungeonMutatorPack5.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_5: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_5_1',
    name: 'DungeonMutator 5.1',
    flavor: 'Auto-generated dungeonmutator entry number 5065 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dungeonMutators_5_2',
    name: 'DungeonMutator 5.2',
    flavor: 'Auto-generated dungeonmutator entry number 5066 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dungeonMutators_5_3',
    name: 'DungeonMutator 5.3',
    flavor: 'Auto-generated dungeonmutator entry number 5067 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dungeonMutators_5_4',
    name: 'DungeonMutator 5.4',
    flavor: 'Auto-generated dungeonmutator entry number 5068 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dungeonMutators_5_5',
    name: 'DungeonMutator 5.5',
    flavor: 'Auto-generated dungeonmutator entry number 5069 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dungeonMutators_5_6',
    name: 'DungeonMutator 5.6',
    flavor: 'Auto-generated dungeonmutator entry number 5070 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getDungeonMutatorEntry5(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_5.find(e => e.id === id);
}
