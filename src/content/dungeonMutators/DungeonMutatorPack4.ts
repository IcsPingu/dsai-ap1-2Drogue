// src/content/dungeonMutators/DungeonMutatorPack4.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_4: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_4_1',
    name: 'DungeonMutator 4.1',
    flavor: 'Auto-generated dungeonmutator entry number 5059 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack4', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dungeonMutators_4_2',
    name: 'DungeonMutator 4.2',
    flavor: 'Auto-generated dungeonmutator entry number 5060 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack4', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dungeonMutators_4_3',
    name: 'DungeonMutator 4.3',
    flavor: 'Auto-generated dungeonmutator entry number 5061 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack4', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dungeonMutators_4_4',
    name: 'DungeonMutator 4.4',
    flavor: 'Auto-generated dungeonmutator entry number 5062 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack4', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dungeonMutators_4_5',
    name: 'DungeonMutator 4.5',
    flavor: 'Auto-generated dungeonmutator entry number 5063 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack4', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dungeonMutators_4_6',
    name: 'DungeonMutator 4.6',
    flavor: 'Auto-generated dungeonmutator entry number 5064 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack4', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
];

export function getDungeonMutatorEntry4(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_4.find(e => e.id === id);
}
