// src/content/shrineProfiles/ShrineProfilePack25.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_25: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_25_1',
    name: 'ShrineProfile 25.1',
    flavor: 'Auto-generated shrineprofile entry number 4285 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'shrineProfiles_25_2',
    name: 'ShrineProfile 25.2',
    flavor: 'Auto-generated shrineprofile entry number 4286 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'shrineProfiles_25_3',
    name: 'ShrineProfile 25.3',
    flavor: 'Auto-generated shrineprofile entry number 4287 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'shrineProfiles_25_4',
    name: 'ShrineProfile 25.4',
    flavor: 'Auto-generated shrineprofile entry number 4288 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'shrineProfiles_25_5',
    name: 'ShrineProfile 25.5',
    flavor: 'Auto-generated shrineprofile entry number 4289 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'shrineProfiles_25_6',
    name: 'ShrineProfile 25.6',
    flavor: 'Auto-generated shrineprofile entry number 4290 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getShrineProfileEntry25(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_25.find(e => e.id === id);
}
