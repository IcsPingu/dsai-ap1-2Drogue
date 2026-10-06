// src/content/buffIcons/BuffIconPack5.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_5: BuffIconEntry[] = [
  {
    id: 'buffIcons_5_1',
    name: 'BuffIcon 5.1',
    flavor: 'Auto-generated bufficon entry number 2785 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'buffIcons_5_2',
    name: 'BuffIcon 5.2',
    flavor: 'Auto-generated bufficon entry number 2786 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'buffIcons_5_3',
    name: 'BuffIcon 5.3',
    flavor: 'Auto-generated bufficon entry number 2787 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'buffIcons_5_4',
    name: 'BuffIcon 5.4',
    flavor: 'Auto-generated bufficon entry number 2788 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'buffIcons_5_5',
    name: 'BuffIcon 5.5',
    flavor: 'Auto-generated bufficon entry number 2789 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'buffIcons_5_6',
    name: 'BuffIcon 5.6',
    flavor: 'Auto-generated bufficon entry number 2790 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getBuffIconEntry5(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_5.find(e => e.id === id);
}
