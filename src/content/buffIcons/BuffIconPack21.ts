// src/content/buffIcons/BuffIconPack21.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_21: BuffIconEntry[] = [
  {
    id: 'buffIcons_21_1',
    name: 'BuffIcon 21.1',
    flavor: 'Auto-generated bufficon entry number 2881 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack21', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_21' },
  },
  {
    id: 'buffIcons_21_2',
    name: 'BuffIcon 21.2',
    flavor: 'Auto-generated bufficon entry number 2882 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack21', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_21' },
  },
  {
    id: 'buffIcons_21_3',
    name: 'BuffIcon 21.3',
    flavor: 'Auto-generated bufficon entry number 2883 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack21', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_21' },
  },
  {
    id: 'buffIcons_21_4',
    name: 'BuffIcon 21.4',
    flavor: 'Auto-generated bufficon entry number 2884 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack21', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_21' },
  },
  {
    id: 'buffIcons_21_5',
    name: 'BuffIcon 21.5',
    flavor: 'Auto-generated bufficon entry number 2885 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack21', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_21' },
  },
  {
    id: 'buffIcons_21_6',
    name: 'BuffIcon 21.6',
    flavor: 'Auto-generated bufficon entry number 2886 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack21', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_21' },
  },
];

export function getBuffIconEntry21(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_21.find(e => e.id === id);
}
