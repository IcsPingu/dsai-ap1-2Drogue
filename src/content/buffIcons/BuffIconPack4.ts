// src/content/buffIcons/BuffIconPack4.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_4: BuffIconEntry[] = [
  {
    id: 'buffIcons_4_1',
    name: 'BuffIcon 4.1',
    flavor: 'Auto-generated bufficon entry number 2779 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack4', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
  {
    id: 'buffIcons_4_2',
    name: 'BuffIcon 4.2',
    flavor: 'Auto-generated bufficon entry number 2780 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack4', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_4' },
  },
  {
    id: 'buffIcons_4_3',
    name: 'BuffIcon 4.3',
    flavor: 'Auto-generated bufficon entry number 2781 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack4', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_4' },
  },
  {
    id: 'buffIcons_4_4',
    name: 'BuffIcon 4.4',
    flavor: 'Auto-generated bufficon entry number 2782 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack4', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_4' },
  },
  {
    id: 'buffIcons_4_5',
    name: 'BuffIcon 4.5',
    flavor: 'Auto-generated bufficon entry number 2783 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack4', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_4' },
  },
  {
    id: 'buffIcons_4_6',
    name: 'BuffIcon 4.6',
    flavor: 'Auto-generated bufficon entry number 2784 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack4', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
];

export function getBuffIconEntry4(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_4.find(e => e.id === id);
}
