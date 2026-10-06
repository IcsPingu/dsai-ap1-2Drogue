import { EditorDocument } from './core/EditorDocument';
import { ToolRegistry } from './core/ToolRegistry';
import { EditorDiagnostic, EditorPrimitive, EditorToolOperation, EditorValue, ToolContext, ToolExecutionResult } from './types';
import { GENERATED_EDITOR_TOOLS } from './generated';

export interface WorkspaceRunOptions {
  activePath?: readonly (string | number)[];
  selectedPaths?: readonly (readonly (string | number)[])[];
  parameters?: Readonly<Record<string, EditorPrimitive>>;
  dryRun?: boolean;
  seed?: number;
}

export class EditorWorkspace {
  public readonly registry = new ToolRegistry();
  private readonly documents = new Map<string, EditorDocument>();
  private activeDocumentId: string | null = null;

  public constructor(extraTools: readonly EditorToolOperation[] = []) {
    this.registry.registerMany(GENERATED_EDITOR_TOOLS).registerMany(extraTools);
  }

  public open(name: string, value: EditorValue): EditorDocument {
    const document = new EditorDocument(name, value);
    this.documents.set(document.snapshot().id, document);
    this.activeDocumentId = document.snapshot().id;
    return document;
  }

  public close(id: string, force = false): boolean {
    const document = this.documents.get(id);
    if (!document) return false;
    if (document.dirty && !force) return false;
    this.documents.delete(id);
    if (this.activeDocumentId === id) this.activeDocumentId = this.documents.keys().next().value ?? null;
    return true;
  }

  public activate(id: string): boolean {
    if (!this.documents.has(id)) return false;
    this.activeDocumentId = id;
    return true;
  }

  public get activeDocument(): EditorDocument | undefined {
    return this.activeDocumentId ? this.documents.get(this.activeDocumentId) : undefined;
  }

  public listDocuments(): readonly EditorDocument[] {
    return [...this.documents.values()];
  }

  public execute(toolId: string, options: WorkspaceRunOptions = {}): ToolExecutionResult {
    const document = this.activeDocument;
    if (!document) throw new Error('No active editor document');
    return this.registry.execute(toolId, document, this.context(options));
  }

  public preview(toolId: string, options: WorkspaceRunOptions = {}): ToolExecutionResult {
    return this.execute(toolId, { ...options, dryRun: true });
  }

  public validate(toolId: string, options: WorkspaceRunOptions = {}): EditorDiagnostic[] {
    const document = this.activeDocument;
    const tool = this.registry.get(toolId);
    if (!document || !tool) return [];
    return tool.validate(document.value, this.context(options));
  }

  private context(options: WorkspaceRunOptions): ToolContext {
    return {
      activePath: options.activePath ?? [],
      selectedPaths: options.selectedPaths ?? [],
      parameters: options.parameters ?? {},
      dryRun: options.dryRun ?? false,
      seed: options.seed ?? 1,
    };
  }
}
