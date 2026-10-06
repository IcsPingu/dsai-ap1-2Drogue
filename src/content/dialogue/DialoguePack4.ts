// src/content/dialogue/DialoguePack4.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_4: DialogueEntry[] = [
  {
    id: 'dialogue_4_1',
    name: 'Dialogue 4.1',
    flavor: 'Auto-generated dialogue entry number 259 for the content pack system.',
    weight: 10,
    tags: ['dialogue', 'pack4', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dialogue_4_2',
    name: 'Dialogue 4.2',
    flavor: 'Auto-generated dialogue entry number 260 for the content pack system.',
    weight: 1,
    tags: ['dialogue', 'pack4', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dialogue_4_3',
    name: 'Dialogue 4.3',
    flavor: 'Auto-generated dialogue entry number 261 for the content pack system.',
    weight: 2,
    tags: ['dialogue', 'pack4', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dialogue_4_4',
    name: 'Dialogue 4.4',
    flavor: 'Auto-generated dialogue entry number 262 for the content pack system.',
    weight: 3,
    tags: ['dialogue', 'pack4', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dialogue_4_5',
    name: 'Dialogue 4.5',
    flavor: 'Auto-generated dialogue entry number 263 for the content pack system.',
    weight: 4,
    tags: ['dialogue', 'pack4', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_4' },
  },
  {
    id: 'dialogue_4_6',
    name: 'Dialogue 4.6',
    flavor: 'Auto-generated dialogue entry number 264 for the content pack system.',
    weight: 5,
    tags: ['dialogue', 'pack4', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
];

export function getDialogueEntry4(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_4.find(e => e.id === id);
}
