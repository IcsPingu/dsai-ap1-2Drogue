// src/content/localization/LocalePack14.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_14: LocaleEntry[] = [
  {
    id: 'localization_14_1',
    name: 'Locale 14.1',
    flavor: 'Auto-generated locale entry number 799 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack14', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
  {
    id: 'localization_14_2',
    name: 'Locale 14.2',
    flavor: 'Auto-generated locale entry number 800 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack14', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_14' },
  },
  {
    id: 'localization_14_3',
    name: 'Locale 14.3',
    flavor: 'Auto-generated locale entry number 801 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack14', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_14' },
  },
  {
    id: 'localization_14_4',
    name: 'Locale 14.4',
    flavor: 'Auto-generated locale entry number 802 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack14', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_14' },
  },
  {
    id: 'localization_14_5',
    name: 'Locale 14.5',
    flavor: 'Auto-generated locale entry number 803 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack14', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_14' },
  },
  {
    id: 'localization_14_6',
    name: 'Locale 14.6',
    flavor: 'Auto-generated locale entry number 804 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack14', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_14' },
  },
];

export function getLocaleEntry14(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_14.find(e => e.id === id);
}
