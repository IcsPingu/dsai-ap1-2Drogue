// src/content/enemyVariants/EnemyVariantPack27.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_27: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_27_1',
    name: 'EnemyVariant 27.1',
    flavor: 'Auto-generated enemyvariant entry number 1777 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack27', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_27' },
  },
  {
    id: 'enemyVariants_27_2',
    name: 'EnemyVariant 27.2',
    flavor: 'Auto-generated enemyvariant entry number 1778 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack27', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_27' },
  },
  {
    id: 'enemyVariants_27_3',
    name: 'EnemyVariant 27.3',
    flavor: 'Auto-generated enemyvariant entry number 1779 for the content pack system.',
    weight: 10,
    tags: ['enemyVariants', 'pack27', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_27' },
  },
  {
    id: 'enemyVariants_27_4',
    name: 'EnemyVariant 27.4',
    flavor: 'Auto-generated enemyvariant entry number 1780 for the content pack system.',
    weight: 1,
    tags: ['enemyVariants', 'pack27', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_27' },
  },
  {
    id: 'enemyVariants_27_5',
    name: 'EnemyVariant 27.5',
    flavor: 'Auto-generated enemyvariant entry number 1781 for the content pack system.',
    weight: 2,
    tags: ['enemyVariants', 'pack27', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_27' },
  },
  {
    id: 'enemyVariants_27_6',
    name: 'EnemyVariant 27.6',
    flavor: 'Auto-generated enemyvariant entry number 1782 for the content pack system.',
    weight: 3,
    tags: ['enemyVariants', 'pack27', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_27' },
  },
];

export function getEnemyVariantEntry27(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_27.find(e => e.id === id);
}
