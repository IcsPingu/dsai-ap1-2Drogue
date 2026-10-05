import { SimulationSystem, SimulationSystemContext, SystemPhase } from '../core/types';

const PHASES: readonly SystemPhase[] = [
  'bootstrap',
  'input',
  'preUpdate',
  'update',
  'postUpdate',
  'renderSync',
  'cleanup',
];

export interface SystemExecution {
  readonly systemId: string;
  readonly phase: SystemPhase;
  readonly durationMilliseconds: number;
  readonly succeeded: boolean;
  readonly error?: Error;
}

export class SystemPipeline {
  private readonly systems = new Map<string, SimulationSystem>();
  private ordered: SimulationSystem[] = [];
  private dirty = false;
  private initialized = false;

  public get size(): number {
    return this.systems.size;
  }

  public add(system: SimulationSystem): () => void {
    if (!system.id.trim()) {
      throw new TypeError('system id cannot be blank');
    }
    if (this.systems.has(system.id)) {
      throw new Error('system already exists: ' + system.id);
    }
    this.systems.set(system.id, system);
    this.dirty = true;
    if (this.initialized) {
      void system.initialize?.();
    }
    return () => this.remove(system.id);
  }

  public remove(systemId: string): boolean {
    const system = this.systems.get(systemId);
    if (!system) return false;
    system.dispose?.();
    this.systems.delete(systemId);
    this.dirty = true;
    return true;
  }

  public get(systemId: string): SimulationSystem | undefined {
    return this.systems.get(systemId);
  }

  public has(systemId: string): boolean {
    return this.systems.has(systemId);
  }

  public list(phase?: SystemPhase): readonly SimulationSystem[] {
    this.sortIfNeeded();
    return this.ordered.filter(system => phase === undefined || system.phase === phase);
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    this.sortIfNeeded();
    for (const system of this.ordered) {
      await system.initialize?.();
    }
    this.initialized = true;
  }

  public execute(context: SimulationSystemContext, phase?: SystemPhase): readonly SystemExecution[] {
    this.sortIfNeeded();
    const executions: SystemExecution[] = [];
    for (const system of this.ordered) {
      if (!system.enabled || (phase !== undefined && system.phase !== phase)) {
        continue;
      }
      const started = this.now();
      try {
        system.update(context);
        executions.push({
          systemId: system.id,
          phase: system.phase,
          durationMilliseconds: this.now() - started,
          succeeded: true,
        });
      } catch (error) {
        executions.push({
          systemId: system.id,
          phase: system.phase,
          durationMilliseconds: this.now() - started,
          succeeded: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }
    return executions;
  }

  public executeAll(context: SimulationSystemContext): readonly SystemExecution[] {
    return this.execute(context);
  }

  public clear(): void {
    for (const system of this.systems.values()) {
      system.dispose?.();
    }
    this.systems.clear();
    this.ordered = [];
    this.dirty = false;
    this.initialized = false;
  }

  private sortIfNeeded(): void {
    if (!this.dirty) return;
    this.ordered = [...this.systems.values()].sort((left, right) => {
      const phaseComparison = PHASES.indexOf(left.phase) - PHASES.indexOf(right.phase);
      return phaseComparison || right.priority - left.priority || left.id.localeCompare(right.id);
    });
    this.dirty = false;
  }

  private now(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
  }
}
