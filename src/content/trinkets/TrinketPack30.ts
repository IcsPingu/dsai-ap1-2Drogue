// src/content/trinkets/TrinketPack30.ts
// Auto-generated content pack.

export interface TrinketEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const TRINKET_PACK_30: TrinketEntry[] = [
  {
    id: 'trinkets_30_1',
    name: 'Trinket 30.1',
    flavor: 'Auto-generated trinket entry number 1195 for the content pack system.',
    weight: 6,
    tags: ['trinkets', 'pack30', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_30' },
  },
  {
    id: 'trinkets_30_2',
    name: 'Trinket 30.2',
    flavor: 'Auto-generated trinket entry number 1196 for the content pack system.',
    weight: 7,
    tags: ['trinkets', 'pack30', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_30' },
  },
  {
    id: 'trinkets_30_3',
    name: 'Trinket 30.3',
    flavor: 'Auto-generated trinket entry number 1197 for the content pack system.',
    weight: 8,
    tags: ['trinkets', 'pack30', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_30' },
  },
  {
    id: 'trinkets_30_4',
    name: 'Trinket 30.4',
    flavor: 'Auto-generated trinket entry number 1198 for the content pack system.',
    weight: 9,
    tags: ['trinkets', 'pack30', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_30' },
  },
  {
    id: 'trinkets_30_5',
    name: 'Trinket 30.5',
    flavor: 'Auto-generated trinket entry number 1199 for the content pack system.',
    weight: 10,
    tags: ['trinkets', 'pack30', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_30' },
  },
  {
    id: 'trinkets_30_6',
    name: 'Trinket 30.6',
    flavor: 'Auto-generated trinket entry number 1200 for the content pack system.',
    weight: 1,
    tags: ['trinkets', 'pack30', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_30' },
  },
];

export function getTrinketEntry30(id: string): TrinketEntry | undefined {
  return TRINKET_PACK_30.find(e => e.id === id);
}
