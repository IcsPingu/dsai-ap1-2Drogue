// src/content/enemyVariants/EnemyVariantPack30.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_30: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_30_1',
    name: 'EnemyVariant 30.1',
    flavor: 'Auto-generated enemyvariant entry number 1795 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack30', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_30' },
  },
  {
    id: 'enemyVariants_30_2',
    name: 'EnemyVariant 30.2',
    flavor: 'Auto-generated enemyvariant entry number 1796 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack30', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_30' },
  },
  {
    id: 'enemyVariants_30_3',
    name: 'EnemyVariant 30.3',
    flavor: 'Auto-generated enemyvariant entry number 1797 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack30', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_30' },
  },
  {
    id: 'enemyVariants_30_4',
    name: 'EnemyVariant 30.4',
    flavor: 'Auto-generated enemyvariant entry number 1798 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack30', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_30' },
  },
  {
    id: 'enemyVariants_30_5',
    name: 'EnemyVariant 30.5',
    flavor: 'Auto-generated enemyvariant entry number 1799 for the content pack system.',
    weight: 10,
    tags: ['enemyVariants', 'pack30', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_30' },
  },
  {
    id: 'enemyVariants_30_6',
    name: 'EnemyVariant 30.6',
    flavor: 'Auto-generated enemyvariant entry number 1800 for the content pack system.',
    weight: 1,
    tags: ['enemyVariants', 'pack30', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_30' },
  },
];

export function getEnemyVariantEntry30(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_30.find(e => e.id === id);
}
