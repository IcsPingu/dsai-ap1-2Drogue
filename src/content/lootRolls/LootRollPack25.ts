// src/content/lootRolls/LootRollPack25.ts
// Auto-generated content pack.

export interface LootRollEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOOTROLL_PACK_25: LootRollEntry[] = [
  {
    id: 'lootRolls_25_1',
    name: 'LootRoll 25.1',
    flavor: 'Auto-generated lootroll entry number 3145 for the content pack system.',
    weight: 6,
    tags: ['lootRolls', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'lootRolls_25_2',
    name: 'LootRoll 25.2',
    flavor: 'Auto-generated lootroll entry number 3146 for the content pack system.',
    weight: 7,
    tags: ['lootRolls', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'lootRolls_25_3',
    name: 'LootRoll 25.3',
    flavor: 'Auto-generated lootroll entry number 3147 for the content pack system.',
    weight: 8,
    tags: ['lootRolls', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'lootRolls_25_4',
    name: 'LootRoll 25.4',
    flavor: 'Auto-generated lootroll entry number 3148 for the content pack system.',
    weight: 9,
    tags: ['lootRolls', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'lootRolls_25_5',
    name: 'LootRoll 25.5',
    flavor: 'Auto-generated lootroll entry number 3149 for the content pack system.',
    weight: 10,
    tags: ['lootRolls', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'lootRolls_25_6',
    name: 'LootRoll 25.6',
    flavor: 'Auto-generated lootroll entry number 3150 for the content pack system.',
    weight: 1,
    tags: ['lootRolls', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getLootRollEntry25(id: string): LootRollEntry | undefined {
  return LOOTROLL_PACK_25.find(e => e.id === id);
}
