// src/content/biomeProfiles/BiomeProfilePack105.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_105: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_105_1',
    name: 'BiomeProfile 105.1',
    flavor: 'Auto-generated biomeprofile entry number 3925 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack105', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_105' },
  },
  {
    id: 'biomeProfiles_105_2',
    name: 'BiomeProfile 105.2',
    flavor: 'Auto-generated biomeprofile entry number 3926 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack105', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_105' },
  },
  {
    id: 'biomeProfiles_105_3',
    name: 'BiomeProfile 105.3',
    flavor: 'Auto-generated biomeprofile entry number 3927 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack105', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_105' },
  },
  {
    id: 'biomeProfiles_105_4',
    name: 'BiomeProfile 105.4',
    flavor: 'Auto-generated biomeprofile entry number 3928 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack105', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_105' },
  },
  {
    id: 'biomeProfiles_105_5',
    name: 'BiomeProfile 105.5',
    flavor: 'Auto-generated biomeprofile entry number 3929 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack105', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_105' },
  },
  {
    id: 'biomeProfiles_105_6',
    name: 'BiomeProfile 105.6',
    flavor: 'Auto-generated biomeprofile entry number 3930 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack105', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_105' },
  },
];

export function getBiomeProfileEntry105(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_105.find(e => e.id === id);
}
