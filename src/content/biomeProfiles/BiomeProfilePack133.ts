// src/content/biomeProfiles/BiomeProfilePack133.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_133: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_133_1',
    name: 'BiomeProfile 133.1',
    flavor: 'Auto-generated biomeprofile entry number 4093 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack133', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_133' },
  },
  {
    id: 'biomeProfiles_133_2',
    name: 'BiomeProfile 133.2',
    flavor: 'Auto-generated biomeprofile entry number 4094 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack133', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_133' },
  },
  {
    id: 'biomeProfiles_133_3',
    name: 'BiomeProfile 133.3',
    flavor: 'Auto-generated biomeprofile entry number 4095 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack133', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_133' },
  },
  {
    id: 'biomeProfiles_133_4',
    name: 'BiomeProfile 133.4',
    flavor: 'Auto-generated biomeprofile entry number 4096 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack133', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_133' },
  },
  {
    id: 'biomeProfiles_133_5',
    name: 'BiomeProfile 133.5',
    flavor: 'Auto-generated biomeprofile entry number 4097 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack133', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_133' },
  },
  {
    id: 'biomeProfiles_133_6',
    name: 'BiomeProfile 133.6',
    flavor: 'Auto-generated biomeprofile entry number 4098 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack133', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_133' },
  },
];

export function getBiomeProfileEntry133(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_133.find(e => e.id === id);
}
