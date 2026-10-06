// src/content/buffIcons/BuffIconPack22.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_22: BuffIconEntry[] = [
  {
    id: 'buffIcons_22_1',
    name: 'BuffIcon 22.1',
    flavor: 'Auto-generated bufficon entry number 2887 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack22', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_22' },
  },
  {
    id: 'buffIcons_22_2',
    name: 'BuffIcon 22.2',
    flavor: 'Auto-generated bufficon entry number 2888 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack22', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_22' },
  },
  {
    id: 'buffIcons_22_3',
    name: 'BuffIcon 22.3',
    flavor: 'Auto-generated bufficon entry number 2889 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack22', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_22' },
  },
  {
    id: 'buffIcons_22_4',
    name: 'BuffIcon 22.4',
    flavor: 'Auto-generated bufficon entry number 2890 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack22', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_22' },
  },
  {
    id: 'buffIcons_22_5',
    name: 'BuffIcon 22.5',
    flavor: 'Auto-generated bufficon entry number 2891 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack22', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_22' },
  },
  {
    id: 'buffIcons_22_6',
    name: 'BuffIcon 22.6',
    flavor: 'Auto-generated bufficon entry number 2892 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack22', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_22' },
  },
];

export function getBuffIconEntry22(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_22.find(e => e.id === id);
}
