// src/content/localization/LocalePack3.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_3: LocaleEntry[] = [
  {
    id: 'localization_3_1',
    name: 'Locale 3.1',
    flavor: 'Auto-generated locale entry number 733 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack3', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_3' },
  },
  {
    id: 'localization_3_2',
    name: 'Locale 3.2',
    flavor: 'Auto-generated locale entry number 734 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack3', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_3' },
  },
  {
    id: 'localization_3_3',
    name: 'Locale 3.3',
    flavor: 'Auto-generated locale entry number 735 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack3', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_3' },
  },
  {
    id: 'localization_3_4',
    name: 'Locale 3.4',
    flavor: 'Auto-generated locale entry number 736 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack3', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_3' },
  },
  {
    id: 'localization_3_5',
    name: 'Locale 3.5',
    flavor: 'Auto-generated locale entry number 737 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack3', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_3' },
  },
  {
    id: 'localization_3_6',
    name: 'Locale 3.6',
    flavor: 'Auto-generated locale entry number 738 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack3', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_3' },
  },
];

export function getLocaleEntry3(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_3.find(e => e.id === id);
}
