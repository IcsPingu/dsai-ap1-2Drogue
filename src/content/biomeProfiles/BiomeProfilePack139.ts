// src/content/biomeProfiles/BiomeProfilePack139.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_139: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_139_1',
    name: 'BiomeProfile 139.1',
    flavor: 'Auto-generated biomeprofile entry number 4129 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack139', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_139' },
  },
  {
    id: 'biomeProfiles_139_2',
    name: 'BiomeProfile 139.2',
    flavor: 'Auto-generated biomeprofile entry number 4130 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack139', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_139' },
  },
  {
    id: 'biomeProfiles_139_3',
    name: 'BiomeProfile 139.3',
    flavor: 'Auto-generated biomeprofile entry number 4131 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack139', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_139' },
  },
  {
    id: 'biomeProfiles_139_4',
    name: 'BiomeProfile 139.4',
    flavor: 'Auto-generated biomeprofile entry number 4132 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack139', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_139' },
  },
  {
    id: 'biomeProfiles_139_5',
    name: 'BiomeProfile 139.5',
    flavor: 'Auto-generated biomeprofile entry number 4133 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack139', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_139' },
  },
  {
    id: 'biomeProfiles_139_6',
    name: 'BiomeProfile 139.6',
    flavor: 'Auto-generated biomeprofile entry number 4134 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack139', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_139' },
  },
];

export function getBiomeProfileEntry139(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_139.find(e => e.id === id);
}
