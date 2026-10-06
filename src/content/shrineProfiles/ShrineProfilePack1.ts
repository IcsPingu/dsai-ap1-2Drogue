// src/content/shrineProfiles/ShrineProfilePack1.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_1: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_1_1',
    name: 'ShrineProfile 1.1',
    flavor: 'Auto-generated shrineprofile entry number 4141 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'shrineProfiles_1_2',
    name: 'ShrineProfile 1.2',
    flavor: 'Auto-generated shrineprofile entry number 4142 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'shrineProfiles_1_3',
    name: 'ShrineProfile 1.3',
    flavor: 'Auto-generated shrineprofile entry number 4143 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'shrineProfiles_1_4',
    name: 'ShrineProfile 1.4',
    flavor: 'Auto-generated shrineprofile entry number 4144 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'shrineProfiles_1_5',
    name: 'ShrineProfile 1.5',
    flavor: 'Auto-generated shrineprofile entry number 4145 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'shrineProfiles_1_6',
    name: 'ShrineProfile 1.6',
    flavor: 'Auto-generated shrineprofile entry number 4146 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getShrineProfileEntry1(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_1.find(e => e.id === id);
}
