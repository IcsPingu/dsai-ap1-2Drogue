// src/content/buffIcons/BuffIconPack26.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_26: BuffIconEntry[] = [
  {
    id: 'buffIcons_26_1',
    name: 'BuffIcon 26.1',
    flavor: 'Auto-generated bufficon entry number 2911 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack26', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_26' },
  },
  {
    id: 'buffIcons_26_2',
    name: 'BuffIcon 26.2',
    flavor: 'Auto-generated bufficon entry number 2912 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack26', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_26' },
  },
  {
    id: 'buffIcons_26_3',
    name: 'BuffIcon 26.3',
    flavor: 'Auto-generated bufficon entry number 2913 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack26', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_26' },
  },
  {
    id: 'buffIcons_26_4',
    name: 'BuffIcon 26.4',
    flavor: 'Auto-generated bufficon entry number 2914 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack26', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_26' },
  },
  {
    id: 'buffIcons_26_5',
    name: 'BuffIcon 26.5',
    flavor: 'Auto-generated bufficon entry number 2915 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack26', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_26' },
  },
  {
    id: 'buffIcons_26_6',
    name: 'BuffIcon 26.6',
    flavor: 'Auto-generated bufficon entry number 2916 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack26', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_26' },
  },
];

export function getBuffIconEntry26(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_26.find(e => e.id === id);
}
