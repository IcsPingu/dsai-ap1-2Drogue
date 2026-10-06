// src/content/buffIcons/BuffIconPack25.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_25: BuffIconEntry[] = [
  {
    id: 'buffIcons_25_1',
    name: 'BuffIcon 25.1',
    flavor: 'Auto-generated bufficon entry number 2905 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'buffIcons_25_2',
    name: 'BuffIcon 25.2',
    flavor: 'Auto-generated bufficon entry number 2906 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'buffIcons_25_3',
    name: 'BuffIcon 25.3',
    flavor: 'Auto-generated bufficon entry number 2907 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'buffIcons_25_4',
    name: 'BuffIcon 25.4',
    flavor: 'Auto-generated bufficon entry number 2908 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'buffIcons_25_5',
    name: 'BuffIcon 25.5',
    flavor: 'Auto-generated bufficon entry number 2909 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'buffIcons_25_6',
    name: 'BuffIcon 25.6',
    flavor: 'Auto-generated bufficon entry number 2910 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getBuffIconEntry25(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_25.find(e => e.id === id);
}
