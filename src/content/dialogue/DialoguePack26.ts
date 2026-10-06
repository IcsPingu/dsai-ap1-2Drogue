// src/content/dialogue/DialoguePack26.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_26: DialogueEntry[] = [
  {
    id: 'dialogue_26_1',
    name: 'Dialogue 26.1',
    flavor: 'Auto-generated dialogue entry number 391 for the content pack system.',
    weight: 2,
    tags: ['dialogue', 'pack26', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dialogue_26_2',
    name: 'Dialogue 26.2',
    flavor: 'Auto-generated dialogue entry number 392 for the content pack system.',
    weight: 3,
    tags: ['dialogue', 'pack26', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dialogue_26_3',
    name: 'Dialogue 26.3',
    flavor: 'Auto-generated dialogue entry number 393 for the content pack system.',
    weight: 4,
    tags: ['dialogue', 'pack26', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dialogue_26_4',
    name: 'Dialogue 26.4',
    flavor: 'Auto-generated dialogue entry number 394 for the content pack system.',
    weight: 5,
    tags: ['dialogue', 'pack26', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dialogue_26_5',
    name: 'Dialogue 26.5',
    flavor: 'Auto-generated dialogue entry number 395 for the content pack system.',
    weight: 6,
    tags: ['dialogue', 'pack26', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_26' },
  },
  {
    id: 'dialogue_26_6',
    name: 'Dialogue 26.6',
    flavor: 'Auto-generated dialogue entry number 396 for the content pack system.',
    weight: 7,
    tags: ['dialogue', 'pack26', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_26' },
  },
];

export function getDialogueEntry26(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_26.find(e => e.id === id);
}
