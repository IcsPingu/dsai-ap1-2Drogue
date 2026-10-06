// src/content/biomeProfiles/BiomeProfilePack129.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_129: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_129_1',
    name: 'BiomeProfile 129.1',
    flavor: 'Auto-generated biomeprofile entry number 4069 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack129', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_129' },
  },
  {
    id: 'biomeProfiles_129_2',
    name: 'BiomeProfile 129.2',
    flavor: 'Auto-generated biomeprofile entry number 4070 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack129', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_129' },
  },
  {
    id: 'biomeProfiles_129_3',
    name: 'BiomeProfile 129.3',
    flavor: 'Auto-generated biomeprofile entry number 4071 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack129', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_129' },
  },
  {
    id: 'biomeProfiles_129_4',
    name: 'BiomeProfile 129.4',
    flavor: 'Auto-generated biomeprofile entry number 4072 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack129', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_129' },
  },
  {
    id: 'biomeProfiles_129_5',
    name: 'BiomeProfile 129.5',
    flavor: 'Auto-generated biomeprofile entry number 4073 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack129', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_129' },
  },
  {
    id: 'biomeProfiles_129_6',
    name: 'BiomeProfile 129.6',
    flavor: 'Auto-generated biomeprofile entry number 4074 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack129', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_129' },
  },
];

export function getBiomeProfileEntry129(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_129.find(e => e.id === id);
}
