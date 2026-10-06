// src/content/enemyVariants/EnemyVariantPack17.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_17: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_17_1',
    name: 'EnemyVariant 17.1',
    flavor: 'Auto-generated enemyvariant entry number 1717 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack17', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
  {
    id: 'enemyVariants_17_2',
    name: 'EnemyVariant 17.2',
    flavor: 'Auto-generated enemyvariant entry number 1718 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack17', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_17' },
  },
  {
    id: 'enemyVariants_17_3',
    name: 'EnemyVariant 17.3',
    flavor: 'Auto-generated enemyvariant entry number 1719 for the content pack system.',
    weight: 10,
    tags: ['enemyVariants', 'pack17', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_17' },
  },
  {
    id: 'enemyVariants_17_4',
    name: 'EnemyVariant 17.4',
    flavor: 'Auto-generated enemyvariant entry number 1720 for the content pack system.',
    weight: 1,
    tags: ['enemyVariants', 'pack17', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_17' },
  },
  {
    id: 'enemyVariants_17_5',
    name: 'EnemyVariant 17.5',
    flavor: 'Auto-generated enemyvariant entry number 1721 for the content pack system.',
    weight: 2,
    tags: ['enemyVariants', 'pack17', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_17' },
  },
  {
    id: 'enemyVariants_17_6',
    name: 'EnemyVariant 17.6',
    flavor: 'Auto-generated enemyvariant entry number 1722 for the content pack system.',
    weight: 3,
    tags: ['enemyVariants', 'pack17', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
];

export function getEnemyVariantEntry17(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_17.find(e => e.id === id);
}
