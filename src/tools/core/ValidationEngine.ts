import { EditorDiagnostic, EditorValue, ValidationRule } from '../types';

export class ValidationEngine {
  private readonly rules = new Map<string, ValidationRule>();

  public register(rule: ValidationRule): this {
    if (this.rules.has(rule.id)) throw new Error(`Validation rule already registered: ${rule.id}`);
    this.rules.set(rule.id, rule);
    return this;
  }

  public unregister(id: string): boolean {
    return this.rules.delete(id);
  }

  public validate(document: EditorValue): EditorDiagnostic[] {
    const diagnostics: EditorDiagnostic[] = [];
    for (const rule of this.rules.values()) {
      try {
        diagnostics.push(...rule.check(document));
      } catch (error) {
        diagnostics.push({
          id: `${rule.id}:failure`,
          severity: 'error',
          message: error instanceof Error ? error.message : 'Unknown validation failure',
          path: [],
          source: rule.id,
        });
      }
    }
    return diagnostics.sort((left, right) => this.weight(right.severity) - this.weight(left.severity) || left.id.localeCompare(right.id));
  }

  public hasErrors(document: EditorValue): boolean {
    return this.validate(document).some(diagnostic => diagnostic.severity === 'error');
  }

  public listRules(): readonly ValidationRule[] {
    return [...this.rules.values()];
  }

  private weight(severity: EditorDiagnostic['severity']): number {
    if (severity === 'error') return 3;
    if (severity === 'warning') return 2;
    return 1;
  }
}
