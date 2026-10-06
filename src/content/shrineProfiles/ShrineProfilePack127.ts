// src/content/shrineProfiles/ShrineProfilePack127.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_127: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_127_1',
    name: 'ShrineProfile 127.1',
    flavor: 'Auto-generated shrineprofile entry number 4897 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack127', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_127' },
  },
  {
    id: 'shrineProfiles_127_2',
    name: 'ShrineProfile 127.2',
    flavor: 'Auto-generated shrineprofile entry number 4898 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack127', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_127' },
  },
  {
    id: 'shrineProfiles_127_3',
    name: 'ShrineProfile 127.3',
    flavor: 'Auto-generated shrineprofile entry number 4899 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack127', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_127' },
  },
  {
    id: 'shrineProfiles_127_4',
    name: 'ShrineProfile 127.4',
    flavor: 'Auto-generated shrineprofile entry number 4900 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack127', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_127' },
  },
  {
    id: 'shrineProfiles_127_5',
    name: 'ShrineProfile 127.5',
    flavor: 'Auto-generated shrineprofile entry number 4901 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack127', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_127' },
  },
  {
    id: 'shrineProfiles_127_6',
    name: 'ShrineProfile 127.6',
    flavor: 'Auto-generated shrineprofile entry number 4902 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack127', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_127' },
  },
];

export function getShrineProfileEntry127(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_127.find(e => e.id === id);
}
