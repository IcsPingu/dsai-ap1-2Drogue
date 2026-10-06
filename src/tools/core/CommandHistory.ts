import { EditorCommand, HistorySnapshot } from '../types';

type HistoryListener = (snapshot: HistorySnapshot) => void;

interface Transaction {
  label: string;
  commands: EditorCommand[];
}

export class CommandHistory {
  private readonly undoStack: EditorCommand[] = [];
  private readonly redoStack: EditorCommand[] = [];
  private readonly transactions: Transaction[] = [];
  private readonly listeners = new Set<HistoryListener>();

  public constructor(private readonly capacity = 200) {
    if (!Number.isInteger(capacity) || capacity < 1) throw new Error('History capacity must be a positive integer');
  }

  public execute(command: EditorCommand): void {
    command.execute();
    const transaction = this.transactions[this.transactions.length - 1];
    if (transaction) {
      transaction.commands.push(command);
      this.emit();
      return;
    }
    this.commit(command);
  }

  public undo(): boolean {
    if (this.transactions.length > 0) throw new Error('Cannot undo while a transaction is open');
    const command = this.undoStack.pop();
    if (!command) return false;
    command.undo();
    this.redoStack.push(command);
    this.emit();
    return true;
  }

  public redo(): boolean {
    if (this.transactions.length > 0) throw new Error('Cannot redo while a transaction is open');
    const command = this.redoStack.pop();
    if (!command) return false;
    command.execute();
    this.undoStack.push(command);
    this.emit();
    return true;
  }

  public begin(label: string): void {
    this.transactions.push({ label, commands: [] });
    this.emit();
  }

  public commitTransaction(): boolean {
    const transaction = this.transactions.pop();
    if (!transaction) return false;
    if (transaction.commands.length === 0) {
      this.emit();
      return false;
    }
    const command = this.compose(transaction.label, transaction.commands);
    const parent = this.transactions[this.transactions.length - 1];
    if (parent) parent.commands.push(command);
    else this.commit(command);
    return true;
  }

  public rollbackTransaction(): boolean {
    const transaction = this.transactions.pop();
    if (!transaction) return false;
    for (let index = transaction.commands.length - 1; index >= 0; index -= 1) transaction.commands[index].undo();
    this.emit();
    return true;
  }

  public transaction<T>(label: string, action: () => T): T {
    this.begin(label);
    try {
      const result = action();
      this.commitTransaction();
      return result;
    } catch (error) {
      this.rollbackTransaction();
      throw error;
    }
  }

  public clear(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.transactions.length = 0;
    this.emit();
  }

  public snapshot(): HistorySnapshot {
    const nextUndo = this.undoStack[this.undoStack.length - 1];
    const nextRedo = this.redoStack[this.redoStack.length - 1];
    return {
      undoDepth: this.undoStack.length,
      redoDepth: this.redoStack.length,
      transactionDepth: this.transactions.length,
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0,
      nextUndoLabel: nextUndo?.label,
      nextRedoLabel: nextRedo?.label,
    };
  }

  public subscribe(listener: HistoryListener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  private commit(command: EditorCommand): void {
    const previous = this.undoStack[this.undoStack.length - 1];
    if (!previous?.merge?.(command)) this.undoStack.push(command);
    if (this.undoStack.length > this.capacity) this.undoStack.shift();
    this.redoStack.length = 0;
    this.emit();
  }

  private compose(label: string, commands: EditorCommand[]): EditorCommand {
    const copy = [...commands];
    return {
      id: `transaction:${Date.now()}:${copy.length}`,
      label,
      timestamp: Date.now(),
      execute: () => copy.forEach(command => command.execute()),
      undo: () => [...copy].reverse().forEach(command => command.undo()),
    };
  }

  private emit(): void {
    const snapshot = this.snapshot();
    this.listeners.forEach(listener => listener(snapshot));
  }
}
