// src/content/buffIcons/BuffIconPack24.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_24: BuffIconEntry[] = [
  {
    id: 'buffIcons_24_1',
    name: 'BuffIcon 24.1',
    flavor: 'Auto-generated bufficon entry number 2899 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack24', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_24' },
  },
  {
    id: 'buffIcons_24_2',
    name: 'BuffIcon 24.2',
    flavor: 'Auto-generated bufficon entry number 2900 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack24', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_24' },
  },
  {
    id: 'buffIcons_24_3',
    name: 'BuffIcon 24.3',
    flavor: 'Auto-generated bufficon entry number 2901 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack24', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_24' },
  },
  {
    id: 'buffIcons_24_4',
    name: 'BuffIcon 24.4',
    flavor: 'Auto-generated bufficon entry number 2902 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack24', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_24' },
  },
  {
    id: 'buffIcons_24_5',
    name: 'BuffIcon 24.5',
    flavor: 'Auto-generated bufficon entry number 2903 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack24', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_24' },
  },
  {
    id: 'buffIcons_24_6',
    name: 'BuffIcon 24.6',
    flavor: 'Auto-generated bufficon entry number 2904 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack24', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_24' },
  },
];

export function getBuffIconEntry24(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_24.find(e => e.id === id);
}
