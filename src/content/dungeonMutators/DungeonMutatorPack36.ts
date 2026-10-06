// src/content/dungeonMutators/DungeonMutatorPack36.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_36: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_36_1',
    name: 'DungeonMutator 36.1',
    flavor: 'Auto-generated dungeonmutator entry number 5251 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack36', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
  {
    id: 'dungeonMutators_36_2',
    name: 'DungeonMutator 36.2',
    flavor: 'Auto-generated dungeonmutator entry number 5252 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack36', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_36' },
  },
  {
    id: 'dungeonMutators_36_3',
    name: 'DungeonMutator 36.3',
    flavor: 'Auto-generated dungeonmutator entry number 5253 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack36', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_36' },
  },
  {
    id: 'dungeonMutators_36_4',
    name: 'DungeonMutator 36.4',
    flavor: 'Auto-generated dungeonmutator entry number 5254 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack36', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_36' },
  },
  {
    id: 'dungeonMutators_36_5',
    name: 'DungeonMutator 36.5',
    flavor: 'Auto-generated dungeonmutator entry number 5255 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack36', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_36' },
  },
  {
    id: 'dungeonMutators_36_6',
    name: 'DungeonMutator 36.6',
    flavor: 'Auto-generated dungeonmutator entry number 5256 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack36', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
];

export function getDungeonMutatorEntry36(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_36.find(e => e.id === id);
}
