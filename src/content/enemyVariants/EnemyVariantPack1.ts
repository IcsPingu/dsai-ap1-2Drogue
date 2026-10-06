// src/content/enemyVariants/EnemyVariantPack1.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_1: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_1_1',
    name: 'EnemyVariant 1.1',
    flavor: 'Auto-generated enemyvariant entry number 1621 for the content pack system.',
    weight: 2,
    tags: ['enemyVariants', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'enemyVariants_1_2',
    name: 'EnemyVariant 1.2',
    flavor: 'Auto-generated enemyvariant entry number 1622 for the content pack system.',
    weight: 3,
    tags: ['enemyVariants', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'enemyVariants_1_3',
    name: 'EnemyVariant 1.3',
    flavor: 'Auto-generated enemyvariant entry number 1623 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'enemyVariants_1_4',
    name: 'EnemyVariant 1.4',
    flavor: 'Auto-generated enemyvariant entry number 1624 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'enemyVariants_1_5',
    name: 'EnemyVariant 1.5',
    flavor: 'Auto-generated enemyvariant entry number 1625 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'enemyVariants_1_6',
    name: 'EnemyVariant 1.6',
    flavor: 'Auto-generated enemyvariant entry number 1626 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getEnemyVariantEntry1(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_1.find(e => e.id === id);
}
