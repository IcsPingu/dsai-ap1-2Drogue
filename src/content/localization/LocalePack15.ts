// src/content/localization/LocalePack15.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_15: LocaleEntry[] = [
  {
    id: 'localization_15_1',
    name: 'Locale 15.1',
    flavor: 'Auto-generated locale entry number 805 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack15', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_15' },
  },
  {
    id: 'localization_15_2',
    name: 'Locale 15.2',
    flavor: 'Auto-generated locale entry number 806 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack15', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_15' },
  },
  {
    id: 'localization_15_3',
    name: 'Locale 15.3',
    flavor: 'Auto-generated locale entry number 807 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack15', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_15' },
  },
  {
    id: 'localization_15_4',
    name: 'Locale 15.4',
    flavor: 'Auto-generated locale entry number 808 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack15', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_15' },
  },
  {
    id: 'localization_15_5',
    name: 'Locale 15.5',
    flavor: 'Auto-generated locale entry number 809 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack15', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_15' },
  },
  {
    id: 'localization_15_6',
    name: 'Locale 15.6',
    flavor: 'Auto-generated locale entry number 810 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack15', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_15' },
  },
];

export function getLocaleEntry15(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_15.find(e => e.id === id);
}
