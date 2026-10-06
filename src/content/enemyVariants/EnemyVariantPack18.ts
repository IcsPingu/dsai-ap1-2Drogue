// src/content/enemyVariants/EnemyVariantPack18.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_18: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_18_1',
    name: 'EnemyVariant 18.1',
    flavor: 'Auto-generated enemyvariant entry number 1723 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack18', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_18' },
  },
  {
    id: 'enemyVariants_18_2',
    name: 'EnemyVariant 18.2',
    flavor: 'Auto-generated enemyvariant entry number 1724 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack18', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_18' },
  },
  {
    id: 'enemyVariants_18_3',
    name: 'EnemyVariant 18.3',
    flavor: 'Auto-generated enemyvariant entry number 1725 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack18', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_18' },
  },
  {
    id: 'enemyVariants_18_4',
    name: 'EnemyVariant 18.4',
    flavor: 'Auto-generated enemyvariant entry number 1726 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack18', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_18' },
  },
  {
    id: 'enemyVariants_18_5',
    name: 'EnemyVariant 18.5',
    flavor: 'Auto-generated enemyvariant entry number 1727 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack18', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_18' },
  },
  {
    id: 'enemyVariants_18_6',
    name: 'EnemyVariant 18.6',
    flavor: 'Auto-generated enemyvariant entry number 1728 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack18', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_18' },
  },
];

export function getEnemyVariantEntry18(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_18.find(e => e.id === id);
}
