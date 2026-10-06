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

export class ProgressionNode0148 implements ProgressionNode {
  public readonly id = 'progression-node-0148';
  public readonly title = 'Arcane Pulse R-8';
  public readonly description = 'Tier 8 arcane technique 0148 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'arcane';
  public readonly rarity: ProgressionRarity = 'epic';
  public readonly tier = 8;
  public readonly maximumRank = 3;
  private readonly requiredLevel = 50;
  private readonly requiredKills = 661;
  private readonly requiredStages = 12;
  private readonly requiredMastery = 308;
  private readonly baseCost = 6;
  private readonly growth = 1.18;
  private readonly modifierKey: keyof ProgressionModifiers = 'maximumMagicBonus';
  private readonly modifierAmount = 0.85;
  private readonly prerequisite = 'progression-node-0142';

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
      experience: Math.round(117 * rankScale),
      currency: Math.round(160 * rankScale),
      unlocks: ['content-arcane-0148', 'lore-0148'],
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

export class ProgressionNode0149 implements ProgressionNode {
  public readonly id = 'progression-node-0149';
  public readonly title = 'Golden Pact S-8';
  public readonly description = 'Tier 8 economy technique 0149 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'economy';
  public readonly rarity: ProgressionRarity = 'epic';
  public readonly tier = 8;
  public readonly maximumRank = 4;
  private readonly requiredLevel = 50;
  private readonly requiredKills = 666;
  private readonly requiredStages = 12;
  private readonly requiredMastery = 310;
  private readonly baseCost = 6;
  private readonly growth = 1.225;
  private readonly modifierKey: keyof ProgressionModifiers = 'haloMultiplier';
  private readonly modifierAmount = 0.0135;
  private readonly prerequisite = 'progression-node-0143';

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
      experience: Math.round(120 * rankScale),
      currency: Math.round(165 * rankScale),
      unlocks: ['content-economy-0149', 'lore-0149'],
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

export class ProgressionNode0150 implements ProgressionNode {
  public readonly id = 'progression-node-0150';
  public readonly title = 'Hidden Path T-8';
  public readonly description = 'Tier 8 exploration technique 0150 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'exploration';
  public readonly rarity: ProgressionRarity = 'epic';
  public readonly tier = 8;
  public readonly maximumRank = 5;
  private readonly requiredLevel = 50;
  private readonly requiredKills = 670;
  private readonly requiredStages = 12;
  private readonly requiredMastery = 312;
  private readonly baseCost = 6;
  private readonly growth = 1.27;
  private readonly modifierKey: keyof ProgressionModifiers = 'lootLuck';
  private readonly modifierAmount = 1.15;
  private readonly prerequisite = 'progression-node-0144';

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
      experience: Math.round(123 * rankScale),
      currency: Math.round(170 * rankScale),
      unlocks: ['content-exploration-0150', 'lore-0150'],
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

export class ProgressionNode0151 implements ProgressionNode {
  public readonly id = 'progression-node-0151';
  public readonly title = 'Witch Art U-8';
  public readonly description = 'Tier 8 combat technique 0151 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'combat';
  public readonly rarity: ProgressionRarity = 'epic';
  public readonly tier = 8;
  public readonly maximumRank = 1;
  private readonly requiredLevel = 51;
  private readonly requiredKills = 675;
  private readonly requiredStages = 12;
  private readonly requiredMastery = 315;
  private readonly baseCost = 6;
  private readonly growth = 1.315;
  private readonly modifierKey: keyof ProgressionModifiers = 'damageMultiplier';
  private readonly modifierAmount = 0.0165;
  private readonly prerequisite = 'progression-node-0145';

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
      experience: Math.round(126 * rankScale),
      currency: Math.round(175 * rankScale),
      unlocks: ['content-combat-0151', 'lore-0151'],
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

export class ProgressionNode0152 implements ProgressionNode {
  public readonly id = 'progression-node-0152';
  public readonly title = 'Moon Step V-8';
  public readonly description = 'Tier 8 mobility technique 0152 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'mobility';
  public readonly rarity: ProgressionRarity = 'epic';
  public readonly tier = 8;
  public readonly maximumRank = 2;
  private readonly requiredLevel = 51;
  private readonly requiredKills = 679;
  private readonly requiredStages = 12;
  private readonly requiredMastery = 317;
  private readonly baseCost = 6;
  private readonly growth = 1.36;
  private readonly modifierKey: keyof ProgressionModifiers = 'movementMultiplier';
  private readonly modifierAmount = 0.018;
  private readonly prerequisite = 'progression-node-0146';

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
      experience: Math.round(129 * rankScale),
      currency: Math.round(180 * rankScale),
      unlocks: ['content-mobility-0152', 'lore-0152'],
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

export class ProgressionNode0153 implements ProgressionNode {
  public readonly id = 'progression-node-0153';
  public readonly title = 'Iron Heart W-8';
  public readonly description = 'Tier 8 defense technique 0153 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'defense';
  public readonly rarity: ProgressionRarity = 'epic';
  public readonly tier = 8;
  public readonly maximumRank = 3;
  private readonly requiredLevel = 51;
  private readonly requiredKills = 684;
  private readonly requiredStages = 12;
  private readonly requiredMastery = 319;
  private readonly baseCost = 6;
  private readonly growth = 1.405;
  private readonly modifierKey: keyof ProgressionModifiers = 'defenseMultiplier';
  private readonly modifierAmount = 0.0195;
  private readonly prerequisite = 'progression-node-0147';

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
      experience: Math.round(132 * rankScale),
      currency: Math.round(185 * rankScale),
      unlocks: ['content-defense-0153', 'lore-0153'],
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

export class ProgressionNode0154 implements ProgressionNode {
  public readonly id = 'progression-node-0154';
  public readonly title = 'Arcane Pulse X-8';
  public readonly description = 'Tier 8 arcane technique 0154 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'arcane';
  public readonly rarity: ProgressionRarity = 'epic';
  public readonly tier = 8;
  public readonly maximumRank = 4;
  private readonly requiredLevel = 52;
  private readonly requiredKills = 688;
  private readonly requiredStages = 12;
  private readonly requiredMastery = 321;
  private readonly baseCost = 6;
  private readonly growth = 1.45;
  private readonly modifierKey: keyof ProgressionModifiers = 'maximumMagicBonus';
  private readonly modifierAmount = 0.4;
  private readonly prerequisite = 'progression-node-0148';

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
      currency: Math.round(190 * rankScale),
      unlocks: ['content-arcane-0154', 'lore-0154'],
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

export const ProgressionNodePack22: readonly ProgressionNode[] = [
  new ProgressionNode0148(),
  new ProgressionNode0149(),
  new ProgressionNode0150(),
  new ProgressionNode0151(),
  new ProgressionNode0152(),
  new ProgressionNode0153(),
  new ProgressionNode0154(),
];
