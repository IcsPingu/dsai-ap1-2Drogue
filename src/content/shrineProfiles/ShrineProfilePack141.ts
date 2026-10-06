// src/content/shrineProfiles/ShrineProfilePack141.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_141: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_141_1',
    name: 'ShrineProfile 141.1',
    flavor: 'Auto-generated shrineprofile entry number 4981 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack141', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_141' },
  },
  {
    id: 'shrineProfiles_141_2',
    name: 'ShrineProfile 141.2',
    flavor: 'Auto-generated shrineprofile entry number 4982 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack141', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_141' },
  },
  {
    id: 'shrineProfiles_141_3',
    name: 'ShrineProfile 141.3',
    flavor: 'Auto-generated shrineprofile entry number 4983 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack141', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_141' },
  },
  {
    id: 'shrineProfiles_141_4',
    name: 'ShrineProfile 141.4',
    flavor: 'Auto-generated shrineprofile entry number 4984 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack141', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_141' },
  },
  {
    id: 'shrineProfiles_141_5',
    name: 'ShrineProfile 141.5',
    flavor: 'Auto-generated shrineprofile entry number 4985 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack141', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_141' },
  },
  {
    id: 'shrineProfiles_141_6',
    name: 'ShrineProfile 141.6',
    flavor: 'Auto-generated shrineprofile entry number 4986 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack141', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_141' },
  },
];

export function getShrineProfileEntry141(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_141.find(e => e.id === id);
}
