// src/content/roomTemplates/RoomTemplatePack23.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_23: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_23_1',
    name: 'RoomTemplate 23.1',
    flavor: 'Auto-generated roomtemplate entry number 2293 for the content pack system.',
    weight: 4,
    tags: ['roomTemplates', 'pack23', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
  {
    id: 'roomTemplates_23_2',
    name: 'RoomTemplate 23.2',
    flavor: 'Auto-generated roomtemplate entry number 2294 for the content pack system.',
    weight: 5,
    tags: ['roomTemplates', 'pack23', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_23' },
  },
  {
    id: 'roomTemplates_23_3',
    name: 'RoomTemplate 23.3',
    flavor: 'Auto-generated roomtemplate entry number 2295 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack23', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_23' },
  },
  {
    id: 'roomTemplates_23_4',
    name: 'RoomTemplate 23.4',
    flavor: 'Auto-generated roomtemplate entry number 2296 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack23', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_23' },
  },
  {
    id: 'roomTemplates_23_5',
    name: 'RoomTemplate 23.5',
    flavor: 'Auto-generated roomtemplate entry number 2297 for the content pack system.',
    weight: 8,
    tags: ['roomTemplates', 'pack23', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_23' },
  },
  {
    id: 'roomTemplates_23_6',
    name: 'RoomTemplate 23.6',
    flavor: 'Auto-generated roomtemplate entry number 2298 for the content pack system.',
    weight: 9,
    tags: ['roomTemplates', 'pack23', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
];

export function getRoomTemplateEntry23(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_23.find(e => e.id === id);
}
