import { EditorDiagnostic, EditorPath, ToolContext } from '../types';

export function makeGeneratedDiagnostic(
  source: string,
  severity: EditorDiagnostic['severity'],
  message: string,
  path: EditorPath,
): EditorDiagnostic {
  return {
    id: `${source}:${severity}:${path.join('.')}`,
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
