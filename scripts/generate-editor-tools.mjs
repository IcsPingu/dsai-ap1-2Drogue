import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outputDirectory = new URL('../src/tools/generated/', import.meta.url);
const categories = [
  'layout',
  'entities',
  'content',
  'balance',
  'cleanup',
  'accessibility',
  'diagnostics',
  'export',
];
const verbs = [
  'normalize', 'align', 'distribute', 'repair', 'optimize',
  'annotate', 'audit', 'balance', 'convert', 'duplicate',
  'expand', 'filter', 'group', 'index', 'merge',
  'prioritize', 'rebuild', 'refine', 'remap', 'sanitize',
  'simplify', 'sort', 'tag', 'validate', 'visualize',
];
const targets = [
  'spawn_points', 'encounter_zones', 'navigation_cells', 'reward_tables',
  'enemy_groups', 'item_placements', 'decorations', 'difficulty_bands',
];

function pascal(source) {
  return source.split('_').map(part => part[0].toUpperCase() + part.slice(1)).join('');
}

function label(source) {
  return source.split('_').map(part => part[0].toUpperCase() + part.slice(1)).join(' ');
}

function makeTool(index, category, verb, target) {
  const suffix = String(index + 1).padStart(3, '0');
  const id = `${category}.${verb}_${target}_${suffix}`;
  const className = `${pascal(category)}${pascal(verb)}${pascal(target)}${suffix}Tool`;
  const safe = ['cleanup', 'diagnostics', 'accessibility', 'export'].includes(category);
  const defaultAmount = (index % 9) + 1;
  const weight = ((index % 17) + 3) / 10;
  return `export class ${className} implements EditorToolOperation {
  public readonly descriptor: ToolDescriptor = {
    id: '${id}',
    label: '${label(verb)} ${label(target)} ${suffix}',
    description: 'Ferramenta ${suffix} para ${verb} ${target} com prévia, diagnóstico e alteração reversível.',
    category: '${category}',
    tags: ['${category}', '${verb}', '${target}', 'generated', 'tool-${suffix}'],
    safeForBatch: ${safe},
    version: 1,
  };

  public supports(document: EditorValue, context: ToolContext): boolean {
    if (document === null || typeof document !== 'object' || Array.isArray(document)) return false;
    if (context.activePath.some(segment => typeof segment !== 'string' && typeof segment !== 'number')) return false;
    return Number.isFinite(context.seed) && context.selectedPaths.length <= 10000;
  }

  public validate(document: EditorValue, context: ToolContext): EditorDiagnostic[] {
    const diagnostics: EditorDiagnostic[] = [];
    if (!this.supports(document, context)) {
      diagnostics.push(makeGeneratedDiagnostic(this.descriptor.id, 'error', 'Documento incompatível com esta ferramenta.', context.activePath));
      return diagnostics;
    }
    const amount = readNumericParameter(context, 'amount', ${defaultAmount});
    if (!Number.isFinite(amount)) {
      diagnostics.push(makeGeneratedDiagnostic(this.descriptor.id, 'error', 'O parâmetro amount precisa ser numérico.', context.activePath));
    }
    if (Math.abs(amount) > 10000) {
      diagnostics.push(makeGeneratedDiagnostic(this.descriptor.id, 'warning', 'Valor muito alto; revise a prévia antes de aplicar.', context.activePath));
    }
    if (context.selectedPaths.length === 0) {
      diagnostics.push(makeGeneratedDiagnostic(this.descriptor.id, 'info', 'Nenhuma seleção: a operação usará o documento inteiro.', []));
    }
    return diagnostics;
  }

  public preview(document: EditorValue, context: ToolContext): ToolPreview {
    const diagnostics = this.validate(document, context);
    const amount = readNumericParameter(context, 'amount', ${defaultAmount});
    const seedOffset = Math.abs(Math.trunc(context.seed)) % 997;
    const selectionFactor = Math.max(1, context.selectedPaths.length);
    const score = Math.round((amount * ${weight.toFixed(1)} + seedOffset) * selectionFactor * 100) / 100;
    const path: EditorPath = ['editorMetadata', 'operations', '${id.replaceAll('.', '_')}'];
    const patches: EditorPatch[] = diagnostics.some(item => item.severity === 'error') ? [] : [{
      op: 'set',
      path,
      value: {
        toolId: this.descriptor.id,
        category: '${category}',
        target: '${target}',
        action: '${verb}',
        score,
        selectionCount: context.selectedPaths.length,
        seed: context.seed,
      },
      description: 'Registrar resultado calculado de ${label(verb)} ${label(target)}',
    }];
    return {
      title: this.descriptor.label,
      summary: \`${label(verb)} ${label(target)}: \${patches.length} alteração, escore \${score}.\`,
      patches,
      diagnostics,
      estimatedCost: Math.max(1, selectionFactor * ${defaultAmount}),
    };
  }

  public execute(document: EditorValue, context: ToolContext): ToolExecutionResult {
    const preview = this.preview(document, context);
    const blocked = preview.diagnostics.some(item => item.severity === 'error');
    return {
      ...preview,
      applied: !context.dryRun && !blocked && preview.patches.length > 0,
      revision: 0,
    };
  }
}`;
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const allTools = [];
for (let index = 0; index < 200; index += 1) {
  const category = categories[index % categories.length];
  const verb = verbs[index % verbs.length];
  const target = targets[Math.floor(index / verbs.length) % targets.length];
  allTools.push({ index, category, verb, target });
}

const chunkSize = 10;
const moduleNames = [];
for (let offset = 0; offset < allTools.length; offset += chunkSize) {
  const chunk = allTools.slice(offset, offset + chunkSize);
  const moduleName = `toolset_${String(offset / chunkSize + 1).padStart(2, '0')}`;
  moduleNames.push(moduleName);
  const imports = `import {
  EditorDiagnostic,
  EditorPatch,
  EditorPath,
  EditorToolOperation,
  EditorValue,
  ToolContext,
  ToolDescriptor,
  ToolExecutionResult,
  ToolPreview,
} from '../types';
import { makeGeneratedDiagnostic, readNumericParameter } from './runtime';
`;
  const source = `${imports}\n${chunk.map(item => makeTool(item.index, item.category, item.verb, item.target)).join('\n\n')}\n`;
  await writeFile(new URL(`${moduleName}.ts`, outputDirectory), source, 'utf8');
}

const runtime = `import { EditorDiagnostic, EditorPath, ToolContext } from '../types';

export function makeGeneratedDiagnostic(
  source: string,
  severity: EditorDiagnostic['severity'],
  message: string,
  path: EditorPath,
): EditorDiagnostic {
  return {
    id: \`\${source}:\${severity}:\${path.join('.')}\`,
    severity,
    message,
    path,
    source,
  };
}

export function readNumericParameter(context: ToolContext, name: string, fallback: number): number {
  const value = context.parameters[name];
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return fallback;
}
`;
await writeFile(new URL('runtime.ts', outputDirectory), runtime, 'utf8');

const exports = moduleNames.map(name => `export * from './${name}';`).join('\n');
const imports = moduleNames.map((name, index) => `import * as set${index + 1} from './${name}';`).join('\n');
const spreads = moduleNames.map((_, index) => `  ...Object.values(set${index + 1}),`).join('\n');
const indexSource = `import { EditorToolOperation } from '../types';
${imports}

${exports}
export * from './runtime';

const generatedConstructors = [
${spreads}
].filter((value): value is new () => EditorToolOperation => typeof value === 'function');

export const GENERATED_EDITOR_TOOLS: readonly EditorToolOperation[] = generatedConstructors.map(
  ToolConstructor => new ToolConstructor(),
);

export const GENERATED_EDITOR_TOOL_COUNT = GENERATED_EDITOR_TOOLS.length;
`;
await writeFile(new URL('index.ts', outputDirectory), indexSource, 'utf8');

console.log(`Generated ${allTools.length} editor tools in ${moduleNames.length} modules at ${join('src', 'tools', 'generated')}`);
