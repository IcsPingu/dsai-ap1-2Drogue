// src/content/buffIcons/BuffIconPack10.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_10: BuffIconEntry[] = [
  {
    id: 'buffIcons_10_1',
    name: 'BuffIcon 10.1',
    flavor: 'Auto-generated bufficon entry number 2815 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack10', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_10' },
  },
  {
    id: 'buffIcons_10_2',
    name: 'BuffIcon 10.2',
    flavor: 'Auto-generated bufficon entry number 2816 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack10', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_10' },
  },
  {
    id: 'buffIcons_10_3',
    name: 'BuffIcon 10.3',
    flavor: 'Auto-generated bufficon entry number 2817 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack10', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_10' },
  },
  {
    id: 'buffIcons_10_4',
    name: 'BuffIcon 10.4',
    flavor: 'Auto-generated bufficon entry number 2818 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack10', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_10' },
  },
  {
    id: 'buffIcons_10_5',
    name: 'BuffIcon 10.5',
    flavor: 'Auto-generated bufficon entry number 2819 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack10', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_10' },
  },
  {
    id: 'buffIcons_10_6',
    name: 'BuffIcon 10.6',
    flavor: 'Auto-generated bufficon entry number 2820 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack10', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_10' },
  },
];

export function getBuffIconEntry10(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_10.find(e => e.id === id);
}
