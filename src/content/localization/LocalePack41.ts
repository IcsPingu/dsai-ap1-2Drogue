// src/content/localization/LocalePack41.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_41: LocaleEntry[] = [
  {
    id: 'localization_41_1',
    name: 'Locale 41.1',
    flavor: 'Auto-generated locale entry number 961 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack41', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_41' },
  },
  {
    id: 'localization_41_2',
    name: 'Locale 41.2',
    flavor: 'Auto-generated locale entry number 962 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack41', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_41' },
  },
  {
    id: 'localization_41_3',
    name: 'Locale 41.3',
    flavor: 'Auto-generated locale entry number 963 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack41', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_41' },
  },
  {
    id: 'localization_41_4',
    name: 'Locale 41.4',
    flavor: 'Auto-generated locale entry number 964 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack41', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_41' },
  },
  {
    id: 'localization_41_5',
    name: 'Locale 41.5',
    flavor: 'Auto-generated locale entry number 965 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack41', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_41' },
  },
  {
    id: 'localization_41_6',
    name: 'Locale 41.6',
    flavor: 'Auto-generated locale entry number 966 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack41', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_41' },
  },
];

export function getLocaleEntry41(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_41.find(e => e.id === id);
}
