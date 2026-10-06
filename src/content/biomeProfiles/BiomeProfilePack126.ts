// src/content/biomeProfiles/BiomeProfilePack126.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_126: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_126_1',
    name: 'BiomeProfile 126.1',
    flavor: 'Auto-generated biomeprofile entry number 4051 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack126', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_126' },
  },
  {
    id: 'biomeProfiles_126_2',
    name: 'BiomeProfile 126.2',
    flavor: 'Auto-generated biomeprofile entry number 4052 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack126', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_126' },
  },
  {
    id: 'biomeProfiles_126_3',
    name: 'BiomeProfile 126.3',
    flavor: 'Auto-generated biomeprofile entry number 4053 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack126', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_126' },
  },
  {
    id: 'biomeProfiles_126_4',
    name: 'BiomeProfile 126.4',
    flavor: 'Auto-generated biomeprofile entry number 4054 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack126', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_126' },
  },
  {
    id: 'biomeProfiles_126_5',
    name: 'BiomeProfile 126.5',
    flavor: 'Auto-generated biomeprofile entry number 4055 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack126', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_126' },
  },
  {
    id: 'biomeProfiles_126_6',
    name: 'BiomeProfile 126.6',
    flavor: 'Auto-generated biomeprofile entry number 4056 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack126', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_126' },
  },
];

export function getBiomeProfileEntry126(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_126.find(e => e.id === id);
}
