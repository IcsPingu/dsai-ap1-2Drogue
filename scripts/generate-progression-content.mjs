import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const output = path.join(root, 'src', 'progression', 'generated');
const nodeCount = 210;
const nodesPerPack = 7;
const disciplines = ['combat', 'mobility', 'defense', 'arcane', 'economy', 'exploration'];
const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const titles = ['Witch Art', 'Moon Step', 'Iron Heart', 'Arcane Pulse', 'Golden Pact', 'Hidden Path'];
const modifierByDiscipline = {
  combat: 'damageMultiplier',
  mobility: 'movementMultiplier',
  defense: 'defenseMultiplier',
  arcane: 'maximumMagicBonus',
  economy: 'haloMultiplier',
  exploration: 'lootLuck',
};

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

function write(relative, source) {
  const target = path.join(output, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, source.endsWith('\n') ? source : `${source}\n`);
}

function fixed(value) {
  return Number(value.toFixed(4));
}

write('helpers.ts', `import {
  ProgressionModifiers,
  ProgressionRequirementResult,
  ProgressionState,
} from '../types';

export function progressionClamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

export function progressionRatio(current: number, target: number): number {
  if (target <= 0) return 1;
  return progressionClamp(current / target, 0, 1);
}

export function progressionRequirement(
  checks: ReadonlyArray<{ met: boolean; label: string; ratio: number }>,
): ProgressionRequirementResult {
  const missing = checks.filter((check) => !check.met).map((check) => check.label);
  const progress = checks.length === 0
    ? 1
    : checks.reduce((total, check) => total + progressionClamp(check.ratio, 0, 1), 0) / checks.length;
  return { met: missing.length === 0, missing, progress };
}

export function addProgressionModifier(
  state: ProgressionState,
  key: keyof ProgressionModifiers,
  amount: number,
): void {
  state.modifiers[key] += amount;
}

export function progressionNodeRank(state: ProgressionState, nodeId: string): number {
  return Math.max(0, Math.floor(state.unlockedNodes[nodeId] ?? 0));
}

export function unlockProgressionContent(state: ProgressionState, contentId: string): void {
  if (!state.unlockedContent.includes(contentId)) state.unlockedContent.push(contentId);
}
`);

function nodeSource(index) {
  const serial = index + 1;
  const padded = String(serial).padStart(4, '0');
  const disciplineIndex = index % disciplines.length;
  const discipline = disciplines[disciplineIndex];
  const rarity = rarities[Math.min(rarities.length - 1, Math.floor(index / 42))];
  const tier = 1 + Math.floor(index / 21);
  const maxRank = 1 + (index % 5);
  const requiredLevel = 1 + Math.floor(index / 3);
  const requiredKills = Math.floor(index * 4.5);
  const requiredStages = Math.floor(index / 12);
  const requiredMastery = Math.floor(index * 2.1);
  const baseCost = 1 + Math.floor(index / 28);
  const growth = fixed(1.18 + (index % 7) * 0.045);
  const modifierKey = modifierByDiscipline[discipline];
  const modifierAmount = modifierKey.includes('Bonus') || modifierKey === 'lootLuck'
    ? fixed(0.4 + (index % 9) * 0.15)
    : fixed(0.006 + (index % 11) * 0.0015);
  const currencyReward = 20 + tier * 15 + (index % 13) * 5;
  const experienceReward = 12 + tier * 9 + (index % 17) * 3;
  const prerequisiteIndex = index >= disciplines.length ? index - disciplines.length + 1 : 0;
  const prerequisite = prerequisiteIndex > 0 ? `progression-node-${String(prerequisiteIndex).padStart(4, '0')}` : '';
  const title = `${titles[disciplineIndex]} ${String.fromCharCode(65 + (index % 26))}-${tier}`;
  const description = `Tier ${tier} ${discipline} technique ${padded} that evolves combat statistics and unlocks authored encounter content.`;

  return `export class ProgressionNode${padded} implements ProgressionNode {
  public readonly id = 'progression-node-${padded}';
  public readonly title = '${title}';
  public readonly description = '${description}';
  public readonly discipline: ProgressionDiscipline = '${discipline}';
  public readonly rarity: ProgressionRarity = '${rarity}';
  public readonly tier = ${tier};
  public readonly maximumRank = ${maxRank};
  private readonly requiredLevel = ${requiredLevel};
  private readonly requiredKills = ${requiredKills};
  private readonly requiredStages = ${requiredStages};
  private readonly requiredMastery = ${requiredMastery};
  private readonly baseCost = ${baseCost};
  private readonly growth = ${growth};
  private readonly modifierKey: keyof ProgressionModifiers = '${modifierKey}';
  private readonly modifierAmount = ${modifierAmount};
  private readonly prerequisite = '${prerequisite}';

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
      experience: Math.round(${experienceReward} * rankScale),
      currency: Math.round(${currencyReward} * rankScale),
      unlocks: ['content-${discipline}-${padded}', 'lore-${padded}'],
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
}`;
}

