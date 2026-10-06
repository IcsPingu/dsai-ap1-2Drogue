// src/content/dungeonMutators/DungeonMutatorPack20.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_20: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_20_1',
    name: 'DungeonMutator 20.1',
    flavor: 'Auto-generated dungeonmutator entry number 5155 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack20', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
  {
    id: 'dungeonMutators_20_2',
    name: 'DungeonMutator 20.2',
    flavor: 'Auto-generated dungeonmutator entry number 5156 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack20', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_20' },
  },
  {
    id: 'dungeonMutators_20_3',
    name: 'DungeonMutator 20.3',
    flavor: 'Auto-generated dungeonmutator entry number 5157 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack20', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_20' },
  },
  {
    id: 'dungeonMutators_20_4',
    name: 'DungeonMutator 20.4',
    flavor: 'Auto-generated dungeonmutator entry number 5158 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack20', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_20' },
  },
  {
    id: 'dungeonMutators_20_5',
    name: 'DungeonMutator 20.5',
    flavor: 'Auto-generated dungeonmutator entry number 5159 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack20', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_20' },
  },
  {
    id: 'dungeonMutators_20_6',
    name: 'DungeonMutator 20.6',
    flavor: 'Auto-generated dungeonmutator entry number 5160 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack20', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
];

export function getDungeonMutatorEntry20(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_20.find(e => e.id === id);
}
