import { CombatantId } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';

export type ComboInput = 'light' | 'heavy' | 'ranged' | 'dodge' | 'special' | 'delay' | 'hold';

export interface ComboMove {
  id: string;
  name: string;
  sequence: ComboInput[];
  maximumGap: number;
  score: number;
  damageMultiplier: number;
  resourceReward: number;
  tags: string[];
}

export interface ComboState {
  combatantId: CombatantId;
  inputs: Array<{ input: ComboInput; time: number }>;
  hitCount: number;
  score: number;
  rank: string;
  multiplier: number;
  lastHitAt: number;
  activeMoveId?: string;
}

interface TrieNode { children: Map<ComboInput, TrieNode>; moves: ComboMove[]; }

export class ComboEngine {
  private readonly root: TrieNode = { children: new Map(), moves: [] };
  private readonly moves = new Map<string, ComboMove>();
  private readonly states = new Map<CombatantId, ComboState>();
  private readonly ranks = [
    { threshold: 0, name: 'D', multiplier: 1 },
    { threshold: 100, name: 'C', multiplier: 1.08 },
    { threshold: 250, name: 'B', multiplier: 1.16 },
    { threshold: 500, name: 'A', multiplier: 1.25 },
    { threshold: 850, name: 'S', multiplier: 1.38 },
    { threshold: 1300, name: 'SS', multiplier: 1.52 },
    { threshold: 2000, name: 'SSS', multiplier: 1.7 },
  ];

  public constructor(private readonly events: CombatEventStream, private readonly timeout = 2800) {}

  public register(move: ComboMove): void {
    if (this.moves.has(move.id)) throw new Error('combo move already registered: ' + move.id);
    if (move.sequence.length === 0) throw new Error('combo move sequence cannot be empty');
    this.moves.set(move.id, { ...move, sequence: [...move.sequence], tags: [...move.tags] });
    let node = this.root;
    for (const input of move.sequence) {
      const child = node.children.get(input) ?? { children: new Map<ComboInput, TrieNode>(), moves: [] };
      node.children.set(input, child);
      node = child;
    }
    node.moves.push(move);
  }

  public input(combatantId: CombatantId, input: ComboInput, now: number): ComboMove | undefined {
    const state = this.state(combatantId);
    if (state.inputs.length > 0 && now - state.inputs[state.inputs.length - 1].time > this.maximumGapForPrefix(state.inputs.map((entry) => entry.input))) state.inputs = [];
    state.inputs.push({ input, time: now });
    if (state.inputs.length > 12) state.inputs.shift();
    const match = this.bestMatch(state.inputs);
    if (match) {
      state.activeMoveId = match.id;
      state.score += match.score;
      this.recalculate(state);
      this.events.emit('combo-advanced', now, { moveId: match.id, score: state.score, rank: state.rank }, combatantId);
    } else if (!this.hasPrefix(state.inputs.map((entry) => entry.input))) {
      const last = state.inputs[state.inputs.length - 1];
      state.inputs = [last];
      if (!this.hasPrefix([last.input])) state.inputs = [];
    }
    return match;
  }

  public registerHit(combatantId: CombatantId, now: number, damage: number, varietyTag?: string): ComboState {
    const state = this.state(combatantId);
    const wasEmpty = state.hitCount === 0;
    state.hitCount++;
    state.lastHitAt = now;
    state.score += Math.max(1, Math.round(damage)) + Math.min(100, state.hitCount * 2) + (varietyTag ? 15 : 0);
    this.recalculate(state);
    this.events.emit(wasEmpty ? 'combo-started' : 'combo-advanced', now, { hitCount: state.hitCount, score: state.score, rank: state.rank }, combatantId);
    return this.cloneState(state);
  }

  public update(now: number): CombatantId[] {
    const broken: CombatantId[] = [];
    for (const state of this.states.values()) {
      if (state.hitCount > 0 && now - state.lastHitAt > this.timeout) { this.break(state.combatantId, now, 'timeout'); broken.push(state.combatantId); }
    }
    return broken;
  }

  public break(combatantId: CombatantId, now: number, reason: string): void {
    const state = this.state(combatantId);
    this.events.emit('combo-broken', now, { reason, finalHits: state.hitCount, finalScore: state.score, finalRank: state.rank }, combatantId);
    this.states.set(combatantId, this.emptyState(combatantId));
  }

  public finish(combatantId: CombatantId, now: number): ComboState {
    const final = this.cloneState(this.state(combatantId));
    this.events.emit('combo-finished', now, final, combatantId);
    this.states.set(combatantId, this.emptyState(combatantId));
    return final;
  }

  public get(combatantId: CombatantId): ComboState { return this.cloneState(this.state(combatantId)); }
  public damageMultiplier(combatantId: CombatantId): number { return this.state(combatantId).multiplier; }
  public listMoves(): ComboMove[] { return [...this.moves.values()].map((move) => ({ ...move, sequence: [...move.sequence], tags: [...move.tags] })); }

  private state(id: CombatantId): ComboState { const current = this.states.get(id) ?? this.emptyState(id); this.states.set(id, current); return current; }
  private emptyState(id: CombatantId): ComboState { return { combatantId: id, inputs: [], hitCount: 0, score: 0, rank: 'D', multiplier: 1, lastHitAt: 0 }; }

  private recalculate(state: ComboState): void {
    const rank = [...this.ranks].reverse().find((entry) => state.score >= entry.threshold) ?? this.ranks[0];
    state.rank = rank.name;
    state.multiplier = rank.multiplier;
  }

  private bestMatch(inputs: Array<{ input: ComboInput; time: number }>): ComboMove | undefined {
    return this.listMoves().filter((move) => move.sequence.length <= inputs.length).filter((move) => {
      const slice = inputs.slice(-move.sequence.length);
      return move.sequence.every((input, index) => input === slice[index].input) && slice.every((entry, index) => index === 0 || entry.time - slice[index - 1].time <= move.maximumGap);
    }).sort((left, right) => right.sequence.length - left.sequence.length || right.score - left.score)[0];
  }

  private hasPrefix(inputs: ComboInput[]): boolean {
    return this.listMoves().some((move) => inputs.length <= move.sequence.length && inputs.every((input, index) => move.sequence[index] === input));
  }

  private maximumGapForPrefix(inputs: ComboInput[]): number {
    return Math.max(250, ...this.listMoves().filter((move) => inputs.length <= move.sequence.length && inputs.every((input, index) => move.sequence[index] === input)).map((move) => move.maximumGap));
  }

  private cloneState(state: ComboState): ComboState { return { ...state, inputs: state.inputs.map((entry) => ({ ...entry })) }; }
}
