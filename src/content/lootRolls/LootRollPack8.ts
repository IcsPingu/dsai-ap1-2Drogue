// src/content/lootRolls/LootRollPack8.ts
// Auto-generated content pack.

export interface LootRollEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOOTROLL_PACK_8: LootRollEntry[] = [
  {
    id: 'lootRolls_8_1',
    name: 'LootRoll 8.1',
    flavor: 'Auto-generated lootroll entry number 3043 for the content pack system.',
    weight: 4,
    tags: ['lootRolls', 'pack8', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
  {
    id: 'lootRolls_8_2',
    name: 'LootRoll 8.2',
    flavor: 'Auto-generated lootroll entry number 3044 for the content pack system.',
    weight: 5,
    tags: ['lootRolls', 'pack8', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_8' },
  },
  {
    id: 'lootRolls_8_3',
    name: 'LootRoll 8.3',
    flavor: 'Auto-generated lootroll entry number 3045 for the content pack system.',
    weight: 6,
    tags: ['lootRolls', 'pack8', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_8' },
  },
  {
    id: 'lootRolls_8_4',
    name: 'LootRoll 8.4',
    flavor: 'Auto-generated lootroll entry number 3046 for the content pack system.',
    weight: 7,
    tags: ['lootRolls', 'pack8', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_8' },
  },
  {
    id: 'lootRolls_8_5',
    name: 'LootRoll 8.5',
    flavor: 'Auto-generated lootroll entry number 3047 for the content pack system.',
    weight: 8,
    tags: ['lootRolls', 'pack8', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_8' },
  },
  {
    id: 'lootRolls_8_6',
    name: 'LootRoll 8.6',
    flavor: 'Auto-generated lootroll entry number 3048 for the content pack system.',
    weight: 9,
    tags: ['lootRolls', 'pack8', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
];

export function getLootRollEntry8(id: string): LootRollEntry | undefined {
  return LOOTROLL_PACK_8.find(e => e.id === id);
}
