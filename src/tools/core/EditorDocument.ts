import { CommandHistory } from './CommandHistory';
import { EditorCommand, EditorPatch, EditorPath, EditorSession, EditorValue } from '../types';
import { cloneValue, deleteAtPath, getAtPath, insertAtPath, setAtPath } from './valueUtils';

type DocumentListener<T extends EditorValue> = (session: Readonly<EditorSession<T>>) => void;

export class EditorDocument<T extends EditorValue = EditorValue> {
  private session: EditorSession<T>;
  private readonly listeners = new Set<DocumentListener<T>>();
  public readonly history: CommandHistory;

  public constructor(name: string, initial: T, capacity = 200) {
    const now = Date.now();
    this.session = {
      id: `document:${now}:${Math.random().toString(36).slice(2, 9)}`,
      name,
      document: cloneValue(initial),
      createdAt: now,
      updatedAt: now,
      revision: 0,
      dirty: false,
    };
    this.history = new CommandHistory(capacity);
  }

  public get value(): T {
    return cloneValue(this.session.document);
  }

  public get revision(): number {
    return this.session.revision;
  }

  public get dirty(): boolean {
    return this.session.dirty;
  }

  public get(path: EditorPath): EditorValue | undefined {
    const value = getAtPath(this.session.document, path);
    return value === undefined ? undefined : cloneValue(value);
  }

  public set(path: EditorPath, value: EditorValue, label = 'Alterar valor'): void {
    const before = this.value;
    const after = setAtPath(before, path, value) as T;
    this.history.execute(this.replacementCommand(label, before, after));
  }

  public delete(path: EditorPath, label = 'Remover valor'): void {
    const before = this.value;
    const after = deleteAtPath(before, path) as T;
    this.history.execute(this.replacementCommand(label, before, after));
  }

  public insert(path: EditorPath, value: EditorValue, label = 'Inserir valor'): void {
    const before = this.value;
    const after = insertAtPath(before, path, value) as T;
    this.history.execute(this.replacementCommand(label, before, after));
  }

  public apply(patches: readonly EditorPatch[], label = 'Aplicar ferramenta'): void {
    let after: EditorValue = this.value;
    for (const patch of patches) {
      if (patch.op === 'set' && patch.value !== undefined) after = setAtPath(after, patch.path, patch.value);
      if (patch.op === 'delete') after = deleteAtPath(after, patch.path);
      if (patch.op === 'insert' && patch.value !== undefined) after = insertAtPath(after, patch.path, patch.value);
    }
    this.history.execute(this.replacementCommand(label, this.value, after as T));
  }

  public replace(value: T, label = 'Substituir documento'): void {
    this.history.execute(this.replacementCommand(label, this.value, cloneValue(value)));
  }

  public undo(): boolean {
    return this.history.undo();
  }

  public redo(): boolean {
    return this.history.redo();
  }

  public markSaved(): void {
    this.session.dirty = false;
    this.emit();
  }

  public subscribe(listener: DocumentListener<T>): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  public snapshot(): Readonly<EditorSession<T>> {
    return { ...this.session, document: this.value };
  }

  private replacementCommand(label: string, before: T, after: T): EditorCommand {
    const id = `edit:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`;
    return {
      id,
      label,
      timestamp: Date.now(),
      execute: () => this.update(after),
      undo: () => this.update(before),
    };
  }

  private update(value: T): void {
    this.session = {
      ...this.session,
      document: cloneValue(value),
      revision: this.session.revision + 1,
      updatedAt: Date.now(),
      dirty: true,
    };
    this.emit();
  }

  private emit(): void {
    const snapshot = this.snapshot();
    this.listeners.forEach(listener => listener(snapshot));
  }
}
