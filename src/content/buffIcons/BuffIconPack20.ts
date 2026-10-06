// src/content/buffIcons/BuffIconPack20.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_20: BuffIconEntry[] = [
  {
    id: 'buffIcons_20_1',
    name: 'BuffIcon 20.1',
    flavor: 'Auto-generated bufficon entry number 2875 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack20', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
  {
    id: 'buffIcons_20_2',
    name: 'BuffIcon 20.2',
    flavor: 'Auto-generated bufficon entry number 2876 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack20', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_20' },
  },
  {
    id: 'buffIcons_20_3',
    name: 'BuffIcon 20.3',
    flavor: 'Auto-generated bufficon entry number 2877 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack20', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_20' },
  },
  {
    id: 'buffIcons_20_4',
    name: 'BuffIcon 20.4',
    flavor: 'Auto-generated bufficon entry number 2878 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack20', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_20' },
  },
  {
    id: 'buffIcons_20_5',
    name: 'BuffIcon 20.5',
    flavor: 'Auto-generated bufficon entry number 2879 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack20', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_20' },
  },
  {
    id: 'buffIcons_20_6',
    name: 'BuffIcon 20.6',
    flavor: 'Auto-generated bufficon entry number 2880 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack20', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
];

export function getBuffIconEntry20(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_20.find(e => e.id === id);
}
