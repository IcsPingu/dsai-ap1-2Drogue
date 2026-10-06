// src/content/biomeProfiles/BiomeProfilePack5.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_5: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_5_1',
    name: 'BiomeProfile 5.1',
    flavor: 'Auto-generated biomeprofile entry number 3325 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'biomeProfiles_5_2',
    name: 'BiomeProfile 5.2',
    flavor: 'Auto-generated biomeprofile entry number 3326 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'biomeProfiles_5_3',
    name: 'BiomeProfile 5.3',
    flavor: 'Auto-generated biomeprofile entry number 3327 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'biomeProfiles_5_4',
    name: 'BiomeProfile 5.4',
    flavor: 'Auto-generated biomeprofile entry number 3328 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'biomeProfiles_5_5',
    name: 'BiomeProfile 5.5',
    flavor: 'Auto-generated biomeprofile entry number 3329 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'biomeProfiles_5_6',
    name: 'BiomeProfile 5.6',
    flavor: 'Auto-generated biomeprofile entry number 3330 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getBiomeProfileEntry5(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_5.find(e => e.id === id);
}