const packNames = [];
for (let start = 0; start < nodeCount; start += nodesPerPack) {
  const packNumber = Math.floor(start / nodesPerPack) + 1;
  const packName = `ProgressionNodePack${String(packNumber).padStart(2, '0')}`;
  packNames.push(packName);
  const classNames = [];
  const blocks = [];
  for (let index = start; index < Math.min(nodeCount, start + nodesPerPack); index++) {
    const className = `ProgressionNode${String(index + 1).padStart(4, '0')}`;
    classNames.push(className);
    blocks.push(nodeSource(index));
  }
  write(`nodes/${packName}.ts`, `// Auto-generated progression content pack.
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

${blocks.join('\n\n')}

export const ${packName}: readonly ProgressionNode[] = [
${classNames.map((name) => `  new ${name}(),`).join('\n')}
];
`);
}

const imports = packNames.map((name) => `import { ${name} } from './nodes/${name}';`).join('\n');
const spreads = packNames.map((name) => `  ...${name},`).join('\n');
write('catalog.ts', `import { ProgressionNode } from '../types';
${imports}

export const GENERATED_PROGRESSION_NODES: readonly ProgressionNode[] = [
${spreads}
];

export const GENERATED_PROGRESSION_NODE_COUNT = GENERATED_PROGRESSION_NODES.length;
`);

write('GeneratedContentDirector.ts', `import {
  ProgressionDiscipline,
  ProgressionNode,
  ProgressionNodePreview,
  ProgressionReward,
  ProgressionSnapshot,
  ProgressionState,
} from '../types';
import { GENERATED_PROGRESSION_NODES } from './catalog';

export class GeneratedContentDirector {
  private readonly byId = new Map<string, ProgressionNode>();

  public constructor(private readonly nodes: readonly ProgressionNode[] = GENERATED_PROGRESSION_NODES) {
    for (const node of nodes) {
      if (this.byId.has(node.id)) throw new Error('duplicate progression node: ' + node.id);
      this.byId.set(node.id, node);
    }
  }

  public get size(): number {
    return this.nodes.length;
  }

  public get(id: string): ProgressionNode | undefined {
    return this.byId.get(id);
  }

  public forDiscipline(discipline: ProgressionDiscipline): ProgressionNode[] {
    return this.nodes.filter((node) => node.discipline === discipline);
  }

  public available(snapshot: ProgressionSnapshot): ProgressionNodePreview[] {
    return this.nodes
      .filter((node) => (snapshot.unlockedNodes[node.id] ?? 0) < node.maximumRank)
      .map((node) => node.preview(snapshot))
      .filter((preview) => preview.requirement.met && preview.cost <= snapshot.skillPoints)
      .sort((left, right) => left.tier - right.tier || left.cost - right.cost || left.id.localeCompare(right.id));
  }

  public upcoming(snapshot: ProgressionSnapshot, limit = 12): ProgressionNodePreview[] {
    return this.nodes
      .filter((node) => (snapshot.unlockedNodes[node.id] ?? 0) < node.maximumRank)
      .map((node) => node.preview(snapshot))
      .sort((left, right) => right.requirement.progress - left.requirement.progress || left.tier - right.tier)
      .slice(0, Math.max(0, limit));
  }

  public recommend(snapshot: ProgressionSnapshot, preferred?: ProgressionDiscipline): ProgressionNodePreview | undefined {
    const available = this.available(snapshot);
    const pool = preferred ? available.filter((node) => node.discipline === preferred) : available;
    const candidates = pool.length > 0 ? pool : available;
    return candidates.sort((left, right) => {
      const leftRank = this.rarityWeight(left.rarity) + left.tier * 0.2 - left.cost * 0.08;
      const rightRank = this.rarityWeight(right.rarity) + right.tier * 0.2 - right.cost * 0.08;
      return rightRank - leftRank || left.id.localeCompare(right.id);
    })[0];
  }

  public unlock(state: ProgressionState, id: string): ProgressionReward {
    const node = this.byId.get(id);
    if (!node) throw new RangeError('unknown progression node: ' + id);
    return node.apply(state);
  }

  public autoUnlock(state: ProgressionState, maximum = 1): string[] {
    const unlocked: string[] = [];
    for (let count = 0; count < maximum; count++) {
      const next = this.recommend(state);
      if (!next) break;
      this.unlock(state, next.id);
      unlocked.push(next.id);
    }
    return unlocked;
  }

  private rarityWeight(rarity: ProgressionNodePreview['rarity']): number {
    switch (rarity) {
      case 'legendary': return 5;
      case 'epic': return 4;
      case 'rare': return 3;
      case 'uncommon': return 2;
      default: return 1;
    }
  }
}
`);

write('index.ts', `export * from './helpers';
export * from './catalog';
export * from './GeneratedContentDirector';
`);

console.log(`Generated ${nodeCount} progression nodes in ${packNames.length} content packs.`);
