// src/content/shrineProfiles/ShrineProfilePack137.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_137: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_137_1',
    name: 'ShrineProfile 137.1',
    flavor: 'Auto-generated shrineprofile entry number 4957 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack137', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_137' },
  },
  {
    id: 'shrineProfiles_137_2',
    name: 'ShrineProfile 137.2',
    flavor: 'Auto-generated shrineprofile entry number 4958 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack137', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_137' },
  },
  {
    id: 'shrineProfiles_137_3',
    name: 'ShrineProfile 137.3',
    flavor: 'Auto-generated shrineprofile entry number 4959 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack137', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_137' },
  },
  {
    id: 'shrineProfiles_137_4',
    name: 'ShrineProfile 137.4',
    flavor: 'Auto-generated shrineprofile entry number 4960 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack137', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_137' },
  },
  {
    id: 'shrineProfiles_137_5',
    name: 'ShrineProfile 137.5',
    flavor: 'Auto-generated shrineprofile entry number 4961 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack137', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_137' },
  },
  {
    id: 'shrineProfiles_137_6',
    name: 'ShrineProfile 137.6',
    flavor: 'Auto-generated shrineprofile entry number 4962 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack137', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_137' },
  },
];

export function getShrineProfileEntry137(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_137.find(e => e.id === id);
}
