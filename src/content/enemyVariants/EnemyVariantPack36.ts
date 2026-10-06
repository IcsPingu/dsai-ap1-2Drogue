// src/content/enemyVariants/EnemyVariantPack36.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_36: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_36_1',
    name: 'EnemyVariant 36.1',
    flavor: 'Auto-generated enemyvariant entry number 1831 for the content pack system.',
    weight: 2,
    tags: ['enemyVariants', 'pack36', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
  {
    id: 'enemyVariants_36_2',
    name: 'EnemyVariant 36.2',
    flavor: 'Auto-generated enemyvariant entry number 1832 for the content pack system.',
    weight: 3,
    tags: ['enemyVariants', 'pack36', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_36' },
  },
  {
    id: 'enemyVariants_36_3',
    name: 'EnemyVariant 36.3',
    flavor: 'Auto-generated enemyvariant entry number 1833 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack36', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_36' },
  },
  {
    id: 'enemyVariants_36_4',
    name: 'EnemyVariant 36.4',
    flavor: 'Auto-generated enemyvariant entry number 1834 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack36', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_36' },
  },
  {
    id: 'enemyVariants_36_5',
    name: 'EnemyVariant 36.5',
    flavor: 'Auto-generated enemyvariant entry number 1835 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack36', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_36' },
  },
  {
    id: 'enemyVariants_36_6',
    name: 'EnemyVariant 36.6',
    flavor: 'Auto-generated enemyvariant entry number 1836 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack36', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
];

export function getEnemyVariantEntry36(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_36.find(e => e.id === id);
}
