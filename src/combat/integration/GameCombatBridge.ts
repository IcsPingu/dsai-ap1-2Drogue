import type { PlayerClassDefinition } from '../../data/ClassDatabase';
import { CombatRuntime } from '../runtime/CombatRuntime';
import { CombatClass, DamageType } from '../core/types';

export interface GameCombatBridgeOptions {
  classDefinition: PlayerClassDefinition;
  seed?: string | number;
}

export class GameCombatBridge {
  public readonly runtime: CombatRuntime;
  private readonly playerId = 'game-player';
  private readonly targetId = 'game-target-proxy';
  private readonly enemyId = 'game-enemy-proxy';
  private hitSequence = 0;

  public constructor(options: GameCombatBridgeOptions) {
    const definition = options.classDefinition;
    this.runtime = new CombatRuntime(options.seed ?? 'game-combat');
    this.runtime.addCombatant({
      id: this.playerId,
      name: definition.name,
      classId: definition.id as CombatClass,
      team: 'player',
      stats: {
        maximumHealth: definition.maxHp * 100,
        maximumMana: definition.maxMagic,
        attackPower: definition.baseDamage,
        spellPower: definition.baseDamage,
        movementSpeed: definition.speed,
        armor: definition.id === 'knight' ? 24 : 8,
        resistance: definition.id === 'mage' ? 22 : 10,
        criticalChance: definition.id === 'rogue' ? 0.18 : definition.id === 'ranger' ? 0.12 : 0.08,
        criticalMultiplier: definition.id === 'rogue' ? 1.8 : 1.55,
      },
    });
    this.runtime.addCombatant({ id: this.targetId, name: 'Target Proxy', classId: 'enemy', team: 'enemy', stats: { maximumHealth: 100000, armor: 0, resistance: 0, dodgeChance: 0, blockChance: 0 } });
    this.runtime.addCombatant({ id: this.enemyId, name: 'Enemy Proxy', classId: 'enemy', team: 'enemy', stats: { maximumHealth: 100000, attackPower: 20, spellPower: 20 } });
  }

  public synchronizePlayer(health: number, maximumHealth: number, mana: number, maximumMana: number): void {
    const player = this.runtime.getCombatant(this.playerId);
    if (!player) return;
    player.stats.setBase('maximumHealth', maximumHealth * 100);
    player.stats.setBase('maximumMana', maximumMana);
    player.resources.setMaximum('health', maximumHealth * 100);
    player.resources.setMaximum('mana', maximumMana);
    player.resources.set('health', health * 100);
    player.resources.set('mana', mana);
  }

  public calculatePlayerDamage(baseAmount: number, type: DamageType, comboMultiplier = 1): number {
    const result = this.runtime.previewDamage({
      sourceId: this.playerId,
      targetId: this.targetId,
      damageType: type,
      baseAmount: baseAmount * comboMultiplier,
      powerRatio: 0,
      canCrit: true,
      canBlock: false,
      ignoresArmor: 0,
      ignoresResistance: 0,
      tags: ['game-hit', type],
      hitIndex: ++this.hitSequence,
    });
    return Math.max(0, result?.applied ?? baseAmount * comboMultiplier);
  }

  public calculateIncomingDamage(baseAmount: number, type: DamageType = 'physical'): number {
    const result = this.runtime.previewDamage({
      sourceId: this.enemyId,
      targetId: this.playerId,
      damageType: type,
      baseAmount,
      powerRatio: 0,
      canCrit: false,
      canBlock: true,
      ignoresArmor: 0,
      ignoresResistance: 0,
      tags: ['enemy-hit'],
      hitIndex: ++this.hitSequence,
    });
    return Math.max(0, result?.applied ?? baseAmount);
  }

  public advance(deltaMilliseconds: number): void { this.runtime.update(deltaMilliseconds); }
  public abilitiesForPlayer(): string[] { return this.runtime.abilities.forClass(this.runtime.getCombatant(this.playerId)?.snapshot().classId ?? 'knight').map((ability) => ability.definition.id); }
  public dispose(): void { this.runtime.dispose(); }
}
