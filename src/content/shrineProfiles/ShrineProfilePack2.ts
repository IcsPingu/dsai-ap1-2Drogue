// src/content/shrineProfiles/ShrineProfilePack2.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_2: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_2_1',
    name: 'ShrineProfile 2.1',
    flavor: 'Auto-generated shrineprofile entry number 4147 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'shrineProfiles_2_2',
    name: 'ShrineProfile 2.2',
    flavor: 'Auto-generated shrineprofile entry number 4148 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'shrineProfiles_2_3',
    name: 'ShrineProfile 2.3',
    flavor: 'Auto-generated shrineprofile entry number 4149 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'shrineProfiles_2_4',
    name: 'ShrineProfile 2.4',
    flavor: 'Auto-generated shrineprofile entry number 4150 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'shrineProfiles_2_5',
    name: 'ShrineProfile 2.5',
    flavor: 'Auto-generated shrineprofile entry number 4151 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'shrineProfiles_2_6',
    name: 'ShrineProfile 2.6',
    flavor: 'Auto-generated shrineprofile entry number 4152 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getShrineProfileEntry2(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_2.find(e => e.id === id);
}
