// src/content/shrineProfiles/ShrineProfilePack144.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_144: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_144_1',
    name: 'ShrineProfile 144.1',
    flavor: 'Auto-generated shrineprofile entry number 4999 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack144', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_144' },
  },
  {
    id: 'shrineProfiles_144_2',
    name: 'ShrineProfile 144.2',
    flavor: 'Auto-generated shrineprofile entry number 5000 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack144', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_144' },
  },
  {
    id: 'shrineProfiles_144_3',
    name: 'ShrineProfile 144.3',
    flavor: 'Auto-generated shrineprofile entry number 5001 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack144', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_144' },
  },
  {
    id: 'shrineProfiles_144_4',
    name: 'ShrineProfile 144.4',
    flavor: 'Auto-generated shrineprofile entry number 5002 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack144', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_144' },
  },
  {
    id: 'shrineProfiles_144_5',
    name: 'ShrineProfile 144.5',
    flavor: 'Auto-generated shrineprofile entry number 5003 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack144', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_144' },
  },
  {
    id: 'shrineProfiles_144_6',
    name: 'ShrineProfile 144.6',
    flavor: 'Auto-generated shrineprofile entry number 5004 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack144', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_144' },
  },
];

export function getShrineProfileEntry144(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_144.find(e => e.id === id);
}
