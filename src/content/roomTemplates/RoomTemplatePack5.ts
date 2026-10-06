// src/content/roomTemplates/RoomTemplatePack5.ts
// Auto-generated content pack.

export interface RoomTemplateEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const ROOMTEMPLATE_PACK_5: RoomTemplateEntry[] = [
  {
    id: 'roomTemplates_5_1',
    name: 'RoomTemplate 5.1',
    flavor: 'Auto-generated roomtemplate entry number 2185 for the content pack system.',
    weight: 6,
    tags: ['roomTemplates', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'roomTemplates_5_2',
    name: 'RoomTemplate 5.2',
    flavor: 'Auto-generated roomtemplate entry number 2186 for the content pack system.',
    weight: 7,
    tags: ['roomTemplates', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'roomTemplates_5_3',
    name: 'RoomTemplate 5.3',
    flavor: 'Auto-generated roomtemplate entry number 2187 for the content pack system.',
    weight: 8,
    tags: ['roomTemplates', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'roomTemplates_5_4',
    name: 'RoomTemplate 5.4',
    flavor: 'Auto-generated roomtemplate entry number 2188 for the content pack system.',
    weight: 9,
    tags: ['roomTemplates', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'roomTemplates_5_5',
    name: 'RoomTemplate 5.5',
    flavor: 'Auto-generated roomtemplate entry number 2189 for the content pack system.',
    weight: 10,
    tags: ['roomTemplates', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'roomTemplates_5_6',
    name: 'RoomTemplate 5.6',
    flavor: 'Auto-generated roomtemplate entry number 2190 for the content pack system.',
    weight: 1,
    tags: ['roomTemplates', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getRoomTemplateEntry5(id: string): RoomTemplateEntry | undefined {
  return ROOMTEMPLATE_PACK_5.find(e => e.id === id);
}
