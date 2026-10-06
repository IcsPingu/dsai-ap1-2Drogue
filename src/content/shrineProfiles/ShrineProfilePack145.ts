// src/content/shrineProfiles/ShrineProfilePack145.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_145: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_145_1',
    name: 'ShrineProfile 145.1',
    flavor: 'Auto-generated shrineprofile entry number 5005 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack145', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_145' },
  },
  {
    id: 'shrineProfiles_145_2',
    name: 'ShrineProfile 145.2',
    flavor: 'Auto-generated shrineprofile entry number 5006 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack145', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_145' },
  },
  {
    id: 'shrineProfiles_145_3',
    name: 'ShrineProfile 145.3',
    flavor: 'Auto-generated shrineprofile entry number 5007 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack145', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_145' },
  },
  {
    id: 'shrineProfiles_145_4',
    name: 'ShrineProfile 145.4',
    flavor: 'Auto-generated shrineprofile entry number 5008 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack145', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_145' },
  },
  {
    id: 'shrineProfiles_145_5',
    name: 'ShrineProfile 145.5',
    flavor: 'Auto-generated shrineprofile entry number 5009 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack145', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_145' },
  },
  {
    id: 'shrineProfiles_145_6',
    name: 'ShrineProfile 145.6',
    flavor: 'Auto-generated shrineprofile entry number 5010 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack145', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_145' },
  },
];

export function getShrineProfileEntry145(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_145.find(e => e.id === id);
}
