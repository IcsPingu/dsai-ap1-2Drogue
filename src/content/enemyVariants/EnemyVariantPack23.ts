// src/content/enemyVariants/EnemyVariantPack23.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_23: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_23_1',
    name: 'EnemyVariant 23.1',
    flavor: 'Auto-generated enemyvariant entry number 1753 for the content pack system.',
    weight: 4,
    tags: ['enemyVariants', 'pack23', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
  {
    id: 'enemyVariants_23_2',
    name: 'EnemyVariant 23.2',
    flavor: 'Auto-generated enemyvariant entry number 1754 for the content pack system.',
    weight: 5,
    tags: ['enemyVariants', 'pack23', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_23' },
  },
  {
    id: 'enemyVariants_23_3',
    name: 'EnemyVariant 23.3',
    flavor: 'Auto-generated enemyvariant entry number 1755 for the content pack system.',
    weight: 6,
    tags: ['enemyVariants', 'pack23', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_23' },
  },
  {
    id: 'enemyVariants_23_4',
    name: 'EnemyVariant 23.4',
    flavor: 'Auto-generated enemyvariant entry number 1756 for the content pack system.',
    weight: 7,
    tags: ['enemyVariants', 'pack23', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_23' },
  },
  {
    id: 'enemyVariants_23_5',
    name: 'EnemyVariant 23.5',
    flavor: 'Auto-generated enemyvariant entry number 1757 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack23', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_23' },
  },
  {
    id: 'enemyVariants_23_6',
    name: 'EnemyVariant 23.6',
    flavor: 'Auto-generated enemyvariant entry number 1758 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack23', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
];

export function getEnemyVariantEntry23(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_23.find(e => e.id === id);
}
