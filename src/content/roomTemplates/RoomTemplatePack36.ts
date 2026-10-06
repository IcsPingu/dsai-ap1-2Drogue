// src/content/roomTemplates/RoomTemplatePack36.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_36: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_36_1',
    name: 'RoomTemplate 36.1',
    flavor: 'Auto-generated roomtemplate entry number 2371 for the content pack system.',
    weight: 2,
    tags: ['roomTemplates', 'pack36', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
  {
    id: 'roomTemplates_36_2',
    name: 'RoomTemplate 36.2',
    flavor: 'Auto-generated roomtemplate entry number 2372 for the content pack system.',
    weight: 3,
    tags: ['roomTemplates', 'pack36', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_36' },
  },
  {
    id: 'roomTemplates_36_3',
    name: 'RoomTemplate 36.3',
    flavor: 'Auto-generated roomtemplate entry number 2373 for the content pack system.',
    weight: 4,
    tags: ['roomTemplates', 'pack36', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_36' },
  },
  {
    id: 'roomTemplates_36_4',
    name: 'RoomTemplate 36.4',
    flavor: 'Auto-generated roomtemplate entry number 2374 for the content pack system.',
    weight: 5,
    tags: ['roomTemplates', 'pack36', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_36' },
  },
  {
    id: 'roomTemplates_36_5',
    name: 'RoomTemplate 36.5',
    flavor: 'Auto-generated roomtemplate entry number 2375 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack36', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_36' },
  },
  {
    id: 'roomTemplates_36_6',
    name: 'RoomTemplate 36.6',
    flavor: 'Auto-generated roomtemplate entry number 2376 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack36', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
];

export function getRoomTemplateEntry36(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_36.find(e => e.id === id);
}
