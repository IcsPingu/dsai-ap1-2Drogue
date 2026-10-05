import {
  CommandId,
  JsonObject,
  JsonValue,
  Result,
  asCommandId,
  cloneJson,
  err,
  ok,
} from '../core/types';

export interface Command<Payload extends JsonValue = JsonValue> {
  readonly id: CommandId;
  readonly type: string;
  readonly payload: Payload;
  readonly issuedBy: string;
  readonly correlationId: string;
}

export interface CommandDraft<Payload extends JsonValue = JsonValue> {
  readonly type: string;
  readonly payload: Payload;
  readonly issuedBy?: string;
  readonly correlationId?: string;
}

export interface CommandExecutionContext {
  readonly depth: number;
  readonly replaying: boolean;
  readonly now: number;
}

export interface CommandOutcome<Value extends JsonValue = JsonValue> extends JsonObject {
  commandId: number;
  commandType: string;
  accepted: boolean;
  value: Value | null;
  error: string | null;
  durationMilliseconds: number;
}

export type CommandHandler<Payload extends JsonValue, Value extends JsonValue> = (
  command: Command<Payload>,
  context: CommandExecutionContext,
) => Value;

export type CommandValidator<Payload extends JsonValue> = (
  command: Command<Payload>,
) => Result<void, Error>;

export type CommandInterceptor = (
  command: Command,
  next: (command: Command) => CommandOutcome,
) => CommandOutcome;

interface HandlerEntry {
  readonly type: string;
  readonly handler: CommandHandler<JsonValue, JsonValue>;
  readonly validators: CommandValidator<JsonValue>[];
}

export class CommandBus {
  private readonly handlers = new Map<string, HandlerEntry>();
  private readonly interceptors: CommandInterceptor[] = [];
  private readonly history: CommandOutcome[] = [];
  private nextCommandId = 1;
  private depth = 0;
  private replaying = false;

  public register<Payload extends JsonValue, Value extends JsonValue>(
    type: string,
    handler: CommandHandler<Payload, Value>,
    validators: readonly CommandValidator<Payload>[] = [],
  ): () => void {
    if (!type.trim()) {
      throw new TypeError('command type cannot be blank');
    }
    if (this.handlers.has(type)) {
      throw new Error('command handler already registered: ' + type);
    }
    this.handlers.set(type, {
      type,
      handler: handler as unknown as CommandHandler<JsonValue, JsonValue>,
      validators: [...validators] as CommandValidator<JsonValue>[],
    });
    return () => this.handlers.delete(type);
  }

  public addValidator<Payload extends JsonValue>(
    type: string,
    validator: CommandValidator<Payload>,
  ): () => void {
    const entry = this.handlers.get(type);
    if (!entry) {
      throw new Error('cannot add validator to unknown command ' + type);
    }
    const normalized = validator as CommandValidator<JsonValue>;
    entry.validators.push(normalized);
    return () => {
      const index = entry.validators.indexOf(normalized);
      if (index >= 0) entry.validators.splice(index, 1);
    };
  }

  public use(interceptor: CommandInterceptor): () => void {
    this.interceptors.push(interceptor);
    return () => {
      const index = this.interceptors.indexOf(interceptor);
      if (index >= 0) this.interceptors.splice(index, 1);
    };
  }

  public create<Payload extends JsonValue>(draft: CommandDraft<Payload>): Command<Payload> {
    const id = asCommandId(this.nextCommandId++);
    return Object.freeze({
      id,
      type: draft.type,
      payload: cloneJson(draft.payload),
      issuedBy: draft.issuedBy ?? 'simulation',
      correlationId: draft.correlationId ?? 'command-' + id.toString(36),
    });
  }

  public execute<Payload extends JsonValue, Value extends JsonValue>(
    draft: CommandDraft<Payload>,
  ): CommandOutcome<Value> {
    return this.executeCommand(this.create(draft)) as CommandOutcome<Value>;
  }

  public executeCommand(command: Command): CommandOutcome {
    const dispatch = this.interceptors.reduceRight<(command: Command) => CommandOutcome>(
      (next, interceptor) => current => interceptor(current, next),
      current => this.invoke(current),
    );
    this.depth++;
    try {
      const outcome = dispatch(command);
      this.history.push(cloneJson(outcome));
      return outcome;
    } finally {
      this.depth--;
    }
  }

  public validate(command: Command): Result<void, Error> {
    const entry = this.handlers.get(command.type);
    if (!entry) {
      return err(new Error('no handler registered for command ' + command.type));
    }
    for (const validator of entry.validators) {
      const result = validator(command);
      if (!result.ok) {
        return result;
      }
    }
    return ok(undefined);
  }

  public canExecute(draft: CommandDraft): boolean {
    const command = this.create(draft);
    return this.validate(command).ok;
  }

  public setReplaying(replaying: boolean): void {
    this.replaying = replaying;
  }

  public outcomes(type?: string): readonly CommandOutcome[] {
    return this.history
      .filter(outcome => type === undefined || outcome.commandType === type)
      .map(outcome => cloneJson(outcome));
  }

  public failures(): readonly CommandOutcome[] {
    return this.history.filter(outcome => !outcome.accepted).map(outcome => cloneJson(outcome));
  }

  public clearHistory(): void {
    this.history.length = 0;
  }

  public clearHandlers(): void {
    this.handlers.clear();
    this.interceptors.length = 0;
  }

  private invoke(command: Command): CommandOutcome {
    const started = this.now();
    const validation = this.validate(command);
    if (!validation.ok) {
      return {
        commandId: command.id,
        commandType: command.type,
        accepted: false,
        value: null,
        error: validation.error.message,
        durationMilliseconds: this.now() - started,
      };
    }
    const entry = this.handlers.get(command.type)!;
    try {
      const value = entry.handler(command, {
        depth: this.depth,
        replaying: this.replaying,
        now: started,
      });
      return {
        commandId: command.id,
        commandType: command.type,
        accepted: true,
        value,
        error: null,
        durationMilliseconds: this.now() - started,
      };
    } catch (error) {
      return {
        commandId: command.id,
        commandType: command.type,
        accepted: false,
        value: null,
        error: error instanceof Error ? error.message : String(error),
        durationMilliseconds: this.now() - started,
      };
    }
  }

  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }
}
