import { Combatant } from '../core/Combatant';
import { AbilityImpact, CombatantId, DamageType, EffectId, Vec2, createEmptyImpact, distance } from '../core/types';
import { CombatEventStream } from '../events/CombatEventStream';

export type ZoneShape = 'circle' | 'ring' | 'rectangle' | 'line';

export interface CombatZoneDefinition {
  id: string;
  sourceId: CombatantId;
  abilityId: string;
  position: Vec2;
  direction: Vec2;
  shape: ZoneShape;
  radius: number;
  innerRadius: number;
  width: number;
  length: number;
  duration: number;
  tickInterval: number;
  damageType?: DamageType;
  damagePerTick: number;
  powerRatio: number;
  effectId?: EffectId;
  effectDuration: number;
  affectsTeams: Array<'player' | 'enemy' | 'neutral'>;
  maximumTargets: number;
  hitOnce: boolean;
  tags: string[];
}

export interface CombatZoneSnapshot extends CombatZoneDefinition {
  instanceId: string;
  createdAt: number;
  expiresAt: number;
  nextTickAt: number;
  hitTargets: CombatantId[];
  ticks: number;
}

export class CombatZoneSystem {
  private readonly zones = new Map<string, CombatZoneSnapshot>();
  private serial = 0;

  public constructor(private readonly combatants: Map<CombatantId, Combatant>, private readonly events: CombatEventStream) {}

  public create(definition: CombatZoneDefinition, now: number): CombatZoneSnapshot {
    if (definition.duration <= 0) throw new RangeError('zone duration must be positive');
    if (definition.tickInterval <= 0) throw new RangeError('zone tick interval must be positive');
    const zone: CombatZoneSnapshot = {
      ...definition,
      position: { ...definition.position },
      direction: this.normalize(definition.direction),
      affectsTeams: [...definition.affectsTeams],
      tags: [...definition.tags],
      instanceId: 'combat-zone-' + ++this.serial,
      createdAt: now,
      expiresAt: now + definition.duration,
      nextTickAt: now,
      hitTargets: [],
      ticks: 0,
    };
    this.zones.set(zone.instanceId, zone);
    return this.clone(zone);
  }

  public update(now: number): AbilityImpact[] {
    const impacts: AbilityImpact[] = [];
    for (const zone of [...this.zones.values()]) {
      while (zone.nextTickAt <= now && zone.nextTickAt < zone.expiresAt) {
        impacts.push(this.tick(zone, zone.nextTickAt));
        zone.ticks++;
        zone.nextTickAt += zone.tickInterval;
      }
      if (now >= zone.expiresAt) this.remove(zone.instanceId, now, 'duration');
    }
    return impacts;
  }

  public remove(instanceId: string, now: number, reason = 'manual'): boolean {
    const zone = this.zones.get(instanceId);
    if (!zone) return false;
    this.zones.delete(instanceId);
    this.events.emit('effect-expired', now, { zoneId: instanceId, abilityId: zone.abilityId, reason }, zone.sourceId);
    return true;
  }

  public removeBySource(sourceId: CombatantId, now: number): number {
    let removed = 0;
    for (const zone of this.list()) if (zone.sourceId === sourceId && this.remove(zone.instanceId, now, 'source-removed')) removed++;
    return removed;
  }

  public list(): CombatZoneSnapshot[] { return [...this.zones.values()].map((zone) => this.clone(zone)); }
  public at(point: Vec2): CombatZoneSnapshot[] { return this.list().filter((zone) => this.contains(zone, point)); }
  public capture(): { zones: CombatZoneSnapshot[]; serial: number } { return { zones: this.list(), serial: this.serial }; }

  public restore(snapshot: { zones: CombatZoneSnapshot[]; serial: number }): void {
    this.zones.clear();
    for (const zone of snapshot.zones) this.zones.set(zone.instanceId, this.clone(zone));
    this.serial = snapshot.serial;
  }

  private tick(zone: CombatZoneSnapshot, now: number): AbilityImpact {
    const impact = createEmptyImpact();
    const targets = [...this.combatants.values()].map((entry) => entry.snapshot())
      .filter((target) => target.alive && target.id !== zone.sourceId)
      .filter((target) => zone.affectsTeams.includes(target.team))
      .filter((target) => this.contains(zone, target.position))
      .filter((target) => !zone.hitOnce || !zone.hitTargets.includes(target.id))
      .sort((left, right) => distance(zone.position, left.position) - distance(zone.position, right.position))
      .slice(0, zone.maximumTargets);
    targets.forEach((target, index) => {
      if (zone.damageType && zone.damagePerTick > 0) {
        impact.damage.push({ sourceId: zone.sourceId, targetId: target.id, abilityId: zone.abilityId, damageType: zone.damageType, baseAmount: zone.damagePerTick, powerRatio: zone.powerRatio, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0, tags: [...zone.tags, 'zone-tick'], hitIndex: zone.ticks * zone.maximumTargets + index });
      }
      if (zone.effectId) impact.effects.push({ effectId: zone.effectId, sourceId: zone.sourceId, targetId: target.id, duration: zone.effectDuration, abilityId: zone.abilityId });
      if (!zone.hitTargets.includes(target.id)) zone.hitTargets.push(target.id);
    });
    this.events.emit('effect-ticked', now, { zoneId: zone.instanceId, tick: zone.ticks, targets: targets.map((entry) => entry.id) }, zone.sourceId);
    return impact;
  }

  private contains(zone: CombatZoneSnapshot, point: Vec2): boolean {
    const dx = point.x - zone.position.x;
    const dy = point.y - zone.position.y;
    if (zone.shape === 'circle') return dx * dx + dy * dy <= zone.radius * zone.radius;
    if (zone.shape === 'ring') { const value = Math.hypot(dx, dy); return value >= zone.innerRadius && value <= zone.radius; }
    const forward = dx * zone.direction.x + dy * zone.direction.y;
    const side = Math.abs(dx * zone.direction.y - dy * zone.direction.x);
    if (zone.shape === 'line') return forward >= 0 && forward <= zone.length && side <= zone.width / 2;
    return Math.abs(forward) <= zone.length / 2 && side <= zone.width / 2;
  }

  private normalize(vector: Vec2): Vec2 { const length = Math.hypot(vector.x, vector.y); return length <= 0 ? { x: 1, y: 0 } : { x: vector.x / length, y: vector.y / length }; }
  private clone(zone: CombatZoneSnapshot): CombatZoneSnapshot { return { ...zone, position: { ...zone.position }, direction: { ...zone.direction }, affectsTeams: [...zone.affectsTeams], tags: [...zone.tags], hitTargets: [...zone.hitTargets] }; }
}
