// src/content/buffIcons/BuffIconPack11.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_11: BuffIconEntry[] = [
  {
    id: 'buffIcons_11_1',
    name: 'BuffIcon 11.1',
    flavor: 'Auto-generated bufficon entry number 2821 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack11', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_11' },
  },
  {
    id: 'buffIcons_11_2',
    name: 'BuffIcon 11.2',
    flavor: 'Auto-generated bufficon entry number 2822 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack11', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_11' },
  },
  {
    id: 'buffIcons_11_3',
    name: 'BuffIcon 11.3',
    flavor: 'Auto-generated bufficon entry number 2823 for the content pack system.',
    weight: 4,
    tags: ['buffIcons', 'pack11', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_11' },
  },
  {
    id: 'buffIcons_11_4',
    name: 'BuffIcon 11.4',
    flavor: 'Auto-generated bufficon entry number 2824 for the content pack system.',
    weight: 5,
    tags: ['buffIcons', 'pack11', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_11' },
  },
  {
    id: 'buffIcons_11_5',
    name: 'BuffIcon 11.5',
    flavor: 'Auto-generated bufficon entry number 2825 for the content pack system.',
    weight: 6,
    tags: ['buffIcons', 'pack11', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_11' },
  },
  {
    id: 'buffIcons_11_6',
    name: 'BuffIcon 11.6',
    flavor: 'Auto-generated bufficon entry number 2826 for the content pack system.',
    weight: 7,
    tags: ['buffIcons', 'pack11', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_11' },
  },
];

export function getBuffIconEntry11(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_11.find(e => e.id === id);
}
