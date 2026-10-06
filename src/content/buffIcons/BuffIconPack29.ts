// src/content/buffIcons/BuffIconPack29.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_29: BuffIconEntry[] = [
  {
    id: 'buffIcons_29_1',
    name: 'BuffIcon 29.1',
    flavor: 'Auto-generated bufficon entry number 2929 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack29', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_29' },
  },
  {
    id: 'buffIcons_29_2',
    name: 'BuffIcon 29.2',
    flavor: 'Auto-generated bufficon entry number 2930 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack29', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_29' },
  },
  {
    id: 'buffIcons_29_3',
    name: 'BuffIcon 29.3',
    flavor: 'Auto-generated bufficon entry number 2931 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack29', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_29' },
  },
  {
    id: 'buffIcons_29_4',
    name: 'BuffIcon 29.4',
    flavor: 'Auto-generated bufficon entry number 2932 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack29', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_29' },
  },
  {
    id: 'buffIcons_29_5',
    name: 'BuffIcon 29.5',
    flavor: 'Auto-generated bufficon entry number 2933 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack29', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_29' },
  },
  {
    id: 'buffIcons_29_6',
    name: 'BuffIcon 29.6',
    flavor: 'Auto-generated bufficon entry number 2934 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack29', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_29' },
  },
];

export function getBuffIconEntry29(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_29.find(e => e.id === id);
}
