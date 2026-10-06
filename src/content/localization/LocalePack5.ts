// src/content/localization/LocalePack5.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_5: LocaleEntry[] = [
  {
    id: 'localization_5_1',
    name: 'Locale 5.1',
    flavor: 'Auto-generated locale entry number 745 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack5', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
  {
    id: 'localization_5_2',
    name: 'Locale 5.2',
    flavor: 'Auto-generated locale entry number 746 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack5', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_5' },
  },
  {
    id: 'localization_5_3',
    name: 'Locale 5.3',
    flavor: 'Auto-generated locale entry number 747 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack5', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_5' },
  },
  {
    id: 'localization_5_4',
    name: 'Locale 5.4',
    flavor: 'Auto-generated locale entry number 748 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack5', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_5' },
  },
  {
    id: 'localization_5_5',
    name: 'Locale 5.5',
    flavor: 'Auto-generated locale entry number 749 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack5', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_5' },
  },
  {
    id: 'localization_5_6',
    name: 'Locale 5.6',
    flavor: 'Auto-generated locale entry number 750 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack5', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_5' },
  },
];

export function getLocaleEntry5(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_5.find(e => e.id === id);
}
