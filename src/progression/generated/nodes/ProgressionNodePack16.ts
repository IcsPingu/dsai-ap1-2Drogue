// Auto-generated progression content pack.
import {
  ProgressionDiscipline,
  ProgressionModifiers,
  ProgressionNode,
  ProgressionNodePreview,
  ProgressionRarity,
  ProgressionRequirementResult,
  ProgressionReward,
  ProgressionSnapshot,
  ProgressionState,
} from '../../types';
import {
  addProgressionModifier,
  progressionNodeRank,
  progressionRatio,
  progressionRequirement,
  unlockProgressionContent,
} from '../helpers';

export class ProgressionNode0106 implements ProgressionNode {
  public readonly id = 'progression-node-0106';
  public readonly title = 'Arcane Pulse B-6';
  public readonly description = 'Tier 6 arcane technique 0106 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'arcane';
  public readonly rarity: ProgressionRarity = 'rare';
  public readonly tier = 6;
  public readonly maximumRank = 1;
  private readonly requiredLevel = 36;
  private readonly requiredKills = 472;
  private readonly requiredStages = 8;
  private readonly requiredMastery = 220;
  private readonly baseCost = 4;
  private readonly growth = 1.18;
  private readonly modifierKey: keyof ProgressionModifiers = 'maximumMagicBonus';
  private readonly modifierAmount = 1.3;
  private readonly prerequisite = 'progression-node-0100';

  public requirement(snapshot: ProgressionSnapshot): ProgressionRequirementResult {
    const masteryValue = this.discipline === 'combat'
      ? snapshot.mastery.melee + snapshot.mastery.ranged
      : this.discipline === 'defense'
        ? snapshot.mastery.survival
        : snapshot.mastery.exploration + snapshot.mastery.boss;
    const prerequisiteMet = this.prerequisite.length === 0 || (snapshot.unlockedNodes[this.prerequisite] ?? 0) > 0;
    return progressionRequirement([
      { met: snapshot.level >= this.requiredLevel, label: 'Reach level ' + this.requiredLevel, ratio: progressionRatio(snapshot.level, this.requiredLevel) },
      { met: snapshot.counters.totalKills >= this.requiredKills, label: 'Defeat ' + this.requiredKills + ' enemies', ratio: progressionRatio(snapshot.counters.totalKills, this.requiredKills) },
      { met: snapshot.counters.stagesCompleted >= this.requiredStages, label: 'Clear ' + this.requiredStages + ' stages', ratio: progressionRatio(snapshot.counters.stagesCompleted, this.requiredStages) },
      { met: masteryValue >= this.requiredMastery, label: 'Earn ' + this.requiredMastery + ' mastery', ratio: progressionRatio(masteryValue, this.requiredMastery) },
      { met: prerequisiteMet, label: 'Unlock ' + this.prerequisite, ratio: prerequisiteMet ? 1 : 0 },
    ]);
  }

  public cost(snapshot: ProgressionSnapshot): number {
    const rank = progressionNodeRank(snapshot, this.id);
    if (rank >= this.maximumRank) return 0;
    return Math.max(1, Math.ceil(this.baseCost * this.growth ** rank));
  }

  public reward(snapshot: ProgressionSnapshot): ProgressionReward {
    const rank = progressionNodeRank(snapshot, this.id);
    const rankScale = 1 + rank * 0.35;
    return {
      experience: Math.round(75 * rankScale),
      currency: Math.round(115 * rankScale),
      unlocks: ['content-arcane-0106', 'lore-0106'],
      modifier: { [this.modifierKey]: this.modifierAmount * rankScale },
    };
  }

