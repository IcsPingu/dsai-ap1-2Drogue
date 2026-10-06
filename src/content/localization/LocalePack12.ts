// src/content/localization/LocalePack12.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_12: LocaleEntry[] = [
  {
    id: 'localization_12_1',
    name: 'Locale 12.1',
    flavor: 'Auto-generated locale entry number 787 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack12', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_12' },
  },
  {
    id: 'localization_12_2',
    name: 'Locale 12.2',
    flavor: 'Auto-generated locale entry number 788 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack12', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_12' },
  },
  {
    id: 'localization_12_3',
    name: 'Locale 12.3',
    flavor: 'Auto-generated locale entry number 789 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack12', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_12' },
  },
  {
    id: 'localization_12_4',
    name: 'Locale 12.4',
    flavor: 'Auto-generated locale entry number 790 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack12', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_12' },
  },
  {
    id: 'localization_12_5',
    name: 'Locale 12.5',
    flavor: 'Auto-generated locale entry number 791 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack12', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_12' },
  },
  {
    id: 'localization_12_6',
    name: 'Locale 12.6',
    flavor: 'Auto-generated locale entry number 792 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack12', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_12' },
  },
];

export function getLocaleEntry12(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_12.find(e => e.id === id);
}
