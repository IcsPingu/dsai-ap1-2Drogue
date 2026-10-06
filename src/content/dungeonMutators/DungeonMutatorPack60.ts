// src/content/dungeonMutators/DungeonMutatorPack60.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_60: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_60_1',
    name: 'DungeonMutator 60.1',
    flavor: 'Auto-generated dungeonmutator entry number 5395 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack60', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_60' },
  },
  {
    id: 'dungeonMutators_60_2',
    name: 'DungeonMutator 60.2',
    flavor: 'Auto-generated dungeonmutator entry number 5396 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack60', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_60' },
  },
  {
    id: 'dungeonMutators_60_3',
    name: 'DungeonMutator 60.3',
    flavor: 'Auto-generated dungeonmutator entry number 5397 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack60', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_60' },
  },
  {
    id: 'dungeonMutators_60_4',
    name: 'DungeonMutator 60.4',
    flavor: 'Auto-generated dungeonmutator entry number 5398 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack60', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_60' },
  },
  {
    id: 'dungeonMutators_60_5',
    name: 'DungeonMutator 60.5',
    flavor: 'Auto-generated dungeonmutator entry number 5399 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack60', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_60' },
  },
  {
    id: 'dungeonMutators_60_6',
    name: 'DungeonMutator 60.6',
    flavor: 'Auto-generated dungeonmutator entry number 5400 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack60', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_60' },
  },
];

export function getDungeonMutatorEntry60(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_60.find(e => e.id === id);
}
