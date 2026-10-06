// src/content/roomTemplates/RoomTemplatePack1.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_1: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_1_1',
    name: 'RoomTemplate 1.1',
    flavor: 'Auto-generated roomtemplate entry number 2161 for the content pack system.',
    weight: 2,
    tags: ['roomTemplates', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'roomTemplates_1_2',
    name: 'RoomTemplate 1.2',
    flavor: 'Auto-generated roomtemplate entry number 2162 for the content pack system.',
    weight: 3,
    tags: ['roomTemplates', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'roomTemplates_1_3',
    name: 'RoomTemplate 1.3',
    flavor: 'Auto-generated roomtemplate entry number 2163 for the content pack system.',
    weight: 4,
    tags: ['roomTemplates', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'roomTemplates_1_4',
    name: 'RoomTemplate 1.4',
    flavor: 'Auto-generated roomtemplate entry number 2164 for the content pack system.',
    weight: 5,
    tags: ['roomTemplates', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'roomTemplates_1_5',
    name: 'RoomTemplate 1.5',
    flavor: 'Auto-generated roomtemplate entry number 2165 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'roomTemplates_1_6',
    name: 'RoomTemplate 1.6',
    flavor: 'Auto-generated roomtemplate entry number 2166 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getRoomTemplateEntry1(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_1.find(e => e.id === id);
}
