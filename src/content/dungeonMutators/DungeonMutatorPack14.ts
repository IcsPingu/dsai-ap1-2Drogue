// src/content/dungeonMutators/DungeonMutatorPack14.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_14: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_14_1',
    name: 'DungeonMutator 14.1',
    flavor: 'Auto-generated dungeonmutator entry number 5119 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dungeonMutators_14_2',
    name: 'DungeonMutator 14.2',
    flavor: 'Auto-generated dungeonmutator entry number 5120 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dungeonMutators_14_3',
    name: 'DungeonMutator 14.3',
    flavor: 'Auto-generated dungeonmutator entry number 5121 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dungeonMutators_14_4',
    name: 'DungeonMutator 14.4',
    flavor: 'Auto-generated dungeonmutator entry number 5122 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dungeonMutators_14_5',
    name: 'DungeonMutator 14.5',
    flavor: 'Auto-generated dungeonmutator entry number 5123 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dungeonMutators_14_6',
    name: 'DungeonMutator 14.6',
    flavor: 'Auto-generated dungeonmutator entry number 5124 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getDungeonMutatorEntry14(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_14.find(e => e.id === id);
}
