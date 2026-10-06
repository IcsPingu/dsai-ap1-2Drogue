// src/content/shrineProfiles/ShrineProfilePack14.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_14: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_14_1',
    name: 'ShrineProfile 14.1',
    flavor: 'Auto-generated shrineprofile entry number 4219 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'shrineProfiles_14_2',
    name: 'ShrineProfile 14.2',
    flavor: 'Auto-generated shrineprofile entry number 4220 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'shrineProfiles_14_3',
    name: 'ShrineProfile 14.3',
    flavor: 'Auto-generated shrineprofile entry number 4221 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'shrineProfiles_14_4',
    name: 'ShrineProfile 14.4',
    flavor: 'Auto-generated shrineprofile entry number 4222 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'shrineProfiles_14_5',
    name: 'ShrineProfile 14.5',
    flavor: 'Auto-generated shrineprofile entry number 4223 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'shrineProfiles_14_6',
    name: 'ShrineProfile 14.6',
    flavor: 'Auto-generated shrineprofile entry number 4224 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getShrineProfileEntry14(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_14.find(e => e.id === id);
}
