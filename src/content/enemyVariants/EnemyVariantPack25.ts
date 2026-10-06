// src/content/enemyVariants/EnemyVariantPack25.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_25: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_25_1',
    name: 'EnemyVariant 25.1',
    flavor: 'Auto-generated enemyvariant entry number 1765 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'enemyVariants_25_2',
    name: 'EnemyVariant 25.2',
    flavor: 'Auto-generated enemyvariant entry number 1766 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'enemyVariants_25_3',
    name: 'EnemyVariant 25.3',
    flavor: 'Auto-generated enemyvariant entry number 1767 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'enemyVariants_25_4',
    name: 'EnemyVariant 25.4',
    flavor: 'Auto-generated enemyvariant entry number 1768 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'enemyVariants_25_5',
    name: 'EnemyVariant 25.5',
    flavor: 'Auto-generated enemyvariant entry number 1769 for the content pack system.',
    weight: 10,
    tags: ['enemyVariants', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'enemyVariants_25_6',
    name: 'EnemyVariant 25.6',
    flavor: 'Auto-generated enemyvariant entry number 1770 for the content pack system.',
    weight: 1,
    tags: ['enemyVariants', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getEnemyVariantEntry25(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_25.find(e => e.id === id);
}
