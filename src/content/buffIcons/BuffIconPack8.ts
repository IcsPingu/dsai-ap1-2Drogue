// src/content/buffIcons/BuffIconPack8.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_8: BuffIconEntry[] = [
  {
    id: 'buffIcons_8_1',
    name: 'BuffIcon 8.1',
    flavor: 'Auto-generated bufficon entry number 2803 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack8', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
  {
    id: 'buffIcons_8_2',
    name: 'BuffIcon 8.2',
    flavor: 'Auto-generated bufficon entry number 2804 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack8', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_8' },
  },
  {
    id: 'buffIcons_8_3',
    name: 'BuffIcon 8.3',
    flavor: 'Auto-generated bufficon entry number 2805 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack8', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_8' },
  },
  {
    id: 'buffIcons_8_4',
    name: 'BuffIcon 8.4',
    flavor: 'Auto-generated bufficon entry number 2806 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack8', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_8' },
  },
  {
    id: 'buffIcons_8_5',
    name: 'BuffIcon 8.5',
    flavor: 'Auto-generated bufficon entry number 2807 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack8', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_8' },
  },
  {
    id: 'buffIcons_8_6',
    name: 'BuffIcon 8.6',
    flavor: 'Auto-generated bufficon entry number 2808 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack8', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
];

export function getBuffIconEntry8(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_8.find(e => e.id === id);
}
