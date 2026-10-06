// src/content/localization/LocalePack23.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_23: LocaleEntry[] = [
  {
    id: 'localization_23_1',
    name: 'Locale 23.1',
    flavor: 'Auto-generated locale entry number 853 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack23', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
  {
    id: 'localization_23_2',
    name: 'Locale 23.2',
    flavor: 'Auto-generated locale entry number 854 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack23', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_23' },
  },
  {
    id: 'localization_23_3',
    name: 'Locale 23.3',
    flavor: 'Auto-generated locale entry number 855 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack23', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_23' },
  },
  {
    id: 'localization_23_4',
    name: 'Locale 23.4',
    flavor: 'Auto-generated locale entry number 856 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack23', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_23' },
  },
  {
    id: 'localization_23_5',
    name: 'Locale 23.5',
    flavor: 'Auto-generated locale entry number 857 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack23', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_23' },
  },
  {
    id: 'localization_23_6',
    name: 'Locale 23.6',
    flavor: 'Auto-generated locale entry number 858 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack23', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_23' },
  },
];

export function getLocaleEntry23(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_23.find(e => e.id === id);
}
