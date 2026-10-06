// src/content/localization/LocalePack20.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_20: LocaleEntry[] = [
  {
    id: 'localization_20_1',
    name: 'Locale 20.1',
    flavor: 'Auto-generated locale entry number 835 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack20', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
  {
    id: 'localization_20_2',
    name: 'Locale 20.2',
    flavor: 'Auto-generated locale entry number 836 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack20', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_20' },
  },
  {
    id: 'localization_20_3',
    name: 'Locale 20.3',
    flavor: 'Auto-generated locale entry number 837 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack20', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_20' },
  },
  {
    id: 'localization_20_4',
    name: 'Locale 20.4',
    flavor: 'Auto-generated locale entry number 838 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack20', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_20' },
  },
  {
    id: 'localization_20_5',
    name: 'Locale 20.5',
    flavor: 'Auto-generated locale entry number 839 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack20', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_20' },
  },
  {
    id: 'localization_20_6',
    name: 'Locale 20.6',
    flavor: 'Auto-generated locale entry number 840 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack20', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_20' },
  },
];

export function getLocaleEntry20(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_20.find(e => e.id === id);
}
