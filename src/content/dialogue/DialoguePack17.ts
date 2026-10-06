// src/content/dialogue/DialoguePack17.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_17: DialogueEntry[] = [
  {
    id: 'dialogue_17_1',
    name: 'Dialogue 17.1',
    flavor: 'Auto-generated dialogue entry number 337 for the content pack system.',
    weight: 8,
    tags: ['dialogue', 'pack17', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dialogue_17_2',
    name: 'Dialogue 17.2',
    flavor: 'Auto-generated dialogue entry number 338 for the content pack system.',
    weight: 9,
    tags: ['dialogue', 'pack17', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dialogue_17_3',
    name: 'Dialogue 17.3',
    flavor: 'Auto-generated dialogue entry number 339 for the content pack system.',
    weight: 10,
    tags: ['dialogue', 'pack17', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dialogue_17_4',
    name: 'Dialogue 17.4',
    flavor: 'Auto-generated dialogue entry number 340 for the content pack system.',
    weight: 1,
    tags: ['dialogue', 'pack17', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dialogue_17_5',
    name: 'Dialogue 17.5',
    flavor: 'Auto-generated dialogue entry number 341 for the content pack system.',
    weight: 2,
    tags: ['dialogue', 'pack17', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_17' },
  },
  {
    id: 'dialogue_17_6',
    name: 'Dialogue 17.6',
    flavor: 'Auto-generated dialogue entry number 342 for the content pack system.',
    weight: 3,
    tags: ['dialogue', 'pack17', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_17' },
  },
];

export function getDialogueEntry17(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_17.find(e => e.id === id);
}
