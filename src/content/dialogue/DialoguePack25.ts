// src/content/dialogue/DialoguePack25.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_25: DialogueEntry[] = [
  {
    id: 'dialogue_25_1',
    name: 'Dialogue 25.1',
    flavor: 'Auto-generated dialogue entry number 385 for the content pack system.',
    weight: 6,
    tags: ['dialogue', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dialogue_25_2',
    name: 'Dialogue 25.2',
    flavor: 'Auto-generated dialogue entry number 386 for the content pack system.',
    weight: 7,
    tags: ['dialogue', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dialogue_25_3',
    name: 'Dialogue 25.3',
    flavor: 'Auto-generated dialogue entry number 387 for the content pack system.',
    weight: 8,
    tags: ['dialogue', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dialogue_25_4',
    name: 'Dialogue 25.4',
    flavor: 'Auto-generated dialogue entry number 388 for the content pack system.',
    weight: 9,
    tags: ['dialogue', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dialogue_25_5',
    name: 'Dialogue 25.5',
    flavor: 'Auto-generated dialogue entry number 389 for the content pack system.',
    weight: 10,
    tags: ['dialogue', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'dialogue_25_6',
    name: 'Dialogue 25.6',
    flavor: 'Auto-generated dialogue entry number 390 for the content pack system.',
    weight: 1,
    tags: ['dialogue', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getDialogueEntry25(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_25.find(e => e.id === id);
}
