import { Ability, CombatantSnapshot, Vec2, distance } from '../core/types';

export interface CombatDecisionContext {
  actor: CombatantSnapshot;
  allies: CombatantSnapshot[];
  enemies: CombatantSnapshot[];
  abilities: Ability[];
  cooldownReady: (abilityId: string) => boolean;
  targetPosition?: Vec2;
}

export interface ScoredCombatDecision {
  abilityId: string;
  targetId?: string;
  targetPosition: Vec2;
  score: number;
  factors: Array<{ name: string; value: number }>;
}

export class CombatDecisionScorer {
  public score(context: CombatDecisionContext): ScoredCombatDecision[] {
    const decisions: ScoredCombatDecision[] = [];
    for (const ability of context.abilities) {
      if (!context.cooldownReady(ability.definition.id)) continue;
      if (!this.canAfford(context.actor, ability)) continue;
      const targets = this.targetsFor(ability, context);
      if (targets.length === 0 && ability.definition.targeting !== 'self' && ability.definition.targeting !== 'summon') continue;
      if (ability.definition.targeting === 'self' || ability.definition.targeting === 'summon') {
        decisions.push(this.evaluate(ability, context.actor, context.actor, context));
      } else {
        for (const target of targets) decisions.push(this.evaluate(ability, context.actor, target, context));
      }
    }
    return decisions.sort((left, right) => right.score - left.score || left.abilityId.localeCompare(right.abilityId));
  }

  public best(context: CombatDecisionContext): ScoredCombatDecision | undefined { return this.score(context)[0]; }

  private evaluate(ability: Ability, actor: CombatantSnapshot, target: CombatantSnapshot, context: CombatDecisionContext): ScoredCombatDecision {
    const definition = ability.definition;
    const factors: Array<{ name: string; value: number }> = [];
    const targetDistance = distance(actor.position, target.position);
    const rangeFit = definition.range <= 0 ? 1 : Math.max(-1, 1 - Math.abs(targetDistance - definition.range * 0.65) / definition.range);
    factors.push({ name: 'range-fit', value: rangeFit * 30 });
    const expectedDamage = definition.baseDamage + (definition.damageType === 'physical' ? actor.stats.attackPower : actor.stats.spellPower) * definition.powerRatio;
    factors.push({ name: 'expected-damage', value: Math.min(80, expectedDamage * 0.35) });
    const healthRatio = target.stats.maximumHealth <= 0 ? 0 : target.resources.health / target.stats.maximumHealth;
    factors.push({ name: 'execute-pressure', value: healthRatio < 0.25 ? 35 : (1 - healthRatio) * 10 });
    const actorHealth = actor.resources.health / Math.max(1, actor.stats.maximumHealth);
    if (definition.targeting === 'self') factors.push({ name: 'self-preservation', value: (1 - actorHealth) * 65 });
    if (definition.category === 'ultimate') factors.push({ name: 'ultimate-conservation', value: context.enemies.length >= 3 || healthRatio < 0.2 ? 25 : -30 });
    if (definition.targeting === 'circle' || definition.targeting === 'cone' || definition.targeting === 'ring') {
      const nearby = context.enemies.filter((enemy) => distance(target.position, enemy.position) <= definition.radius).length;
      factors.push({ name: 'area-targets', value: nearby * 16 });
    }
    if (target.tags.includes('vulnerable-' + definition.damageType)) factors.push({ name: 'typed-vulnerability', value: 24 });
    if (target.tags.includes('fortified')) factors.push({ name: 'fortified-target', value: -12 });
    const cost = definition.costs.reduce((sum, entry) => sum + entry.amount, 0);
    factors.push({ name: 'resource-efficiency', value: -cost * 0.35 });
    const castRisk = definition.castTime / 1000 * (actorHealth < 0.35 ? -24 : -8);
    factors.push({ name: 'cast-risk', value: castRisk });
    const score = factors.reduce((sum, factor) => sum + factor.value, 0);
    return { abilityId: definition.id, targetId: definition.targeting === 'self' ? actor.id : target.id, targetPosition: { ...target.position }, score, factors };
  }

  private targetsFor(ability: Ability, context: CombatDecisionContext): CombatantSnapshot[] {
    const definition = ability.definition;
    const candidates = definition.targeting === 'self' ? context.allies : context.enemies;
    return candidates.filter((target) => target.alive && distance(context.actor.position, target.position) <= definition.range + definition.radius)
      .sort((left, right) => distance(context.actor.position, left.position) - distance(context.actor.position, right.position));
  }

  private canAfford(actor: CombatantSnapshot, ability: Ability): boolean {
    return ability.definition.costs.every((cost) => {
      const required = cost.percentage ? actor.resources[cost.resource] * cost.amount : cost.amount;
      return actor.resources[cost.resource] >= required;
    });
  }
}
