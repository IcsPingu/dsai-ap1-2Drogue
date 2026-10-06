// src/content/shrineProfiles/ShrineProfilePack60.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_60: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_60_1',
    name: 'ShrineProfile 60.1',
    flavor: 'Auto-generated shrineprofile entry number 4495 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack60', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_60' },
  },
  {
    id: 'shrineProfiles_60_2',
    name: 'ShrineProfile 60.2',
    flavor: 'Auto-generated shrineprofile entry number 4496 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack60', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_60' },
  },
  {
    id: 'shrineProfiles_60_3',
    name: 'ShrineProfile 60.3',
    flavor: 'Auto-generated shrineprofile entry number 4497 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack60', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_60' },
  },
  {
    id: 'shrineProfiles_60_4',
    name: 'ShrineProfile 60.4',
    flavor: 'Auto-generated shrineprofile entry number 4498 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack60', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_60' },
  },
  {
    id: 'shrineProfiles_60_5',
    name: 'ShrineProfile 60.5',
    flavor: 'Auto-generated shrineprofile entry number 4499 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack60', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_60' },
  },
  {
    id: 'shrineProfiles_60_6',
    name: 'ShrineProfile 60.6',
    flavor: 'Auto-generated shrineprofile entry number 4500 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack60', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_60' },
  },
];

export function getShrineProfileEntry60(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_60.find(e => e.id === id);
}
