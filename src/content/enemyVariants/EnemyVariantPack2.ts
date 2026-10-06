// src/content/enemyVariants/EnemyVariantPack2.ts
// Auto-generated content pack.

export interface EnemyVariantEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ENEMYVARIANT_PACK_2: EnemyVariantEntry[] = [
  {
    id: 'enemyVariants_2_1',
    name: 'EnemyVariant 2.1',
    flavor: 'Auto-generated enemyvariant entry number 1627 for the content pack system.',
    weight: 8,
    tags: ['enemyVariants', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'enemyVariants_2_2',
    name: 'EnemyVariant 2.2',
    flavor: 'Auto-generated enemyvariant entry number 1628 for the content pack system.',
    weight: 9,
    tags: ['enemyVariants', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'enemyVariants_2_3',
    name: 'EnemyVariant 2.3',
    flavor: 'Auto-generated enemyvariant entry number 1629 for the content pack system.',
    weight: 10,
    tags: ['enemyVariants', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'enemyVariants_2_4',
    name: 'EnemyVariant 2.4',
    flavor: 'Auto-generated enemyvariant entry number 1630 for the content pack system.',
    weight: 1,
    tags: ['enemyVariants', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'enemyVariants_2_5',
    name: 'EnemyVariant 2.5',
    flavor: 'Auto-generated enemyvariant entry number 1631 for the content pack system.',
    weight: 2,
    tags: ['enemyVariants', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'enemyVariants_2_6',
    name: 'EnemyVariant 2.6',
    flavor: 'Auto-generated enemyvariant entry number 1632 for the content pack system.',
    weight: 3,
    tags: ['enemyVariants', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getEnemyVariantEntry2(id: string): EnemyVariantEntry | undefined {
  return ENEMYVARIANT_PACK_2.find(e => e.id === id);
}
