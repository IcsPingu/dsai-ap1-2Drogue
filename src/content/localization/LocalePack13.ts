// src/content/localization/LocalePack13.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_13: LocaleEntry[] = [
  {
    id: 'localization_13_1',
    name: 'Locale 13.1',
    flavor: 'Auto-generated locale entry number 793 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack13', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
  {
    id: 'localization_13_2',
    name: 'Locale 13.2',
    flavor: 'Auto-generated locale entry number 794 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack13', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_13' },
  },
  {
    id: 'localization_13_3',
    name: 'Locale 13.3',
    flavor: 'Auto-generated locale entry number 795 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack13', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_13' },
  },
  {
    id: 'localization_13_4',
    name: 'Locale 13.4',
    flavor: 'Auto-generated locale entry number 796 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack13', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_13' },
  },
  {
    id: 'localization_13_5',
    name: 'Locale 13.5',
    flavor: 'Auto-generated locale entry number 797 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack13', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_13' },
  },
  {
    id: 'localization_13_6',
    name: 'Locale 13.6',
    flavor: 'Auto-generated locale entry number 798 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack13', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_13' },
  },
];

export function getLocaleEntry13(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_13.find(e => e.id === id);
}