  public preview(snapshot: ProgressionSnapshot): ProgressionNodePreview {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      discipline: this.discipline,
      rarity: this.rarity,
      tier: this.tier,
      currentRank: progressionNodeRank(snapshot, this.id),
      maximumRank: this.maximumRank,
      cost: this.cost(snapshot),
      requirement: this.requirement(snapshot),
      reward: this.reward(snapshot),
    };
  }

  public apply(state: ProgressionState): ProgressionReward {
    const rank = progressionNodeRank(state, this.id);
    const requirement = this.requirement(state);
    const cost = this.cost(state);
    if (!requirement.met) throw new Error(this.id + ' requirements are not met: ' + requirement.missing.join(', '));
    if (rank >= this.maximumRank) throw new Error(this.id + ' is already at maximum rank');
    if (state.skillPoints < cost) throw new Error(this.id + ' requires ' + cost + ' skill points');
    const reward = this.reward(state);
    state.skillPoints -= cost;
    state.unlockedNodes[this.id] = rank + 1;
    state.experience += reward.experience ?? 0;
    state.lifetimeExperience += reward.experience ?? 0;
    state.currency += reward.currency ?? 0;
    addProgressionModifier(state, this.modifierKey, reward.modifier?.[this.modifierKey] ?? 0);
    for (const contentId of reward.unlocks ?? []) unlockProgressionContent(state, contentId);
    state.updatedAt = Date.now();
    return reward;
  }
}

export class ProgressionNode0107 implements ProgressionNode {
  public readonly id = 'progression-node-0107';
  public readonly title = 'Golden Pact C-6';
  public readonly description = 'Tier 6 economy technique 0107 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'economy';
  public readonly rarity: ProgressionRarity = 'rare';
  public readonly tier = 6;
  public readonly maximumRank = 2;
  private readonly requiredLevel = 36;
  private readonly requiredKills = 477;
  private readonly requiredStages = 8;
  private readonly requiredMastery = 222;
  private readonly baseCost = 4;
  private readonly growth = 1.225;
  private readonly modifierKey: keyof ProgressionModifiers = 'haloMultiplier';
  private readonly modifierAmount = 0.0165;
  private readonly prerequisite = 'progression-node-0101';

  public requirement(snapshot: ProgressionSnapshot): ProgressionRequirementResult {
    const masteryValue = this.discipline === 'combat'
      ? snapshot.mastery.melee + snapshot.mastery.ranged
      : this.discipline === 'defense'
        ? snapshot.mastery.survival
        : snapshot.mastery.exploration + snapshot.mastery.boss;
    const prerequisiteMet = this.prerequisite.length === 0 || (snapshot.unlockedNodes[this.prerequisite] ?? 0) > 0;
    return progressionRequirement([
      { met: snapshot.level >= this.requiredLevel, label: 'Reach level ' + this.requiredLevel, ratio: progressionRatio(snapshot.level, this.requiredLevel) },
      { met: snapshot.counters.totalKills >= this.requiredKills, label: 'Defeat ' + this.requiredKills + ' enemies', ratio: progressionRatio(snapshot.counters.totalKills, this.requiredKills) },
      { met: snapshot.counters.stagesCompleted >= this.requiredStages, label: 'Clear ' + this.requiredStages + ' stages', ratio: progressionRatio(snapshot.counters.stagesCompleted, this.requiredStages) },
      { met: masteryValue >= this.requiredMastery, label: 'Earn ' + this.requiredMastery + ' mastery', ratio: progressionRatio(masteryValue, this.requiredMastery) },
      { met: prerequisiteMet, label: 'Unlock ' + this.prerequisite, ratio: prerequisiteMet ? 1 : 0 },
    ]);
  }

  public cost(snapshot: ProgressionSnapshot): number {
    const rank = progressionNodeRank(snapshot, this.id);
    if (rank >= this.maximumRank) return 0;
    return Math.max(1, Math.ceil(this.baseCost * this.growth ** rank));
  }

  public reward(snapshot: ProgressionSnapshot): ProgressionReward {
    const rank = progressionNodeRank(snapshot, this.id);
    const rankScale = 1 + rank * 0.35;
    return {
      experience: Math.round(78 * rankScale),
      currency: Math.round(120 * rankScale),
      unlocks: ['content-economy-0107', 'lore-0107'],
      modifier: { [this.modifierKey]: this.modifierAmount * rankScale },
    };
  }

