// src/content/biomeProfiles/BiomeProfilePack120.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_120: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_120_1',
    name: 'BiomeProfile 120.1',
    flavor: 'Auto-generated biomeprofile entry number 4015 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack120', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_120' },
  },
  {
    id: 'biomeProfiles_120_2',
    name: 'BiomeProfile 120.2',
    flavor: 'Auto-generated biomeprofile entry number 4016 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack120', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_120' },
  },
  {
    id: 'biomeProfiles_120_3',
    name: 'BiomeProfile 120.3',
    flavor: 'Auto-generated biomeprofile entry number 4017 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack120', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_120' },
  },
  {
    id: 'biomeProfiles_120_4',
    name: 'BiomeProfile 120.4',
    flavor: 'Auto-generated biomeprofile entry number 4018 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack120', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_120' },
  },
  {
    id: 'biomeProfiles_120_5',
    name: 'BiomeProfile 120.5',
    flavor: 'Auto-generated biomeprofile entry number 4019 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack120', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_120' },
  },
  {
    id: 'biomeProfiles_120_6',
    name: 'BiomeProfile 120.6',
    flavor: 'Auto-generated biomeprofile entry number 4020 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack120', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_120' },
  },
];

export function getBiomeProfileEntry120(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_120.find(e => e.id === id);
}
