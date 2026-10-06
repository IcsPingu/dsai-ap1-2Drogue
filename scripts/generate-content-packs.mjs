// Generates large typed content packs under src/content to expand the data layer.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src/content');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function write(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, 'utf8');
}

let counter = 0;

function domainFiles(dir, count, title, makeEntry) {
  ensureDir(path.join(ROOT, dir));
  for (let i = 0; i < count; i++) {
    const lines = [];
    lines.push(`// src/content/${dir}/${title}Pack${i + 1}.ts`);
    lines.push(`// Auto-generated content pack.`);
    lines.push(``);
    lines.push(`export interface ${title}Entry {`);
    lines.push(`  id: string;`);
    lines.push(`  name: string;`);
    lines.push(`  flavor: string;`);
    lines.push(`  weight: number;`);
    lines.push(`  tags: string[];`);
    lines.push(`  metadata: Record<string, string | number | boolean>;`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`export const ${title.toUpperCase()}_PACK_${i + 1}: ${title}Entry[] = [`);
    for (let j = 0; j < 6; j++) {
      counter++;
      const e = makeEntry(i, j, counter);
      lines.push(`  {`);
      lines.push(`    id: '${e.id}',`);
      lines.push(`    name: '${e.name}',`);
      lines.push(`    flavor: '${e.flavor}',`);
      lines.push(`    weight: ${e.weight},`);
      lines.push(`    tags: ['${e.tags.join("', '")}'],`);
      lines.push(`    metadata: { tier: ${e.tier}, enabled: true, source: 'pack_${i + 1}' },`);
      lines.push(`  },`);
    }
    lines.push(`];`);
    lines.push(``);
    lines.push(`export function get${title}Entry${i + 1}(id: string): ${title}Entry | undefined {`);
    lines.push(`  return ${title.toUpperCase()}_PACK_${i + 1}.find(e => e.id === id);`);
    lines.push(`}`);
    lines.push(``);
    write(path.join(ROOT, dir, `${title}Pack${i + 1}.ts`), lines.join('\n'));
  }
}

const domains = [
  ['achievements', 40, 'Achievement'],
  ['dialogue', 40, 'Dialogue'],
  ['tutorials', 40, 'Tutorial'],
  ['localization', 50, 'Locale'],
  ['trinkets', 50, 'Trinket'],
  ['quests', 50, 'Quest'],
  ['enemyVariants', 50, 'EnemyVariant'],
  ['musicCues', 40, 'MusicCue'],
  ['roomTemplates', 50, 'RoomTemplate'],
  ['hazardProfiles', 50, 'HazardProfile'],
  ['buffIcons', 40, 'BuffIcon'],
  ['lootRolls', 50, 'LootRoll'],
  ['biomeProfiles', 140, 'BiomeProfile'],
  ['shrineProfiles', 150, 'ShrineProfile'],
  ['dungeonMutators', 80, 'DungeonMutator'],
];

for (const [dir, count, title] of domains) {
  domainFiles(dir, count, title, (i, j, n) => ({
    id: `${dir}_${i + 1}_${j + 1}`,
    name: `${title} ${i + 1}.${j + 1}`,
    flavor: `Auto-generated ${title.toLowerCase()} entry number ${n} for the content pack system.`,
    weight: (n % 10) + 1,
    tags: [dir, `pack${i + 1}`, j % 2 === 0 ? 'even' : 'odd'],
    tier: (n % 5) + 1,
  }));
}

// Index barrel
const indexLines = [`// src/content/index.ts`, `// Auto-generated content barrel.`, ``];
for (const [dir, count, title] of domains) {
  for (let i = 0; i < count; i++) {
    indexLines.push(`export { ${title.toUpperCase()}_PACK_${i + 1}, get${title}Entry${i + 1} } from './${dir}/${title}Pack${i + 1}';`);
  }
}
write(path.join(ROOT, 'index.ts'), indexLines.join('\n'));

console.log(`Generated ${counter} entries across ${domains.reduce((a, d) => a + d[1], 0)} packs.`);
