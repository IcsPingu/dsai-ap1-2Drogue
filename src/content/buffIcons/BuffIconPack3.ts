// src/content/buffIcons/BuffIconPack3.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_3: BuffIconEntry[] = [
  {
    id: 'buffIcons_3_1',
    name: 'BuffIcon 3.1',
    flavor: 'Auto-generated bufficon entry number 2773 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack3', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_3' },
  },
  {
    id: 'buffIcons_3_2',
    name: 'BuffIcon 3.2',
    flavor: 'Auto-generated bufficon entry number 2774 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack3', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_3' },
  },
  {
    id: 'buffIcons_3_3',
    name: 'BuffIcon 3.3',
    flavor: 'Auto-generated bufficon entry number 2775 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack3', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_3' },
  },
  {
    id: 'buffIcons_3_4',
    name: 'BuffIcon 3.4',
    flavor: 'Auto-generated bufficon entry number 2776 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack3', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_3' },
  },
  {
    id: 'buffIcons_3_5',
    name: 'BuffIcon 3.5',
    flavor: 'Auto-generated bufficon entry number 2777 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack3', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_3' },
  },
  {
    id: 'buffIcons_3_6',
    name: 'BuffIcon 3.6',
    flavor: 'Auto-generated bufficon entry number 2778 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack3', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_3' },
  },
];

export function getBuffIconEntry3(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_3.find(e => e.id === id);
}
