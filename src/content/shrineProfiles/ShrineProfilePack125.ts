// src/content/shrineProfiles/ShrineProfilePack125.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_125: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_125_1',
    name: 'ShrineProfile 125.1',
    flavor: 'Auto-generated shrineprofile entry number 4885 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack125', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_125' },
  },
  {
    id: 'shrineProfiles_125_2',
    name: 'ShrineProfile 125.2',
    flavor: 'Auto-generated shrineprofile entry number 4886 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack125', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_125' },
  },
  {
    id: 'shrineProfiles_125_3',
    name: 'ShrineProfile 125.3',
    flavor: 'Auto-generated shrineprofile entry number 4887 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack125', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_125' },
  },
  {
    id: 'shrineProfiles_125_4',
    name: 'ShrineProfile 125.4',
    flavor: 'Auto-generated shrineprofile entry number 4888 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack125', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_125' },
  },
  {
    id: 'shrineProfiles_125_5',
    name: 'ShrineProfile 125.5',
    flavor: 'Auto-generated shrineprofile entry number 4889 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack125', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_125' },
  },
  {
    id: 'shrineProfiles_125_6',
    name: 'ShrineProfile 125.6',
    flavor: 'Auto-generated shrineprofile entry number 4890 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack125', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_125' },
  },
];

export function getShrineProfileEntry125(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_125.find(e => e.id === id);
}
