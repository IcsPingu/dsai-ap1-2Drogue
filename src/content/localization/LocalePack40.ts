// src/content/localization/LocalePack40.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_40: LocaleEntry[] = [
  {
    id: 'localization_40_1',
    name: 'Locale 40.1',
    flavor: 'Auto-generated locale entry number 955 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack40', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_40' },
  },
  {
    id: 'localization_40_2',
    name: 'Locale 40.2',
    flavor: 'Auto-generated locale entry number 956 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack40', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_40' },
  },
  {
    id: 'localization_40_3',
    name: 'Locale 40.3',
    flavor: 'Auto-generated locale entry number 957 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack40', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_40' },
  },
  {
    id: 'localization_40_4',
    name: 'Locale 40.4',
    flavor: 'Auto-generated locale entry number 958 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack40', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_40' },
  },
  {
    id: 'localization_40_5',
    name: 'Locale 40.5',
    flavor: 'Auto-generated locale entry number 959 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack40', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_40' },
  },
  {
    id: 'localization_40_6',
    name: 'Locale 40.6',
    flavor: 'Auto-generated locale entry number 960 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack40', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_40' },
  },
];

export function getLocaleEntry40(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_40.find(e => e.id === id);
}
