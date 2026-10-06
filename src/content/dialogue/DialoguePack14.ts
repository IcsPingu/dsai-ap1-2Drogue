// src/content/dialogue/DialoguePack14.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_14: DialogueEntry[] = [
  {
    id: 'dialogue_14_1',
    name: 'Dialogue 14.1',
    flavor: 'Auto-generated dialogue entry number 319 for the content pack system.',
    weight: 10,
    tags: ['dialogue', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dialogue_14_2',
    name: 'Dialogue 14.2',
    flavor: 'Auto-generated dialogue entry number 320 for the content pack system.',
    weight: 1,
    tags: ['dialogue', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dialogue_14_3',
    name: 'Dialogue 14.3',
    flavor: 'Auto-generated dialogue entry number 321 for the content pack system.',
    weight: 2,
    tags: ['dialogue', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dialogue_14_4',
    name: 'Dialogue 14.4',
    flavor: 'Auto-generated dialogue entry number 322 for the content pack system.',
    weight: 3,
    tags: ['dialogue', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dialogue_14_5',
    name: 'Dialogue 14.5',
    flavor: 'Auto-generated dialogue entry number 323 for the content pack system.',
    weight: 4,
    tags: ['dialogue', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'dialogue_14_6',
    name: 'Dialogue 14.6',
    flavor: 'Auto-generated dialogue entry number 324 for the content pack system.',
    weight: 5,
    tags: ['dialogue', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getDialogueEntry14(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_14.find(e => e.id === id);
}
