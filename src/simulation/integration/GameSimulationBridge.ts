import { ComponentDefinition } from '../ecs/ComponentStore';
import { EntityId, JsonObject } from '../core/types';
import { SimulationKernel } from '../kernel/SimulationKernel';
import {
  createDamageAppliedDraft,
  createDamageAppliedPayload,
  createHealthChangedDraft,
  createHealthChangedPayload,
  createItemPickedUpDraft,
  createItemPickedUpPayload,
  createManaChangedDraft,
  createManaChangedPayload,
  createPositionChangedDraft,
  createPositionChangedPayload,
  createRoomEnteredDraft,
  createRoomEnteredPayload,
  createSimulationStartedDraft,
  createSimulationStartedPayload,
  createSimulationStoppedDraft,
  createSimulationStoppedPayload,
  createWaveCompletedDraft,
  createWaveCompletedPayload,
  createWaveStartedDraft,
  createWaveStartedPayload,
} from '../events/catalog';

interface TransformState extends JsonObject {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
}

interface VitalState extends JsonObject {
  health: number;
  maximumHealth: number;
  mana: number;
  maximumMana: number;
}

interface RunState extends JsonObject {
  sessionId: string;
  classId: string;
  section: string;
  wave: number;
  enemiesRemaining: number;
  itemsCollected: number;
  damageTaken: number;
}

export interface PlayerSimulationState {
  readonly x: number;
  readonly y: number;
  readonly health: number;
  readonly maximumHealth: number;
  readonly mana: number;
  readonly maximumMana: number;
}

export interface GameSimulationBridgeOptions {
  readonly seed?: number | string;
  readonly fixedStepMilliseconds?: number;
  readonly classId: string;
  readonly section: string;
  readonly difficulty?: string;
}

const transformDefinition: ComponentDefinition<TransformState> = {
  key: 'game.transform',
  createDefault: () => ({ x: 0, y: 0, previousX: 0, previousY: 0 }),
  validate: value => (
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.previousX) &&
    Number.isFinite(value.previousY)
  ),
};

const vitalDefinition: ComponentDefinition<VitalState> = {
  key: 'game.vitals',
  createDefault: () => ({ health: 1, maximumHealth: 1, mana: 0, maximumMana: 0 }),
  validate: value => (
    Number.isFinite(value.health) &&
    Number.isFinite(value.maximumHealth) &&
    Number.isFinite(value.mana) &&
    Number.isFinite(value.maximumMana) &&
    value.health >= 0 &&
    value.maximumHealth > 0 &&
    value.health <= value.maximumHealth &&
    value.mana >= 0 &&
    value.maximumMana >= 0 &&
    value.mana <= value.maximumMana
  ),
};

export class GameSimulationBridge {
  public readonly kernel: SimulationKernel;
  public readonly playerEntity: EntityId;

  private readonly sessionId: string;
  private readonly transformStore;
  private readonly vitalStore;
  private paused = false;
  private stopped = false;

  public constructor(private readonly options: GameSimulationBridgeOptions) {
    this.kernel = new SimulationKernel({
      randomSeed: options.seed ?? Date.now(),
      fixedStepMilliseconds: options.fixedStepMilliseconds ?? 1000 / 60,
    });
    this.transformStore = this.kernel.world.register(transformDefinition);
    this.vitalStore = this.kernel.world.register(vitalDefinition);
    this.playerEntity = this.kernel.world.create(['player', 'living', options.classId]);
    this.transformStore.set(this.playerEntity, transformDefinition.createDefault());
    this.vitalStore.set(this.playerEntity, vitalDefinition.createDefault());
    this.sessionId = this.kernel.random.uuid();
    this.kernel.world.setResource<RunState>('game.run', {
      sessionId: this.sessionId,
      classId: options.classId,
      section: options.section,
      wave: 0,
      enemiesRemaining: 0,
      itemsCollected: 0,
      damageTaken: 0,
    });
    this.kernel.publish(createSimulationStartedDraft(createSimulationStartedPayload({
      sessionId: this.sessionId,
      seed: typeof options.seed === 'number' ? options.seed : 0,
      difficulty: options.difficulty ?? 'normal',
    }), { source: 'game-scene' }));
  }

  public advance(deltaMilliseconds: number): void {
    if (!this.stopped && !this.paused) {
      this.kernel.frame(deltaMilliseconds);
    }
  }

