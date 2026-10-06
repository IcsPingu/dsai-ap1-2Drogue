// src/content/shrineProfiles/ShrineProfilePack133.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_133: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_133_1',
    name: 'ShrineProfile 133.1',
    flavor: 'Auto-generated shrineprofile entry number 4933 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack133', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_133' },
  },
  {
    id: 'shrineProfiles_133_2',
    name: 'ShrineProfile 133.2',
    flavor: 'Auto-generated shrineprofile entry number 4934 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack133', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_133' },
  },
  {
    id: 'shrineProfiles_133_3',
    name: 'ShrineProfile 133.3',
    flavor: 'Auto-generated shrineprofile entry number 4935 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack133', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_133' },
  },
  {
    id: 'shrineProfiles_133_4',
    name: 'ShrineProfile 133.4',
    flavor: 'Auto-generated shrineprofile entry number 4936 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack133', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_133' },
  },
  {
    id: 'shrineProfiles_133_5',
    name: 'ShrineProfile 133.5',
    flavor: 'Auto-generated shrineprofile entry number 4937 for the content pack system.',
    weight: 8,
    tags: ['shrineProfiles', 'pack133', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_133' },
  },
  {
    id: 'shrineProfiles_133_6',
    name: 'ShrineProfile 133.6',
    flavor: 'Auto-generated shrineprofile entry number 4938 for the content pack system.',
    weight: 9,
    tags: ['shrineProfiles', 'pack133', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_133' },
  },
];

export function getShrineProfileEntry133(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_133.find(e => e.id === id);
}
