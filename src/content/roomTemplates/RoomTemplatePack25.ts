// src/content/roomTemplates/RoomTemplatePack25.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_25: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_25_1',
    name: 'RoomTemplate 25.1',
    flavor: 'Auto-generated roomtemplate entry number 2305 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'roomTemplates_25_2',
    name: 'RoomTemplate 25.2',
    flavor: 'Auto-generated roomtemplate entry number 2306 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'roomTemplates_25_3',
    name: 'RoomTemplate 25.3',
    flavor: 'Auto-generated roomtemplate entry number 2307 for the content pack system.',
    weight: 8,
    tags: ['roomTemplates', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'roomTemplates_25_4',
    name: 'RoomTemplate 25.4',
    flavor: 'Auto-generated roomtemplate entry number 2308 for the content pack system.',
    weight: 9,
    tags: ['roomTemplates', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'roomTemplates_25_5',
    name: 'RoomTemplate 25.5',
    flavor: 'Auto-generated roomtemplate entry number 2309 for the content pack system.',
    weight: 10,
    tags: ['roomTemplates', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'roomTemplates_25_6',
    name: 'RoomTemplate 25.6',
    flavor: 'Auto-generated roomtemplate entry number 2310 for the content pack system.',
    weight: 1,
    tags: ['roomTemplates', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getRoomTemplateEntry25(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_25.find(e => e.id === id);
}
