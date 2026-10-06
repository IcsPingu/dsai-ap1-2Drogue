// src/content/shrineProfiles/ShrineProfilePack105.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_105: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_105_1',
    name: 'ShrineProfile 105.1',
    flavor: 'Auto-generated shrineprofile entry number 4765 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack105', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_105' },
  },
  {
    id: 'shrineProfiles_105_2',
    name: 'ShrineProfile 105.2',
    flavor: 'Auto-generated shrineprofile entry number 4766 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack105', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_105' },
  },
  {
    id: 'shrineProfiles_105_3',
    name: 'ShrineProfile 105.3',
    flavor: 'Auto-generated shrineprofile entry number 4767 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack105', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_105' },
  },
  {
    id: 'shrineProfiles_105_4',
    name: 'ShrineProfile 105.4',
    flavor: 'Auto-generated shrineprofile entry number 4768 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack105', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_105' },
  },
  {
    id: 'shrineProfiles_105_5',
    name: 'ShrineProfile 105.5',
    flavor: 'Auto-generated shrineprofile entry number 4769 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack105', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_105' },
  },
  {
    id: 'shrineProfiles_105_6',
    name: 'ShrineProfile 105.6',
    flavor: 'Auto-generated shrineprofile entry number 4770 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack105', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_105' },
  },
];

export function getShrineProfileEntry105(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_105.find(e => e.id === id);
}
