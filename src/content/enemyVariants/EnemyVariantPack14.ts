// src/content/enemyVariants/EnemyVariantPack14.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_14: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_14_1',
    name: 'EnemyVariant 14.1',
    flavor: 'Auto-generated enemyvariant entry number 1699 for the content pack system.',
    weight: 10,
    tags: ['enemyVariants', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'enemyVariants_14_2',
    name: 'EnemyVariant 14.2',
    flavor: 'Auto-generated enemyvariant entry number 1700 for the content pack system.',
    weight: 1,
    tags: ['enemyVariants', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'enemyVariants_14_3',
    name: 'EnemyVariant 14.3',
    flavor: 'Auto-generated enemyvariant entry number 1701 for the content pack system.',
    weight: 2,
    tags: ['enemyVariants', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'enemyVariants_14_4',
    name: 'EnemyVariant 14.4',
    flavor: 'Auto-generated enemyvariant entry number 1702 for the content pack system.',
    weight: 3,
    tags: ['enemyVariants', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'enemyVariants_14_5',
    name: 'EnemyVariant 14.5',
    flavor: 'Auto-generated enemyvariant entry number 1703 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'enemyVariants_14_6',
    name: 'EnemyVariant 14.6',
    flavor: 'Auto-generated enemyvariant entry number 1704 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getEnemyVariantEntry14(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_14.find(e => e.id === id);
}
