// src/content/biomeProfiles/BiomeProfilePack125.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_125: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_125_1',
    name: 'BiomeProfile 125.1',
    flavor: 'Auto-generated biomeprofile entry number 4045 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack125', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_125' },
  },
  {
    id: 'biomeProfiles_125_2',
    name: 'BiomeProfile 125.2',
    flavor: 'Auto-generated biomeprofile entry number 4046 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack125', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_125' },
  },
  {
    id: 'biomeProfiles_125_3',
    name: 'BiomeProfile 125.3',
    flavor: 'Auto-generated biomeprofile entry number 4047 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack125', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_125' },
  },
  {
    id: 'biomeProfiles_125_4',
    name: 'BiomeProfile 125.4',
    flavor: 'Auto-generated biomeprofile entry number 4048 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack125', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_125' },
  },
  {
    id: 'biomeProfiles_125_5',
    name: 'BiomeProfile 125.5',
    flavor: 'Auto-generated biomeprofile entry number 4049 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack125', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_125' },
  },
  {
    id: 'biomeProfiles_125_6',
    name: 'BiomeProfile 125.6',
    flavor: 'Auto-generated biomeprofile entry number 4050 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack125', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_125' },
  },
];

export function getBiomeProfileEntry125(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_125.find(e => e.id === id);
}
