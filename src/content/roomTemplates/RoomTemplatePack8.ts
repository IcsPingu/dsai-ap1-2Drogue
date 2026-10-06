// src/content/roomTemplates/RoomTemplatePack8.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_8: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_8_1',
    name: 'RoomTemplate 8.1',
    flavor: 'Auto-generated roomtemplate entry number 2203 for the content pack system.',
    weight: 4,
    tags: ['roomTemplates', 'pack8', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
  {
    id: 'roomTemplates_8_2',
    name: 'RoomTemplate 8.2',
    flavor: 'Auto-generated roomtemplate entry number 2204 for the content pack system.',
    weight: 5,
    tags: ['roomTemplates', 'pack8', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_8' },
  },
  {
    id: 'roomTemplates_8_3',
    name: 'RoomTemplate 8.3',
    flavor: 'Auto-generated roomtemplate entry number 2205 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack8', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_8' },
  },
  {
    id: 'roomTemplates_8_4',
    name: 'RoomTemplate 8.4',
    flavor: 'Auto-generated roomtemplate entry number 2206 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack8', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_8' },
  },
  {
    id: 'roomTemplates_8_5',
    name: 'RoomTemplate 8.5',
    flavor: 'Auto-generated roomtemplate entry number 2207 for the content pack system.',
    weight: 8,
    tags: ['roomTemplates', 'pack8', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_8' },
  },
  {
    id: 'roomTemplates_8_6',
    name: 'RoomTemplate 8.6',
    flavor: 'Auto-generated roomtemplate entry number 2208 for the content pack system.',
    weight: 9,
    tags: ['roomTemplates', 'pack8', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
];

export function getRoomTemplateEntry8(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_8.find(e => e.id === id);
}
