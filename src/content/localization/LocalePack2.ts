// src/content/localization/LocalePack2.ts
// Auto-generated content pack.

export interface LocaleEntry {
  id: string;
  name: string;
  flavor: string;
  weight: number;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export const LOCALE_PACK_2: LocaleEntry[] = [
  {
    id: 'localization_2_1',
    name: 'Locale 2.1',
    flavor: 'Auto-generated locale entry number 727 for the content pack system.',
    weight: 8,
    tags: ['localization', 'pack2', 'even'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
  {
    id: 'localization_2_2',
    name: 'Locale 2.2',
    flavor: 'Auto-generated locale entry number 728 for the content pack system.',
    weight: 9,
    tags: ['localization', 'pack2', 'odd'],
    metadata: { tier: 4, enabled: true, source: 'pack_2' },
  },
  {
    id: 'localization_2_3',
    name: 'Locale 2.3',
    flavor: 'Auto-generated locale entry number 729 for the content pack system.',
    weight: 10,
    tags: ['localization', 'pack2', 'even'],
    metadata: { tier: 5, enabled: true, source: 'pack_2' },
  },
  {
    id: 'localization_2_4',
    name: 'Locale 2.4',
    flavor: 'Auto-generated locale entry number 730 for the content pack system.',
    weight: 1,
    tags: ['localization', 'pack2', 'odd'],
    metadata: { tier: 1, enabled: true, source: 'pack_2' },
  },
  {
    id: 'localization_2_5',
    name: 'Locale 2.5',
    flavor: 'Auto-generated locale entry number 731 for the content pack system.',
    weight: 2,
    tags: ['localization', 'pack2', 'even'],
    metadata: { tier: 2, enabled: true, source: 'pack_2' },
  },
  {
    id: 'localization_2_6',
    name: 'Locale 2.6',
    flavor: 'Auto-generated locale entry number 732 for the content pack system.',
    weight: 3,
    tags: ['localization', 'pack2', 'odd'],
    metadata: { tier: 3, enabled: true, source: 'pack_2' },
  },
];

export function getLocaleEntry2(id: string): LocaleEntry | undefined {
  return LOCALE_PACK_2.find(e => e.id === id);
}
