// src/content/trinkets/TrinketPack25.ts
// Auto-generated content pack.

export interface TrinketEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const TRINKET_PACK_25: TrinketEntry[] = [
  {
    id: 'trinkets_25_1',
    name: 'Trinket 25.1',
    flavor: 'Auto-generated trinket entry number 1165 for the content pack system.',
    weight: 6,
    tags: ['trinkets', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'trinkets_25_2',
    name: 'Trinket 25.2',
    flavor: 'Auto-generated trinket entry number 1166 for the content pack system.',
    weight: 7,
    tags: ['trinkets', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'trinkets_25_3',
    name: 'Trinket 25.3',
    flavor: 'Auto-generated trinket entry number 1167 for the content pack system.',
    weight: 8,
    tags: ['trinkets', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'trinkets_25_4',
    name: 'Trinket 25.4',
    flavor: 'Auto-generated trinket entry number 1168 for the content pack system.',
    weight: 9,
    tags: ['trinkets', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'trinkets_25_5',
    name: 'Trinket 25.5',
    flavor: 'Auto-generated trinket entry number 1169 for the content pack system.',
    weight: 10,
    tags: ['trinkets', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'trinkets_25_6',
    name: 'Trinket 25.6',
    flavor: 'Auto-generated trinket entry number 1170 for the content pack system.',
    weight: 1,
    tags: ['trinkets', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getTrinketEntry25(id: string): TrinketEntry | undefined {
  return TRINKET_PACK_25.find(e => e.id === id);
}
