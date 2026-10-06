// src/content/biomeProfiles/BiomeProfilePack46.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_46: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_46_1',
    name: 'BiomeProfile 46.1',
    flavor: 'Auto-generated biomeprofile entry number 3571 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack46', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_46' },
  },
  {
    id: 'biomeProfiles_46_2',
    name: 'BiomeProfile 46.2',
    flavor: 'Auto-generated biomeprofile entry number 3572 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack46', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_46' },
  },
  {
    id: 'biomeProfiles_46_3',
    name: 'BiomeProfile 46.3',
    flavor: 'Auto-generated biomeprofile entry number 3573 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack46', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_46' },
  },
  {
    id: 'biomeProfiles_46_4',
    name: 'BiomeProfile 46.4',
    flavor: 'Auto-generated biomeprofile entry number 3574 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack46', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_46' },
  },
  {
    id: 'biomeProfiles_46_5',
    name: 'BiomeProfile 46.5',
    flavor: 'Auto-generated biomeprofile entry number 3575 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack46', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_46' },
  },
  {
    id: 'biomeProfiles_46_6',
    name: 'BiomeProfile 46.6',
    flavor: 'Auto-generated biomeprofile entry number 3576 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack46', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_46' },
  },
];

export function getBiomeProfileEntry46(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_46.find(e => e.id === id);
}
