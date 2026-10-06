// src/content/localization/LocalePack8.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_8: LocaleEntry[] = [
  {
    id: 'localization_8_1',
    name: 'Locale 8.1',
    flavor: 'Auto-generated locale entry number 763 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack8', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
  {
    id: 'localization_8_2',
    name: 'Locale 8.2',
    flavor: 'Auto-generated locale entry number 764 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack8', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_8' },
  },
  {
    id: 'localization_8_3',
    name: 'Locale 8.3',
    flavor: 'Auto-generated locale entry number 765 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack8', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_8' },
  },
  {
    id: 'localization_8_4',
    name: 'Locale 8.4',
    flavor: 'Auto-generated locale entry number 766 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack8', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_8' },
  },
  {
    id: 'localization_8_5',
    name: 'Locale 8.5',
    flavor: 'Auto-generated locale entry number 767 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack8', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_8' },
  },
  {
    id: 'localization_8_6',
    name: 'Locale 8.6',
    flavor: 'Auto-generated locale entry number 768 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack8', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_8' },
  },
];

export function getLocaleEntry8(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_8.find(e => e.id === id);
}
