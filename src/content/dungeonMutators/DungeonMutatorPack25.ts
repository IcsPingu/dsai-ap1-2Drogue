// src/content/dungeonMutators/DungeonMutatorPack25.ts
// Auto-generated content pack.

export interface DungeonMutatorEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DUNGEONMUTATOR_PACK_25: DungeonMutatorEntry[] = [
  {
    id: 'dungeonMutators_25_1',
    name: 'DungeonMutator 25.1',
    flavor: 'Auto-generated dungeonmutator entry number 5185 for the content pack system.',
    weight: 6,
    tags: ['dungeonMutators', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dungeonMutators_25_2',
    name: 'DungeonMutator 25.2',
    flavor: 'Auto-generated dungeonmutator entry number 5186 for the content pack system.',
    weight: 7,
    tags: ['dungeonMutators', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dungeonMutators_25_3',
    name: 'DungeonMutator 25.3',
    flavor: 'Auto-generated dungeonmutator entry number 5187 for the content pack system.',
    weight: 8,
    tags: ['dungeonMutators', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dungeonMutators_25_4',
    name: 'DungeonMutator 25.4',
    flavor: 'Auto-generated dungeonmutator entry number 5188 for the content pack system.',
    weight: 9,
    tags: ['dungeonMutators', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dungeonMutators_25_5',
    name: 'DungeonMutator 25.5',
    flavor: 'Auto-generated dungeonmutator entry number 5189 for the content pack system.',
    weight: 10,
    tags: ['dungeonMutators', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dungeonMutators_25_6',
    name: 'DungeonMutator 25.6',
    flavor: 'Auto-generated dungeonmutator entry number 5190 for the content pack system.',
    weight: 1,
    tags: ['dungeonMutators', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getDungeonMutatorEntry25(id: string): DungeonMutatorEntry | undefined {
  return DUNGEONMUTATOR_PACK_25.find(e => e.id === id);
}
