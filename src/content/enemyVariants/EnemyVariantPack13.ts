// src/content/enemyVariants/EnemyVariantPack13.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_13: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_13_1',
    name: 'EnemyVariant 13.1',
    flavor: 'Auto-generated enemyvariant entry number 1693 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'enemyVariants_13_2',
    name: 'EnemyVariant 13.2',
    flavor: 'Auto-generated enemyvariant entry number 1694 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'enemyVariants_13_3',
    name: 'EnemyVariant 13.3',
    flavor: 'Auto-generated enemyvariant entry number 1695 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'enemyVariants_13_4',
    name: 'EnemyVariant 13.4',
    flavor: 'Auto-generated enemyvariant entry number 1696 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'enemyVariants_13_5',
    name: 'EnemyVariant 13.5',
    flavor: 'Auto-generated enemyvariant entry number 1697 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'enemyVariants_13_6',
    name: 'EnemyVariant 13.6',
    flavor: 'Auto-generated enemyvariant entry number 1698 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getEnemyVariantEntry13(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_13.find(e => e.id === id);
}
