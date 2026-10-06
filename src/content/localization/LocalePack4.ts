// src/content/localization/LocalePack4.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_4: LocaleEntry[] = [
  {
    id: 'localization_4_1',
    name: 'Locale 4.1',
    flavor: 'Auto-generated locale entry number 739 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack4', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
  {
    id: 'localization_4_2',
    name: 'Locale 4.2',
    flavor: 'Auto-generated locale entry number 740 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack4', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_4' },
  },
  {
    id: 'localization_4_3',
    name: 'Locale 4.3',
    flavor: 'Auto-generated locale entry number 741 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack4', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_4' },
  },
  {
    id: 'localization_4_4',
    name: 'Locale 4.4',
    flavor: 'Auto-generated locale entry number 742 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack4', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_4' },
  },
  {
    id: 'localization_4_5',
    name: 'Locale 4.5',
    flavor: 'Auto-generated locale entry number 743 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack4', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_4' },
  },
  {
    id: 'localization_4_6',
    name: 'Locale 4.6',
    flavor: 'Auto-generated locale entry number 744 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack4', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_4' },
  },
];

export function getLocaleEntry4(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_4.find(e => e.id === id);
}
