// src/content/biomeProfiles/BiomeProfilePack14.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_14: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_14_1',
    name: 'BiomeProfile 14.1',
    flavor: 'Auto-generated biomeprofile entry number 3379 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'biomeProfiles_14_2',
    name: 'BiomeProfile 14.2',
    flavor: 'Auto-generated biomeprofile entry number 3380 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'biomeProfiles_14_3',
    name: 'BiomeProfile 14.3',
    flavor: 'Auto-generated biomeprofile entry number 3381 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'biomeProfiles_14_4',
    name: 'BiomeProfile 14.4',
    flavor: 'Auto-generated biomeprofile entry number 3382 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'biomeProfiles_14_5',
    name: 'BiomeProfile 14.5',
    flavor: 'Auto-generated biomeprofile entry number 3383 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'biomeProfiles_14_6',
    name: 'BiomeProfile 14.6',
    flavor: 'Auto-generated biomeprofile entry number 3384 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getBiomeProfileEntry14(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_14.find(e => e.id === id);
}
