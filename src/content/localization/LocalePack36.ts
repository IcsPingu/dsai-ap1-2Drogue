// src/content/localization/LocalePack36.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_36: LocaleEntry[] = [
  {
    id: 'localization_36_1',
    name: 'Locale 36.1',
    flavor: 'Auto-generated locale entry number 931 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack36', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
  {
    id: 'localization_36_2',
    name: 'Locale 36.2',
    flavor: 'Auto-generated locale entry number 932 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack36', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_36' },
  },
  {
    id: 'localization_36_3',
    name: 'Locale 36.3',
    flavor: 'Auto-generated locale entry number 933 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack36', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_36' },
  },
  {
    id: 'localization_36_4',
    name: 'Locale 36.4',
    flavor: 'Auto-generated locale entry number 934 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack36', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_36' },
  },
  {
    id: 'localization_36_5',
    name: 'Locale 36.5',
    flavor: 'Auto-generated locale entry number 935 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack36', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_36' },
  },
  {
    id: 'localization_36_6',
    name: 'Locale 36.6',
    flavor: 'Auto-generated locale entry number 936 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack36', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_36' },
  },
];

export function getLocaleEntry36(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_36.find(e => e.id === id);
}
