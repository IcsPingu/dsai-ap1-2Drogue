// src/content/shrineProfiles/ShrineProfilePack136.ts
// Auto-generated content pack.

export interface ShrineProfileEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const SHRINEPROFILE_PACK_136: ShrineProfileEntry[] = [
  {
    id: 'shrineProfiles_136_1',
    name: 'ShrineProfile 136.1',
    flavor: 'Auto-generated shrineprofile entry number 4951 for the content pack system.',
    weight: 2,
    tags: ['shrineProfiles', 'pack136', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_136' },
  },
  {
    id: 'shrineProfiles_136_2',
    name: 'ShrineProfile 136.2',
    flavor: 'Auto-generated shrineprofile entry number 4952 for the content pack system.',
    weight: 3,
    tags: ['shrineProfiles', 'pack136', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_136' },
  },
  {
    id: 'shrineProfiles_136_3',
    name: 'ShrineProfile 136.3',
    flavor: 'Auto-generated shrineprofile entry number 4953 for the content pack system.',
    weight: 4,
    tags: ['shrineProfiles', 'pack136', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_136' },
  },
  {
    id: 'shrineProfiles_136_4',
    name: 'ShrineProfile 136.4',
    flavor: 'Auto-generated shrineprofile entry number 4954 for the content pack system.',
    weight: 5,
    tags: ['shrineProfiles', 'pack136', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_136' },
  },
  {
    id: 'shrineProfiles_136_5',
    name: 'ShrineProfile 136.5',
    flavor: 'Auto-generated shrineprofile entry number 4955 for the content pack system.',
    weight: 6,
    tags: ['shrineProfiles', 'pack136', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_136' },
  },
  {
    id: 'shrineProfiles_136_6',
    name: 'ShrineProfile 136.6',
    flavor: 'Auto-generated shrineprofile entry number 4956 for the content pack system.',
    weight: 7,
    tags: ['shrineProfiles', 'pack136', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_136' },
  },
];

export function getShrineProfileEntry136(id: string): ShrineProfileEntry | undefined {
  return SHRINEPROFILE_PACK_136.find(e => e.id === id);
}
