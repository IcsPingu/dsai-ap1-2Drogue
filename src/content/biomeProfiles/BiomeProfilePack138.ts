// src/content/biomeProfiles/BiomeProfilePack138.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_138: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_138_1',
    name: 'BiomeProfile 138.1',
    flavor: 'Auto-generated biomeprofile entry number 4123 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack138', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_138' },
  },
  {
    id: 'biomeProfiles_138_2',
    name: 'BiomeProfile 138.2',
    flavor: 'Auto-generated biomeprofile entry number 4124 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack138', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_138' },
  },
  {
    id: 'biomeProfiles_138_3',
    name: 'BiomeProfile 138.3',
    flavor: 'Auto-generated biomeprofile entry number 4125 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack138', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_138' },
  },
  {
    id: 'biomeProfiles_138_4',
    name: 'BiomeProfile 138.4',
    flavor: 'Auto-generated biomeprofile entry number 4126 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack138', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_138' },
  },
  {
    id: 'biomeProfiles_138_5',
    name: 'BiomeProfile 138.5',
    flavor: 'Auto-generated biomeprofile entry number 4127 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack138', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_138' },
  },
  {
    id: 'biomeProfiles_138_6',
    name: 'BiomeProfile 138.6',
    flavor: 'Auto-generated biomeprofile entry number 4128 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack138', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_138' },
  },
];

export function getBiomeProfileEntry138(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_138.find(e => e.id === id);
}
