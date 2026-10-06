// src/content/buffIcons/BuffIconPack6.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_6: BuffIconEntry[] = [
  {
    id: 'buffIcons_6_1',
    name: 'BuffIcon 6.1',
    flavor: 'Auto-generated bufficon entry number 2791 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack6', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
  {
    id: 'buffIcons_6_2',
    name: 'BuffIcon 6.2',
    flavor: 'Auto-generated bufficon entry number 2792 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack6', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_6' },
  },
  {
    id: 'buffIcons_6_3',
    name: 'BuffIcon 6.3',
    flavor: 'Auto-generated bufficon entry number 2793 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack6', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_6' },
  },
  {
    id: 'buffIcons_6_4',
    name: 'BuffIcon 6.4',
    flavor: 'Auto-generated bufficon entry number 2794 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack6', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_6' },
  },
  {
    id: 'buffIcons_6_5',
    name: 'BuffIcon 6.5',
    flavor: 'Auto-generated bufficon entry number 2795 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack6', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_6' },
  },
  {
    id: 'buffIcons_6_6',
    name: 'BuffIcon 6.6',
    flavor: 'Auto-generated bufficon entry number 2796 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack6', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
];

export function getBuffIconEntry6(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_6.find(e => e.id === id);
}
