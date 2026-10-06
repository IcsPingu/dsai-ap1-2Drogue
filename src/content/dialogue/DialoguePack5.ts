// src/content/dialogue/DialoguePack5.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_5: DialogueEntry[] = [
  {
    id: 'dialogue_5_1',
    name: 'Dialogue 5.1',
    flavor: 'Auto-generated dialogue entry number 265 for the content pack system.',
    weight: 6,
    tags: ['dialogue', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dialogue_5_2',
    name: 'Dialogue 5.2',
    flavor: 'Auto-generated dialogue entry number 266 for the content pack system.',
    weight: 7,
    tags: ['dialogue', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dialogue_5_3',
    name: 'Dialogue 5.3',
    flavor: 'Auto-generated dialogue entry number 267 for the content pack system.',
    weight: 8,
    tags: ['dialogue', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dialogue_5_4',
    name: 'Dialogue 5.4',
    flavor: 'Auto-generated dialogue entry number 268 for the content pack system.',
    weight: 9,
    tags: ['dialogue', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dialogue_5_5',
    name: 'Dialogue 5.5',
    flavor: 'Auto-generated dialogue entry number 269 for the content pack system.',
    weight: 10,
    tags: ['dialogue', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'dialogue_5_6',
    name: 'Dialogue 5.6',
    flavor: 'Auto-generated dialogue entry number 270 for the content pack system.',
    weight: 1,
    tags: ['dialogue', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getDialogueEntry5(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_5.find(e => e.id === id);
}
