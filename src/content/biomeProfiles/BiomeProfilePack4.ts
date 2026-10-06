// src/content/biomeProfiles/BiomeProfilePack4.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_4: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_4_1',
    name: 'BiomeProfile 4.1',
    flavor: 'Auto-generated biomeprofile entry number 3319 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack4', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
  {
    id: 'biomeProfiles_4_2',
    name: 'BiomeProfile 4.2',
    flavor: 'Auto-generated biomeprofile entry number 3320 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack4', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_4' },
  },
  {
    id: 'biomeProfiles_4_3',
    name: 'BiomeProfile 4.3',
    flavor: 'Auto-generated biomeprofile entry number 3321 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack4', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_4' },
  },
  {
    id: 'biomeProfiles_4_4',
    name: 'BiomeProfile 4.4',
    flavor: 'Auto-generated biomeprofile entry number 3322 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack4', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_4' },
  },
  {
    id: 'biomeProfiles_4_5',
    name: 'BiomeProfile 4.5',
    flavor: 'Auto-generated biomeprofile entry number 3323 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack4', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_4' },
  },
  {
    id: 'biomeProfiles_4_6',
    name: 'BiomeProfile 4.6',
    flavor: 'Auto-generated biomeprofile entry number 3324 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack4', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
];

export function getBiomeProfileEntry4(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_4.find(e => e.id === id);
}
