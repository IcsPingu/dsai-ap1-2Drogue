// src/content/biomeProfiles/BiomeProfilePack121.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_121: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_121_1',
    name: 'BiomeProfile 121.1',
    flavor: 'Auto-generated biomeprofile entry number 4021 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack121', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_121' },
  },
  {
    id: 'biomeProfiles_121_2',
    name: 'BiomeProfile 121.2',
    flavor: 'Auto-generated biomeprofile entry number 4022 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack121', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_121' },
  },
  {
    id: 'biomeProfiles_121_3',
    name: 'BiomeProfile 121.3',
    flavor: 'Auto-generated biomeprofile entry number 4023 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack121', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_121' },
  },
  {
    id: 'biomeProfiles_121_4',
    name: 'BiomeProfile 121.4',
    flavor: 'Auto-generated biomeprofile entry number 4024 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack121', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_121' },
  },
  {
    id: 'biomeProfiles_121_5',
    name: 'BiomeProfile 121.5',
    flavor: 'Auto-generated biomeprofile entry number 4025 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack121', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_121' },
  },
  {
    id: 'biomeProfiles_121_6',
    name: 'BiomeProfile 121.6',
    flavor: 'Auto-generated biomeprofile entry number 4026 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack121', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_121' },
  },
];

export function getBiomeProfileEntry121(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_121.find(e => e.id === id);
}
