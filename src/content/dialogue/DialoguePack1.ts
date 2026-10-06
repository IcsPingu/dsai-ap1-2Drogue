// src/content/dialogue/DialoguePack1.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_1: DialogueEntry[] = [
  {
    id: 'dialogue_1_1',
    name: 'Dialogue 1.1',
    flavor: 'Auto-generated dialogue entry number 241 for the content pack system.',
    weight: 2,
    tags: ['dialogue', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dialogue_1_2',
    name: 'Dialogue 1.2',
    flavor: 'Auto-generated dialogue entry number 242 for the content pack system.',
    weight: 3,
    tags: ['dialogue', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dialogue_1_3',
    name: 'Dialogue 1.3',
    flavor: 'Auto-generated dialogue entry number 243 for the content pack system.',
    weight: 4,
    tags: ['dialogue', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dialogue_1_4',
    name: 'Dialogue 1.4',
    flavor: 'Auto-generated dialogue entry number 244 for the content pack system.',
    weight: 5,
    tags: ['dialogue', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dialogue_1_5',
    name: 'Dialogue 1.5',
    flavor: 'Auto-generated dialogue entry number 245 for the content pack system.',
    weight: 6,
    tags: ['dialogue', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'dialogue_1_6',
    name: 'Dialogue 1.6',
    flavor: 'Auto-generated dialogue entry number 246 for the content pack system.',
    weight: 7,
    tags: ['dialogue', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getDialogueEntry1(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_1.find(e => e.id === id);
}
