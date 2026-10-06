// src/content/shrineProfiles/ShrineProfilePack130.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_130: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_130_1',
    name: 'ShrineProfile 130.1',
    flavor: 'Auto-generated shrineprofile entry number 4915 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack130', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_130' },
  },
  {
    id: 'shrineProfiles_130_2',
    name: 'ShrineProfile 130.2',
    flavor: 'Auto-generated shrineprofile entry number 4916 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack130', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_130' },
  },
  {
    id: 'shrineProfiles_130_3',
    name: 'ShrineProfile 130.3',
    flavor: 'Auto-generated shrineprofile entry number 4917 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack130', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_130' },
  },
  {
    id: 'shrineProfiles_130_4',
    name: 'ShrineProfile 130.4',
    flavor: 'Auto-generated shrineprofile entry number 4918 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack130', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_130' },
  },
  {
    id: 'shrineProfiles_130_5',
    name: 'ShrineProfile 130.5',
    flavor: 'Auto-generated shrineprofile entry number 4919 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack130', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_130' },
  },
  {
    id: 'shrineProfiles_130_6',
    name: 'ShrineProfile 130.6',
    flavor: 'Auto-generated shrineprofile entry number 4920 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack130', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_130' },
  },
];

export function getShrineProfileEntry130(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_130.find(e => e.id === id);
}
