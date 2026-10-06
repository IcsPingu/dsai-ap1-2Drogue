// src/content/shrineProfiles/ShrineProfilePack139.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_139: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_139_1',
    name: 'ShrineProfile 139.1',
    flavor: 'Auto-generated shrineprofile entry number 4969 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack139', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_139' },
  },
  {
    id: 'shrineProfiles_139_2',
    name: 'ShrineProfile 139.2',
    flavor: 'Auto-generated shrineprofile entry number 4970 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack139', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_139' },
  },
  {
    id: 'shrineProfiles_139_3',
    name: 'ShrineProfile 139.3',
    flavor: 'Auto-generated shrineprofile entry number 4971 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack139', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_139' },
  },
  {
    id: 'shrineProfiles_139_4',
    name: 'ShrineProfile 139.4',
    flavor: 'Auto-generated shrineprofile entry number 4972 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack139', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_139' },
  },
  {
    id: 'shrineProfiles_139_5',
    name: 'ShrineProfile 139.5',
    flavor: 'Auto-generated shrineprofile entry number 4973 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack139', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_139' },
  },
  {
    id: 'shrineProfiles_139_6',
    name: 'ShrineProfile 139.6',
    flavor: 'Auto-generated shrineprofile entry number 4974 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack139', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_139' },
  },
];

export function getShrineProfileEntry139(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_139.find(e => e.id === id);
}
