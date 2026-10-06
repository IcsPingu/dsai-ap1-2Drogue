// src/content/enemyVariants/EnemyVariantPack5.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_5: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_5_1',
    name: 'EnemyVariant 5.1',
    flavor: 'Auto-generated enemyvariant entry number 1645 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'enemyVariants_5_2',
    name: 'EnemyVariant 5.2',
    flavor: 'Auto-generated enemyvariant entry number 1646 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'enemyVariants_5_3',
    name: 'EnemyVariant 5.3',
    flavor: 'Auto-generated enemyvariant entry number 1647 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'enemyVariants_5_4',
    name: 'EnemyVariant 5.4',
    flavor: 'Auto-generated enemyvariant entry number 1648 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'enemyVariants_5_5',
    name: 'EnemyVariant 5.5',
    flavor: 'Auto-generated enemyvariant entry number 1649 for the content pack system.',
    weight: 10,
    tags: ['enemyVariants', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'enemyVariants_5_6',
    name: 'EnemyVariant 5.6',
    flavor: 'Auto-generated enemyvariant entry number 1650 for the content pack system.',
    weight: 1,
    tags: ['enemyVariants', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getEnemyVariantEntry5(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_5.find(e => e.id === id);
}
