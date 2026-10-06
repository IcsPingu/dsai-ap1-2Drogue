// src/content/roomTemplates/RoomTemplatePack14.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_14: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_14_1',
    name: 'RoomTemplate 14.1',
    flavor: 'Auto-generated roomtemplate entry number 2239 for the content pack system.',
    weight: 10,
    tags: ['roomTemplates', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'roomTemplates_14_2',
    name: 'RoomTemplate 14.2',
    flavor: 'Auto-generated roomtemplate entry number 2240 for the content pack system.',
    weight: 1,
    tags: ['roomTemplates', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'roomTemplates_14_3',
    name: 'RoomTemplate 14.3',
    flavor: 'Auto-generated roomtemplate entry number 2241 for the content pack system.',
    weight: 2,
    tags: ['roomTemplates', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'roomTemplates_14_4',
    name: 'RoomTemplate 14.4',
    flavor: 'Auto-generated roomtemplate entry number 2242 for the content pack system.',
    weight: 3,
    tags: ['roomTemplates', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'roomTemplates_14_5',
    name: 'RoomTemplate 14.5',
    flavor: 'Auto-generated roomtemplate entry number 2243 for the content pack system.',
    weight: 4,
    tags: ['roomTemplates', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'roomTemplates_14_6',
    name: 'RoomTemplate 14.6',
    flavor: 'Auto-generated roomtemplate entry number 2244 for the content pack system.',
    weight: 5,
    tags: ['roomTemplates', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getRoomTemplateEntry14(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_14.find(e => e.id === id);
}
