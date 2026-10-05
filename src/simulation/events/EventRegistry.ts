import { EventDraft, JsonValue, SimulationEvent } from '../core/types';
import { SimulationStartedType, validateSimulationStartedPayload } from './contracts/SimulationStarted';
import { SimulationStoppedType, validateSimulationStoppedPayload } from './contracts/SimulationStopped';
import { SimulationPausedType, validateSimulationPausedPayload } from './contracts/SimulationPaused';
import { SimulationResumedType, validateSimulationResumedPayload } from './contracts/SimulationResumed';
import { TickStartedType, validateTickStartedPayload } from './contracts/TickStarted';
import { TickCompletedType, validateTickCompletedPayload } from './contracts/TickCompleted';
import { FrameStartedType, validateFrameStartedPayload } from './contracts/FrameStarted';
import { FrameCompletedType, validateFrameCompletedPayload } from './contracts/FrameCompleted';
import { RollbackRequestedType, validateRollbackRequestedPayload } from './contracts/RollbackRequested';
import { RollbackCompletedType, validateRollbackCompletedPayload } from './contracts/RollbackCompleted';
import { EntityCreatedType, validateEntityCreatedPayload } from './contracts/EntityCreated';
import { EntityDestroyedType, validateEntityDestroyedPayload } from './contracts/EntityDestroyed';
import { EntityEnabledType, validateEntityEnabledPayload } from './contracts/EntityEnabled';
import { EntityDisabledType, validateEntityDisabledPayload } from './contracts/EntityDisabled';
import { EntityTaggedType, validateEntityTaggedPayload } from './contracts/EntityTagged';
import { EntityUntaggedType, validateEntityUntaggedPayload } from './contracts/EntityUntagged';
import { ComponentAddedType, validateComponentAddedPayload } from './contracts/ComponentAdded';
import { ComponentChangedType, validateComponentChangedPayload } from './contracts/ComponentChanged';
import { ComponentRemovedType, validateComponentRemovedPayload } from './contracts/ComponentRemoved';
import { ResourceChangedType, validateResourceChangedPayload } from './contracts/ResourceChanged';
import { MoveRequestedType, validateMoveRequestedPayload } from './contracts/MoveRequested';
import { MoveStartedType, validateMoveStartedPayload } from './contracts/MoveStarted';
import { MoveCompletedType, validateMoveCompletedPayload } from './contracts/MoveCompleted';
import { MoveBlockedType, validateMoveBlockedPayload } from './contracts/MoveBlocked';
import { VelocityChangedType, validateVelocityChangedPayload } from './contracts/VelocityChanged';
import { PositionChangedType, validatePositionChangedPayload } from './contracts/PositionChanged';
import { TeleportStartedType, validateTeleportStartedPayload } from './contracts/TeleportStarted';
import { TeleportCompletedType, validateTeleportCompletedPayload } from './contracts/TeleportCompleted';
import { DodgeStartedType, validateDodgeStartedPayload } from './contracts/DodgeStarted';
import { DodgeCompletedType, validateDodgeCompletedPayload } from './contracts/DodgeCompleted';
import { AttackRequestedType, validateAttackRequestedPayload } from './contracts/AttackRequested';
import { AttackStartedType, validateAttackStartedPayload } from './contracts/AttackStarted';
import { AttackReleasedType, validateAttackReleasedPayload } from './contracts/AttackReleased';
import { AttackCompletedType, validateAttackCompletedPayload } from './contracts/AttackCompleted';
import { AttackCancelledType, validateAttackCancelledPayload } from './contracts/AttackCancelled';
import { DamageCalculatedType, validateDamageCalculatedPayload } from './contracts/DamageCalculated';
import { DamageAppliedType, validateDamageAppliedPayload } from './contracts/DamageApplied';
import { DamagePreventedType, validateDamagePreventedPayload } from './contracts/DamagePrevented';
import { HealingAppliedType, validateHealingAppliedPayload } from './contracts/HealingApplied';
import { ShieldChangedType, validateShieldChangedPayload } from './contracts/ShieldChanged';
import { HealthChangedType, validateHealthChangedPayload } from './contracts/HealthChanged';
import { ManaChangedType, validateManaChangedPayload } from './contracts/ManaChanged';
import { EntityDefeatedType, validateEntityDefeatedPayload } from './contracts/EntityDefeated';
import { ProjectileSpawnedType, validateProjectileSpawnedPayload } from './contracts/ProjectileSpawned';
import { ProjectileMovedType, validateProjectileMovedPayload } from './contracts/ProjectileMoved';
import { ProjectileHitType, validateProjectileHitPayload } from './contracts/ProjectileHit';
import { ProjectileExpiredType, validateProjectileExpiredPayload } from './contracts/ProjectileExpired';
import { ComboStartedType, validateComboStartedPayload } from './contracts/ComboStarted';
import { ComboAdvancedType, validateComboAdvancedPayload } from './contracts/ComboAdvanced';
import { ComboCompletedType, validateComboCompletedPayload } from './contracts/ComboCompleted';
import { ComboBrokenType, validateComboBrokenPayload } from './contracts/ComboBroken';
import { StatusAppliedType, validateStatusAppliedPayload } from './contracts/StatusApplied';
import { StatusRefreshedType, validateStatusRefreshedPayload } from './contracts/StatusRefreshed';
import { StatusTickedType, validateStatusTickedPayload } from './contracts/StatusTicked';
import { StatusRemovedType, validateStatusRemovedPayload } from './contracts/StatusRemoved';
import { BuffAppliedType, validateBuffAppliedPayload } from './contracts/BuffApplied';
import { DebuffAppliedType, validateDebuffAppliedPayload } from './contracts/DebuffApplied';
import { ImmunityGrantedType, validateImmunityGrantedPayload } from './contracts/ImmunityGranted';
import { ImmunityExpiredType, validateImmunityExpiredPayload } from './contracts/ImmunityExpired';
import { ItemSpawnedType, validateItemSpawnedPayload } from './contracts/ItemSpawned';
import { ItemPickedUpType, validateItemPickedUpPayload } from './contracts/ItemPickedUp';
import { ItemDroppedType, validateItemDroppedPayload } from './contracts/ItemDropped';
import { ItemConsumedType, validateItemConsumedPayload } from './contracts/ItemConsumed';
import { ItemEquippedType, validateItemEquippedPayload } from './contracts/ItemEquipped';
import { ItemUnequippedType, validateItemUnequippedPayload } from './contracts/ItemUnequipped';
import { InventoryChangedType, validateInventoryChangedPayload } from './contracts/InventoryChanged';
import { CurrencyChangedType, validateCurrencyChangedPayload } from './contracts/CurrencyChanged';
import { PurchaseRequestedType, validatePurchaseRequestedPayload } from './contracts/PurchaseRequested';
import { PurchaseCompletedType, validatePurchaseCompletedPayload } from './contracts/PurchaseCompleted';
import { RoomEnteredType, validateRoomEnteredPayload } from './contracts/RoomEntered';
import { RoomExitedType, validateRoomExitedPayload } from './contracts/RoomExited';
import { DoorOpenedType, validateDoorOpenedPayload } from './contracts/DoorOpened';
import { DoorClosedType, validateDoorClosedPayload } from './contracts/DoorClosed';
import { DoorLockedType, validateDoorLockedPayload } from './contracts/DoorLocked';
import { DoorUnlockedType, validateDoorUnlockedPayload } from './contracts/DoorUnlocked';
import { WaveStartedType, validateWaveStartedPayload } from './contracts/WaveStarted';
import { WaveCompletedType, validateWaveCompletedPayload } from './contracts/WaveCompleted';
import { EncounterStartedType, validateEncounterStartedPayload } from './contracts/EncounterStarted';
import { EncounterCompletedType, validateEncounterCompletedPayload } from './contracts/EncounterCompleted';
import { ObjectiveStartedType, validateObjectiveStartedPayload } from './contracts/ObjectiveStarted';
import { ObjectiveProgressedType, validateObjectiveProgressedPayload } from './contracts/ObjectiveProgressed';
import { ObjectiveCompletedType, validateObjectiveCompletedPayload } from './contracts/ObjectiveCompleted';
import { ExperienceChangedType, validateExperienceChangedPayload } from './contracts/ExperienceChanged';
import { LevelGainedType, validateLevelGainedPayload } from './contracts/LevelGained';
import { AchievementUnlockedType, validateAchievementUnlockedPayload } from './contracts/AchievementUnlocked';
import { CheckpointReachedType, validateCheckpointReachedPayload } from './contracts/CheckpointReached';
import { RunCompletedType, validateRunCompletedPayload } from './contracts/RunCompleted';
import { InputPressedType, validateInputPressedPayload } from './contracts/InputPressed';
import { InputReleasedType, validateInputReleasedPayload } from './contracts/InputReleased';
import { PointerMovedType, validatePointerMovedPayload } from './contracts/PointerMoved';
import { PointerPressedType, validatePointerPressedPayload } from './contracts/PointerPressed';
import { PointerReleasedType, validatePointerReleasedPayload } from './contracts/PointerReleased';
import { MenuOpenedType, validateMenuOpenedPayload } from './contracts/MenuOpened';
import { MenuClosedType, validateMenuClosedPayload } from './contracts/MenuClosed';
import { NotificationShownType, validateNotificationShownPayload } from './contracts/NotificationShown';
import { SettingChangedType, validateSettingChangedPayload } from './contracts/SettingChanged';
import { DiagnosticMeasuredType, validateDiagnosticMeasuredPayload } from './contracts/DiagnosticMeasured';
import { InvariantViolatedType, validateInvariantViolatedPayload } from './contracts/InvariantViolated';
import { SystemFailedType, validateSystemFailedPayload } from './contracts/SystemFailed';
import { PerformanceBudgetExceededType, validatePerformanceBudgetExceededPayload } from './contracts/PerformanceBudgetExceeded';

