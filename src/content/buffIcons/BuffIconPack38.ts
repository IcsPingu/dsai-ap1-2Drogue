// src/content/buffIcons/BuffIconPack38.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_38: BuffIconEntry[] = [
  {
    id: 'buffIcons_38_1',
    name: 'BuffIcon 38.1',
    flavor: 'Auto-generated bufficon entry number 2983 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack38', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_38' },
  },
  {
    id: 'buffIcons_38_2',
    name: 'BuffIcon 38.2',
    flavor: 'Auto-generated bufficon entry number 2984 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack38', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_38' },
  },
  {
    id: 'buffIcons_38_3',
    name: 'BuffIcon 38.3',
    flavor: 'Auto-generated bufficon entry number 2985 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack38', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_38' },
  },
  {
    id: 'buffIcons_38_4',
    name: 'BuffIcon 38.4',
    flavor: 'Auto-generated bufficon entry number 2986 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack38', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_38' },
  },
  {
    id: 'buffIcons_38_5',
    name: 'BuffIcon 38.5',
    flavor: 'Auto-generated bufficon entry number 2987 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack38', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_38' },
  },
  {
    id: 'buffIcons_38_6',
    name: 'BuffIcon 38.6',
    flavor: 'Auto-generated bufficon entry number 2988 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack38', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_38' },
  },
];

export function getBuffIconEntry38(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_38.find(e => e.id === id);
}