  public preview(snapshot: ProgressionSnapshot): ProgressionNodePreview {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      discipline: this.discipline,
      rarity: this.rarity,
      tier: this.tier,
      currentRank: progressionNodeRank(snapshot, this.id),
      maximumRank: this.maximumRank,
      cost: this.cost(snapshot),
      requirement: this.requirement(snapshot),
      reward: this.reward(snapshot),
    };
  }

  public apply(state: ProgressionState): ProgressionReward {
    const rank = progressionNodeRank(state, this.id);
    const requirement = this.requirement(state);
    const cost = this.cost(state);
    if (!requirement.met) throw new Error(this.id + ' requirements are not met: ' + requirement.missing.join(', '));
    if (rank >= this.maximumRank) throw new Error(this.id + ' is already at maximum rank');
    if (state.skillPoints < cost) throw new Error(this.id + ' requires ' + cost + ' skill points');
    const reward = this.reward(state);
    state.skillPoints -= cost;
    state.unlockedNodes[this.id] = rank + 1;
    state.experience += reward.experience ?? 0;
    state.lifetimeExperience += reward.experience ?? 0;
    state.currency += reward.currency ?? 0;
    addProgressionModifier(state, this.modifierKey, reward.modifier?.[this.modifierKey] ?? 0);
    for (const contentId of reward.unlocks ?? []) unlockProgressionContent(state, contentId);
    state.updatedAt = Date.now();
    return reward;
  }
}

export class ProgressionNode0108 implements ProgressionNode {
  public readonly id = 'progression-node-0108';
  public readonly title = 'Hidden Path D-6';
  public readonly description = 'Tier 6 exploration technique 0108 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'exploration';
  public readonly rarity: ProgressionRarity = 'rare';
  public readonly tier = 6;
  public readonly maximumRank = 3;
  private readonly requiredLevel = 36;
  private readonly requiredKills = 481;
  private readonly requiredStages = 8;
  private readonly requiredMastery = 224;
  private readonly baseCost = 4;
  private readonly growth = 1.27;
  private readonly modifierKey: keyof ProgressionModifiers = 'lootLuck';
  private readonly modifierAmount = 1.6;
  private readonly prerequisite = 'progression-node-0102';

  public requirement(snapshot: ProgressionSnapshot): ProgressionRequirementResult {
    const masteryValue = this.discipline === 'combat'
      ? snapshot.mastery.melee + snapshot.mastery.ranged
      : this.discipline === 'defense'
        ? snapshot.mastery.survival
        : snapshot.mastery.exploration + snapshot.mastery.boss;
    const prerequisiteMet = this.prerequisite.length === 0 || (snapshot.unlockedNodes[this.prerequisite] ?? 0) > 0;
    return progressionRequirement([
      { met: snapshot.level >= this.requiredLevel, label: 'Reach level ' + this.requiredLevel, ratio: progressionRatio(snapshot.level, this.requiredLevel) },
      { met: snapshot.counters.totalKills >= this.requiredKills, label: 'Defeat ' + this.requiredKills + ' enemies', ratio: progressionRatio(snapshot.counters.totalKills, this.requiredKills) },
      { met: snapshot.counters.stagesCompleted >= this.requiredStages, label: 'Clear ' + this.requiredStages + ' stages', ratio: progressionRatio(snapshot.counters.stagesCompleted, this.requiredStages) },
      { met: masteryValue >= this.requiredMastery, label: 'Earn ' + this.requiredMastery + ' mastery', ratio: progressionRatio(masteryValue, this.requiredMastery) },
      { met: prerequisiteMet, label: 'Unlock ' + this.prerequisite, ratio: prerequisiteMet ? 1 : 0 },
    ]);
  }

  public cost(snapshot: ProgressionSnapshot): number {
    const rank = progressionNodeRank(snapshot, this.id);
    if (rank >= this.maximumRank) return 0;
    return Math.max(1, Math.ceil(this.baseCost * this.growth ** rank));
  }

