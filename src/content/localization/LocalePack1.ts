// src/content/localization/LocalePack1.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_1: LocaleEntry[] = [
  {
    id: 'localization_1_1',
    name: 'Locale 1.1',
    flavor: 'Auto-generated locale entry number 721 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack1', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
  {
    id: 'localization_1_2',
    name: 'Locale 1.2',
    flavor: 'Auto-generated locale entry number 722 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack1', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_1' },
  },
  {
    id: 'localization_1_3',
    name: 'Locale 1.3',
    flavor: 'Auto-generated locale entry number 723 for the content pack system.',
    weight: 4,
    tags: ['localization', 'pack1', 'even'],
    metadata: { tier: 4, enabled: true, source: 'pack_1' },
  },
  {
    id: 'localization_1_4',
    name: 'Locale 1.4',
    flavor: 'Auto-generated locale entry number 724 for the content pack system.',
    weight: 5,
    tags: ['localization', 'pack1', 'odd'],
    metadata: { tier: 5, enabled: true, source: 'pack_1' },
  },
  {
    id: 'localization_1_5',
    name: 'Locale 1.5',
    flavor: 'Auto-generated locale entry number 725 for the content pack system.',
    weight: 6,
    tags: ['localization', 'pack1', 'even'],
    metadata: { tier: 1, enabled: true, source: 'pack_1' },
  },
  {
    id: 'localization_1_6',
    name: 'Locale 1.6',
    flavor: 'Auto-generated locale entry number 726 for the content pack system.',
    weight: 7,
    tags: ['localization', 'pack1', 'odd'],
    metadata: { tier: 2, enabled: true, source: 'pack_1' },
  },
];

export function getLocaleEntry1(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_1.find(e => e.id === id);
}
