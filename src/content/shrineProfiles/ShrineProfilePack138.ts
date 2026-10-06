// src/content/shrineProfiles/ShrineProfilePack138.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_138: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_138_1',
    name: 'ShrineProfile 138.1',
    flavor: 'Auto-generated shrineprofile entry number 4963 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack138', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_138' },
  },
  {
    id: 'shrineProfiles_138_2',
    name: 'ShrineProfile 138.2',
    flavor: 'Auto-generated shrineprofile entry number 4964 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack138', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_138' },
  },
  {
    id: 'shrineProfiles_138_3',
    name: 'ShrineProfile 138.3',
    flavor: 'Auto-generated shrineprofile entry number 4965 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack138', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_138' },
  },
  {
    id: 'shrineProfiles_138_4',
    name: 'ShrineProfile 138.4',
    flavor: 'Auto-generated shrineprofile entry number 4966 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack138', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_138' },
  },
  {
    id: 'shrineProfiles_138_5',
    name: 'ShrineProfile 138.5',
    flavor: 'Auto-generated shrineprofile entry number 4967 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack138', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_138' },
  },
  {
    id: 'shrineProfiles_138_6',
    name: 'ShrineProfile 138.6',
    flavor: 'Auto-generated shrineprofile entry number 4968 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack138', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_138' },
  },
];

export function getShrineProfileEntry138(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_138.find(e => e.id === id);
}
