import { DeterministicRandom } from '../../simulation/core/DeterministicRandom';
import { Combatant } from '../core/Combatant';
import { AppliedModifier, DamagePacket, DamageResult, DamageType, HealPacket, HealResult, clamp } from '../core/types';

export interface DamageHookContext {
  packet: DamagePacket;
  source: Combatant;
  target: Combatant;
  amount: number;
  modifiers: AppliedModifier[];
}

export interface DamageHook {
  id: string;
  priority: number;
  phase: 'before-power' | 'after-power' | 'before-mitigation' | 'after-mitigation' | 'before-apply';
  apply(context: DamageHookContext): number;
}

export class DamagePipeline {
  private readonly hooks = new Map<string, DamageHook>();

  public addHook(hook: DamageHook): void { this.hooks.set(hook.id, hook); }
  public removeHook(id: string): boolean { return this.hooks.delete(id); }
  public clearHooks(): void { this.hooks.clear(); }

  public resolve(packet: DamagePacket, source: Combatant, target: Combatant, random: DeterministicRandom): DamageResult {
    const sourceSnapshot = source.snapshot();
    const targetSnapshot = target.snapshot();
    const modifiers: AppliedModifier[] = [];
    if (!sourceSnapshot.alive || !targetSnapshot.alive) return this.empty(packet.baseAmount);
    if (target.tags.has('invulnerable') && !packet.tags.includes('bypass-invulnerability')) return this.empty(packet.baseAmount);
    if (packet.canBlock && random.boolean(targetSnapshot.stats.dodgeChance) && !packet.tags.includes('undodgeable')) {
      return { ...this.empty(packet.baseAmount), dodged: true };
    }
    let amount = Math.max(0, packet.baseAmount);
    amount = this.runHooks('before-power', amount, packet, source, target, modifiers);
    const power = this.powerFor(packet.damageType, sourceSnapshot.stats.attackPower, sourceSnapshot.stats.spellPower);
    amount = this.modify(amount, amount + power * packet.powerRatio, 'power-scaling', 'add', power * packet.powerRatio, modifiers);
    amount = this.runHooks('after-power', amount, packet, source, target, modifiers);
    const critical = packet.canCrit && random.boolean(sourceSnapshot.stats.criticalChance) && !packet.tags.includes('cannot-crit');
    if (critical) amount = this.modify(amount, amount * sourceSnapshot.stats.criticalMultiplier, 'critical-hit', 'multiply', sourceSnapshot.stats.criticalMultiplier, modifiers);
    amount = this.applyVulnerabilityTags(amount, packet.damageType, target, modifiers);
    const amplified = amount;
    amount = this.runHooks('before-mitigation', amount, packet, source, target, modifiers);
    if (packet.damageType !== 'true') {
      const defense = packet.damageType === 'physical' ? targetSnapshot.stats.armor : targetSnapshot.stats.resistance;
      const ignore = packet.damageType === 'physical' ? packet.ignoresArmor : packet.ignoresResistance;
      const effective = Math.max(-80, defense * (1 - clamp(ignore, 0, 1)));
      const multiplier = effective >= 0 ? 100 / (100 + effective) : 2 - 100 / (100 - effective);
      amount = this.modify(amount, amount * multiplier, 'defense-mitigation', 'multiply', multiplier, modifiers);
      const resistance = targetSnapshot.resistances[packet.damageType];
      amount = this.modify(amount, amount * (1 - resistance), 'typed-resistance', 'multiply', 1 - resistance, modifiers);
    }
    const mitigated = Math.max(0, amplified - amount);
    amount = this.runHooks('after-mitigation', amount, packet, source, target, modifiers);
    let blocked = false;
    if (packet.canBlock && targetSnapshot.resources.guard > 0 && random.boolean(targetSnapshot.stats.blockChance) && !packet.tags.includes('unblockable')) {
      blocked = true;
      const blockedAmount = amount * targetSnapshot.stats.blockPower;
      const guardSpent = Math.min(targetSnapshot.resources.guard, blockedAmount);
      target.lose('guard', guardSpent);
      amount = this.modify(amount, amount - blockedAmount, 'active-block', 'add', -blockedAmount, modifiers);
    }
    const absorbed = this.absorbShields(target, amount, modifiers);
    amount = Math.max(0, amount - absorbed);
    amount = this.runHooks('before-apply', amount, packet, source, target, modifiers);
    const healthBefore = target.resources.get('health');
    const applied = Math.min(healthBefore, Math.max(0, amount));
    target.lose('health', applied);
    this.applySteal(source, applied, sourceSnapshot.stats.lifeSteal, sourceSnapshot.stats.manaSteal);
    return {
      requested: packet.baseAmount,
      amplified,
      mitigated,
      absorbed,
      applied,
      overkill: Math.max(0, amount - healthBefore),
      critical,
      blocked,
      dodged: false,
      defeated: !target.isAlive(),
      modifiers,
    };
  }

