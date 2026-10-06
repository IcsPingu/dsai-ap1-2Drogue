// src/content/buffIcons/BuffIconPack16.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_16: BuffIconEntry[] = [
  {
    id: 'buffIcons_16_1',
    name: 'BuffIcon 16.1',
    flavor: 'Auto-generated bufficon entry number 2851 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack16', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_16' },
  },
  {
    id: 'buffIcons_16_2',
    name: 'BuffIcon 16.2',
    flavor: 'Auto-generated bufficon entry number 2852 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack16', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_16' },
  },
  {
    id: 'buffIcons_16_3',
    name: 'BuffIcon 16.3',
    flavor: 'Auto-generated bufficon entry number 2853 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack16', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_16' },
  },
  {
    id: 'buffIcons_16_4',
    name: 'BuffIcon 16.4',
    flavor: 'Auto-generated bufficon entry number 2854 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack16', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_16' },
  },
  {
    id: 'buffIcons_16_5',
    name: 'BuffIcon 16.5',
    flavor: 'Auto-generated bufficon entry number 2855 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack16', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_16' },
  },
  {
    id: 'buffIcons_16_6',
    name: 'BuffIcon 16.6',
    flavor: 'Auto-generated bufficon entry number 2856 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack16', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_16' },
  },
];

export function getBuffIconEntry16(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_16.find(e => e.id === id);
}
