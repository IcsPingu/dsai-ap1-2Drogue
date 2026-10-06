// src/content/tutorials/TutorialPack1.ts
// Auto-generated content pack.

export interface TutorialEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const TUTORIAL_PACK_1: TutorialEntry[] = [
  {
    id: 'tutorials_1_1',
    name: 'Tutorial 1.1',
    flavor: 'Auto-generated tutorial entry number 481 for the content pack system.',
    weight: 2,
    tags: ['tutorials', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'tutorials_1_2',
    name: 'Tutorial 1.2',
    flavor: 'Auto-generated tutorial entry number 482 for the content pack system.',
    weight: 3,
    tags: ['tutorials', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'tutorials_1_3',
    name: 'Tutorial 1.3',
    flavor: 'Auto-generated tutorial entry number 483 for the content pack system.',
    weight: 4,
    tags: ['tutorials', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'tutorials_1_4',
    name: 'Tutorial 1.4',
    flavor: 'Auto-generated tutorial entry number 484 for the content pack system.',
    weight: 5,
    tags: ['tutorials', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'tutorials_1_5',
    name: 'Tutorial 1.5',
    flavor: 'Auto-generated tutorial entry number 485 for the content pack system.',
    weight: 6,
    tags: ['tutorials', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'tutorials_1_6',
    name: 'Tutorial 1.6',
    flavor: 'Auto-generated tutorial entry number 486 for the content pack system.',
    weight: 7,
    tags: ['tutorials', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getTutorialEntry1(id: string): TutorialEntry | undefined {
  return TUTORIAL_PACK_1.find(e => e.id === id);
}
