// src/content/shrineProfiles/ShrineProfilePack146.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_146: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_146_1',
    name: 'ShrineProfile 146.1',
    flavor: 'Auto-generated shrineprofile entry number 5011 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack146', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_146' },
  },
  {
    id: 'shrineProfiles_146_2',
    name: 'ShrineProfile 146.2',
    flavor: 'Auto-generated shrineprofile entry number 5012 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack146', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_146' },
  },
  {
    id: 'shrineProfiles_146_3',
    name: 'ShrineProfile 146.3',
    flavor: 'Auto-generated shrineprofile entry number 5013 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack146', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_146' },
  },
  {
    id: 'shrineProfiles_146_4',
    name: 'ShrineProfile 146.4',
    flavor: 'Auto-generated shrineprofile entry number 5014 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack146', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_146' },
  },
  {
    id: 'shrineProfiles_146_5',
    name: 'ShrineProfile 146.5',
    flavor: 'Auto-generated shrineprofile entry number 5015 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack146', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_146' },
  },
  {
    id: 'shrineProfiles_146_6',
    name: 'ShrineProfile 146.6',
    flavor: 'Auto-generated shrineprofile entry number 5016 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack146', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_146' },
  },
];

export function getShrineProfileEntry146(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_146.find(e => e.id === id);
}