  public reward(snapshot: ProgressionSnapshot): ProgressionReward {
    const rank = progressionNodeRank(snapshot, this.id);
    const rankScale = 1 + rank * 0.35;
    return {
      experience: Math.round(81 * rankScale),
      currency: Math.round(125 * rankScale),
      unlocks: ['content-exploration-0108', 'lore-0108'],
      modifier: { [this.modifierKey]: this.modifierAmount * rankScale },
    };
  }

  public preview(snapshot: ProgressionSnapshot): ProgressionNodePreview {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      discipline: this.discipline,
      rarity: this.rarity,
      tier: this.tier,
      currentRank: progressionNodeRank(snapshot, this.id),
      maximumRank: this.maximumRank,
      cost: this.cost(snapshot),
      requirement: this.requirement(snapshot),
      reward: this.reward(snapshot),
    };
  }

  public apply(state: ProgressionState): ProgressionReward {
    const rank = progressionNodeRank(state, this.id);
    const requirement = this.requirement(state);
    const cost = this.cost(state);
    if (!requirement.met) throw new Error(this.id + ' requirements are not met: ' + requirement.missing.join(', '));
    if (rank >= this.maximumRank) throw new Error(this.id + ' is already at maximum rank');
    if (state.skillPoints < cost) throw new Error(this.id + ' requires ' + cost + ' skill points');
    const reward = this.reward(state);
    state.skillPoints -= cost;
    state.unlockedNodes[this.id] = rank + 1;
    state.experience += reward.experience ?? 0;
    state.lifetimeExperience += reward.experience ?? 0;
    state.currency += reward.currency ?? 0;
    addProgressionModifier(state, this.modifierKey, reward.modifier?.[this.modifierKey] ?? 0);
    for (const contentId of reward.unlocks ?? []) unlockProgressionContent(state, contentId);
    state.updatedAt = Date.now();
    return reward;
  }
}

export class ProgressionNode0109 implements ProgressionNode {
  public readonly id = 'progression-node-0109';
  public readonly title = 'Witch Art E-6';
  public readonly description = 'Tier 6 combat technique 0109 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'combat';
  public readonly rarity: ProgressionRarity = 'rare';
  public readonly tier = 6;
  public readonly maximumRank = 4;
  private readonly requiredLevel = 37;
  private readonly requiredKills = 486;
  private readonly requiredStages = 9;
  private readonly requiredMastery = 226;
  private readonly baseCost = 4;
  private readonly growth = 1.315;
  private readonly modifierKey: keyof ProgressionModifiers = 'damageMultiplier';
  private readonly modifierAmount = 0.0195;
  private readonly prerequisite = 'progression-node-0103';

  public requirement(snapshot: ProgressionSnapshot): ProgressionRequirementResult {
    const masteryValue = this.discipline === 'combat'
      ? snapshot.mastery.melee + snapshot.mastery.ranged
      : this.discipline === 'defense'
        ? snapshot.mastery.survival
        : snapshot.mastery.exploration + snapshot.mastery.boss;
    const prerequisiteMet = this.prerequisite.length === 0 || (snapshot.unlockedNodes[this.prerequisite] ?? 0) > 0;
    return progressionRequirement([
      { met: snapshot.level >= this.requiredLevel, label: 'Reach level ' + this.requiredLevel, ratio: progressionRatio(snapshot.level, this.requiredLevel) },
      { met: snapshot.counters.totalKills >= this.requiredKills, label: 'Defeat ' + this.requiredKills + ' enemies', ratio: progressionRatio(snapshot.counters.totalKills, this.requiredKills) },
      { met: snapshot.counters.stagesCompleted >= this.requiredStages, label: 'Clear ' + this.requiredStages + ' stages', ratio: progressionRatio(snapshot.counters.stagesCompleted, this.requiredStages) },
      { met: masteryValue >= this.requiredMastery, label: 'Earn ' + this.requiredMastery + ' mastery', ratio: progressionRatio(masteryValue, this.requiredMastery) },
      { met: prerequisiteMet, label: 'Unlock ' + this.prerequisite, ratio: prerequisiteMet ? 1 : 0 },
    ]);
  }

