// src/content/biomeProfiles/BiomeProfilePack122.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_122: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_122_1',
    name: 'BiomeProfile 122.1',
    flavor: 'Auto-generated biomeprofile entry number 4027 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack122', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_122' },
  },
  {
    id: 'biomeProfiles_122_2',
    name: 'BiomeProfile 122.2',
    flavor: 'Auto-generated biomeprofile entry number 4028 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack122', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_122' },
  },
  {
    id: 'biomeProfiles_122_3',
    name: 'BiomeProfile 122.3',
    flavor: 'Auto-generated biomeprofile entry number 4029 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack122', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_122' },
  },
  {
    id: 'biomeProfiles_122_4',
    name: 'BiomeProfile 122.4',
    flavor: 'Auto-generated biomeprofile entry number 4030 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack122', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_122' },
  },
  {
    id: 'biomeProfiles_122_5',
    name: 'BiomeProfile 122.5',
    flavor: 'Auto-generated biomeprofile entry number 4031 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack122', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_122' },
  },
  {
    id: 'biomeProfiles_122_6',
    name: 'BiomeProfile 122.6',
    flavor: 'Auto-generated biomeprofile entry number 4032 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack122', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_122' },
  },
];

export function getBiomeProfileEntry122(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_122.find(e => e.id === id);
}
