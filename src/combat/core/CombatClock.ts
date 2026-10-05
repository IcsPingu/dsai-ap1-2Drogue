export interface CombatClockSnapshot {
  time: number;
  scale: number;
  paused: boolean;
  frame: number;
  accumulated: number;
  fixedStep: number;
}

export class CombatClock {
  private timeValue = 0;
  private scaleValue = 1;
  private pausedValue = false;
  private frameValue = 0;
  private accumulated = 0;

  public constructor(private readonly fixedStep = 1000 / 60, private readonly maximumFrame = 250) {
    if (!Number.isFinite(fixedStep) || fixedStep <= 0) throw new RangeError('fixed step must be positive');
    if (!Number.isFinite(maximumFrame) || maximumFrame < fixedStep) throw new RangeError('maximum frame must cover a fixed step');
  }

  public advance(realDelta: number, callback: (step: number, time: number, frame: number) => void): number {
    if (!Number.isFinite(realDelta) || realDelta < 0) throw new RangeError('delta must be finite and non-negative');
    if (this.pausedValue || this.scaleValue === 0) return 0;
    this.accumulated += Math.min(this.maximumFrame, realDelta) * this.scaleValue;
    let steps = 0;
    while (this.accumulated >= this.fixedStep) {
      this.accumulated -= this.fixedStep;
      this.timeValue += this.fixedStep;
      this.frameValue++;
      steps++;
      callback(this.fixedStep, this.timeValue, this.frameValue);
    }
    return steps;
  }

  public setScale(scale: number): void {
    if (!Number.isFinite(scale) || scale < 0 || scale > 8) throw new RangeError('combat time scale must be between zero and eight');
    this.scaleValue = scale;
  }

  public pause(): void { this.pausedValue = true; }
  public resume(): void { this.pausedValue = false; }
  public toggle(): boolean { this.pausedValue = !this.pausedValue; return this.pausedValue; }
  public reset(time = 0): void { this.timeValue = Math.max(0, time); this.frameValue = 0; this.accumulated = 0; }
  public time(): number { return this.timeValue; }
  public frame(): number { return this.frameValue; }
  public scale(): number { return this.scaleValue; }
  public isPaused(): boolean { return this.pausedValue; }
  public interpolation(): number { return this.accumulated / this.fixedStep; }

  public step(callback: (step: number, time: number, frame: number) => void): void {
    if (this.pausedValue) return;
    this.timeValue += this.fixedStep;
    this.frameValue++;
    callback(this.fixedStep, this.timeValue, this.frameValue);
  }

  public advanceTo(targetTime: number, callback: (step: number, time: number, frame: number) => void): number {
    if (!Number.isFinite(targetTime) || targetTime < this.timeValue) throw new RangeError('target time cannot precede combat time');
    let steps = 0;
    while (this.timeValue + this.fixedStep <= targetTime) {
      this.step(callback);
      steps++;
    }
    return steps;
  }

  public elapsedSince(timestamp: number): number {
    if (!Number.isFinite(timestamp)) throw new RangeError('timestamp must be finite');
    return Math.max(0, this.timeValue - timestamp);
  }

  public formatTime(): string {
    const totalSeconds = Math.floor(this.timeValue / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor(this.timeValue % 1000);
    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0') + '.' + milliseconds.toString().padStart(3, '0');
  }

  public capture(): CombatClockSnapshot {
    return { time: this.timeValue, scale: this.scaleValue, paused: this.pausedValue, frame: this.frameValue, accumulated: this.accumulated, fixedStep: this.fixedStep };
  }

  public restore(snapshot: CombatClockSnapshot): void {
    if (Math.abs(snapshot.fixedStep - this.fixedStep) > Number.EPSILON) throw new Error('clock snapshot fixed step mismatch');
    this.timeValue = Math.max(0, snapshot.time);
    this.scaleValue = Math.max(0, snapshot.scale);
    this.pausedValue = snapshot.paused;
    this.frameValue = Math.max(0, Math.floor(snapshot.frame));
    this.accumulated = Math.max(0, snapshot.accumulated);
  }
}