  public cost(snapshot: ProgressionSnapshot): number {
    const rank = progressionNodeRank(snapshot, this.id);
    if (rank >= this.maximumRank) return 0;
    return Math.max(1, Math.ceil(this.baseCost * this.growth ** rank));
  }

  public reward(snapshot: ProgressionSnapshot): ProgressionReward {
    const rank = progressionNodeRank(snapshot, this.id);
    const rankScale = 1 + rank * 0.35;
    return {
      experience: Math.round(84 * rankScale),
      currency: Math.round(130 * rankScale),
      unlocks: ['content-combat-0109', 'lore-0109'],
      modifier: { [this.modifierKey]: this.modifierAmount * rankScale },
    };
  }

  public preview(snapshot: ProgressionSnapshot): ProgressionNodePreview {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      discipline: this.discipline,
      rarity: this.rarity,
      tier: this.tier,
      currentRank: progressionNodeRank(snapshot, this.id),
      maximumRank: this.maximumRank,
      cost: this.cost(snapshot),
      requirement: this.requirement(snapshot),
      reward: this.reward(snapshot),
    };
  }

  public apply(state: ProgressionState): ProgressionReward {
    const rank = progressionNodeRank(state, this.id);
    const requirement = this.requirement(state);
    const cost = this.cost(state);
    if (!requirement.met) throw new Error(this.id + ' requirements are not met: ' + requirement.missing.join(', '));
    if (rank >= this.maximumRank) throw new Error(this.id + ' is already at maximum rank');
    if (state.skillPoints < cost) throw new Error(this.id + ' requires ' + cost + ' skill points');
    const reward = this.reward(state);
    state.skillPoints -= cost;
    state.unlockedNodes[this.id] = rank + 1;
    state.experience += reward.experience ?? 0;
    state.lifetimeExperience += reward.experience ?? 0;
    state.currency += reward.currency ?? 0;
    addProgressionModifier(state, this.modifierKey, reward.modifier?.[this.modifierKey] ?? 0);
    for (const contentId of reward.unlocks ?? []) unlockProgressionContent(state, contentId);
    state.updatedAt = Date.now();
    return reward;
  }
}

export class ProgressionNode0110 implements ProgressionNode {
  public readonly id = 'progression-node-0110';
  public readonly title = 'Moon Step F-6';
  public readonly description = 'Tier 6 mobility technique 0110 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'mobility';
  public readonly rarity: ProgressionRarity = 'rare';
  public readonly tier = 6;
  public readonly maximumRank = 5;
  private readonly requiredLevel = 37;
  private readonly requiredKills = 490;
  private readonly requiredStages = 9;
  private readonly requiredMastery = 228;
  private readonly baseCost = 4;
  private readonly growth = 1.36;
  private readonly modifierKey: keyof ProgressionModifiers = 'movementMultiplier';
  private readonly modifierAmount = 0.021;
  private readonly prerequisite = 'progression-node-0104';

  public requirement(snapshot: ProgressionSnapshot): ProgressionRequirementResult {
    const masteryValue = this.discipline === 'combat'
      ? snapshot.mastery.melee + snapshot.mastery.ranged
      : this.discipline === 'defense'
        ? snapshot.mastery.survival
        : snapshot.mastery.exploration + snapshot.mastery.boss;
    const prerequisiteMet = this.prerequisite.length === 0 || (snapshot.unlockedNodes[this.prerequisite] ?? 0) > 0;
    return progressionRequirement([
      { met: snapshot.level >= this.requiredLevel, label: 'Reach level ' + this.requiredLevel, ratio: progressionRatio(snapshot.level, this.requiredLevel) },
      { met: snapshot.counters.totalKills >= this.requiredKills, label: 'Defeat ' + this.requiredKills + ' enemies', ratio: progressionRatio(snapshot.counters.totalKills, this.requiredKills) },
      { met: snapshot.counters.stagesCompleted >= this.requiredStages, label: 'Clear ' + this.requiredStages + ' stages', ratio: progressionRatio(snapshot.counters.stagesCompleted, this.requiredStages) },
      { met: masteryValue >= this.requiredMastery, label: 'Earn ' + this.requiredMastery + ' mastery', ratio: progressionRatio(masteryValue, this.requiredMastery) },
      { met: prerequisiteMet, label: 'Unlock ' + this.prerequisite, ratio: prerequisiteMet ? 1 : 0 },
    ]);
  }

