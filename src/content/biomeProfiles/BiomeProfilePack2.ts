// src/content/biomeProfiles/BiomeProfilePack2.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_2: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_2_1',
    name: 'BiomeProfile 2.1',
    flavor: 'Auto-generated biomeprofile entry number 3307 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'biomeProfiles_2_2',
    name: 'BiomeProfile 2.2',
    flavor: 'Auto-generated biomeprofile entry number 3308 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'biomeProfiles_2_3',
    name: 'BiomeProfile 2.3',
    flavor: 'Auto-generated biomeprofile entry number 3309 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'biomeProfiles_2_4',
    name: 'BiomeProfile 2.4',
    flavor: 'Auto-generated biomeprofile entry number 3310 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'biomeProfiles_2_5',
    name: 'BiomeProfile 2.5',
    flavor: 'Auto-generated biomeprofile entry number 3311 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'biomeProfiles_2_6',
    name: 'BiomeProfile 2.6',
    flavor: 'Auto-generated biomeprofile entry number 3312 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getBiomeProfileEntry2(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_2.find(e => e.id === id);
}
