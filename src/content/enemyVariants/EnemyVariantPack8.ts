// src/content/enemyVariants/EnemyVariantPack8.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_8: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_8_1',
    name: 'EnemyVariant 8.1',
    flavor: 'Auto-generated enemyvariant entry number 1663 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack8', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
  {
    id: 'enemyVariants_8_2',
    name: 'EnemyVariant 8.2',
    flavor: 'Auto-generated enemyvariant entry number 1664 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack8', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_8' },
  },
  {
    id: 'enemyVariants_8_3',
    name: 'EnemyVariant 8.3',
    flavor: 'Auto-generated enemyvariant entry number 1665 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack8', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_8' },
  },
  {
    id: 'enemyVariants_8_4',
    name: 'EnemyVariant 8.4',
    flavor: 'Auto-generated enemyvariant entry number 1666 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack8', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_8' },
  },
  {
    id: 'enemyVariants_8_5',
    name: 'EnemyVariant 8.5',
    flavor: 'Auto-generated enemyvariant entry number 1667 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack8', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_8' },
  },
  {
    id: 'enemyVariants_8_6',
    name: 'EnemyVariant 8.6',
    flavor: 'Auto-generated enemyvariant entry number 1668 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack8', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
];

export function getEnemyVariantEntry8(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_8.find(e => e.id === id);
}
