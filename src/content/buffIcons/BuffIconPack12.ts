// src/content/buffIcons/BuffIconPack12.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_12: BuffIconEntry[] = [
  {
    id: 'buffIcons_12_1',
    name: 'BuffIcon 12.1',
    flavor: 'Auto-generated bufficon entry number 2827 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack12', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_12' },
  },
  {
    id: 'buffIcons_12_2',
    name: 'BuffIcon 12.2',
    flavor: 'Auto-generated bufficon entry number 2828 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack12', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_12' },
  },
  {
    id: 'buffIcons_12_3',
    name: 'BuffIcon 12.3',
    flavor: 'Auto-generated bufficon entry number 2829 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack12', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_12' },
  },
  {
    id: 'buffIcons_12_4',
    name: 'BuffIcon 12.4',
    flavor: 'Auto-generated bufficon entry number 2830 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack12', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_12' },
  },
  {
    id: 'buffIcons_12_5',
    name: 'BuffIcon 12.5',
    flavor: 'Auto-generated bufficon entry number 2831 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack12', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_12' },
  },
  {
    id: 'buffIcons_12_6',
    name: 'BuffIcon 12.6',
    flavor: 'Auto-generated bufficon entry number 2832 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack12', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_12' },
  },
];

export function getBuffIconEntry12(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_12.find(e => e.id === id);
}
