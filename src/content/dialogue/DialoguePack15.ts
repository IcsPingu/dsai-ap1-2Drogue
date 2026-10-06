// src/content/dialogue/DialoguePack15.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_15: DialogueEntry[] = [
  {
    id: 'dialogue_15_1',
    name: 'Dialogue 15.1',
    flavor: 'Auto-generated dialogue entry number 325 for the content pack system.',
    weight: 6,
    tags: ['dialogue', 'pack15', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dialogue_15_2',
    name: 'Dialogue 15.2',
    flavor: 'Auto-generated dialogue entry number 326 for the content pack system.',
    weight: 7,
    tags: ['dialogue', 'pack15', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dialogue_15_3',
    name: 'Dialogue 15.3',
    flavor: 'Auto-generated dialogue entry number 327 for the content pack system.',
    weight: 8,
    tags: ['dialogue', 'pack15', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dialogue_15_4',
    name: 'Dialogue 15.4',
    flavor: 'Auto-generated dialogue entry number 328 for the content pack system.',
    weight: 9,
    tags: ['dialogue', 'pack15', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dialogue_15_5',
    name: 'Dialogue 15.5',
    flavor: 'Auto-generated dialogue entry number 329 for the content pack system.',
    weight: 10,
    tags: ['dialogue', 'pack15', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_15' },
  },
  {
    id: 'dialogue_15_6',
    name: 'Dialogue 15.6',
    flavor: 'Auto-generated dialogue entry number 330 for the content pack system.',
    weight: 1,
    tags: ['dialogue', 'pack15', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_15' },
  },
];

export function getDialogueEntry15(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_15.find(e => e.id === id);
}
