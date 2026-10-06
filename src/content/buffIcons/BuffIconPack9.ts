// src/content/buffIcons/BuffIconPack9.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_9: BuffIconEntry[] = [
  {
    id: 'buffIcons_9_1',
    name: 'BuffIcon 9.1',
    flavor: 'Auto-generated bufficon entry number 2809 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack9', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_9' },
  },
  {
    id: 'buffIcons_9_2',
    name: 'BuffIcon 9.2',
    flavor: 'Auto-generated bufficon entry number 2810 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack9', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_9' },
  },
  {
    id: 'buffIcons_9_3',
    name: 'BuffIcon 9.3',
    flavor: 'Auto-generated bufficon entry number 2811 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack9', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_9' },
  },
  {
    id: 'buffIcons_9_4',
    name: 'BuffIcon 9.4',
    flavor: 'Auto-generated bufficon entry number 2812 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack9', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_9' },
  },
  {
    id: 'buffIcons_9_5',
    name: 'BuffIcon 9.5',
    flavor: 'Auto-generated bufficon entry number 2813 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack9', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_9' },
  },
  {
    id: 'buffIcons_9_6',
    name: 'BuffIcon 9.6',
    flavor: 'Auto-generated bufficon entry number 2814 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack9', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_9' },
  },
];

export function getBuffIconEntry9(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_9.find(e => e.id === id);
}
