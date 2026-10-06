import {
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
