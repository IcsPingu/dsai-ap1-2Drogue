// src/content/dungeonMutators/DungeonMutatorPack8.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_8: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_8_1',
    name: 'DungeonMutator 8.1',
    flavor: 'Auto-generated dungeonmutator entry number 5083 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack8', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
  {
    id: 'dungeonMutators_8_2',
    name: 'DungeonMutator 8.2',
    flavor: 'Auto-generated dungeonmutator entry number 5084 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack8', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_8' },
  },
  {
    id: 'dungeonMutators_8_3',
    name: 'DungeonMutator 8.3',
    flavor: 'Auto-generated dungeonmutator entry number 5085 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack8', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_8' },
  },
  {
    id: 'dungeonMutators_8_4',
    name: 'DungeonMutator 8.4',
    flavor: 'Auto-generated dungeonmutator entry number 5086 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack8', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_8' },
  },
  {
    id: 'dungeonMutators_8_5',
    name: 'DungeonMutator 8.5',
    flavor: 'Auto-generated dungeonmutator entry number 5087 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack8', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_8' },
  },
  {
    id: 'dungeonMutators_8_6',
    name: 'DungeonMutator 8.6',
    flavor: 'Auto-generated dungeonmutator entry number 5088 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack8', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
];

export function getDungeonMutatorEntry8(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_8.find(e => e.id === id);
}
