// src/content/buffIcons/BuffIconPack37.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_37: BuffIconEntry[] = [
  {
    id: 'buffIcons_37_1',
    name: 'BuffIcon 37.1',
    flavor: 'Auto-generated bufficon entry number 2977 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack37', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_37' },
  },
  {
    id: 'buffIcons_37_2',
    name: 'BuffIcon 37.2',
    flavor: 'Auto-generated bufficon entry number 2978 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack37', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_37' },
  },
  {
    id: 'buffIcons_37_3',
    name: 'BuffIcon 37.3',
    flavor: 'Auto-generated bufficon entry number 2979 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack37', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_37' },
  },
  {
    id: 'buffIcons_37_4',
    name: 'BuffIcon 37.4',
    flavor: 'Auto-generated bufficon entry number 2980 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack37', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_37' },
  },
  {
    id: 'buffIcons_37_5',
    name: 'BuffIcon 37.5',
    flavor: 'Auto-generated bufficon entry number 2981 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack37', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_37' },
  },
  {
    id: 'buffIcons_37_6',
    name: 'BuffIcon 37.6',
    flavor: 'Auto-generated bufficon entry number 2982 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack37', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_37' },
  },
];

export function getBuffIconEntry37(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_37.find(e => e.id === id);
}
