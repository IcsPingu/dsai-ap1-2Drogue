// src/content/achievements/AchievementPack1.ts
// Auto-generated content pack.

export interface AchievementEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ACHIEVEMENT_PACK_1: AchievementEntry[] = [
  {
    id: 'achievements_1_1',
    name: 'Achievement 1.1',
    flavor: 'Auto-generated achievement entry number 1 for the content pack system.',
    weight: 2,
    tags: ['achievements', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'achievements_1_2',
    name: 'Achievement 1.2',
    flavor: 'Auto-generated achievement entry number 2 for the content pack system.',
    weight: 3,
    tags: ['achievements', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'achievements_1_3',
    name: 'Achievement 1.3',
    flavor: 'Auto-generated achievement entry number 3 for the content pack system.',
    weight: 4,
    tags: ['achievements', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'achievements_1_4',
    name: 'Achievement 1.4',
    flavor: 'Auto-generated achievement entry number 4 for the content pack system.',
    weight: 5,
    tags: ['achievements', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'achievements_1_5',
    name: 'Achievement 1.5',
    flavor: 'Auto-generated achievement entry number 5 for the content pack system.',
    weight: 6,
    tags: ['achievements', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'achievements_1_6',
    name: 'Achievement 1.6',
    flavor: 'Auto-generated achievement entry number 6 for the content pack system.',
    weight: 7,
    tags: ['achievements', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getAchievementEntry1(id: string): AchievementEntry | undefined {
  return ACHIEVEMENT_PACK_1.find(e => e.id === id);
}
