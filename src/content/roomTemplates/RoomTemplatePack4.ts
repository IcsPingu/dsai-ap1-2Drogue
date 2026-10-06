// src/content/roomTemplates/RoomTemplatePack4.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_4: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_4_1',
    name: 'RoomTemplate 4.1',
    flavor: 'Auto-generated roomtemplate entry number 2179 for the content pack system.',
    weight: 10,
    tags: ['roomTemplates', 'pack4', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
  {
    id: 'roomTemplates_4_2',
    name: 'RoomTemplate 4.2',
    flavor: 'Auto-generated roomtemplate entry number 2180 for the content pack system.',
    weight: 1,
    tags: ['roomTemplates', 'pack4', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_4' },
  },
  {
    id: 'roomTemplates_4_3',
    name: 'RoomTemplate 4.3',
    flavor: 'Auto-generated roomtemplate entry number 2181 for the content pack system.',
    weight: 2,
    tags: ['roomTemplates', 'pack4', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_4' },
  },
  {
    id: 'roomTemplates_4_4',
    name: 'RoomTemplate 4.4',
    flavor: 'Auto-generated roomtemplate entry number 2182 for the content pack system.',
    weight: 3,
    tags: ['roomTemplates', 'pack4', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_4' },
  },
  {
    id: 'roomTemplates_4_5',
    name: 'RoomTemplate 4.5',
    flavor: 'Auto-generated roomtemplate entry number 2183 for the content pack system.',
    weight: 4,
    tags: ['roomTemplates', 'pack4', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_4' },
  },
  {
    id: 'roomTemplates_4_6',
    name: 'RoomTemplate 4.6',
    flavor: 'Auto-generated roomtemplate entry number 2184 for the content pack system.',
    weight: 5,
    tags: ['roomTemplates', 'pack4', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
];

export function getRoomTemplateEntry4(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_4.find(e => e.id === id);
}
