// src/content/dungeonMutators/DungeonMutatorPack2.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_2: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_2_1',
    name: 'DungeonMutator 2.1',
    flavor: 'Auto-generated dungeonmutator entry number 5047 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dungeonMutators_2_2',
    name: 'DungeonMutator 2.2',
    flavor: 'Auto-generated dungeonmutator entry number 5048 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dungeonMutators_2_3',
    name: 'DungeonMutator 2.3',
    flavor: 'Auto-generated dungeonmutator entry number 5049 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dungeonMutators_2_4',
    name: 'DungeonMutator 2.4',
    flavor: 'Auto-generated dungeonmutator entry number 5050 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dungeonMutators_2_5',
    name: 'DungeonMutator 2.5',
    flavor: 'Auto-generated dungeonmutator entry number 5051 for the content pack system.',
    weight: 2,
    tags: ['dungeonMutators', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dungeonMutators_2_6',
    name: 'DungeonMutator 2.6',
    flavor: 'Auto-generated dungeonmutator entry number 5052 for the content pack system.',
    weight: 3,
    tags: ['dungeonMutators', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getDungeonMutatorEntry2(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_2.find(e => e.id === id);
}
