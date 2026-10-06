// src/content/buffIcons/BuffIconPack30.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_30: BuffIconEntry[] = [
  {
    id: 'buffIcons_30_1',
    name: 'BuffIcon 30.1',
    flavor: 'Auto-generated bufficon entry number 2935 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack30', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_30' },
  },
  {
    id: 'buffIcons_30_2',
    name: 'BuffIcon 30.2',
    flavor: 'Auto-generated bufficon entry number 2936 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack30', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_30' },
  },
  {
    id: 'buffIcons_30_3',
    name: 'BuffIcon 30.3',
    flavor: 'Auto-generated bufficon entry number 2937 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack30', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_30' },
  },
  {
    id: 'buffIcons_30_4',
    name: 'BuffIcon 30.4',
    flavor: 'Auto-generated bufficon entry number 2938 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack30', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_30' },
  },
  {
    id: 'buffIcons_30_5',
    name: 'BuffIcon 30.5',
    flavor: 'Auto-generated bufficon entry number 2939 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack30', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_30' },
  },
  {
    id: 'buffIcons_30_6',
    name: 'BuffIcon 30.6',
    flavor: 'Auto-generated bufficon entry number 2940 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack30', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_30' },
  },
];

export function getBuffIconEntry30(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_30.find(e => e.id === id);
}
