// src/content/buffIcons/BuffIconPack18.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_18: BuffIconEntry[] = [
  {
    id: 'buffIcons_18_1',
    name: 'BuffIcon 18.1',
    flavor: 'Auto-generated bufficon entry number 2863 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack18', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_18' },
  },
  {
    id: 'buffIcons_18_2',
    name: 'BuffIcon 18.2',
    flavor: 'Auto-generated bufficon entry number 2864 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack18', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_18' },
  },
  {
    id: 'buffIcons_18_3',
    name: 'BuffIcon 18.3',
    flavor: 'Auto-generated bufficon entry number 2865 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack18', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_18' },
  },
  {
    id: 'buffIcons_18_4',
    name: 'BuffIcon 18.4',
    flavor: 'Auto-generated bufficon entry number 2866 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack18', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_18' },
  },
  {
    id: 'buffIcons_18_5',
    name: 'BuffIcon 18.5',
    flavor: 'Auto-generated bufficon entry number 2867 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack18', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_18' },
  },
  {
    id: 'buffIcons_18_6',
    name: 'BuffIcon 18.6',
    flavor: 'Auto-generated bufficon entry number 2868 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack18', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_18' },
  },
];

export function getBuffIconEntry18(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_18.find(e => e.id === id);
}
