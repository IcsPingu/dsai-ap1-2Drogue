// src/content/biomeProfiles/BiomeProfilePack60.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_60: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_60_1',
    name: 'BiomeProfile 60.1',
    flavor: 'Auto-generated biomeprofile entry number 3655 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack60', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_60' },
  },
  {
    id: 'biomeProfiles_60_2',
    name: 'BiomeProfile 60.2',
    flavor: 'Auto-generated biomeprofile entry number 3656 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack60', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_60' },
  },
  {
    id: 'biomeProfiles_60_3',
    name: 'BiomeProfile 60.3',
    flavor: 'Auto-generated biomeprofile entry number 3657 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack60', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_60' },
  },
  {
    id: 'biomeProfiles_60_4',
    name: 'BiomeProfile 60.4',
    flavor: 'Auto-generated biomeprofile entry number 3658 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack60', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_60' },
  },
  {
    id: 'biomeProfiles_60_5',
    name: 'BiomeProfile 60.5',
    flavor: 'Auto-generated biomeprofile entry number 3659 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack60', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_60' },
  },
  {
    id: 'biomeProfiles_60_6',
    name: 'BiomeProfile 60.6',
    flavor: 'Auto-generated biomeprofile entry number 3660 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack60', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_60' },
  },
];

export function getBiomeProfileEntry60(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_60.find(e => e.id === id);
}
