// src/content/roomTemplates/RoomTemplatePack20.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_20: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_20_1',
    name: 'RoomTemplate 20.1',
    flavor: 'Auto-generated roomtemplate entry number 2275 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack20', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
  {
    id: 'roomTemplates_20_2',
    name: 'RoomTemplate 20.2',
    flavor: 'Auto-generated roomtemplate entry number 2276 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack20', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_20' },
  },
  {
    id: 'roomTemplates_20_3',
    name: 'RoomTemplate 20.3',
    flavor: 'Auto-generated roomtemplate entry number 2277 for the content pack system.',
    weight: 8,
    tags: ['roomTemplates', 'pack20', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_20' },
  },
  {
    id: 'roomTemplates_20_4',
    name: 'RoomTemplate 20.4',
    flavor: 'Auto-generated roomtemplate entry number 2278 for the content pack system.',
    weight: 9,
    tags: ['roomTemplates', 'pack20', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_20' },
  },
  {
    id: 'roomTemplates_20_5',
    name: 'RoomTemplate 20.5',
    flavor: 'Auto-generated roomtemplate entry number 2279 for the content pack system.',
    weight: 10,
    tags: ['roomTemplates', 'pack20', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_20' },
  },
  {
    id: 'roomTemplates_20_6',
    name: 'RoomTemplate 20.6',
    flavor: 'Auto-generated roomtemplate entry number 2280 for the content pack system.',
    weight: 1,
    tags: ['roomTemplates', 'pack20', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
];

export function getRoomTemplateEntry20(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_20.find(e => e.id === id);
}
