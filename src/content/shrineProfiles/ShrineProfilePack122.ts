// src/content/shrineProfiles/ShrineProfilePack122.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_122: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_122_1',
    name: 'ShrineProfile 122.1',
    flavor: 'Auto-generated shrineprofile entry number 4867 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack122', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_122' },
  },
  {
    id: 'shrineProfiles_122_2',
    name: 'ShrineProfile 122.2',
    flavor: 'Auto-generated shrineprofile entry number 4868 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack122', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_122' },
  },
  {
    id: 'shrineProfiles_122_3',
    name: 'ShrineProfile 122.3',
    flavor: 'Auto-generated shrineprofile entry number 4869 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack122', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_122' },
  },
  {
    id: 'shrineProfiles_122_4',
    name: 'ShrineProfile 122.4',
    flavor: 'Auto-generated shrineprofile entry number 4870 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack122', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_122' },
  },
  {
    id: 'shrineProfiles_122_5',
    name: 'ShrineProfile 122.5',
    flavor: 'Auto-generated shrineprofile entry number 4871 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack122', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_122' },
  },
  {
    id: 'shrineProfiles_122_6',
    name: 'ShrineProfile 122.6',
    flavor: 'Auto-generated shrineprofile entry number 4872 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack122', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_122' },
  },
];

export function getShrineProfileEntry122(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_122.find(e => e.id === id);
}
