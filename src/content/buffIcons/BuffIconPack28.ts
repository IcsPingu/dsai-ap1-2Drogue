// src/content/buffIcons/BuffIconPack28.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_28: BuffIconEntry[] = [
  {
    id: 'buffIcons_28_1',
    name: 'BuffIcon 28.1',
    flavor: 'Auto-generated bufficon entry number 2923 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack28', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_28' },
  },
  {
    id: 'buffIcons_28_2',
    name: 'BuffIcon 28.2',
    flavor: 'Auto-generated bufficon entry number 2924 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack28', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_28' },
  },
  {
    id: 'buffIcons_28_3',
    name: 'BuffIcon 28.3',
    flavor: 'Auto-generated bufficon entry number 2925 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack28', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_28' },
  },
  {
    id: 'buffIcons_28_4',
    name: 'BuffIcon 28.4',
    flavor: 'Auto-generated bufficon entry number 2926 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack28', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_28' },
  },
  {
    id: 'buffIcons_28_5',
    name: 'BuffIcon 28.5',
    flavor: 'Auto-generated bufficon entry number 2927 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack28', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_28' },
  },
  {
    id: 'buffIcons_28_6',
    name: 'BuffIcon 28.6',
    flavor: 'Auto-generated bufficon entry number 2928 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack28', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_28' },
  },
];

export function getBuffIconEntry28(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_28.find(e => e.id === id);
}
