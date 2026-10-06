// src/content/shrineProfiles/ShrineProfilePack129.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_129: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_129_1',
    name: 'ShrineProfile 129.1',
    flavor: 'Auto-generated shrineprofile entry number 4909 for the content pack system.',
    weight: 10,
    tags: ['shrineProfiles', 'pack129', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_129' },
  },
  {
    id: 'shrineProfiles_129_2',
    name: 'ShrineProfile 129.2',
    flavor: 'Auto-generated shrineprofile entry number 4910 for the content pack system.',
    weight: 1,
    tags: ['shrineProfiles', 'pack129', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_129' },
  },
  {
    id: 'shrineProfiles_129_3',
    name: 'ShrineProfile 129.3',
    flavor: 'Auto-generated shrineprofile entry number 4911 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack129', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_129' },
  },
  {
    id: 'shrineProfiles_129_4',
    name: 'ShrineProfile 129.4',
    flavor: 'Auto-generated shrineprofile entry number 4912 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack129', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_129' },
  },
  {
    id: 'shrineProfiles_129_5',
    name: 'ShrineProfile 129.5',
    flavor: 'Auto-generated shrineprofile entry number 4913 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack129', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_129' },
  },
  {
    id: 'shrineProfiles_129_6',
    name: 'ShrineProfile 129.6',
    flavor: 'Auto-generated shrineprofile entry number 4914 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack129', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_129' },
  },
];

export function getShrineProfileEntry129(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_129.find(e => e.id === id);
}
