// src/content/biomeProfiles/BiomeProfilePack6.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_6: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_6_1',
    name: 'BiomeProfile 6.1',
    flavor: 'Auto-generated biomeprofile entry number 3331 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack6', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
  {
    id: 'biomeProfiles_6_2',
    name: 'BiomeProfile 6.2',
    flavor: 'Auto-generated biomeprofile entry number 3332 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack6', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_6' },
  },
  {
    id: 'biomeProfiles_6_3',
    name: 'BiomeProfile 6.3',
    flavor: 'Auto-generated biomeprofile entry number 3333 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack6', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_6' },
  },
  {
    id: 'biomeProfiles_6_4',
    name: 'BiomeProfile 6.4',
    flavor: 'Auto-generated biomeprofile entry number 3334 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack6', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_6' },
  },
  {
    id: 'biomeProfiles_6_5',
    name: 'BiomeProfile 6.5',
    flavor: 'Auto-generated biomeprofile entry number 3335 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack6', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_6' },
  },
  {
    id: 'biomeProfiles_6_6',
    name: 'BiomeProfile 6.6',
    flavor: 'Auto-generated biomeprofile entry number 3336 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack6', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
];

export function getBiomeProfileEntry6(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_6.find(e => e.id === id);
}
