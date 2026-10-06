// src/content/shrineProfiles/ShrineProfilePack13.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_13: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_13_1',
    name: 'ShrineProfile 13.1',
    flavor: 'Auto-generated shrineprofile entry number 4213 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'shrineProfiles_13_2',
    name: 'ShrineProfile 13.2',
    flavor: 'Auto-generated shrineprofile entry number 4214 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'shrineProfiles_13_3',
    name: 'ShrineProfile 13.3',
    flavor: 'Auto-generated shrineprofile entry number 4215 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'shrineProfiles_13_4',
    name: 'ShrineProfile 13.4',
    flavor: 'Auto-generated shrineprofile entry number 4216 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'shrineProfiles_13_5',
    name: 'ShrineProfile 13.5',
    flavor: 'Auto-generated shrineprofile entry number 4217 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'shrineProfiles_13_6',
    name: 'ShrineProfile 13.6',
    flavor: 'Auto-generated shrineprofile entry number 4218 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getShrineProfileEntry13(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_13.find(e => e.id === id);
}
