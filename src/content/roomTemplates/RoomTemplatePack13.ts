// src/content/roomTemplates/RoomTemplatePack13.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_13: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_13_1',
    name: 'RoomTemplate 13.1',
    flavor: 'Auto-generated roomtemplate entry number 2233 for the content pack system.',
    weight: 4,
    tags: ['roomTemplates', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'roomTemplates_13_2',
    name: 'RoomTemplate 13.2',
    flavor: 'Auto-generated roomtemplate entry number 2234 for the content pack system.',
    weight: 5,
    tags: ['roomTemplates', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'roomTemplates_13_3',
    name: 'RoomTemplate 13.3',
    flavor: 'Auto-generated roomtemplate entry number 2235 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'roomTemplates_13_4',
    name: 'RoomTemplate 13.4',
    flavor: 'Auto-generated roomtemplate entry number 2236 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'roomTemplates_13_5',
    name: 'RoomTemplate 13.5',
    flavor: 'Auto-generated roomtemplate entry number 2237 for the content pack system.',
    weight: 8,
    tags: ['roomTemplates', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'roomTemplates_13_6',
    name: 'RoomTemplate 13.6',
    flavor: 'Auto-generated roomtemplate entry number 2238 for the content pack system.',
    weight: 9,
    tags: ['roomTemplates', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getRoomTemplateEntry13(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_13.find(e => e.id === id);
}
