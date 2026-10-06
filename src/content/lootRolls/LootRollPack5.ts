// src/content/lootRolls/LootRollPack5.ts
// Auto-generated content pack.

export interface LootRollEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOOTROLL_PACK_5: LootRollEntry[] = [
  {
    id: 'lootRolls_5_1',
    name: 'LootRoll 5.1',
    flavor: 'Auto-generated lootroll entry number 3025 for the content pack system.',
    weight: 6,
    tags: ['lootRolls', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'lootRolls_5_2',
    name: 'LootRoll 5.2',
    flavor: 'Auto-generated lootroll entry number 3026 for the content pack system.',
    weight: 7,
    tags: ['lootRolls', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'lootRolls_5_3',
    name: 'LootRoll 5.3',
    flavor: 'Auto-generated lootroll entry number 3027 for the content pack system.',
    weight: 8,
    tags: ['lootRolls', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'lootRolls_5_4',
    name: 'LootRoll 5.4',
    flavor: 'Auto-generated lootroll entry number 3028 for the content pack system.',
    weight: 9,
    tags: ['lootRolls', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'lootRolls_5_5',
    name: 'LootRoll 5.5',
    flavor: 'Auto-generated lootroll entry number 3029 for the content pack system.',
    weight: 10,
    tags: ['lootRolls', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'lootRolls_5_6',
    name: 'LootRoll 5.6',
    flavor: 'Auto-generated lootroll entry number 3030 for the content pack system.',
    weight: 1,
    tags: ['lootRolls', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getLootRollEntry5(id: string): LootRollEntry | undefined {
  return LOOTROLL_PACK_5.find(e => e.id === id);
}
