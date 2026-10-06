// src/content/buffIcons/BuffIconPack32.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_32: BuffIconEntry[] = [
  {
    id: 'buffIcons_32_1',
    name: 'BuffIcon 32.1',
    flavor: 'Auto-generated bufficon entry number 2947 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack32', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_32' },
  },
  {
    id: 'buffIcons_32_2',
    name: 'BuffIcon 32.2',
    flavor: 'Auto-generated bufficon entry number 2948 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack32', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_32' },
  },
  {
    id: 'buffIcons_32_3',
    name: 'BuffIcon 32.3',
    flavor: 'Auto-generated bufficon entry number 2949 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack32', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_32' },
  },
  {
    id: 'buffIcons_32_4',
    name: 'BuffIcon 32.4',
    flavor: 'Auto-generated bufficon entry number 2950 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack32', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_32' },
  },
  {
    id: 'buffIcons_32_5',
    name: 'BuffIcon 32.5',
    flavor: 'Auto-generated bufficon entry number 2951 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack32', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_32' },
  },
  {
    id: 'buffIcons_32_6',
    name: 'BuffIcon 32.6',
    flavor: 'Auto-generated bufficon entry number 2952 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack32', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_32' },
  },
];

export function getBuffIconEntry32(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_32.find(e => e.id === id);
}