  public cost(snapshot: ProgressionSnapshot): number {
    const rank = progressionNodeRank(snapshot, this.id);
    if (rank >= this.maximumRank) return 0;
    return Math.max(1, Math.ceil(this.baseCost * this.growth ** rank));
  }

  public reward(snapshot: ProgressionSnapshot): ProgressionReward {
    const rank = progressionNodeRank(snapshot, this.id);
    const rankScale = 1 + rank * 0.35;
    return {
      experience: Math.round(87 * rankScale),
      currency: Math.round(135 * rankScale),
      unlocks: ['content-mobility-0110', 'lore-0110'],
      modifier: { [this.modifierKey]: this.modifierAmount * rankScale },
    };
  }

  public preview(snapshot: ProgressionSnapshot): ProgressionNodePreview {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      discipline: this.discipline,
      rarity: this.rarity,
      tier: this.tier,
      currentRank: progressionNodeRank(snapshot, this.id),
      maximumRank: this.maximumRank,
      cost: this.cost(snapshot),
      requirement: this.requirement(snapshot),
      reward: this.reward(snapshot),
    };
  }

  public apply(state: ProgressionState): ProgressionReward {
    const rank = progressionNodeRank(state, this.id);
    const requirement = this.requirement(state);
    const cost = this.cost(state);
    if (!requirement.met) throw new Error(this.id + ' requirements are not met: ' + requirement.missing.join(', '));
    if (rank >= this.maximumRank) throw new Error(this.id + ' is already at maximum rank');
    if (state.skillPoints < cost) throw new Error(this.id + ' requires ' + cost + ' skill points');
    const reward = this.reward(state);
    state.skillPoints -= cost;
    state.unlockedNodes[this.id] = rank + 1;
    state.experience += reward.experience ?? 0;
    state.lifetimeExperience += reward.experience ?? 0;
    state.currency += reward.currency ?? 0;
    addProgressionModifier(state, this.modifierKey, reward.modifier?.[this.modifierKey] ?? 0);
    for (const contentId of reward.unlocks ?? []) unlockProgressionContent(state, contentId);
    state.updatedAt = Date.now();
    return reward;
  }
}

export class ProgressionNode0111 implements ProgressionNode {
  public readonly id = 'progression-node-0111';
  public readonly title = 'Iron Heart G-6';
  public readonly description = 'Tier 6 defense technique 0111 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'defense';
  public readonly rarity: ProgressionRarity = 'rare';
  public readonly tier = 6;
  public readonly maximumRank = 1;
  private readonly requiredLevel = 37;
  private readonly requiredKills = 495;
  private readonly requiredStages = 9;
  private readonly requiredMastery = 231;
  private readonly baseCost = 4;
  private readonly growth = 1.405;
  private readonly modifierKey: keyof ProgressionModifiers = 'defenseMultiplier';
  private readonly modifierAmount = 0.006;
  private readonly prerequisite = 'progression-node-0105';

