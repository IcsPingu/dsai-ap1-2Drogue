// src/content/buffIcons/BuffIconPack27.ts
// Auto-generated content pack.

export interface BuffIconEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BUFFICON_PACK_27: BuffIconEntry[] = [
  {
    id: 'buffIcons_27_1',
    name: 'BuffIcon 27.1',
    flavor: 'Auto-generated bufficon entry number 2917 for the content pack system.',
    weight: 8,
    tags: ['buffIcons', 'pack27', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_27' },
  },
  {
    id: 'buffIcons_27_2',
    name: 'BuffIcon 27.2',
    flavor: 'Auto-generated bufficon entry number 2918 for the content pack system.',
    weight: 9,
    tags: ['buffIcons', 'pack27', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_27' },
  },
  {
    id: 'buffIcons_27_3',
    name: 'BuffIcon 27.3',
    flavor: 'Auto-generated bufficon entry number 2919 for the content pack system.',
    weight: 10,
    tags: ['buffIcons', 'pack27', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_27' },
  },
  {
    id: 'buffIcons_27_4',
    name: 'BuffIcon 27.4',
    flavor: 'Auto-generated bufficon entry number 2920 for the content pack system.',
    weight: 1,
    tags: ['buffIcons', 'pack27', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_27' },
  },
  {
    id: 'buffIcons_27_5',
    name: 'BuffIcon 27.5',
    flavor: 'Auto-generated bufficon entry number 2921 for the content pack system.',
    weight: 2,
    tags: ['buffIcons', 'pack27', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_27' },
  },
  {
    id: 'buffIcons_27_6',
    name: 'BuffIcon 27.6',
    flavor: 'Auto-generated bufficon entry number 2922 for the content pack system.',
    weight: 3,
    tags: ['buffIcons', 'pack27', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_27' },
  },
];

export function getBuffIconEntry27(id: string): BuffIconEntry | undefined {
  return BUFFICON_PACK_27.find(e => e.id === id);
}
