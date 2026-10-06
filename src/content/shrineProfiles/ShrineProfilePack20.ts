// src/content/shrineProfiles/ShrineProfilePack20.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_20: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_20_1',
    name: 'ShrineProfile 20.1',
    flavor: 'Auto-generated shrineprofile entry number 4255 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack20', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
  {
    id: 'shrineProfiles_20_2',
    name: 'ShrineProfile 20.2',
    flavor: 'Auto-generated shrineprofile entry number 4256 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack20', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_20' },
  },
  {
    id: 'shrineProfiles_20_3',
    name: 'ShrineProfile 20.3',
    flavor: 'Auto-generated shrineprofile entry number 4257 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack20', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_20' },
  },
  {
    id: 'shrineProfiles_20_4',
    name: 'ShrineProfile 20.4',
    flavor: 'Auto-generated shrineprofile entry number 4258 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack20', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_20' },
  },
  {
    id: 'shrineProfiles_20_5',
    name: 'ShrineProfile 20.5',
    flavor: 'Auto-generated shrineprofile entry number 4259 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack20', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_20' },
  },
  {
    id: 'shrineProfiles_20_6',
    name: 'ShrineProfile 20.6',
    flavor: 'Auto-generated shrineprofile entry number 4260 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack20', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
];

export function getShrineProfileEntry20(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_20.find(e => e.id === id);
}