  public requirement(snapshot: ProgressionSnapshot): ProgressionRequirementResult {
    const masteryValue = this.discipline === 'combat'
      ? snapshot.mastery.melee + snapshot.mastery.ranged
      : this.discipline === 'defense'
        ? snapshot.mastery.survival
        : snapshot.mastery.exploration + snapshot.mastery.boss;
    const prerequisiteMet = this.prerequisite.length === 0 || (snapshot.unlockedNodes[this.prerequisite] ?? 0) > 0;
    return progressionRequirement([
      { met: snapshot.level >= this.requiredLevel, label: 'Reach level ' + this.requiredLevel, ratio: progressionRatio(snapshot.level, this.requiredLevel) },
      { met: snapshot.counters.totalKills >= this.requiredKills, label: 'Defeat ' + this.requiredKills + ' enemies', ratio: progressionRatio(snapshot.counters.totalKills, this.requiredKills) },
      { met: snapshot.counters.stagesCompleted >= this.requiredStages, label: 'Clear ' + this.requiredStages + ' stages', ratio: progressionRatio(snapshot.counters.stagesCompleted, this.requiredStages) },
      { met: masteryValue >= this.requiredMastery, label: 'Earn ' + this.requiredMastery + ' mastery', ratio: progressionRatio(masteryValue, this.requiredMastery) },
      { met: prerequisiteMet, label: 'Unlock ' + this.prerequisite, ratio: prerequisiteMet ? 1 : 0 },
    ]);
  }

  public cost(snapshot: ProgressionSnapshot): number {
    const rank = progressionNodeRank(snapshot, this.id);
    if (rank >= this.maximumRank) return 0;
    return Math.max(1, Math.ceil(this.baseCost * this.growth ** rank));
  }

  public reward(snapshot: ProgressionSnapshot): ProgressionReward {
    const rank = progressionNodeRank(snapshot, this.id);
    const rankScale = 1 + rank * 0.35;
    return {
      experience: Math.round(90 * rankScale),
      currency: Math.round(140 * rankScale),
      unlocks: ['content-defense-0111', 'lore-0111'],
      modifier: { [this.modifierKey]: this.modifierAmount * rankScale },
    };
  }

  public preview(snapshot: ProgressionSnapshot): ProgressionNodePreview {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      discipline: this.discipline,
      rarity: this.rarity,
      tier: this.tier,
      currentRank: progressionNodeRank(snapshot, this.id),
      maximumRank: this.maximumRank,
      cost: this.cost(snapshot),
      requirement: this.requirement(snapshot),
      reward: this.reward(snapshot),
    };
  }

  public apply(state: ProgressionState): ProgressionReward {
    const rank = progressionNodeRank(state, this.id);
    const requirement = this.requirement(state);
    const cost = this.cost(state);
    if (!requirement.met) throw new Error(this.id + ' requirements are not met: ' + requirement.missing.join(', '));
    if (rank >= this.maximumRank) throw new Error(this.id + ' is already at maximum rank');
    if (state.skillPoints < cost) throw new Error(this.id + ' requires ' + cost + ' skill points');
    const reward = this.reward(state);
    state.skillPoints -= cost;
    state.unlockedNodes[this.id] = rank + 1;
    state.experience += reward.experience ?? 0;
    state.lifetimeExperience += reward.experience ?? 0;
    state.currency += reward.currency ?? 0;
    addProgressionModifier(state, this.modifierKey, reward.modifier?.[this.modifierKey] ?? 0);
    for (const contentId of reward.unlocks ?? []) unlockProgressionContent(state, contentId);
    state.updatedAt = Date.now();
    return reward;
  }
}

export class ProgressionNode0112 implements ProgressionNode {
  public readonly id = 'progression-node-0112';
  public readonly title = 'Arcane Pulse H-6';
  public readonly description = 'Tier 6 arcane technique 0112 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'arcane';
  public readonly rarity: ProgressionRarity = 'rare';
  public readonly tier = 6;
  public readonly maximumRank = 2;
  private readonly requiredLevel = 38;
  private readonly requiredKills = 499;
  private readonly requiredStages = 9;
  private readonly requiredMastery = 233;
  private readonly baseCost = 4;
  private readonly growth = 1.45;
  private readonly modifierKey: keyof ProgressionModifiers = 'maximumMagicBonus';
  private readonly modifierAmount = 0.85;
  private readonly prerequisite = 'progression-node-0106';

