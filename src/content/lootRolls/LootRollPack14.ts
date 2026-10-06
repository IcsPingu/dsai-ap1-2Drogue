// src/content/lootRolls/LootRollPack14.ts
// Auto-generated content pack.

export interface LootRollEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOOTROLL_PACK_14: LootRollEntry[] = [
  {
    id: 'lootRolls_14_1',
    name: 'LootRoll 14.1',
    flavor: 'Auto-generated lootroll entry number 3079 for the content pack system.',
    weight: 10,
    tags: ['lootRolls', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'lootRolls_14_2',
    name: 'LootRoll 14.2',
    flavor: 'Auto-generated lootroll entry number 3080 for the content pack system.',
    weight: 1,
    tags: ['lootRolls', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'lootRolls_14_3',
    name: 'LootRoll 14.3',
    flavor: 'Auto-generated lootroll entry number 3081 for the content pack system.',
    weight: 2,
    tags: ['lootRolls', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'lootRolls_14_4',
    name: 'LootRoll 14.4',
    flavor: 'Auto-generated lootroll entry number 3082 for the content pack system.',
    weight: 3,
    tags: ['lootRolls', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'lootRolls_14_5',
    name: 'LootRoll 14.5',
    flavor: 'Auto-generated lootroll entry number 3083 for the content pack system.',
    weight: 4,
    tags: ['lootRolls', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'lootRolls_14_6',
    name: 'LootRoll 14.6',
    flavor: 'Auto-generated lootroll entry number 3084 for the content pack system.',
    weight: 5,
    tags: ['lootRolls', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getLootRollEntry14(id: string): LootRollEntry | undefined {
  return LOOTROLL_PACK_14.find(e => e.id === id);
}
