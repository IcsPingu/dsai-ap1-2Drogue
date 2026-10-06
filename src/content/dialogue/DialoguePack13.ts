// src/content/dialogue/DialoguePack13.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_13: DialogueEntry[] = [
  {
    id: 'dialogue_13_1',
    name: 'Dialogue 13.1',
    flavor: 'Auto-generated dialogue entry number 313 for the content pack system.',
    weight: 4,
    tags: ['dialogue', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dialogue_13_2',
    name: 'Dialogue 13.2',
    flavor: 'Auto-generated dialogue entry number 314 for the content pack system.',
    weight: 5,
    tags: ['dialogue', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dialogue_13_3',
    name: 'Dialogue 13.3',
    flavor: 'Auto-generated dialogue entry number 315 for the content pack system.',
    weight: 6,
    tags: ['dialogue', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dialogue_13_4',
    name: 'Dialogue 13.4',
    flavor: 'Auto-generated dialogue entry number 316 for the content pack system.',
    weight: 7,
    tags: ['dialogue', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dialogue_13_5',
    name: 'Dialogue 13.5',
    flavor: 'Auto-generated dialogue entry number 317 for the content pack system.',
    weight: 8,
    tags: ['dialogue', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'dialogue_13_6',
    name: 'Dialogue 13.6',
    flavor: 'Auto-generated dialogue entry number 318 for the content pack system.',
    weight: 9,
    tags: ['dialogue', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getDialogueEntry13(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_13.find(e => e.id === id);
}
