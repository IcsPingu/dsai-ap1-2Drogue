// src/content/shrineProfiles/ShrineProfilePack4.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_4: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_4_1',
    name: 'ShrineProfile 4.1',
    flavor: 'Auto-generated shrineprofile entry number 4159 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack4', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
  {
    id: 'shrineProfiles_4_2',
    name: 'ShrineProfile 4.2',
    flavor: 'Auto-generated shrineprofile entry number 4160 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack4', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_4' },
  },
  {
    id: 'shrineProfiles_4_3',
    name: 'ShrineProfile 4.3',
    flavor: 'Auto-generated shrineprofile entry number 4161 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack4', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_4' },
  },
  {
    id: 'shrineProfiles_4_4',
    name: 'ShrineProfile 4.4',
    flavor: 'Auto-generated shrineprofile entry number 4162 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack4', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_4' },
  },
  {
    id: 'shrineProfiles_4_5',
    name: 'ShrineProfile 4.5',
    flavor: 'Auto-generated shrineprofile entry number 4163 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack4', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_4' },
  },
  {
    id: 'shrineProfiles_4_6',
    name: 'ShrineProfile 4.6',
    flavor: 'Auto-generated shrineprofile entry number 4164 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack4', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
];

export function getShrineProfileEntry4(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_4.find(e => e.id === id);
}
