// src/content/dungeonMutators/DungeonMutatorPack23.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_23: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_23_1',
    name: 'DungeonMutator 23.1',
    flavor: 'Auto-generated dungeonmutator entry number 5173 for the content pack system.',
    weight: 4,
    tags: ['dungeonMutators', 'pack23', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dungeonMutators_23_2',
    name: 'DungeonMutator 23.2',
    flavor: 'Auto-generated dungeonmutator entry number 5174 for the content pack system.',
    weight: 5,
    tags: ['dungeonMutators', 'pack23', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dungeonMutators_23_3',
    name: 'DungeonMutator 23.3',
    flavor: 'Auto-generated dungeonmutator entry number 5175 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack23', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dungeonMutators_23_4',
    name: 'DungeonMutator 23.4',
    flavor: 'Auto-generated dungeonmutator entry number 5176 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack23', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dungeonMutators_23_5',
    name: 'DungeonMutator 23.5',
    flavor: 'Auto-generated dungeonmutator entry number 5177 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack23', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dungeonMutators_23_6',
    name: 'DungeonMutator 23.6',
    flavor: 'Auto-generated dungeonmutator entry number 5178 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack23', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
];

export function getDungeonMutatorEntry23(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_23.find(e => e.id === id);
}