  public requirement(snapshot: ProgressionSnapshot): ProgressionRequirementResult {
    const masteryValue = this.discipline === 'combat'
      ? snapshot.mastery.melee + snapshot.mastery.ranged
      : this.discipline === 'defense'
        ? snapshot.mastery.survival
        : snapshot.mastery.exploration + snapshot.mastery.boss;
    const prerequisiteMet = this.prerequisite.length === 0 || (snapshot.unlockedNodes[this.prerequisite] ?? 0) > 0;
    return progressionRequirement([
      { met: snapshot.level >= this.requiredLevel, label: 'Reach level ' + this.requiredLevel, ratio: progressionRatio(snapshot.level, this.requiredLevel) },
      { met: snapshot.counters.totalKills >= this.requiredKills, label: 'Defeat ' + this.requiredKills + ' enemies', ratio: progressionRatio(snapshot.counters.totalKills, this.requiredKills) },
      { met: snapshot.counters.stagesCompleted >= this.requiredStages, label: 'Clear ' + this.requiredStages + ' stages', ratio: progressionRatio(snapshot.counters.stagesCompleted, this.requiredStages) },
      { met: masteryValue >= this.requiredMastery, label: 'Earn ' + this.requiredMastery + ' mastery', ratio: progressionRatio(masteryValue, this.requiredMastery) },
      { met: prerequisiteMet, label: 'Unlock ' + this.prerequisite, ratio: prerequisiteMet ? 1 : 0 },
    ]);
  }

  public cost(snapshot: ProgressionSnapshot): number {
    const rank = progressionNodeRank(snapshot, this.id);
    if (rank >= this.maximumRank) return 0;
    return Math.max(1, Math.ceil(this.baseCost * this.growth ** rank));
  }

  public reward(snapshot: ProgressionSnapshot): ProgressionReward {
    const rank = progressionNodeRank(snapshot, this.id);
    const rankScale = 1 + rank * 0.35;
    return {
      experience: Math.round(93 * rankScale),
      currency: Math.round(145 * rankScale),
      unlocks: ['content-arcane-0112', 'lore-0112'],
      modifier: { [this.modifierKey]: this.modifierAmount * rankScale },
    };
  }

  public preview(snapshot: ProgressionSnapshot): ProgressionNodePreview {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      discipline: this.discipline,
      rarity: this.rarity,
      tier: this.tier,
      currentRank: progressionNodeRank(snapshot, this.id),
      maximumRank: this.maximumRank,
      cost: this.cost(snapshot),
      requirement: this.requirement(snapshot),
      reward: this.reward(snapshot),
    };
  }

  public apply(state: ProgressionState): ProgressionReward {
    const rank = progressionNodeRank(state, this.id);
    const requirement = this.requirement(state);
    const cost = this.cost(state);
    if (!requirement.met) throw new Error(this.id + ' requirements are not met: ' + requirement.missing.join(', '));
    if (rank >= this.maximumRank) throw new Error(this.id + ' is already at maximum rank');
    if (state.skillPoints < cost) throw new Error(this.id + ' requires ' + cost + ' skill points');
    const reward = this.reward(state);
    state.skillPoints -= cost;
    state.unlockedNodes[this.id] = rank + 1;
    state.experience += reward.experience ?? 0;
    state.lifetimeExperience += reward.experience ?? 0;
    state.currency += reward.currency ?? 0;
    addProgressionModifier(state, this.modifierKey, reward.modifier?.[this.modifierKey] ?? 0);
    for (const contentId of reward.unlocks ?? []) unlockProgressionContent(state, contentId);
    state.updatedAt = Date.now();
    return reward;
  }
}

export const ProgressionNodePack16: readonly ProgressionNode[] = [
  new ProgressionNode0106(),
  new ProgressionNode0107(),
  new ProgressionNode0108(),
  new ProgressionNode0109(),
  new ProgressionNode0110(),
  new ProgressionNode0111(),
  new ProgressionNode0112(),
];
