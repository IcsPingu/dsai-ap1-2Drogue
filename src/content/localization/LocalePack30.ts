// src/content/localization/LocalePack30.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_30: LocaleEntry[] = [
  {
    id: 'localization_30_1',
    name: 'Locale 30.1',
    flavor: 'Auto-generated locale entry number 895 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack30', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_30' },
  },
  {
    id: 'localization_30_2',
    name: 'Locale 30.2',
    flavor: 'Auto-generated locale entry number 896 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack30', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_30' },
  },
  {
    id: 'localization_30_3',
    name: 'Locale 30.3',
    flavor: 'Auto-generated locale entry number 897 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack30', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_30' },
  },
  {
    id: 'localization_30_4',
    name: 'Locale 30.4',
    flavor: 'Auto-generated locale entry number 898 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack30', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_30' },
  },
  {
    id: 'localization_30_5',
    name: 'Locale 30.5',
    flavor: 'Auto-generated locale entry number 899 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack30', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_30' },
  },
  {
    id: 'localization_30_6',
    name: 'Locale 30.6',
    flavor: 'Auto-generated locale entry number 900 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack30', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_30' },
  },
];

export function getLocaleEntry30(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_30.find(e => e.id === id);
}
