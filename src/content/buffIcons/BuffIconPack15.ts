// src/content/buffIcons/BuffIconPack15.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_15: BuffIconEntry[] = [
  {
    id: 'buffIcons_15_1',
    name: 'BuffIcon 15.1',
    flavor: 'Auto-generated bufficon entry number 2845 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack15', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_15' },
  },
  {
    id: 'buffIcons_15_2',
    name: 'BuffIcon 15.2',
    flavor: 'Auto-generated bufficon entry number 2846 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack15', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_15' },
  },
  {
    id: 'buffIcons_15_3',
    name: 'BuffIcon 15.3',
    flavor: 'Auto-generated bufficon entry number 2847 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack15', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_15' },
  },
  {
    id: 'buffIcons_15_4',
    name: 'BuffIcon 15.4',
    flavor: 'Auto-generated bufficon entry number 2848 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack15', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_15' },
  },
  {
    id: 'buffIcons_15_5',
    name: 'BuffIcon 15.5',
    flavor: 'Auto-generated bufficon entry number 2849 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack15', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_15' },
  },
  {
    id: 'buffIcons_15_6',
    name: 'BuffIcon 15.6',
    flavor: 'Auto-generated bufficon entry number 2850 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack15', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_15' },
  },
];

export function getBuffIconEntry15(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_15.find(e => e.id === id);
}
