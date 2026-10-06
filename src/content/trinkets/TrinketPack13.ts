// src/content/trinkets/TrinketPack13.ts
// Auto-generated content pack.

export interface TrinketEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const TRINKET_PACK_13: TrinketEntry[] = [
  {
    id: 'trinkets_13_1',
    name: 'Trinket 13.1',
    flavor: 'Auto-generated trinket entry number 1093 for the content pack system.',
    weight: 4,
    tags: ['trinkets', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'trinkets_13_2',
    name: 'Trinket 13.2',
    flavor: 'Auto-generated trinket entry number 1094 for the content pack system.',
    weight: 5,
    tags: ['trinkets', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'trinkets_13_3',
    name: 'Trinket 13.3',
    flavor: 'Auto-generated trinket entry number 1095 for the content pack system.',
    weight: 6,
    tags: ['trinkets', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'trinkets_13_4',
    name: 'Trinket 13.4',
    flavor: 'Auto-generated trinket entry number 1096 for the content pack system.',
    weight: 7,
    tags: ['trinkets', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'trinkets_13_5',
    name: 'Trinket 13.5',
    flavor: 'Auto-generated trinket entry number 1097 for the content pack system.',
    weight: 8,
    tags: ['trinkets', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'trinkets_13_6',
    name: 'Trinket 13.6',
    flavor: 'Auto-generated trinket entry number 1098 for the content pack system.',
    weight: 9,
    tags: ['trinkets', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getTrinketEntry13(id: string): TrinketEntry | undefined {
  return TRINKET_PACK_13.find(e => e.id === id);
}
