// src/content/biomeProfiles/BiomeProfilePack137.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_137: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_137_1',
    name: 'BiomeProfile 137.1',
    flavor: 'Auto-generated biomeprofile entry number 4117 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack137', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_137' },
  },
  {
    id: 'biomeProfiles_137_2',
    name: 'BiomeProfile 137.2',
    flavor: 'Auto-generated biomeprofile entry number 4118 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack137', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_137' },
  },
  {
    id: 'biomeProfiles_137_3',
    name: 'BiomeProfile 137.3',
    flavor: 'Auto-generated biomeprofile entry number 4119 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack137', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_137' },
  },
  {
    id: 'biomeProfiles_137_4',
    name: 'BiomeProfile 137.4',
    flavor: 'Auto-generated biomeprofile entry number 4120 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack137', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_137' },
  },
  {
    id: 'biomeProfiles_137_5',
    name: 'BiomeProfile 137.5',
    flavor: 'Auto-generated biomeprofile entry number 4121 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack137', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_137' },
  },
  {
    id: 'biomeProfiles_137_6',
    name: 'BiomeProfile 137.6',
    flavor: 'Auto-generated biomeprofile entry number 4122 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack137', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_137' },
  },
];

export function getBiomeProfileEntry137(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_137.find(e => e.id === id);
}