  public heal(packet: HealPacket, source: Combatant, target: Combatant, random: DeterministicRandom): HealResult {
    const sourceStats = source.snapshot().stats;
    const critical = packet.canCrit && random.boolean(sourceStats.criticalChance);
    let requested = Math.max(0, packet.baseAmount + sourceStats.healingPower * packet.powerRatio);
    if (critical) requested *= sourceStats.criticalMultiplier;
    if (target.tags.has('healing-reduced')) requested *= 0.5;
    if (target.tags.has('healing-blocked')) requested = 0;
    const missing = target.resources.maximum('health') - target.resources.get('health');
    const applied = Math.min(missing, requested);
    target.gain('health', applied);
    return { requested, applied, overheal: Math.max(0, requested - missing), critical };
  }

  private runHooks(phase: DamageHook['phase'], amount: number, packet: DamagePacket, source: Combatant, target: Combatant, modifiers: AppliedModifier[]): number {
    for (const hook of [...this.hooks.values()].filter((entry) => entry.phase === phase).sort((a, b) => a.priority - b.priority)) {
      const before = amount;
      amount = Math.max(0, hook.apply({ packet, source, target, amount, modifiers }));
      modifiers.push({ source: hook.id, operation: 'override', value: amount, before, after: amount });
    }
    return amount;
  }

  private applyVulnerabilityTags(amount: number, type: DamageType, target: Combatant, modifiers: AppliedModifier[]): number {
    if (target.tags.has('vulnerable')) amount = this.modify(amount, amount * 1.2, 'vulnerable', 'multiply', 1.2, modifiers);
    if (target.tags.has('vulnerable-' + type)) amount = this.modify(amount, amount * 1.35, 'vulnerable-' + type, 'multiply', 1.35, modifiers);
    if (target.tags.has('fortified')) amount = this.modify(amount, amount * 0.8, 'fortified', 'multiply', 0.8, modifiers);
    return amount;
  }

  private absorbShields(target: Combatant, amount: number, modifiers: AppliedModifier[]): number {
    const shieldTags = target.tags.values().filter((tag) => tag.startsWith('shield:')).sort();
    let remaining = amount;
    let absorbed = 0;
    for (const tag of shieldTags) {
      const value = Number(tag.split(':')[2] ?? 0);
      if (!Number.isFinite(value) || value <= 0) continue;
      const used = Math.min(remaining, value);
      absorbed += used;
      remaining -= used;
      target.tags.remove(tag);
      const leftover = value - used;
      if (leftover > 0) target.tags.add('shield:value:' + leftover);
      modifiers.push({ source: tag, operation: 'add', value: -used, before: remaining + used, after: remaining });
      if (remaining <= 0) break;
    }
    return absorbed;
  }

  private applySteal(source: Combatant, damage: number, lifeSteal: number, manaSteal: number): void {
    if (lifeSteal > 0) source.gain('health', damage * lifeSteal);
    if (manaSteal > 0) source.gain('mana', damage * manaSteal);
  }

  private powerFor(type: DamageType, attackPower: number, spellPower: number): number {
    return type === 'physical' || type === 'poison' ? attackPower : type === 'true' ? Math.max(attackPower, spellPower) : spellPower;
  }

  private modify(before: number, after: number, source: string, operation: AppliedModifier['operation'], value: number, modifiers: AppliedModifier[]): number {
    modifiers.push({ source, operation, value, before, after });
    return after;
  }

  private empty(requested: number): DamageResult {
    return { requested, amplified: 0, mitigated: 0, absorbed: 0, applied: 0, overkill: 0, critical: false, blocked: false, dodged: false, defeated: false, modifiers: [] };
  }
}
