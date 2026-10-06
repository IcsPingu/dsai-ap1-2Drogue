export type EditorPrimitive = string | number | boolean | null;

export type EditorValue =
  | EditorPrimitive
  | EditorValue[]
  | { [key: string]: EditorValue };

export type EditorPath = readonly (string | number)[];

export type ToolCategory =
  | 'layout'
  | 'entities'
  | 'content'
  | 'balance'
  | 'cleanup'
  | 'accessibility'
  | 'diagnostics'
  | 'export';

export type DiagnosticSeverity = 'info' | 'warning' | 'error';

export interface EditorDiagnostic {
  id: string;
  severity: DiagnosticSeverity;
  message: string;
  path: EditorPath;
  source: string;
  suggestion?: string;
}

export interface EditorPatch {
  op: 'set' | 'delete' | 'insert';
  path: EditorPath;
  value?: EditorValue;
  description: string;
}

export interface ToolDescriptor {
  id: string;
  label: string;
  description: string;
  category: ToolCategory;
  tags: readonly string[];
  shortcut?: string;
  safeForBatch: boolean;
  version: number;
}

export interface ToolContext {
  readonly activePath: EditorPath;
  readonly selectedPaths: readonly EditorPath[];
  readonly parameters: Readonly<Record<string, EditorPrimitive>>;
  readonly dryRun: boolean;
  readonly seed: number;
}

export interface ToolPreview {
  title: string;
  summary: string;
  patches: EditorPatch[];
  diagnostics: EditorDiagnostic[];
  estimatedCost: number;
}

export interface ToolExecutionResult extends ToolPreview {
  applied: boolean;
  revision: number;
}

export interface EditorToolOperation {
  readonly descriptor: ToolDescriptor;
  supports(document: EditorValue, context: ToolContext): boolean;
  validate(document: EditorValue, context: ToolContext): EditorDiagnostic[];
  preview(document: EditorValue, context: ToolContext): ToolPreview;
  execute(document: EditorValue, context: ToolContext): ToolExecutionResult;
}

export interface EditorCommand {
  readonly id: string;
  readonly label: string;
  readonly timestamp: number;
  execute(): void;
  undo(): void;
  merge?(next: EditorCommand): boolean;
}

export interface HistorySnapshot {
  undoDepth: number;
  redoDepth: number;
  transactionDepth: number;
  canUndo: boolean;
  canRedo: boolean;
  nextUndoLabel?: string;
  nextRedoLabel?: string;
}

export interface GridPoint {
  x: number;
  y: number;
}

export interface GridRect extends GridPoint {
  width: number;
  height: number;
}

export interface EditorSelection {
  anchor: GridPoint | null;
  focus: GridPoint | null;
  cells: GridPoint[];
  entityIds: string[];
}

export interface EditorSession<T extends EditorValue = EditorValue> {
  id: string;
  name: string;
  document: T;
  createdAt: number;
  updatedAt: number;
  revision: number;
  dirty: boolean;
}

export interface ValidationRule {
  readonly id: string;
  readonly description: string;
  readonly severity: DiagnosticSeverity;
  check(document: EditorValue): EditorDiagnostic[];
}

export interface SerializedEditorDocument {
  format: 'umbra-editor-document';
  version: 1;
  checksum: string;
  savedAt: string;
  payload: EditorValue;
}
