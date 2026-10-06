// src/content/enemyVariants/EnemyVariantPack4.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_4: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_4_1',
    name: 'EnemyVariant 4.1',
    flavor: 'Auto-generated enemyvariant entry number 1639 for the content pack system.',
    weight: 10,
    tags: ['enemyVariants', 'pack4', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
  {
    id: 'enemyVariants_4_2',
    name: 'EnemyVariant 4.2',
    flavor: 'Auto-generated enemyvariant entry number 1640 for the content pack system.',
    weight: 1,
    tags: ['enemyVariants', 'pack4', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_4' },
  },
  {
    id: 'enemyVariants_4_3',
    name: 'EnemyVariant 4.3',
    flavor: 'Auto-generated enemyvariant entry number 1641 for the content pack system.',
    weight: 2,
    tags: ['enemyVariants', 'pack4', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_4' },
  },
  {
    id: 'enemyVariants_4_4',
    name: 'EnemyVariant 4.4',
    flavor: 'Auto-generated enemyvariant entry number 1642 for the content pack system.',
    weight: 3,
    tags: ['enemyVariants', 'pack4', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_4' },
  },
  {
    id: 'enemyVariants_4_5',
    name: 'EnemyVariant 4.5',
    flavor: 'Auto-generated enemyvariant entry number 1643 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack4', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_4' },
  },
  {
    id: 'enemyVariants_4_6',
    name: 'EnemyVariant 4.6',
    flavor: 'Auto-generated enemyvariant entry number 1644 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack4', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
];

export function getEnemyVariantEntry4(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_4.find(e => e.id === id);
}
