// src/content/dialogue/DialoguePack2.ts
// Auto-generated content pack.

export interface DialogueEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const DIALOGUE_PACK_2: DialogueEntry[] = [
  {
    id: 'dialogue_2_1',
    name: 'Dialogue 2.1',
    flavor: 'Auto-generated dialogue entry number 247 for the content pack system.',
    weight: 8,
    tags: ['dialogue', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dialogue_2_2',
    name: 'Dialogue 2.2',
    flavor: 'Auto-generated dialogue entry number 248 for the content pack system.',
    weight: 9,
    tags: ['dialogue', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dialogue_2_3',
    name: 'Dialogue 2.3',
    flavor: 'Auto-generated dialogue entry number 249 for the content pack system.',
    weight: 10,
    tags: ['dialogue', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dialogue_2_4',
    name: 'Dialogue 2.4',
    flavor: 'Auto-generated dialogue entry number 250 for the content pack system.',
    weight: 1,
    tags: ['dialogue', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dialogue_2_5',
    name: 'Dialogue 2.5',
    flavor: 'Auto-generated dialogue entry number 251 for the content pack system.',
    weight: 2,
    tags: ['dialogue', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'dialogue_2_6',
    name: 'Dialogue 2.6',
    flavor: 'Auto-generated dialogue entry number 252 for the content pack system.',
    weight: 3,
    tags: ['dialogue', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getDialogueEntry2(id: string): DialogueEntry | undefined {
  return DIALOGUE_PACK_2.find(e => e.id === id);
}
