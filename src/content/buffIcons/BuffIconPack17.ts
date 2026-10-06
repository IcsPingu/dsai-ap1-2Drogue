// src/content/buffIcons/BuffIconPack17.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_17: BuffIconEntry[] = [
  {
    id: 'buffIcons_17_1',
    name: 'BuffIcon 17.1',
    flavor: 'Auto-generated bufficon entry number 2857 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack17', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
  {
    id: 'buffIcons_17_2',
    name: 'BuffIcon 17.2',
    flavor: 'Auto-generated bufficon entry number 2858 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack17', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_17' },
  },
  {
    id: 'buffIcons_17_3',
    name: 'BuffIcon 17.3',
    flavor: 'Auto-generated bufficon entry number 2859 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack17', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_17' },
  },
  {
    id: 'buffIcons_17_4',
    name: 'BuffIcon 17.4',
    flavor: 'Auto-generated bufficon entry number 2860 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack17', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_17' },
  },
  {
    id: 'buffIcons_17_5',
    name: 'BuffIcon 17.5',
    flavor: 'Auto-generated bufficon entry number 2861 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack17', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_17' },
  },
  {
    id: 'buffIcons_17_6',
    name: 'BuffIcon 17.6',
    flavor: 'Auto-generated bufficon entry number 2862 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack17', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
];

export function getBuffIconEntry17(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_17.find(e => e.id === id);
}
