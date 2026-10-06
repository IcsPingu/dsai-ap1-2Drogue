import { GENERATED_TACTICAL_RULES } from './catalog';
import {
  GeneratedTacticalContext,
  GeneratedTacticalDecision,
  GeneratedTacticalRule,
  generatedFallback,
  generatedHash,
} from './types';

export interface TacticalDirectorDiagnostics {
  evaluations: number;
  accepted: number;
  rejected: number;
  lastRuleId?: string;
}

export class GeneratedTacticalDirector {
  private evaluations = 0;
  private accepted = 0;
  private rejected = 0;
  private lastRuleId?: string;

  public constructor(private readonly rules: readonly GeneratedTacticalRule[] = GENERATED_TACTICAL_RULES) {
    if (rules.length === 0) throw new RangeError('generated tactical director requires at least one rule');
  }

  public decide(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const candidates = this.candidates(context);
    let best: GeneratedTacticalDecision | undefined;
    for (const rule of candidates) {
      this.evaluations++;
      if (!rule.supports(context)) {
        this.rejected++;
        continue;
      }
      this.accepted++;
      const decision = rule.evaluate(context);
      if (!best || decision.score > best.score || (decision.score === best.score && decision.ruleId < best.ruleId)) {
        best = decision;
      }
    }
    const result = best ?? generatedFallback(context);
    this.lastRuleId = result.ruleId;
    return result;
  }

  public diagnostics(): TacticalDirectorDiagnostics {
    return {
      evaluations: this.evaluations,
      accepted: this.accepted,
      rejected: this.rejected,
      lastRuleId: this.lastRuleId,
    };
  }

  public resetDiagnostics(): void {
    this.evaluations = 0;
    this.accepted = 0;
    this.rejected = 0;
    this.lastRuleId = undefined;
  }

  private candidates(context: GeneratedTacticalContext): GeneratedTacticalRule[] {
    const roleOffset = context.role === 'melee' ? 11 : context.role === 'ranged' ? 97 : 211;
    const stateOffset = context.state.length * 23;
    const spatialOffset = Math.floor(context.self.x / 32) * 17 + Math.floor(context.self.y / 32) * 31;
    const seed = generatedHash(context.actorId * 131 + roleOffset + stateOffset + spatialOffset);
    const result: GeneratedTacticalRule[] = [];
    const seen = new Set<number>();
    for (let probe = 0; probe < 72 && result.length < 18; probe++) {
      const index = generatedHash(seed + probe * 0x9e3779b1) % this.rules.length;
      if (seen.has(index)) continue;
      seen.add(index);
      const rule = this.rules[index];
      if (rule.role === context.role && (rule.state === context.state || rule.state === 'chase' || rule.state === 'engage')) {
        result.push(rule);
      }
    }
    if (result.length === 0) {
      for (const rule of this.rules) {
        if (rule.role === context.role && rule.state === context.state) result.push(rule);
        if (result.length >= 18) break;
      }
    }
    return result;
  }
}
