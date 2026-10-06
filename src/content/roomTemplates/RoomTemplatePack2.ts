// src/content/roomTemplates/RoomTemplatePack2.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_2: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_2_1',
    name: 'RoomTemplate 2.1',
    flavor: 'Auto-generated roomtemplate entry number 2167 for the content pack system.',
    weight: 8,
    tags: ['roomTemplates', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'roomTemplates_2_2',
    name: 'RoomTemplate 2.2',
    flavor: 'Auto-generated roomtemplate entry number 2168 for the content pack system.',
    weight: 9,
    tags: ['roomTemplates', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'roomTemplates_2_3',
    name: 'RoomTemplate 2.3',
    flavor: 'Auto-generated roomtemplate entry number 2169 for the content pack system.',
    weight: 10,
    tags: ['roomTemplates', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'roomTemplates_2_4',
    name: 'RoomTemplate 2.4',
    flavor: 'Auto-generated roomtemplate entry number 2170 for the content pack system.',
    weight: 1,
    tags: ['roomTemplates', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'roomTemplates_2_5',
    name: 'RoomTemplate 2.5',
    flavor: 'Auto-generated roomtemplate entry number 2171 for the content pack system.',
    weight: 2,
    tags: ['roomTemplates', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'roomTemplates_2_6',
    name: 'RoomTemplate 2.6',
    flavor: 'Auto-generated roomtemplate entry number 2172 for the content pack system.',
    weight: 3,
    tags: ['roomTemplates', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getRoomTemplateEntry2(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_2.find(e => e.id === id);
}
