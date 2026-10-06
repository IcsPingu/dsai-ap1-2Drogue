// src/content/tutorials/TutorialPack2.ts
// Auto-generated content pack.

export interface TutorialEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const TUTORIAL_PACK_2: TutorialEntry[] = [
  {
    id: 'tutorials_2_1',
    name: 'Tutorial 2.1',
    flavor: 'Auto-generated tutorial entry number 487 for the content pack system.',
    weight: 8,
    tags: ['tutorials', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'tutorials_2_2',
    name: 'Tutorial 2.2',
    flavor: 'Auto-generated tutorial entry number 488 for the content pack system.',
    weight: 9,
    tags: ['tutorials', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'tutorials_2_3',
    name: 'Tutorial 2.3',
    flavor: 'Auto-generated tutorial entry number 489 for the content pack system.',
    weight: 10,
    tags: ['tutorials', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'tutorials_2_4',
    name: 'Tutorial 2.4',
    flavor: 'Auto-generated tutorial entry number 490 for the content pack system.',
    weight: 1,
    tags: ['tutorials', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'tutorials_2_5',
    name: 'Tutorial 2.5',
    flavor: 'Auto-generated tutorial entry number 491 for the content pack system.',
    weight: 2,
    tags: ['tutorials', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'tutorials_2_6',
    name: 'Tutorial 2.6',
    flavor: 'Auto-generated tutorial entry number 492 for the content pack system.',
    weight: 3,
    tags: ['tutorials', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getTutorialEntry2(id: string): TutorialEntry | undefined {
  return TUTORIAL_PACK_2.find(e => e.id === id);
}
