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

export class ProgressionNode0022 implements ProgressionNode {
  public readonly id = 'progression-node-0022';
  public readonly title = 'Arcane Pulse V-2';
  public readonly description = 'Tier 2 arcane technique 0022 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'arcane';
  public readonly rarity: ProgressionRarity = 'common';
  public readonly tier = 2;
  public readonly maximumRank = 2;
  private readonly requiredLevel = 8;
  private readonly requiredKills = 94;
  private readonly requiredStages = 1;
  private readonly requiredMastery = 44;
  private readonly baseCost = 1;
  private readonly growth = 1.18;
  private readonly modifierKey: keyof ProgressionModifiers = 'maximumMagicBonus';
  private readonly modifierAmount = 0.85;
  private readonly prerequisite = 'progression-node-0016';

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
      experience: Math.round(42 * rankScale),
      currency: Math.round(90 * rankScale),
      unlocks: ['content-arcane-0022', 'lore-0022'],
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

export class ProgressionNode0023 implements ProgressionNode {
  public readonly id = 'progression-node-0023';
  public readonly title = 'Golden Pact W-2';
  public readonly description = 'Tier 2 economy technique 0023 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'economy';
  public readonly rarity: ProgressionRarity = 'common';
  public readonly tier = 2;
  public readonly maximumRank = 3;
  private readonly requiredLevel = 8;
  private readonly requiredKills = 99;
  private readonly requiredStages = 1;
  private readonly requiredMastery = 46;
  private readonly baseCost = 1;
  private readonly growth = 1.225;
  private readonly modifierKey: keyof ProgressionModifiers = 'haloMultiplier';
  private readonly modifierAmount = 0.006;
  private readonly prerequisite = 'progression-node-0017';

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
      experience: Math.round(45 * rankScale),
      currency: Math.round(95 * rankScale),
      unlocks: ['content-economy-0023', 'lore-0023'],
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

export class ProgressionNode0024 implements ProgressionNode {
  public readonly id = 'progression-node-0024';
  public readonly title = 'Hidden Path X-2';
  public readonly description = 'Tier 2 exploration technique 0024 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'exploration';
  public readonly rarity: ProgressionRarity = 'common';
  public readonly tier = 2;
  public readonly maximumRank = 4;
  private readonly requiredLevel = 8;
  private readonly requiredKills = 103;
  private readonly requiredStages = 1;
  private readonly requiredMastery = 48;
  private readonly baseCost = 1;
  private readonly growth = 1.27;
  private readonly modifierKey: keyof ProgressionModifiers = 'lootLuck';
  private readonly modifierAmount = 1.15;
  private readonly prerequisite = 'progression-node-0018';

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
      experience: Math.round(48 * rankScale),
      currency: Math.round(100 * rankScale),
      unlocks: ['content-exploration-0024', 'lore-0024'],
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

export class ProgressionNode0025 implements ProgressionNode {
  public readonly id = 'progression-node-0025';
  public readonly title = 'Witch Art Y-2';
  public readonly description = 'Tier 2 combat technique 0025 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'combat';
  public readonly rarity: ProgressionRarity = 'common';
  public readonly tier = 2;
  public readonly maximumRank = 5;
  private readonly requiredLevel = 9;
  private readonly requiredKills = 108;
  private readonly requiredStages = 2;
  private readonly requiredMastery = 50;
  private readonly baseCost = 1;
  private readonly growth = 1.315;
  private readonly modifierKey: keyof ProgressionModifiers = 'damageMultiplier';
  private readonly modifierAmount = 0.009;
  private readonly prerequisite = 'progression-node-0019';

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
      experience: Math.round(51 * rankScale),
      currency: Math.round(105 * rankScale),
      unlocks: ['content-combat-0025', 'lore-0025'],
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

export class ProgressionNode0026 implements ProgressionNode {
  public readonly id = 'progression-node-0026';
  public readonly title = 'Moon Step Z-2';
  public readonly description = 'Tier 2 mobility technique 0026 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'mobility';
  public readonly rarity: ProgressionRarity = 'common';
  public readonly tier = 2;
  public readonly maximumRank = 1;
  private readonly requiredLevel = 9;
  private readonly requiredKills = 112;
  private readonly requiredStages = 2;
  private readonly requiredMastery = 52;
  private readonly baseCost = 1;
  private readonly growth = 1.36;
  private readonly modifierKey: keyof ProgressionModifiers = 'movementMultiplier';
  private readonly modifierAmount = 0.0105;
  private readonly prerequisite = 'progression-node-0020';

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
      experience: Math.round(54 * rankScale),
      currency: Math.round(110 * rankScale),
      unlocks: ['content-mobility-0026', 'lore-0026'],
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

export class ProgressionNode0027 implements ProgressionNode {
  public readonly id = 'progression-node-0027';
  public readonly title = 'Iron Heart A-2';
  public readonly description = 'Tier 2 defense technique 0027 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'defense';
  public readonly rarity: ProgressionRarity = 'common';
  public readonly tier = 2;
  public readonly maximumRank = 2;
  private readonly requiredLevel = 9;
  private readonly requiredKills = 117;
  private readonly requiredStages = 2;
  private readonly requiredMastery = 54;
  private readonly baseCost = 1;
  private readonly growth = 1.405;
  private readonly modifierKey: keyof ProgressionModifiers = 'defenseMultiplier';
  private readonly modifierAmount = 0.012;
  private readonly prerequisite = 'progression-node-0021';

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
      experience: Math.round(57 * rankScale),
      currency: Math.round(50 * rankScale),
      unlocks: ['content-defense-0027', 'lore-0027'],
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

export class ProgressionNode0028 implements ProgressionNode {
  public readonly id = 'progression-node-0028';
  public readonly title = 'Arcane Pulse B-2';
  public readonly description = 'Tier 2 arcane technique 0028 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'arcane';
  public readonly rarity: ProgressionRarity = 'common';
  public readonly tier = 2;
  public readonly maximumRank = 3;
  private readonly requiredLevel = 10;
  private readonly requiredKills = 121;
  private readonly requiredStages = 2;
  private readonly requiredMastery = 56;
  private readonly baseCost = 1;
  private readonly growth = 1.45;
  private readonly modifierKey: keyof ProgressionModifiers = 'maximumMagicBonus';
  private readonly modifierAmount = 0.4;
  private readonly prerequisite = 'progression-node-0022';

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
      experience: Math.round(60 * rankScale),
      currency: Math.round(55 * rankScale),
      unlocks: ['content-arcane-0028', 'lore-0028'],
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

export const ProgressionNodePack04: readonly ProgressionNode[] = [
  new ProgressionNode0022(),
  new ProgressionNode0023(),
  new ProgressionNode0024(),
  new ProgressionNode0025(),
  new ProgressionNode0026(),
  new ProgressionNode0027(),
  new ProgressionNode0028(),
];
