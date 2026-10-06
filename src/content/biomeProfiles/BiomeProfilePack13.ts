// src/content/biomeProfiles/BiomeProfilePack13.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_13: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_13_1',
    name: 'BiomeProfile 13.1',
    flavor: 'Auto-generated biomeprofile entry number 3373 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'biomeProfiles_13_2',
    name: 'BiomeProfile 13.2',
    flavor: 'Auto-generated biomeprofile entry number 3374 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'biomeProfiles_13_3',
    name: 'BiomeProfile 13.3',
    flavor: 'Auto-generated biomeprofile entry number 3375 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'biomeProfiles_13_4',
    name: 'BiomeProfile 13.4',
    flavor: 'Auto-generated biomeprofile entry number 3376 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'biomeProfiles_13_5',
    name: 'BiomeProfile 13.5',
    flavor: 'Auto-generated biomeprofile entry number 3377 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'biomeProfiles_13_6',
    name: 'BiomeProfile 13.6',
    flavor: 'Auto-generated biomeprofile entry number 3378 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getBiomeProfileEntry13(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_13.find(e => e.id === id);
}
