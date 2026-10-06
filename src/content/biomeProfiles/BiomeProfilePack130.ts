// src/content/biomeProfiles/BiomeProfilePack130.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_130: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_130_1',
    name: 'BiomeProfile 130.1',
    flavor: 'Auto-generated biomeprofile entry number 4075 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack130', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_130' },
  },
  {
    id: 'biomeProfiles_130_2',
    name: 'BiomeProfile 130.2',
    flavor: 'Auto-generated biomeprofile entry number 4076 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack130', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_130' },
  },
  {
    id: 'biomeProfiles_130_3',
    name: 'BiomeProfile 130.3',
    flavor: 'Auto-generated biomeprofile entry number 4077 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack130', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_130' },
  },
  {
    id: 'biomeProfiles_130_4',
    name: 'BiomeProfile 130.4',
    flavor: 'Auto-generated biomeprofile entry number 4078 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack130', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_130' },
  },
  {
    id: 'biomeProfiles_130_5',
    name: 'BiomeProfile 130.5',
    flavor: 'Auto-generated biomeprofile entry number 4079 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack130', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_130' },
  },
  {
    id: 'biomeProfiles_130_6',
    name: 'BiomeProfile 130.6',
    flavor: 'Auto-generated biomeprofile entry number 4080 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack130', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_130' },
  },
];

export function getBiomeProfileEntry130(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_130.find(e => e.id === id);
}
