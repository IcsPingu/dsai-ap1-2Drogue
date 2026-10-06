// src/content/buffIcons/BuffIconPack7.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_7: BuffIconEntry[] = [
  {
    id: 'buffIcons_7_1',
    name: 'BuffIcon 7.1',
    flavor: 'Auto-generated bufficon entry number 2797 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack7', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_7' },
  },
  {
    id: 'buffIcons_7_2',
    name: 'BuffIcon 7.2',
    flavor: 'Auto-generated bufficon entry number 2798 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack7', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_7' },
  },
  {
    id: 'buffIcons_7_3',
    name: 'BuffIcon 7.3',
    flavor: 'Auto-generated bufficon entry number 2799 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack7', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_7' },
  },
  {
    id: 'buffIcons_7_4',
    name: 'BuffIcon 7.4',
    flavor: 'Auto-generated bufficon entry number 2800 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack7', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_7' },
  },
  {
    id: 'buffIcons_7_5',
    name: 'BuffIcon 7.5',
    flavor: 'Auto-generated bufficon entry number 2801 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack7', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_7' },
  },
  {
    id: 'buffIcons_7_6',
    name: 'BuffIcon 7.6',
    flavor: 'Auto-generated bufficon entry number 2802 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack7', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_7' },
  },
];

export function getBuffIconEntry7(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_7.find(e => e.id === id);
}
