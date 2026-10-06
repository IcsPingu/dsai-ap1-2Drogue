// src/content/biomeProfiles/BiomeProfilePack136.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_136: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_136_1',
    name: 'BiomeProfile 136.1',
    flavor: 'Auto-generated biomeprofile entry number 4111 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack136', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_136' },
  },
  {
    id: 'biomeProfiles_136_2',
    name: 'BiomeProfile 136.2',
    flavor: 'Auto-generated biomeprofile entry number 4112 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack136', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_136' },
  },
  {
    id: 'biomeProfiles_136_3',
    name: 'BiomeProfile 136.3',
    flavor: 'Auto-generated biomeprofile entry number 4113 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack136', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_136' },
  },
  {
    id: 'biomeProfiles_136_4',
    name: 'BiomeProfile 136.4',
    flavor: 'Auto-generated biomeprofile entry number 4114 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack136', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_136' },
  },
  {
    id: 'biomeProfiles_136_5',
    name: 'BiomeProfile 136.5',
    flavor: 'Auto-generated biomeprofile entry number 4115 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack136', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_136' },
  },
  {
    id: 'biomeProfiles_136_6',
    name: 'BiomeProfile 136.6',
    flavor: 'Auto-generated biomeprofile entry number 4116 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack136', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_136' },
  },
];

export function getBiomeProfileEntry136(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_136.find(e => e.id === id);
}
