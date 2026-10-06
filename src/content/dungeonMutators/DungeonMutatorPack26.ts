// src/content/dungeonMutators/DungeonMutatorPack26.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_26: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_26_1',
    name: 'DungeonMutator 26.1',
    flavor: 'Auto-generated dungeonmutator entry number 5191 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack26', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dungeonMutators_26_2',
    name: 'DungeonMutator 26.2',
    flavor: 'Auto-generated dungeonmutator entry number 5192 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack26', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dungeonMutators_26_3',
    name: 'DungeonMutator 26.3',
    flavor: 'Auto-generated dungeonmutator entry number 5193 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack26', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dungeonMutators_26_4',
    name: 'DungeonMutator 26.4',
    flavor: 'Auto-generated dungeonmutator entry number 5194 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack26', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dungeonMutators_26_5',
    name: 'DungeonMutator 26.5',
    flavor: 'Auto-generated dungeonmutator entry number 5195 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack26', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dungeonMutators_26_6',
    name: 'DungeonMutator 26.6',
    flavor: 'Auto-generated dungeonmutator entry number 5196 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack26', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_26' },
  },
];

export function getDungeonMutatorEntry26(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_26.find(e => e.id === id);
}
