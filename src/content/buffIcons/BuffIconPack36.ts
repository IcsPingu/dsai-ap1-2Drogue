// src/content/buffIcons/BuffIconPack36.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_36: BuffIconEntry[] = [
  {
    id: 'buffIcons_36_1',
    name: 'BuffIcon 36.1',
    flavor: 'Auto-generated bufficon entry number 2971 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack36', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
  {
    id: 'buffIcons_36_2',
    name: 'BuffIcon 36.2',
    flavor: 'Auto-generated bufficon entry number 2972 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack36', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_36' },
  },
  {
    id: 'buffIcons_36_3',
    name: 'BuffIcon 36.3',
    flavor: 'Auto-generated bufficon entry number 2973 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack36', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_36' },
  },
  {
    id: 'buffIcons_36_4',
    name: 'BuffIcon 36.4',
    flavor: 'Auto-generated bufficon entry number 2974 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack36', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_36' },
  },
  {
    id: 'buffIcons_36_5',
    name: 'BuffIcon 36.5',
    flavor: 'Auto-generated bufficon entry number 2975 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack36', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_36' },
  },
  {
    id: 'buffIcons_36_6',
    name: 'BuffIcon 36.6',
    flavor: 'Auto-generated bufficon entry number 2976 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack36', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
];

export function getBuffIconEntry36(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_36.find(e => e.id === id);
}
