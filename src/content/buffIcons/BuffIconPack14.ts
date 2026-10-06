// src/content/buffIcons/BuffIconPack14.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_14: BuffIconEntry[] = [
  {
    id: 'buffIcons_14_1',
    name: 'BuffIcon 14.1',
    flavor: 'Auto-generated bufficon entry number 2839 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'buffIcons_14_2',
    name: 'BuffIcon 14.2',
    flavor: 'Auto-generated bufficon entry number 2840 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'buffIcons_14_3',
    name: 'BuffIcon 14.3',
    flavor: 'Auto-generated bufficon entry number 2841 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'buffIcons_14_4',
    name: 'BuffIcon 14.4',
    flavor: 'Auto-generated bufficon entry number 2842 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'buffIcons_14_5',
    name: 'BuffIcon 14.5',
    flavor: 'Auto-generated bufficon entry number 2843 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'buffIcons_14_6',
    name: 'BuffIcon 14.6',
    flavor: 'Auto-generated bufficon entry number 2844 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getBuffIconEntry14(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_14.find(e => e.id === id);
}
