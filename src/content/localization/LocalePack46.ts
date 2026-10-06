// src/content/localization/LocalePack46.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_46: LocaleEntry[] = [
  {
    id: 'localization_46_1',
    name: 'Locale 46.1',
    flavor: 'Auto-generated locale entry number 991 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack46', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_46' },
  },
  {
    id: 'localization_46_2',
    name: 'Locale 46.2',
    flavor: 'Auto-generated locale entry number 992 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack46', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_46' },
  },
  {
    id: 'localization_46_3',
    name: 'Locale 46.3',
    flavor: 'Auto-generated locale entry number 993 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack46', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_46' },
  },
  {
    id: 'localization_46_4',
    name: 'Locale 46.4',
    flavor: 'Auto-generated locale entry number 994 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack46', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_46' },
  },
  {
    id: 'localization_46_5',
    name: 'Locale 46.5',
    flavor: 'Auto-generated locale entry number 995 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack46', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_46' },
  },
  {
    id: 'localization_46_6',
    name: 'Locale 46.6',
    flavor: 'Auto-generated locale entry number 996 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack46', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_46' },
  },
];

export function getLocaleEntry46(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_46.find(e => e.id === id);
}
