// src/content/localization/LocalePack6.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_6: LocaleEntry[] = [
  {
    id: 'localization_6_1',
    name: 'Locale 6.1',
    flavor: 'Auto-generated locale entry number 751 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack6', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
  {
    id: 'localization_6_2',
    name: 'Locale 6.2',
    flavor: 'Auto-generated locale entry number 752 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack6', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_6' },
  },
  {
    id: 'localization_6_3',
    name: 'Locale 6.3',
    flavor: 'Auto-generated locale entry number 753 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack6', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_6' },
  },
  {
    id: 'localization_6_4',
    name: 'Locale 6.4',
    flavor: 'Auto-generated locale entry number 754 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack6', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_6' },
  },
  {
    id: 'localization_6_5',
    name: 'Locale 6.5',
    flavor: 'Auto-generated locale entry number 755 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack6', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_6' },
  },
  {
    id: 'localization_6_6',
    name: 'Locale 6.6',
    flavor: 'Auto-generated locale entry number 756 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack6', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_6' },
  },
];

export function getLocaleEntry6(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_6.find(e => e.id === id);
}
