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

export class ProgressionNode0169 implements ProgressionNode {
  public readonly id = 'progression-node-0169';
  public readonly title = 'Witch Art M-9';
  public readonly description = 'Tier 9 combat technique 0169 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'combat';
  public readonly rarity: ProgressionRarity = 'legendary';
  public readonly tier = 9;
  public readonly maximumRank = 4;
  private readonly requiredLevel = 57;
  private readonly requiredKills = 756;
  private readonly requiredStages = 14;
  private readonly requiredMastery = 352;
  private readonly baseCost = 7;
  private readonly growth = 1.18;
  private readonly modifierKey: keyof ProgressionModifiers = 'damageMultiplier';
  private readonly modifierAmount = 0.0105;
  private readonly prerequisite = 'progression-node-0163';

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
      experience: Math.round(138 * rankScale),
      currency: Math.round(215 * rankScale),
      unlocks: ['content-combat-0169', 'lore-0169'],
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

export class ProgressionNode0170 implements ProgressionNode {
  public readonly id = 'progression-node-0170';
  public readonly title = 'Moon Step N-9';
  public readonly description = 'Tier 9 mobility technique 0170 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'mobility';
  public readonly rarity: ProgressionRarity = 'legendary';
  public readonly tier = 9;
  public readonly maximumRank = 5;
  private readonly requiredLevel = 57;
  private readonly requiredKills = 760;
  private readonly requiredStages = 14;
  private readonly requiredMastery = 354;
  private readonly baseCost = 7;
  private readonly growth = 1.225;
  private readonly modifierKey: keyof ProgressionModifiers = 'movementMultiplier';
  private readonly modifierAmount = 0.012;
  private readonly prerequisite = 'progression-node-0164';

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
      experience: Math.round(141 * rankScale),
      currency: Math.round(155 * rankScale),
      unlocks: ['content-mobility-0170', 'lore-0170'],
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

export class ProgressionNode0171 implements ProgressionNode {
  public readonly id = 'progression-node-0171';
  public readonly title = 'Iron Heart O-9';
  public readonly description = 'Tier 9 defense technique 0171 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'defense';
  public readonly rarity: ProgressionRarity = 'legendary';
  public readonly tier = 9;
  public readonly maximumRank = 1;
  private readonly requiredLevel = 57;
  private readonly requiredKills = 765;
  private readonly requiredStages = 14;
  private readonly requiredMastery = 357;
  private readonly baseCost = 7;
  private readonly growth = 1.27;
  private readonly modifierKey: keyof ProgressionModifiers = 'defenseMultiplier';
  private readonly modifierAmount = 0.0135;
  private readonly prerequisite = 'progression-node-0165';

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
      currency: Math.round(160 * rankScale),
      unlocks: ['content-defense-0171', 'lore-0171'],
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

export class ProgressionNode0172 implements ProgressionNode {
  public readonly id = 'progression-node-0172';
  public readonly title = 'Arcane Pulse P-9';
  public readonly description = 'Tier 9 arcane technique 0172 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'arcane';
  public readonly rarity: ProgressionRarity = 'legendary';
  public readonly tier = 9;
  public readonly maximumRank = 2;
  private readonly requiredLevel = 58;
  private readonly requiredKills = 769;
  private readonly requiredStages = 14;
  private readonly requiredMastery = 359;
  private readonly baseCost = 7;
  private readonly growth = 1.315;
  private readonly modifierKey: keyof ProgressionModifiers = 'maximumMagicBonus';
  private readonly modifierAmount = 0.4;
  private readonly prerequisite = 'progression-node-0166';

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
      experience: Math.round(96 * rankScale),
      currency: Math.round(165 * rankScale),
      unlocks: ['content-arcane-0172', 'lore-0172'],
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

export class ProgressionNode0173 implements ProgressionNode {
  public readonly id = 'progression-node-0173';
  public readonly title = 'Golden Pact Q-9';
  public readonly description = 'Tier 9 economy technique 0173 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'economy';
  public readonly rarity: ProgressionRarity = 'legendary';
  public readonly tier = 9;
  public readonly maximumRank = 3;
  private readonly requiredLevel = 58;
  private readonly requiredKills = 774;
  private readonly requiredStages = 14;
  private readonly requiredMastery = 361;
  private readonly baseCost = 7;
  private readonly growth = 1.36;
  private readonly modifierKey: keyof ProgressionModifiers = 'haloMultiplier';
  private readonly modifierAmount = 0.0165;
  private readonly prerequisite = 'progression-node-0167';

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
      experience: Math.round(99 * rankScale),
      currency: Math.round(170 * rankScale),
      unlocks: ['content-economy-0173', 'lore-0173'],
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

export class ProgressionNode0174 implements ProgressionNode {
  public readonly id = 'progression-node-0174';
  public readonly title = 'Hidden Path R-9';
  public readonly description = 'Tier 9 exploration technique 0174 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'exploration';
  public readonly rarity: ProgressionRarity = 'legendary';
  public readonly tier = 9;
  public readonly maximumRank = 4;
  private readonly requiredLevel = 58;
  private readonly requiredKills = 778;
  private readonly requiredStages = 14;
  private readonly requiredMastery = 363;
  private readonly baseCost = 7;
  private readonly growth = 1.405;
  private readonly modifierKey: keyof ProgressionModifiers = 'lootLuck';
  private readonly modifierAmount = 0.7;
  private readonly prerequisite = 'progression-node-0168';

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
      experience: Math.round(102 * rankScale),
      currency: Math.round(175 * rankScale),
      unlocks: ['content-exploration-0174', 'lore-0174'],
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

export class ProgressionNode0175 implements ProgressionNode {
  public readonly id = 'progression-node-0175';
  public readonly title = 'Witch Art S-9';
  public readonly description = 'Tier 9 combat technique 0175 that evolves combat statistics and unlocks authored encounter content.';
  public readonly discipline: ProgressionDiscipline = 'combat';
  public readonly rarity: ProgressionRarity = 'legendary';
  public readonly tier = 9;
  public readonly maximumRank = 5;
  private readonly requiredLevel = 59;
  private readonly requiredKills = 783;
  private readonly requiredStages = 14;
  private readonly requiredMastery = 365;
  private readonly baseCost = 7;
  private readonly growth = 1.45;
  private readonly modifierKey: keyof ProgressionModifiers = 'damageMultiplier';
  private readonly modifierAmount = 0.0195;
  private readonly prerequisite = 'progression-node-0169';

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
      experience: Math.round(105 * rankScale),
      currency: Math.round(180 * rankScale),
      unlocks: ['content-combat-0175', 'lore-0175'],
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

export const ProgressionNodePack25: readonly ProgressionNode[] = [
  new ProgressionNode0169(),
  new ProgressionNode0170(),
  new ProgressionNode0171(),
  new ProgressionNode0172(),
  new ProgressionNode0173(),
  new ProgressionNode0174(),
  new ProgressionNode0175(),
];
