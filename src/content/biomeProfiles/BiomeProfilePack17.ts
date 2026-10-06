// src/content/biomeProfiles/BiomeProfilePack17.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_17: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_17_1',
    name: 'BiomeProfile 17.1',
    flavor: 'Auto-generated biomeprofile entry number 3397 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack17', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
  {
    id: 'biomeProfiles_17_2',
    name: 'BiomeProfile 17.2',
    flavor: 'Auto-generated biomeprofile entry number 3398 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack17', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_17' },
  },
  {
    id: 'biomeProfiles_17_3',
    name: 'BiomeProfile 17.3',
    flavor: 'Auto-generated biomeprofile entry number 3399 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack17', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_17' },
  },
  {
    id: 'biomeProfiles_17_4',
    name: 'BiomeProfile 17.4',
    flavor: 'Auto-generated biomeprofile entry number 3400 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack17', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_17' },
  },
  {
    id: 'biomeProfiles_17_5',
    name: 'BiomeProfile 17.5',
    flavor: 'Auto-generated biomeprofile entry number 3401 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack17', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_17' },
  },
  {
    id: 'biomeProfiles_17_6',
    name: 'BiomeProfile 17.6',
    flavor: 'Auto-generated biomeprofile entry number 3402 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack17', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
];

export function getBiomeProfileEntry17(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_17.find(e => e.id === id);
}
