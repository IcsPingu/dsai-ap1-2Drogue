// src/content/biomeProfiles/BiomeProfilePack106.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_106: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_106_1',
    name: 'BiomeProfile 106.1',
    flavor: 'Auto-generated biomeprofile entry number 3931 for the content pack system.',
    weight: 2,
    tags: ['biomeProfiles', 'pack106', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_106' },
  },
  {
    id: 'biomeProfiles_106_2',
    name: 'BiomeProfile 106.2',
    flavor: 'Auto-generated biomeprofile entry number 3932 for the content pack system.',
    weight: 3,
    tags: ['biomeProfiles', 'pack106', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_106' },
  },
  {
    id: 'biomeProfiles_106_3',
    name: 'BiomeProfile 106.3',
    flavor: 'Auto-generated biomeprofile entry number 3933 for the content pack system.',
    weight: 4,
    tags: ['biomeProfiles', 'pack106', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_106' },
  },
  {
    id: 'biomeProfiles_106_4',
    name: 'BiomeProfile 106.4',
    flavor: 'Auto-generated biomeprofile entry number 3934 for the content pack system.',
    weight: 5,
    tags: ['biomeProfiles', 'pack106', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_106' },
  },
  {
    id: 'biomeProfiles_106_5',
    name: 'BiomeProfile 106.5',
    flavor: 'Auto-generated biomeprofile entry number 3935 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack106', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_106' },
  },
  {
    id: 'biomeProfiles_106_6',
    name: 'BiomeProfile 106.6',
    flavor: 'Auto-generated biomeprofile entry number 3936 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack106', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_106' },
  },
];

export function getBiomeProfileEntry106(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_106.find(e => e.id === id);
}
