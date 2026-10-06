// src/content/shrineProfiles/ShrineProfilePack126.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_126: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_126_1',
    name: 'ShrineProfile 126.1',
    flavor: 'Auto-generated shrineprofile entry number 4891 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack126', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_126' },
  },
  {
    id: 'shrineProfiles_126_2',
    name: 'ShrineProfile 126.2',
    flavor: 'Auto-generated shrineprofile entry number 4892 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack126', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_126' },
  },
  {
    id: 'shrineProfiles_126_3',
    name: 'ShrineProfile 126.3',
    flavor: 'Auto-generated shrineprofile entry number 4893 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack126', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_126' },
  },
  {
    id: 'shrineProfiles_126_4',
    name: 'ShrineProfile 126.4',
    flavor: 'Auto-generated shrineprofile entry number 4894 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack126', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_126' },
  },
  {
    id: 'shrineProfiles_126_5',
    name: 'ShrineProfile 126.5',
    flavor: 'Auto-generated shrineprofile entry number 4895 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack126', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_126' },
  },
  {
    id: 'shrineProfiles_126_6',
    name: 'ShrineProfile 126.6',
    flavor: 'Auto-generated shrineprofile entry number 4896 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack126', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_126' },
  },
];

export function getShrineProfileEntry126(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_126.find(e => e.id === id);
}
