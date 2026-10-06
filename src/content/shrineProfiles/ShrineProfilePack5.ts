// src/content/shrineProfiles/ShrineProfilePack5.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_5: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_5_1',
    name: 'ShrineProfile 5.1',
    flavor: 'Auto-generated shrineprofile entry number 4165 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'shrineProfiles_5_2',
    name: 'ShrineProfile 5.2',
    flavor: 'Auto-generated shrineprofile entry number 4166 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'shrineProfiles_5_3',
    name: 'ShrineProfile 5.3',
    flavor: 'Auto-generated shrineprofile entry number 4167 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'shrineProfiles_5_4',
    name: 'ShrineProfile 5.4',
    flavor: 'Auto-generated shrineprofile entry number 4168 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'shrineProfiles_5_5',
    name: 'ShrineProfile 5.5',
    flavor: 'Auto-generated shrineprofile entry number 4169 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'shrineProfiles_5_6',
    name: 'ShrineProfile 5.6',
    flavor: 'Auto-generated shrineprofile entry number 4170 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getShrineProfileEntry5(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_5.find(e => e.id === id);
}
