// src/content/dialogue/DialoguePack23.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_23: DialogueEntry[] = [
  {
    id: 'dialogue_23_1',
    name: 'Dialogue 23.1',
    flavor: 'Auto-generated dialogue entry number 373 for the content pack system.',
    weight: 4,
    tags: ['dialogue', 'pack23', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dialogue_23_2',
    name: 'Dialogue 23.2',
    flavor: 'Auto-generated dialogue entry number 374 for the content pack system.',
    weight: 5,
    tags: ['dialogue', 'pack23', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dialogue_23_3',
    name: 'Dialogue 23.3',
    flavor: 'Auto-generated dialogue entry number 375 for the content pack system.',
    weight: 6,
    tags: ['dialogue', 'pack23', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dialogue_23_4',
    name: 'Dialogue 23.4',
    flavor: 'Auto-generated dialogue entry number 376 for the content pack system.',
    weight: 7,
    tags: ['dialogue', 'pack23', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dialogue_23_5',
    name: 'Dialogue 23.5',
    flavor: 'Auto-generated dialogue entry number 377 for the content pack system.',
    weight: 8,
    tags: ['dialogue', 'pack23', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_23' },
  },
  {
    id: 'dialogue_23_6',
    name: 'Dialogue 23.6',
    flavor: 'Auto-generated dialogue entry number 378 for the content pack system.',
    weight: 9,
    tags: ['dialogue', 'pack23', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
];

export function getDialogueEntry23(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_23.find(e => e.id === id);
}
