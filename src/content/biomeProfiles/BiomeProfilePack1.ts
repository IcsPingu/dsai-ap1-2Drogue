// src/content/biomeProfiles/BiomeProfilePack1.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_1: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_1_1',
    name: 'BiomeProfile 1.1',
    flavor: 'Auto-generated biomeprofile entry number 3301 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'biomeProfiles_1_2',
    name: 'BiomeProfile 1.2',
    flavor: 'Auto-generated biomeprofile entry number 3302 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'biomeProfiles_1_3',
    name: 'BiomeProfile 1.3',
    flavor: 'Auto-generated biomeprofile entry number 3303 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'biomeProfiles_1_4',
    name: 'BiomeProfile 1.4',
    flavor: 'Auto-generated biomeprofile entry number 3304 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'biomeProfiles_1_5',
    name: 'BiomeProfile 1.5',
    flavor: 'Auto-generated biomeprofile entry number 3305 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'biomeProfiles_1_6',
    name: 'BiomeProfile 1.6',
    flavor: 'Auto-generated biomeprofile entry number 3306 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getBiomeProfileEntry1(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_1.find(e => e.id === id);
}
