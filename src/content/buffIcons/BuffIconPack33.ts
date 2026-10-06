// src/content/buffIcons/BuffIconPack33.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_33: BuffIconEntry[] = [
  {
    id: 'buffIcons_33_1',
    name: 'BuffIcon 33.1',
    flavor: 'Auto-generated bufficon entry number 2953 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack33', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_33' },
  },
  {
    id: 'buffIcons_33_2',
    name: 'BuffIcon 33.2',
    flavor: 'Auto-generated bufficon entry number 2954 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack33', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_33' },
  },
  {
    id: 'buffIcons_33_3',
    name: 'BuffIcon 33.3',
    flavor: 'Auto-generated bufficon entry number 2955 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack33', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_33' },
  },
  {
    id: 'buffIcons_33_4',
    name: 'BuffIcon 33.4',
    flavor: 'Auto-generated bufficon entry number 2956 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack33', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_33' },
  },
  {
    id: 'buffIcons_33_5',
    name: 'BuffIcon 33.5',
    flavor: 'Auto-generated bufficon entry number 2957 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack33', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_33' },
  },
  {
    id: 'buffIcons_33_6',
    name: 'BuffIcon 33.6',
    flavor: 'Auto-generated bufficon entry number 2958 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack33', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_33' },
  },
];

export function getBuffIconEntry33(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_33.find(e => e.id === id);
}