  public synchronizePlayer(state: PlayerSimulationState): void {
    if (this.stopped) return;
    const transform = this.transformStore.require(this.playerEntity);
    if (transform.x !== state.x || transform.y !== state.y) {
      this.kernel.publish(createPositionChangedDraft(createPositionChangedPayload({
        entityId: this.playerEntity,
        previousX: transform.x,
        previousY: transform.y,
        x: state.x,
        y: state.y,
      }), { source: 'phaser-bridge', transient: true }));
      this.transformStore.set(this.playerEntity, {
        previousX: transform.x,
        previousY: transform.y,
        x: state.x,
        y: state.y,
      });
    }
    const vitals = this.vitalStore.require(this.playerEntity);
    if (vitals.health !== state.health || vitals.maximumHealth !== state.maximumHealth) {
      this.kernel.publish(createHealthChangedDraft(createHealthChangedPayload({
        entityId: this.playerEntity,
        previous: vitals.health,
        current: state.health,
        maximum: state.maximumHealth,
      }), { source: 'phaser-bridge' }));
    }
    if (vitals.mana !== state.mana || vitals.maximumMana !== state.maximumMana) {
      this.kernel.publish(createManaChangedDraft(createManaChangedPayload({
        entityId: this.playerEntity,
        previous: vitals.mana,
        current: state.mana,
        maximum: state.maximumMana,
      }), { source: 'phaser-bridge' }));
    }
    this.vitalStore.set(this.playerEntity, {
      health: state.health,
      maximumHealth: state.maximumHealth,
      mana: state.mana,
      maximumMana: state.maximumMana,
    });
  }

  public recordDamage(amount: number, sourceId = 0): void {
    const run = this.runState();
    run.damageTaken += Math.max(0, amount);
    this.kernel.world.setResource('game.run', run);
    this.kernel.publish(createDamageAppliedDraft(createDamageAppliedPayload({
      sourceId,
      targetId: this.playerEntity,
      amount,
      damageType: 'enemy',
      critical: false,
    }), { source: 'game-scene' }));
  }

  public recordItem(itemType: string, quantity = 1): void {
    const run = this.runState();
    run.itemsCollected += quantity;
    this.kernel.world.setResource('game.run', run);
    this.kernel.publish(createItemPickedUpDraft(createItemPickedUpPayload({
      entityId: this.playerEntity,
      itemId: run.itemsCollected,
      itemType,
      quantity,
    }), { source: 'game-scene' }));
  }

  public recordWaveStarted(roomId: string, wave: number, enemyCount: number): void {
    const run = this.runState();
    run.section = roomId;
    run.wave = wave;
    run.enemiesRemaining = enemyCount;
    this.kernel.world.setResource('game.run', run);
    this.kernel.publish(createWaveStartedDraft(createWaveStartedPayload({
      roomId,
      wave,
      enemyCount,
    }), { source: 'game-scene' }));
  }

  public recordWaveCompleted(roomId: string, wave: number): void {
    const run = this.runState();
    run.enemiesRemaining = 0;
    this.kernel.world.setResource('game.run', run);
    this.kernel.publish(createWaveCompletedDraft(createWaveCompletedPayload({
      roomId,
      wave,
      duration: this.kernel.clock.elapsed,
    }), { source: 'game-scene' }));
  }

  public recordRoomEntered(roomId: string, previousRoomId: string): void {
    const run = this.runState();
    run.section = roomId;
    this.kernel.world.setResource('game.run', run);
    this.kernel.publish(createRoomEnteredDraft(createRoomEnteredPayload({
      entityId: this.playerEntity,
      roomId,
      fromRoomId: previousRoomId,
    }), { source: 'game-scene' }));
  }

  public setPaused(paused: boolean): void {
    if (this.stopped || paused === this.paused) return;
    this.paused = paused;
    if (paused) this.kernel.clock.pause();
    else this.kernel.clock.resume();
  }

  public checkpoint(label: string): void {
    this.kernel.capture(label);
  }

  public stop(reason: string): void {
    if (this.stopped) return;
    this.kernel.publish(createSimulationStoppedDraft(createSimulationStoppedPayload({
      sessionId: this.sessionId,
      reason,
      finalTick: this.kernel.tick,
    }), { source: 'game-scene' }));
    this.stopped = true;
  }

  public dispose(): void {
    if (!this.stopped) this.stop('scene-disposed');
    this.kernel.dispose();
  }

  private runState(): RunState {
    return { ...this.kernel.world.requireResource<RunState>('game.run') };
  }
}
