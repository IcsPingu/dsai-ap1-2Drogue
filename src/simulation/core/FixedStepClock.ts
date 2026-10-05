import {
  ClockFrame,
  ClockSnapshot,
  ClockStep,
  SimulationMilliseconds,
  Tick,
  asMilliseconds,
  asTick,
  clamp,
} from './types';

export interface FixedStepClockOptions {
  readonly stepMilliseconds?: number;
  readonly maximumSubSteps?: number;
  readonly maximumFrameMilliseconds?: number;
  readonly speed?: number;
}

export type ClockListener = (step: ClockStep) => void;

export class FixedStepClock {
  private currentTick: Tick = asTick(0);
  private elapsedValue: SimulationMilliseconds = asMilliseconds(0);
  private realElapsedValue: SimulationMilliseconds = asMilliseconds(0);
  private accumulatorValue = 0;
  private speedValue: number;
  private pausedValue = false;
  private readonly beforeStepListeners = new Set<ClockListener>();
  private readonly afterStepListeners = new Set<ClockListener>();

  public readonly stepMilliseconds: number;
  public readonly maximumSubSteps: number;
  public readonly maximumFrameMilliseconds: number;

  public constructor(options: FixedStepClockOptions = {}) {
    this.stepMilliseconds = options.stepMilliseconds ?? 1000 / 60;
    this.maximumSubSteps = options.maximumSubSteps ?? 8;
    this.maximumFrameMilliseconds = options.maximumFrameMilliseconds ?? 250;
    this.speedValue = options.speed ?? 1;
    if (!Number.isFinite(this.stepMilliseconds) || this.stepMilliseconds <= 0) {
      throw new RangeError('stepMilliseconds must be finite and positive');
    }
    if (!Number.isSafeInteger(this.maximumSubSteps) || this.maximumSubSteps <= 0) {
      throw new RangeError('maximumSubSteps must be a positive integer');
    }
    if (!Number.isFinite(this.maximumFrameMilliseconds) || this.maximumFrameMilliseconds <= 0) {
      throw new RangeError('maximumFrameMilliseconds must be finite and positive');
    }
    this.setSpeed(this.speedValue);
  }

  public get tick(): Tick {
    return this.currentTick;
  }

  public get elapsed(): SimulationMilliseconds {
    return this.elapsedValue;
  }

  public get realElapsed(): SimulationMilliseconds {
    return this.realElapsedValue;
  }

  public get accumulator(): number {
    return this.accumulatorValue;
  }

  public get alpha(): number {
    return clamp(this.accumulatorValue / this.stepMilliseconds, 0, 1);
  }

  public get speed(): number {
    return this.speedValue;
  }

  public get paused(): boolean {
    return this.pausedValue;
  }

  public setSpeed(speed: number): void {
    if (!Number.isFinite(speed) || speed < 0 || speed > 32) {
      throw new RangeError('clock speed must be between zero and 32');
    }
    this.speedValue = speed;
  }

  public pause(): void {
    this.pausedValue = true;
  }

  public resume(): void {
    this.pausedValue = false;
  }

  public togglePause(): boolean {
    this.pausedValue = !this.pausedValue;
    return this.pausedValue;
  }

  public reset(): void {
    this.currentTick = asTick(0);
    this.elapsedValue = asMilliseconds(0);
    this.realElapsedValue = asMilliseconds(0);
    this.accumulatorValue = 0;
    this.pausedValue = false;
  }

  public advance(realDeltaMilliseconds: number): ClockFrame {
    if (!Number.isFinite(realDeltaMilliseconds) || realDeltaMilliseconds < 0) {
      throw new RangeError('frame delta must be finite and non-negative');
    }
    const clampedRealDelta = Math.min(realDeltaMilliseconds, this.maximumFrameMilliseconds);
    this.realElapsedValue = asMilliseconds(this.realElapsedValue + clampedRealDelta);
    if (this.pausedValue || this.speedValue === 0) {
      return {
        steps: [],
        alpha: this.alpha,
        droppedMilliseconds: Math.max(0, realDeltaMilliseconds - clampedRealDelta),
      };
    }
    this.accumulatorValue += clampedRealDelta * this.speedValue;
    const steps: ClockStep[] = [];
    let executed = 0;
    while (this.accumulatorValue + Number.EPSILON >= this.stepMilliseconds && executed < this.maximumSubSteps) {
      const step = this.executeStep();
      steps.push(step);
      this.accumulatorValue -= this.stepMilliseconds;
      if (this.accumulatorValue < Number.EPSILON) {
        this.accumulatorValue = 0;
      }
      executed++;
    }
    let droppedMilliseconds = Math.max(0, realDeltaMilliseconds - clampedRealDelta);
    if (executed === this.maximumSubSteps && this.accumulatorValue >= this.stepMilliseconds) {
      const retained = this.accumulatorValue % this.stepMilliseconds;
      droppedMilliseconds += this.accumulatorValue - retained;
      this.accumulatorValue = retained;
    }
    return {
      steps,
      alpha: this.alpha,
      droppedMilliseconds,
    };
  }

  public step(count = 1): readonly ClockStep[] {
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new RangeError('manual step count must be a non-negative integer');
    }
    const steps: ClockStep[] = [];
    for (let index = 0; index < count; index++) {
      steps.push(this.executeStep());
    }
    return steps;
  }

  public onBeforeStep(listener: ClockListener): () => void {
    this.beforeStepListeners.add(listener);
    return () => this.beforeStepListeners.delete(listener);
  }

  public onAfterStep(listener: ClockListener): () => void {
    this.afterStepListeners.add(listener);
    return () => this.afterStepListeners.delete(listener);
  }

  public capture(): ClockSnapshot {
    return {
      tick: this.currentTick,
      elapsed: this.elapsedValue,
      realElapsed: this.realElapsedValue,
      accumulator: this.accumulatorValue,
      speed: this.speedValue,
      paused: this.pausedValue,
    };
  }

  public restore(snapshot: ClockSnapshot): void {
    this.currentTick = asTick(snapshot.tick);
    this.elapsedValue = asMilliseconds(snapshot.elapsed);
    this.realElapsedValue = asMilliseconds(snapshot.realElapsed);
    this.accumulatorValue = snapshot.accumulator;
    this.setSpeed(snapshot.speed);
    this.pausedValue = snapshot.paused;
  }

  private executeStep(): ClockStep {
    this.currentTick = asTick(this.currentTick + 1);
    this.elapsedValue = asMilliseconds(this.elapsedValue + this.stepMilliseconds);
    const step: ClockStep = {
      tick: this.currentTick,
      delta: asMilliseconds(this.stepMilliseconds),
      elapsed: this.elapsedValue,
      realElapsed: this.realElapsedValue,
    };
    for (const listener of [...this.beforeStepListeners]) {
      listener(step);
    }
    for (const listener of [...this.afterStepListeners]) {
      listener(step);
    }
    return step;
  }
}
