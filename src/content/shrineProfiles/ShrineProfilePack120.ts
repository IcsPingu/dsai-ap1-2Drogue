// src/content/shrineProfiles/ShrineProfilePack120.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_120: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_120_1',
    name: 'ShrineProfile 120.1',
    flavor: 'Auto-generated shrineprofile entry number 4855 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack120', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_120' },
  },
  {
    id: 'shrineProfiles_120_2',
    name: 'ShrineProfile 120.2',
    flavor: 'Auto-generated shrineprofile entry number 4856 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack120', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_120' },
  },
  {
    id: 'shrineProfiles_120_3',
    name: 'ShrineProfile 120.3',
    flavor: 'Auto-generated shrineprofile entry number 4857 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack120', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_120' },
  },
  {
    id: 'shrineProfiles_120_4',
    name: 'ShrineProfile 120.4',
    flavor: 'Auto-generated shrineprofile entry number 4858 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack120', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_120' },
  },
  {
    id: 'shrineProfiles_120_5',
    name: 'ShrineProfile 120.5',
    flavor: 'Auto-generated shrineprofile entry number 4859 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack120', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_120' },
  },
  {
    id: 'shrineProfiles_120_6',
    name: 'ShrineProfile 120.6',
    flavor: 'Auto-generated shrineprofile entry number 4860 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack120', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_120' },
  },
];

export function getShrineProfileEntry120(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_120.find(e => e.id === id);
}
