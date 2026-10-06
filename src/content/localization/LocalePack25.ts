// src/content/localization/LocalePack25.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_25: LocaleEntry[] = [
  {
    id: 'localization_25_1',
    name: 'Locale 25.1',
    flavor: 'Auto-generated locale entry number 865 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack25', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
  {
    id: 'localization_25_2',
    name: 'Locale 25.2',
    flavor: 'Auto-generated locale entry number 866 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack25', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_25' },
  },
  {
    id: 'localization_25_3',
    name: 'Locale 25.3',
    flavor: 'Auto-generated locale entry number 867 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack25', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_25' },
  },
  {
    id: 'localization_25_4',
    name: 'Locale 25.4',
    flavor: 'Auto-generated locale entry number 868 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack25', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_25' },
  },
  {
    id: 'localization_25_5',
    name: 'Locale 25.5',
    flavor: 'Auto-generated locale entry number 869 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack25', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_25' },
  },
  {
    id: 'localization_25_6',
    name: 'Locale 25.6',
    flavor: 'Auto-generated locale entry number 870 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack25', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_25' },
  },
];

export function getLocaleEntry25(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_25.find(e => e.id === id);
}
