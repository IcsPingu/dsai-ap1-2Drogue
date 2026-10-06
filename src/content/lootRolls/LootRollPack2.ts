// src/content/lootRolls/LootRollPack2.ts
// Auto-generated content pack.

export interface LootRollEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOOTROLL_PACK_2: LootRollEntry[] = [
  {
    id: 'lootRolls_2_1',
    name: 'LootRoll 2.1',
    flavor: 'Auto-generated lootroll entry number 3007 for the content pack system.',
    weight: 8,
    tags: ['lootRolls', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'lootRolls_2_2',
    name: 'LootRoll 2.2',
    flavor: 'Auto-generated lootroll entry number 3008 for the content pack system.',
    weight: 9,
    tags: ['lootRolls', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'lootRolls_2_3',
    name: 'LootRoll 2.3',
    flavor: 'Auto-generated lootroll entry number 3009 for the content pack system.',
    weight: 10,
    tags: ['lootRolls', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'lootRolls_2_4',
    name: 'LootRoll 2.4',
    flavor: 'Auto-generated lootroll entry number 3010 for the content pack system.',
    weight: 1,
    tags: ['lootRolls', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'lootRolls_2_5',
    name: 'LootRoll 2.5',
    flavor: 'Auto-generated lootroll entry number 3011 for the content pack system.',
    weight: 2,
    tags: ['lootRolls', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'lootRolls_2_6',
    name: 'LootRoll 2.6',
    flavor: 'Auto-generated lootroll entry number 3012 for the content pack system.',
    weight: 3,
    tags: ['lootRolls', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getLootRollEntry2(id: string): LootRollEntry | undefined {
  return LOOTROLL_PACK_2.find(e => e.id === id);
}
