// src/content/buffIcons/BuffIconPack23.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_23: BuffIconEntry[] = [
  {
    id: 'buffIcons_23_1',
    name: 'BuffIcon 23.1',
    flavor: 'Auto-generated bufficon entry number 2893 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack23', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
  {
    id: 'buffIcons_23_2',
    name: 'BuffIcon 23.2',
    flavor: 'Auto-generated bufficon entry number 2894 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack23', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_23' },
  },
  {
    id: 'buffIcons_23_3',
    name: 'BuffIcon 23.3',
    flavor: 'Auto-generated bufficon entry number 2895 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack23', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_23' },
  },
  {
    id: 'buffIcons_23_4',
    name: 'BuffIcon 23.4',
    flavor: 'Auto-generated bufficon entry number 2896 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack23', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_23' },
  },
  {
    id: 'buffIcons_23_5',
    name: 'BuffIcon 23.5',
    flavor: 'Auto-generated bufficon entry number 2897 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack23', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_23' },
  },
  {
    id: 'buffIcons_23_6',
    name: 'BuffIcon 23.6',
    flavor: 'Auto-generated bufficon entry number 2898 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack23', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
];

export function getBuffIconEntry23(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_23.find(e => e.id === id);
}
