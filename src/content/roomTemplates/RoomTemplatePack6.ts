// src/content/roomTemplates/RoomTemplatePack6.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_6: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_6_1',
    name: 'RoomTemplate 6.1',
    flavor: 'Auto-generated roomtemplate entry number 2191 for the content pack system.',
    weight: 2,
    tags: ['roomTemplates', 'pack6', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
  {
    id: 'roomTemplates_6_2',
    name: 'RoomTemplate 6.2',
    flavor: 'Auto-generated roomtemplate entry number 2192 for the content pack system.',
    weight: 3,
    tags: ['roomTemplates', 'pack6', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_6' },
  },
  {
    id: 'roomTemplates_6_3',
    name: 'RoomTemplate 6.3',
    flavor: 'Auto-generated roomtemplate entry number 2193 for the content pack system.',
    weight: 4,
    tags: ['roomTemplates', 'pack6', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_6' },
  },
  {
    id: 'roomTemplates_6_4',
    name: 'RoomTemplate 6.4',
    flavor: 'Auto-generated roomtemplate entry number 2194 for the content pack system.',
    weight: 5,
    tags: ['roomTemplates', 'pack6', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_6' },
  },
  {
    id: 'roomTemplates_6_5',
    name: 'RoomTemplate 6.5',
    flavor: 'Auto-generated roomtemplate entry number 2195 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack6', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_6' },
  },
  {
    id: 'roomTemplates_6_6',
    name: 'RoomTemplate 6.6',
    flavor: 'Auto-generated roomtemplate entry number 2196 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack6', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
];

export function getRoomTemplateEntry6(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_6.find(e => e.id === id);
}