export type EventPayloadValidator = (value: unknown) => value is JsonValue;

export class EventRegistry {
  private readonly validators = new Map<string, EventPayloadValidator>();

  public register(type: string, validator: EventPayloadValidator): () => void {
    if (this.validators.has(type)) {
      throw new Error('event type already registered: ' + type);
    }
    this.validators.set(type, validator);
    return () => this.validators.delete(type);
  }

  public replace(type: string, validator: EventPayloadValidator): void {
    this.validators.set(type, validator);
  }

  public unregister(type: string): boolean {
    return this.validators.delete(type);
  }

  public has(type: string): boolean {
    return this.validators.has(type);
  }

  public validateDraft(draft: EventDraft): boolean {
    return this.validators.get(draft.type)?.(draft.payload) ?? false;
  }

  public validateEvent(event: SimulationEvent): boolean {
    return this.validators.get(event.type)?.(event.payload) ?? false;
  }

  public types(): readonly string[] {
    return [...this.validators.keys()].sort();
  }

  public clear(): void {
    this.validators.clear();
  }
}

export function createDefaultEventRegistry(): EventRegistry {
  const registry = new EventRegistry();
  const definitions: ReadonlyArray<readonly [string, EventPayloadValidator]> = [
  [SimulationStartedType, validateSimulationStartedPayload],
  [SimulationStoppedType, validateSimulationStoppedPayload],
  [SimulationPausedType, validateSimulationPausedPayload],
  [SimulationResumedType, validateSimulationResumedPayload],
  [TickStartedType, validateTickStartedPayload],
  [TickCompletedType, validateTickCompletedPayload],
  [FrameStartedType, validateFrameStartedPayload],
  [FrameCompletedType, validateFrameCompletedPayload],
  [RollbackRequestedType, validateRollbackRequestedPayload],
  [RollbackCompletedType, validateRollbackCompletedPayload],
  [EntityCreatedType, validateEntityCreatedPayload],
  [EntityDestroyedType, validateEntityDestroyedPayload],
  [EntityEnabledType, validateEntityEnabledPayload],
  [EntityDisabledType, validateEntityDisabledPayload],
  [EntityTaggedType, validateEntityTaggedPayload],
  [EntityUntaggedType, validateEntityUntaggedPayload],
  [ComponentAddedType, validateComponentAddedPayload],
  [ComponentChangedType, validateComponentChangedPayload],
  [ComponentRemovedType, validateComponentRemovedPayload],
  [ResourceChangedType, validateResourceChangedPayload],
  [MoveRequestedType, validateMoveRequestedPayload],
  [MoveStartedType, validateMoveStartedPayload],
  [MoveCompletedType, validateMoveCompletedPayload],
  [MoveBlockedType, validateMoveBlockedPayload],
  [VelocityChangedType, validateVelocityChangedPayload],
  [PositionChangedType, validatePositionChangedPayload],
  [TeleportStartedType, validateTeleportStartedPayload],
  [TeleportCompletedType, validateTeleportCompletedPayload],
  [DodgeStartedType, validateDodgeStartedPayload],
  [DodgeCompletedType, validateDodgeCompletedPayload],
  [AttackRequestedType, validateAttackRequestedPayload],
  [AttackStartedType, validateAttackStartedPayload],
  [AttackReleasedType, validateAttackReleasedPayload],
  [AttackCompletedType, validateAttackCompletedPayload],
  [AttackCancelledType, validateAttackCancelledPayload],
  [DamageCalculatedType, validateDamageCalculatedPayload],
  [DamageAppliedType, validateDamageAppliedPayload],
  [DamagePreventedType, validateDamagePreventedPayload],
  [HealingAppliedType, validateHealingAppliedPayload],
  [ShieldChangedType, validateShieldChangedPayload],
  [HealthChangedType, validateHealthChangedPayload],
  [ManaChangedType, validateManaChangedPayload],
  [EntityDefeatedType, validateEntityDefeatedPayload],
  [ProjectileSpawnedType, validateProjectileSpawnedPayload],
  [ProjectileMovedType, validateProjectileMovedPayload],
  [ProjectileHitType, validateProjectileHitPayload],
  [ProjectileExpiredType, validateProjectileExpiredPayload],
  [ComboStartedType, validateComboStartedPayload],
  [ComboAdvancedType, validateComboAdvancedPayload],
  [ComboCompletedType, validateComboCompletedPayload],
  [ComboBrokenType, validateComboBrokenPayload],
  [StatusAppliedType, validateStatusAppliedPayload],
  [StatusRefreshedType, validateStatusRefreshedPayload],
  [StatusTickedType, validateStatusTickedPayload],
  [StatusRemovedType, validateStatusRemovedPayload],
  [BuffAppliedType, validateBuffAppliedPayload],
  [DebuffAppliedType, validateDebuffAppliedPayload],
  [ImmunityGrantedType, validateImmunityGrantedPayload],
  [ImmunityExpiredType, validateImmunityExpiredPayload],
  [ItemSpawnedType, validateItemSpawnedPayload],
  [ItemPickedUpType, validateItemPickedUpPayload],
  [ItemDroppedType, validateItemDroppedPayload],
  [ItemConsumedType, validateItemConsumedPayload],
  [ItemEquippedType, validateItemEquippedPayload],
  [ItemUnequippedType, validateItemUnequippedPayload],
  [InventoryChangedType, validateInventoryChangedPayload],
  [CurrencyChangedType, validateCurrencyChangedPayload],
  [PurchaseRequestedType, validatePurchaseRequestedPayload],
  [PurchaseCompletedType, validatePurchaseCompletedPayload],
  [RoomEnteredType, validateRoomEnteredPayload],
  [RoomExitedType, validateRoomExitedPayload],
  [DoorOpenedType, validateDoorOpenedPayload],
  [DoorClosedType, validateDoorClosedPayload],
  [DoorLockedType, validateDoorLockedPayload],
  [DoorUnlockedType, validateDoorUnlockedPayload],
  [WaveStartedType, validateWaveStartedPayload],
  [WaveCompletedType, validateWaveCompletedPayload],
  [EncounterStartedType, validateEncounterStartedPayload],
  [EncounterCompletedType, validateEncounterCompletedPayload],
  [ObjectiveStartedType, validateObjectiveStartedPayload],
  [ObjectiveProgressedType, validateObjectiveProgressedPayload],
  [ObjectiveCompletedType, validateObjectiveCompletedPayload],
  [ExperienceChangedType, validateExperienceChangedPayload],
  [LevelGainedType, validateLevelGainedPayload],
  [AchievementUnlockedType, validateAchievementUnlockedPayload],
  [CheckpointReachedType, validateCheckpointReachedPayload],
  [RunCompletedType, validateRunCompletedPayload],
  [InputPressedType, validateInputPressedPayload],
  [InputReleasedType, validateInputReleasedPayload],
  [PointerMovedType, validatePointerMovedPayload],
  [PointerPressedType, validatePointerPressedPayload],
  [PointerReleasedType, validatePointerReleasedPayload],
  [MenuOpenedType, validateMenuOpenedPayload],
  [MenuClosedType, validateMenuClosedPayload],
  [NotificationShownType, validateNotificationShownPayload],
  [SettingChangedType, validateSettingChangedPayload],
  [DiagnosticMeasuredType, validateDiagnosticMeasuredPayload],
  [InvariantViolatedType, validateInvariantViolatedPayload],
  [SystemFailedType, validateSystemFailedPayload],
  [PerformanceBudgetExceededType, validatePerformanceBudgetExceededPayload],
  ];
  for (const [type, validator] of definitions) {
    registry.register(type, validator);
  }
  return registry;
}
