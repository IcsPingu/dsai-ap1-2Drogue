// src/content/localization/LocalePack27.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_27: LocaleEntry[] = [
  {
    id: 'localization_27_1',
    name: 'Locale 27.1',
    flavor: 'Auto-generated locale entry number 877 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack27', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_27' },
  },
  {
    id: 'localization_27_2',
    name: 'Locale 27.2',
    flavor: 'Auto-generated locale entry number 878 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack27', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_27' },
  },
  {
    id: 'localization_27_3',
    name: 'Locale 27.3',
    flavor: 'Auto-generated locale entry number 879 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack27', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_27' },
  },
  {
    id: 'localization_27_4',
    name: 'Locale 27.4',
    flavor: 'Auto-generated locale entry number 880 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack27', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_27' },
  },
  {
    id: 'localization_27_5',
    name: 'Locale 27.5',
    flavor: 'Auto-generated locale entry number 881 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack27', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_27' },
  },
  {
    id: 'localization_27_6',
    name: 'Locale 27.6',
    flavor: 'Auto-generated locale entry number 882 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack27', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_27' },
  },
];

export function getLocaleEntry27(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_27.find(e => e.id === id);
}
