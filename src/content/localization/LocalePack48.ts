// src/content/localization/LocalePack48.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_48: LocaleEntry[] = [
  {
    id: 'localization_48_1',
    name: 'Locale 48.1',
    flavor: 'Auto-generated locale entry number 1003 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack48', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_48' },
  },
  {
    id: 'localization_48_2',
    name: 'Locale 48.2',
    flavor: 'Auto-generated locale entry number 1004 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack48', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_48' },
  },
  {
    id: 'localization_48_3',
    name: 'Locale 48.3',
    flavor: 'Auto-generated locale entry number 1005 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack48', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_48' },
  },
  {
    id: 'localization_48_4',
    name: 'Locale 48.4',
    flavor: 'Auto-generated locale entry number 1006 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack48', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_48' },
  },
  {
    id: 'localization_48_5',
    name: 'Locale 48.5',
    flavor: 'Auto-generated locale entry number 1007 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack48', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_48' },
  },
  {
    id: 'localization_48_6',
    name: 'Locale 48.6',
    flavor: 'Auto-generated locale entry number 1008 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack48', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_48' },
  },
];

export function getLocaleEntry48(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_48.find(e => e.id === id);
}
