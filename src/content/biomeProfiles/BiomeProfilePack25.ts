// src/content/biomeProfiles/BiomeProfilePack25.ts
// Auto-generated content pack.

export interface BiomeProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const BIOMEPROFILE_PACK_25: BiomeProfileEntry[] = [
  {
    id: 'biomeProfiles_25_1',
    name: 'BiomeProfile 25.1',
    flavor: 'Auto-generated biomeprofile entry number 3445 for the content pack system.',
    weight: 6,
    tags: ['biomeProfiles', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'biomeProfiles_25_2',
    name: 'BiomeProfile 25.2',
    flavor: 'Auto-generated biomeprofile entry number 3446 for the content pack system.',
    weight: 7,
    tags: ['biomeProfiles', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'biomeProfiles_25_3',
    name: 'BiomeProfile 25.3',
    flavor: 'Auto-generated biomeprofile entry number 3447 for the content pack system.',
    weight: 8,
    tags: ['biomeProfiles', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'biomeProfiles_25_4',
    name: 'BiomeProfile 25.4',
    flavor: 'Auto-generated biomeprofile entry number 3448 for the content pack system.',
    weight: 9,
    tags: ['biomeProfiles', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'biomeProfiles_25_5',
    name: 'BiomeProfile 25.5',
    flavor: 'Auto-generated biomeprofile entry number 3449 for the content pack system.',
    weight: 10,
    tags: ['biomeProfiles', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'biomeProfiles_25_6',
    name: 'BiomeProfile 25.6',
    flavor: 'Auto-generated biomeprofile entry number 3450 for the content pack system.',
    weight: 1,
    tags: ['biomeProfiles', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getBiomeProfileEntry25(id: string): BiomeProfileEntry | undefined {
  return BIOMEPROFILE_PACK_25.find(e => e.id === id);
}
