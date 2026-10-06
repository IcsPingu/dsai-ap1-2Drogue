// src/content/enemyVariants/EnemyVariantPack26.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_26: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_26_1',
    name: 'EnemyVariant 26.1',
    flavor: 'Auto-generated enemyvariant entry number 1771 for the content pack system.',
    weight: 2,
    tags: ['enemyVariants', 'pack26', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_26' },
  },
  {
    id: 'enemyVariants_26_2',
    name: 'EnemyVariant 26.2',
    flavor: 'Auto-generated enemyvariant entry number 1772 for the content pack system.',
    weight: 3,
    tags: ['enemyVariants', 'pack26', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_26' },
  },
  {
    id: 'enemyVariants_26_3',
    name: 'EnemyVariant 26.3',
    flavor: 'Auto-generated enemyvariant entry number 1773 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack26', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_26' },
  },
  {
    id: 'enemyVariants_26_4',
    name: 'EnemyVariant 26.4',
    flavor: 'Auto-generated enemyvariant entry number 1774 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack26', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_26' },
  },
  {
    id: 'enemyVariants_26_5',
    name: 'EnemyVariant 26.5',
    flavor: 'Auto-generated enemyvariant entry number 1775 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack26', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_26' },
  },
  {
    id: 'enemyVariants_26_6',
    name: 'EnemyVariant 26.6',
    flavor: 'Auto-generated enemyvariant entry number 1776 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack26', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_26' },
  },
];

export function getEnemyVariantEntry26(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_26.find(e => e.id === id);
}
