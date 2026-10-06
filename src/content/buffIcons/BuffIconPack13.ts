// src/content/buffIcons/BuffIconPack13.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_13: BuffIconEntry[] = [
  {
    id: 'buffIcons_13_1',
    name: 'BuffIcon 13.1',
    flavor: 'Auto-generated bufficon entry number 2833 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'buffIcons_13_2',
    name: 'BuffIcon 13.2',
    flavor: 'Auto-generated bufficon entry number 2834 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'buffIcons_13_3',
    name: 'BuffIcon 13.3',
    flavor: 'Auto-generated bufficon entry number 2835 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'buffIcons_13_4',
    name: 'BuffIcon 13.4',
    flavor: 'Auto-generated bufficon entry number 2836 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'buffIcons_13_5',
    name: 'BuffIcon 13.5',
    flavor: 'Auto-generated bufficon entry number 2837 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'buffIcons_13_6',
    name: 'BuffIcon 13.6',
    flavor: 'Auto-generated bufficon entry number 2838 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getBuffIconEntry13(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_13.find(e => e.id === id);
}
