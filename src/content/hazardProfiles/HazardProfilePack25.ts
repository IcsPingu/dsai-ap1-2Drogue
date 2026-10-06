// src/content/hazardProfiles/HazardProfilePack25.ts
// Auto-generated content pack.

export interface HazardProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const HAZARDPROFILE_PACK_25: HazardProfileEntry[] = [
  {
    id: 'hazardProfiles_25_1',
    name: 'HazardProfile 25.1',
    flavor: 'Auto-generated hazardprofile entry number 2605 for the content pack system.',
    weight: 6,
    tags: ['hazardProfiles', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'hazardProfiles_25_2',
    name: 'HazardProfile 25.2',
    flavor: 'Auto-generated hazardprofile entry number 2606 for the content pack system.',
    weight: 7,
    tags: ['hazardProfiles', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'hazardProfiles_25_3',
    name: 'HazardProfile 25.3',
    flavor: 'Auto-generated hazardprofile entry number 2607 for the content pack system.',
    weight: 8,
    tags: ['hazardProfiles', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'hazardProfiles_25_4',
    name: 'HazardProfile 25.4',
    flavor: 'Auto-generated hazardprofile entry number 2608 for the content pack system.',
    weight: 9,
    tags: ['hazardProfiles', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'hazardProfiles_25_5',
    name: 'HazardProfile 25.5',
    flavor: 'Auto-generated hazardprofile entry number 2609 for the content pack system.',
    weight: 10,
    tags: ['hazardProfiles', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'hazardProfiles_25_6',
    name: 'HazardProfile 25.6',
    flavor: 'Auto-generated hazardprofile entry number 2610 for the content pack system.',
    weight: 1,
    tags: ['hazardProfiles', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getHazardProfileEntry25(id: string): HazardProfileEntry | undefined {
  return HAZARDPROFILE_PACK_25.find(e => e.id === id);
}
