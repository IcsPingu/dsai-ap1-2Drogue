// src/content/buffIcons/BuffIconPack2.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_2: BuffIconEntry[] = [
  {
    id: 'buffIcons_2_1',
    name: 'BuffIcon 2.1',
    flavor: 'Auto-generated bufficon entry number 2767 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'buffIcons_2_2',
    name: 'BuffIcon 2.2',
    flavor: 'Auto-generated bufficon entry number 2768 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'buffIcons_2_3',
    name: 'BuffIcon 2.3',
    flavor: 'Auto-generated bufficon entry number 2769 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'buffIcons_2_4',
    name: 'BuffIcon 2.4',
    flavor: 'Auto-generated bufficon entry number 2770 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'buffIcons_2_5',
    name: 'BuffIcon 2.5',
    flavor: 'Auto-generated bufficon entry number 2771 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'buffIcons_2_6',
    name: 'BuffIcon 2.6',
    flavor: 'Auto-generated bufficon entry number 2772 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getBuffIconEntry2(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_2.find(e => e.id === id);
}
