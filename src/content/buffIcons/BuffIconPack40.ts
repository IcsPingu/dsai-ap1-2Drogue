// src/content/buffIcons/BuffIconPack40.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_40: BuffIconEntry[] = [
  {
    id: 'buffIcons_40_1',
    name: 'BuffIcon 40.1',
    flavor: 'Auto-generated bufficon entry number 2995 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack40', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_40' },
  },
  {
    id: 'buffIcons_40_2',
    name: 'BuffIcon 40.2',
    flavor: 'Auto-generated bufficon entry number 2996 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack40', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_40' },
  },
  {
    id: 'buffIcons_40_3',
    name: 'BuffIcon 40.3',
    flavor: 'Auto-generated bufficon entry number 2997 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack40', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_40' },
  },
  {
    id: 'buffIcons_40_4',
    name: 'BuffIcon 40.4',
    flavor: 'Auto-generated bufficon entry number 2998 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack40', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_40' },
  },
  {
    id: 'buffIcons_40_5',
    name: 'BuffIcon 40.5',
    flavor: 'Auto-generated bufficon entry number 2999 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack40', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_40' },
  },
  {
    id: 'buffIcons_40_6',
    name: 'BuffIcon 40.6',
    flavor: 'Auto-generated bufficon entry number 3000 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack40', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_40' },
  },
];

export function getBuffIconEntry40(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_40.find(e => e.id === id);
}
