// src/content/biomeProfiles/BiomeProfilePack127.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_127: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_127_1',
    name: 'BiomeProfile 127.1',
    flavor: 'Auto-generated biomeprofile entry number 4057 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack127', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_127' },
  },
  {
    id: 'biomeProfiles_127_2',
    name: 'BiomeProfile 127.2',
    flavor: 'Auto-generated biomeprofile entry number 4058 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack127', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_127' },
  },
  {
    id: 'biomeProfiles_127_3',
    name: 'BiomeProfile 127.3',
    flavor: 'Auto-generated biomeprofile entry number 4059 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack127', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_127' },
  },
  {
    id: 'biomeProfiles_127_4',
    name: 'BiomeProfile 127.4',
    flavor: 'Auto-generated biomeprofile entry number 4060 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack127', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_127' },
  },
  {
    id: 'biomeProfiles_127_5',
    name: 'BiomeProfile 127.5',
    flavor: 'Auto-generated biomeprofile entry number 4061 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack127', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_127' },
  },
  {
    id: 'biomeProfiles_127_6',
    name: 'BiomeProfile 127.6',
    flavor: 'Auto-generated biomeprofile entry number 4062 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack127', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_127' },
  },
];

export function getBiomeProfileEntry127(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_127.find(e => e.id === id);
}
