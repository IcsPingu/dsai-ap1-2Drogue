// Auto-generated tactical rule pack.
import {
  GeneratedTacticalContext,
  GeneratedTacticalDecision,
  GeneratedTacticalRule,
  generatedClamp,
  generatedDistance,
  generatedNormalize,
} from '../types';

export class TacticalRule0161 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0161';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'return';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 264;
  private readonly lateralBias = -0.25;
  private readonly aggression = 0.766;
  private readonly cohesion = 0.566;
  private readonly hazardWeight = 1.59;
  private readonly healthThreshold = 0.64;
  private readonly phase = 0;
  private readonly stride = 48;

  public supports(context: GeneratedTacticalContext): boolean {
    if (context.role !== this.role) return false;
    if (context.state === this.state) return true;
    if (this.state === 'chase' && context.state === 'investigate') return true;
    if (this.state === 'engage' && context.state === 'alert') return context.targetVisible;
    return false;
  }

  public evaluate(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const offset = { x: context.self.x - context.target.x, y: context.self.y - context.target.y };
    const distance = Math.max(0.001, generatedDistance(context.self, context.target));
    const radial = generatedNormalize(offset);
    const tangentSign = this.style === 'flank-left' ? -1 : this.style === 'flank-right' ? 1 : this.lateralBias >= 0 ? 1 : -1;
    const tangent = { x: -radial.y * tangentSign, y: radial.x * tangentSign };
    const healthPressure = generatedClamp((this.healthThreshold - context.healthRatio) * 2.2, -1, 1);
    const rangeError = generatedClamp((distance - this.desiredRange) / Math.max(32, this.desiredRange), -1.5, 1.5);
    const allyPressure = generatedClamp(context.nearbyAllies / 8, 0, 1);
    const routePressure = generatedClamp(context.routeCost / 900, 0, 1);
    const hazardPressure = generatedClamp(context.hazard, 0, 1) * this.hazardWeight;
    const pulse = Math.sin(context.elapsed * 0.001 + this.phase + context.actorId * 0.37);
    const retreatIntent = this.style === 'retreat' ? 1 : healthPressure > 0.2 ? healthPressure : 0;
    const advanceIntent = this.style === 'advance' ? this.aggression : generatedClamp(rangeError, 0, 1) * this.aggression;
    const orbitIntent = this.style === 'orbit' ? 0.9 : Math.abs(this.lateralBias) * 0.45;
    const anchorIntent = this.style === 'anchor' ? 1 : 0;
    const radialDistance = this.desiredRange + retreatIntent * this.stride - advanceIntent * this.stride * 0.45;
    const lateralDistance = (orbitIntent + allyPressure * this.cohesion) * this.stride * (0.65 + pulse * 0.15);
    const destination = {
      x: context.target.x + radial.x * radialDistance + tangent.x * lateralDistance,
      y: context.target.y + radial.y * radialDistance + tangent.y * lateralDistance,
    };
    const visibilityScore = context.targetVisible ? 0.24 : -0.08;
    const rangeScore = 1 - Math.min(1, Math.abs(distance - this.desiredRange) / Math.max(1, this.desiredRange));
    const formationScore = generatedClamp(1 - Math.abs(context.nearbyAllies - 0) * 0.16, 0, 1);
    const safetyScore = generatedClamp(1 - hazardPressure - routePressure * 0.35, 0, 1);
    const score = generatedClamp(rangeScore * 0.36 + formationScore * 0.2 + safetyScore * 0.24 + visibilityScore + this.aggression * 0.12, -1, 2);
    const speedScale = generatedClamp(0.72 + advanceIntent * 0.35 + retreatIntent * 0.28 - routePressure * 0.12, 0.55, 1.45);
    const separationScale = generatedClamp(0.65 + allyPressure * this.cohesion + Math.abs(pulse) * 0.16, 0.5, 1.6);
    const holdPosition = anchorIntent > 0 && Math.abs(rangeError) < 0.24 && context.targetVisible;
    return {
      ruleId: this.id,
      score,
      destination: holdPosition ? { ...context.self } : destination,
      speedScale,
      separationScale,
      holdPosition,
      preferredRange: this.desiredRange,
      style: this.style,
      reason: this.explain(distance, rangeError, hazardPressure, context.targetVisible),
    };
  }

  private explain(distance: number, rangeError: number, hazardPressure: number, visible: boolean): string {
    const rangeLabel = rangeError > 0.2 ? 'closing' : rangeError < -0.2 ? 'creating-distance' : 'holding-range';
    const safetyLabel = hazardPressure > 0.45 ? 'avoiding-hazard' : 'safe-ground';
    const sightLabel = visible ? 'visual-contact' : 'memory-contact';
    return [this.style, rangeLabel, safetyLabel, sightLabel, Math.round(distance)].join(':');
  }
}

export class TacticalRule0162 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0162';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'return';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 281;
  private readonly lateralBias = -0.125;
  private readonly aggression = 0.793;
  private readonly cohesion = 0.627;
  private readonly hazardWeight = 0.45;
  private readonly healthThreshold = 0.75;
  private readonly phase = 0.1963;
  private readonly stride = 71;

  public supports(context: GeneratedTacticalContext): boolean {
    if (context.role !== this.role) return false;
    if (context.state === this.state) return true;
    if (this.state === 'chase' && context.state === 'investigate') return true;
    if (this.state === 'engage' && context.state === 'alert') return context.targetVisible;
    return false;
  }

  public evaluate(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const offset = { x: context.self.x - context.target.x, y: context.self.y - context.target.y };
    const distance = Math.max(0.001, generatedDistance(context.self, context.target));
    const radial = generatedNormalize(offset);
    const tangentSign = this.style === 'flank-left' ? -1 : this.style === 'flank-right' ? 1 : this.lateralBias >= 0 ? 1 : -1;
    const tangent = { x: -radial.y * tangentSign, y: radial.x * tangentSign };
    const healthPressure = generatedClamp((this.healthThreshold - context.healthRatio) * 2.2, -1, 1);
    const rangeError = generatedClamp((distance - this.desiredRange) / Math.max(32, this.desiredRange), -1.5, 1.5);
    const allyPressure = generatedClamp(context.nearbyAllies / 8, 0, 1);
    const routePressure = generatedClamp(context.routeCost / 900, 0, 1);
    const hazardPressure = generatedClamp(context.hazard, 0, 1) * this.hazardWeight;
    const pulse = Math.sin(context.elapsed * 0.001 + this.phase + context.actorId * 0.37);
    const retreatIntent = this.style === 'retreat' ? 1 : healthPressure > 0.2 ? healthPressure : 0;
    const advanceIntent = this.style === 'advance' ? this.aggression : generatedClamp(rangeError, 0, 1) * this.aggression;
    const orbitIntent = this.style === 'orbit' ? 0.9 : Math.abs(this.lateralBias) * 0.45;
    const anchorIntent = this.style === 'anchor' ? 1 : 0;
    const radialDistance = this.desiredRange + retreatIntent * this.stride - advanceIntent * this.stride * 0.45;
    const lateralDistance = (orbitIntent + allyPressure * this.cohesion) * this.stride * (0.65 + pulse * 0.15);
    const destination = {
      x: context.target.x + radial.x * radialDistance + tangent.x * lateralDistance,
      y: context.target.y + radial.y * radialDistance + tangent.y * lateralDistance,
    };
    const visibilityScore = context.targetVisible ? 0.24 : -0.08;
    const rangeScore = 1 - Math.min(1, Math.abs(distance - this.desiredRange) / Math.max(1, this.desiredRange));
    const formationScore = generatedClamp(1 - Math.abs(context.nearbyAllies - 1) * 0.16, 0, 1);
    const safetyScore = generatedClamp(1 - hazardPressure - routePressure * 0.35, 0, 1);
    const score = generatedClamp(rangeScore * 0.36 + formationScore * 0.2 + safetyScore * 0.24 + visibilityScore + this.aggression * 0.12, -1, 2);
    const speedScale = generatedClamp(0.72 + advanceIntent * 0.35 + retreatIntent * 0.28 - routePressure * 0.12, 0.55, 1.45);
    const separationScale = generatedClamp(0.65 + allyPressure * this.cohesion + Math.abs(pulse) * 0.16, 0.5, 1.6);
    const holdPosition = anchorIntent > 0 && Math.abs(rangeError) < 0.24 && context.targetVisible;
    return {
      ruleId: this.id,
      score,
      destination: holdPosition ? { ...context.self } : destination,
      speedScale,
      separationScale,
      holdPosition,
      preferredRange: this.desiredRange,
      style: this.style,
      reason: this.explain(distance, rangeError, hazardPressure, context.targetVisible),
    };
  }

  private explain(distance: number, rangeError: number, hazardPressure: number, visible: boolean): string {
    const rangeLabel = rangeError > 0.2 ? 'closing' : rangeError < -0.2 ? 'creating-distance' : 'holding-range';
    const safetyLabel = hazardPressure > 0.45 ? 'avoiding-hazard' : 'safe-ground';
    const sightLabel = visible ? 'visual-contact' : 'memory-contact';
    return [this.style, rangeLabel, safetyLabel, sightLabel, Math.round(distance)].join(':');
  }
}

export class TacticalRule0163 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0163';
  public readonly role: GeneratedTacticalRule['role'] = 'melee';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 298;
  private readonly lateralBias = 0;
  private readonly aggression = 0.82;
  private readonly cohesion = 0.688;
  private readonly hazardWeight = 0.64;
  private readonly healthThreshold = 0.2;
  private readonly phase = 0.3927;
  private readonly stride = 94;

  public supports(context: GeneratedTacticalContext): boolean {
    if (context.role !== this.role) return false;
    if (context.state === this.state) return true;
    if (this.state === 'chase' && context.state === 'investigate') return true;
    if (this.state === 'engage' && context.state === 'alert') return context.targetVisible;
    return false;
  }

  public evaluate(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const offset = { x: context.self.x - context.target.x, y: context.self.y - context.target.y };
    const distance = Math.max(0.001, generatedDistance(context.self, context.target));
    const radial = generatedNormalize(offset);
    const tangentSign = this.style === 'flank-left' ? -1 : this.style === 'flank-right' ? 1 : this.lateralBias >= 0 ? 1 : -1;
    const tangent = { x: -radial.y * tangentSign, y: radial.x * tangentSign };
    const healthPressure = generatedClamp((this.healthThreshold - context.healthRatio) * 2.2, -1, 1);
    const rangeError = generatedClamp((distance - this.desiredRange) / Math.max(32, this.desiredRange), -1.5, 1.5);
    const allyPressure = generatedClamp(context.nearbyAllies / 8, 0, 1);
    const routePressure = generatedClamp(context.routeCost / 900, 0, 1);
    const hazardPressure = generatedClamp(context.hazard, 0, 1) * this.hazardWeight;
    const pulse = Math.sin(context.elapsed * 0.001 + this.phase + context.actorId * 0.37);
    const retreatIntent = this.style === 'retreat' ? 1 : healthPressure > 0.2 ? healthPressure : 0;
    const advanceIntent = this.style === 'advance' ? this.aggression : generatedClamp(rangeError, 0, 1) * this.aggression;
    const orbitIntent = this.style === 'orbit' ? 0.9 : Math.abs(this.lateralBias) * 0.45;
    const anchorIntent = this.style === 'anchor' ? 1 : 0;
    const radialDistance = this.desiredRange + retreatIntent * this.stride - advanceIntent * this.stride * 0.45;
    const lateralDistance = (orbitIntent + allyPressure * this.cohesion) * this.stride * (0.65 + pulse * 0.15);
    const destination = {
      x: context.target.x + radial.x * radialDistance + tangent.x * lateralDistance,
      y: context.target.y + radial.y * radialDistance + tangent.y * lateralDistance,
    };
    const visibilityScore = context.targetVisible ? 0.24 : -0.08;
    const rangeScore = 1 - Math.min(1, Math.abs(distance - this.desiredRange) / Math.max(1, this.desiredRange));
    const formationScore = generatedClamp(1 - Math.abs(context.nearbyAllies - 2) * 0.16, 0, 1);
    const safetyScore = generatedClamp(1 - hazardPressure - routePressure * 0.35, 0, 1);
    const score = generatedClamp(rangeScore * 0.36 + formationScore * 0.2 + safetyScore * 0.24 + visibilityScore + this.aggression * 0.12, -1, 2);
    const speedScale = generatedClamp(0.72 + advanceIntent * 0.35 + retreatIntent * 0.28 - routePressure * 0.12, 0.55, 1.45);
    const separationScale = generatedClamp(0.65 + allyPressure * this.cohesion + Math.abs(pulse) * 0.16, 0.5, 1.6);
    const holdPosition = anchorIntent > 0 && Math.abs(rangeError) < 0.24 && context.targetVisible;
    return {
      ruleId: this.id,
      score,
      destination: holdPosition ? { ...context.self } : destination,
      speedScale,
      separationScale,
      holdPosition,
      preferredRange: this.desiredRange,
      style: this.style,
      reason: this.explain(distance, rangeError, hazardPressure, context.targetVisible),
    };
  }

  private explain(distance: number, rangeError: number, hazardPressure: number, visible: boolean): string {
    const rangeLabel = rangeError > 0.2 ? 'closing' : rangeError < -0.2 ? 'creating-distance' : 'holding-range';
    const safetyLabel = hazardPressure > 0.45 ? 'avoiding-hazard' : 'safe-ground';
    const sightLabel = visible ? 'visual-contact' : 'memory-contact';
    return [this.style, rangeLabel, safetyLabel, sightLabel, Math.round(distance)].join(':');
  }
}

export class TacticalRule0164 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0164';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 315;
  private readonly lateralBias = 0.125;
  private readonly aggression = 0.847;
  private readonly cohesion = 0.749;
  private readonly hazardWeight = 0.83;
  private readonly healthThreshold = 0.31;
  private readonly phase = 0.589;
  private readonly stride = 117;

  public supports(context: GeneratedTacticalContext): boolean {
    if (context.role !== this.role) return false;
    if (context.state === this.state) return true;
    if (this.state === 'chase' && context.state === 'investigate') return true;
    if (this.state === 'engage' && context.state === 'alert') return context.targetVisible;
    return false;
  }

  public evaluate(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const offset = { x: context.self.x - context.target.x, y: context.self.y - context.target.y };
    const distance = Math.max(0.001, generatedDistance(context.self, context.target));
    const radial = generatedNormalize(offset);
    const tangentSign = this.style === 'flank-left' ? -1 : this.style === 'flank-right' ? 1 : this.lateralBias >= 0 ? 1 : -1;
    const tangent = { x: -radial.y * tangentSign, y: radial.x * tangentSign };
    const healthPressure = generatedClamp((this.healthThreshold - context.healthRatio) * 2.2, -1, 1);
    const rangeError = generatedClamp((distance - this.desiredRange) / Math.max(32, this.desiredRange), -1.5, 1.5);
    const allyPressure = generatedClamp(context.nearbyAllies / 8, 0, 1);
    const routePressure = generatedClamp(context.routeCost / 900, 0, 1);
    const hazardPressure = generatedClamp(context.hazard, 0, 1) * this.hazardWeight;
    const pulse = Math.sin(context.elapsed * 0.001 + this.phase + context.actorId * 0.37);
    const retreatIntent = this.style === 'retreat' ? 1 : healthPressure > 0.2 ? healthPressure : 0;
    const advanceIntent = this.style === 'advance' ? this.aggression : generatedClamp(rangeError, 0, 1) * this.aggression;
    const orbitIntent = this.style === 'orbit' ? 0.9 : Math.abs(this.lateralBias) * 0.45;
    const anchorIntent = this.style === 'anchor' ? 1 : 0;
    const radialDistance = this.desiredRange + retreatIntent * this.stride - advanceIntent * this.stride * 0.45;
    const lateralDistance = (orbitIntent + allyPressure * this.cohesion) * this.stride * (0.65 + pulse * 0.15);
    const destination = {
      x: context.target.x + radial.x * radialDistance + tangent.x * lateralDistance,
      y: context.target.y + radial.y * radialDistance + tangent.y * lateralDistance,
    };
    const visibilityScore = context.targetVisible ? 0.24 : -0.08;
    const rangeScore = 1 - Math.min(1, Math.abs(distance - this.desiredRange) / Math.max(1, this.desiredRange));
    const formationScore = generatedClamp(1 - Math.abs(context.nearbyAllies - 3) * 0.16, 0, 1);
    const safetyScore = generatedClamp(1 - hazardPressure - routePressure * 0.35, 0, 1);
    const score = generatedClamp(rangeScore * 0.36 + formationScore * 0.2 + safetyScore * 0.24 + visibilityScore + this.aggression * 0.12, -1, 2);
    const speedScale = generatedClamp(0.72 + advanceIntent * 0.35 + retreatIntent * 0.28 - routePressure * 0.12, 0.55, 1.45);
    const separationScale = generatedClamp(0.65 + allyPressure * this.cohesion + Math.abs(pulse) * 0.16, 0.5, 1.6);
    const holdPosition = anchorIntent > 0 && Math.abs(rangeError) < 0.24 && context.targetVisible;
    return {
      ruleId: this.id,
      score,
      destination: holdPosition ? { ...context.self } : destination,
      speedScale,
      separationScale,
      holdPosition,
      preferredRange: this.desiredRange,
      style: this.style,
      reason: this.explain(distance, rangeError, hazardPressure, context.targetVisible),
    };
  }

  private explain(distance: number, rangeError: number, hazardPressure: number, visible: boolean): string {
    const rangeLabel = rangeError > 0.2 ? 'closing' : rangeError < -0.2 ? 'creating-distance' : 'holding-range';
    const safetyLabel = hazardPressure > 0.45 ? 'avoiding-hazard' : 'safe-ground';
    const sightLabel = visible ? 'visual-contact' : 'memory-contact';
    return [this.style, rangeLabel, safetyLabel, sightLabel, Math.round(distance)].join(':');
  }
}

export class TacticalRule0165 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0165';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 332;
  private readonly lateralBias = 0.25;
  private readonly aggression = 0.874;
  private readonly cohesion = 0.81;
  private readonly hazardWeight = 1.02;
  private readonly healthThreshold = 0.42;
  private readonly phase = 0.7854;
  private readonly stride = 140;

  public supports(context: GeneratedTacticalContext): boolean {
    if (context.role !== this.role) return false;
    if (context.state === this.state) return true;
    if (this.state === 'chase' && context.state === 'investigate') return true;
    if (this.state === 'engage' && context.state === 'alert') return context.targetVisible;
    return false;
  }

  public evaluate(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const offset = { x: context.self.x - context.target.x, y: context.self.y - context.target.y };
    const distance = Math.max(0.001, generatedDistance(context.self, context.target));
    const radial = generatedNormalize(offset);
    const tangentSign = this.style === 'flank-left' ? -1 : this.style === 'flank-right' ? 1 : this.lateralBias >= 0 ? 1 : -1;
    const tangent = { x: -radial.y * tangentSign, y: radial.x * tangentSign };
    const healthPressure = generatedClamp((this.healthThreshold - context.healthRatio) * 2.2, -1, 1);
    const rangeError = generatedClamp((distance - this.desiredRange) / Math.max(32, this.desiredRange), -1.5, 1.5);
    const allyPressure = generatedClamp(context.nearbyAllies / 8, 0, 1);
    const routePressure = generatedClamp(context.routeCost / 900, 0, 1);
    const hazardPressure = generatedClamp(context.hazard, 0, 1) * this.hazardWeight;
    const pulse = Math.sin(context.elapsed * 0.001 + this.phase + context.actorId * 0.37);
    const retreatIntent = this.style === 'retreat' ? 1 : healthPressure > 0.2 ? healthPressure : 0;
    const advanceIntent = this.style === 'advance' ? this.aggression : generatedClamp(rangeError, 0, 1) * this.aggression;
    const orbitIntent = this.style === 'orbit' ? 0.9 : Math.abs(this.lateralBias) * 0.45;
    const anchorIntent = this.style === 'anchor' ? 1 : 0;
    const radialDistance = this.desiredRange + retreatIntent * this.stride - advanceIntent * this.stride * 0.45;
    const lateralDistance = (orbitIntent + allyPressure * this.cohesion) * this.stride * (0.65 + pulse * 0.15);
    const destination = {
      x: context.target.x + radial.x * radialDistance + tangent.x * lateralDistance,
      y: context.target.y + radial.y * radialDistance + tangent.y * lateralDistance,
    };
    const visibilityScore = context.targetVisible ? 0.24 : -0.08;
    const rangeScore = 1 - Math.min(1, Math.abs(distance - this.desiredRange) / Math.max(1, this.desiredRange));
    const formationScore = generatedClamp(1 - Math.abs(context.nearbyAllies - 4) * 0.16, 0, 1);
    const safetyScore = generatedClamp(1 - hazardPressure - routePressure * 0.35, 0, 1);
    const score = generatedClamp(rangeScore * 0.36 + formationScore * 0.2 + safetyScore * 0.24 + visibilityScore + this.aggression * 0.12, -1, 2);
    const speedScale = generatedClamp(0.72 + advanceIntent * 0.35 + retreatIntent * 0.28 - routePressure * 0.12, 0.55, 1.45);
    const separationScale = generatedClamp(0.65 + allyPressure * this.cohesion + Math.abs(pulse) * 0.16, 0.5, 1.6);
    const holdPosition = anchorIntent > 0 && Math.abs(rangeError) < 0.24 && context.targetVisible;
    return {
      ruleId: this.id,
      score,
      destination: holdPosition ? { ...context.self } : destination,
      speedScale,
      separationScale,
      holdPosition,
      preferredRange: this.desiredRange,
      style: this.style,
      reason: this.explain(distance, rangeError, hazardPressure, context.targetVisible),
    };
  }

  private explain(distance: number, rangeError: number, hazardPressure: number, visible: boolean): string {
    const rangeLabel = rangeError > 0.2 ? 'closing' : rangeError < -0.2 ? 'creating-distance' : 'holding-range';
    const safetyLabel = hazardPressure > 0.45 ? 'avoiding-hazard' : 'safe-ground';
    const sightLabel = visible ? 'visual-contact' : 'memory-contact';
    return [this.style, rangeLabel, safetyLabel, sightLabel, Math.round(distance)].join(':');
  }
}

export class TacticalRule0166 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0166';
  public readonly role: GeneratedTacticalRule['role'] = 'melee';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 69;
  private readonly lateralBias = 0.375;
  private readonly aggression = 0.901;
  private readonly cohesion = 0.2;
  private readonly hazardWeight = 1.21;
  private readonly healthThreshold = 0.53;
  private readonly phase = 0.9817;
  private readonly stride = 163;

  public supports(context: GeneratedTacticalContext): boolean {
    if (context.role !== this.role) return false;
    if (context.state === this.state) return true;
    if (this.state === 'chase' && context.state === 'investigate') return true;
    if (this.state === 'engage' && context.state === 'alert') return context.targetVisible;
    return false;
  }

  public evaluate(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const offset = { x: context.self.x - context.target.x, y: context.self.y - context.target.y };
    const distance = Math.max(0.001, generatedDistance(context.self, context.target));
    const radial = generatedNormalize(offset);
    const tangentSign = this.style === 'flank-left' ? -1 : this.style === 'flank-right' ? 1 : this.lateralBias >= 0 ? 1 : -1;
    const tangent = { x: -radial.y * tangentSign, y: radial.x * tangentSign };
    const healthPressure = generatedClamp((this.healthThreshold - context.healthRatio) * 2.2, -1, 1);
    const rangeError = generatedClamp((distance - this.desiredRange) / Math.max(32, this.desiredRange), -1.5, 1.5);
    const allyPressure = generatedClamp(context.nearbyAllies / 8, 0, 1);
    const routePressure = generatedClamp(context.routeCost / 900, 0, 1);
    const hazardPressure = generatedClamp(context.hazard, 0, 1) * this.hazardWeight;
    const pulse = Math.sin(context.elapsed * 0.001 + this.phase + context.actorId * 0.37);
    const retreatIntent = this.style === 'retreat' ? 1 : healthPressure > 0.2 ? healthPressure : 0;
    const advanceIntent = this.style === 'advance' ? this.aggression : generatedClamp(rangeError, 0, 1) * this.aggression;
    const orbitIntent = this.style === 'orbit' ? 0.9 : Math.abs(this.lateralBias) * 0.45;
    const anchorIntent = this.style === 'anchor' ? 1 : 0;
    const radialDistance = this.desiredRange + retreatIntent * this.stride - advanceIntent * this.stride * 0.45;
    const lateralDistance = (orbitIntent + allyPressure * this.cohesion) * this.stride * (0.65 + pulse * 0.15);
    const destination = {
      x: context.target.x + radial.x * radialDistance + tangent.x * lateralDistance,
      y: context.target.y + radial.y * radialDistance + tangent.y * lateralDistance,
    };
    const visibilityScore = context.targetVisible ? 0.24 : -0.08;
    const rangeScore = 1 - Math.min(1, Math.abs(distance - this.desiredRange) / Math.max(1, this.desiredRange));
    const formationScore = generatedClamp(1 - Math.abs(context.nearbyAllies - 0) * 0.16, 0, 1);
    const safetyScore = generatedClamp(1 - hazardPressure - routePressure * 0.35, 0, 1);
    const score = generatedClamp(rangeScore * 0.36 + formationScore * 0.2 + safetyScore * 0.24 + visibilityScore + this.aggression * 0.12, -1, 2);
    const speedScale = generatedClamp(0.72 + advanceIntent * 0.35 + retreatIntent * 0.28 - routePressure * 0.12, 0.55, 1.45);
    const separationScale = generatedClamp(0.65 + allyPressure * this.cohesion + Math.abs(pulse) * 0.16, 0.5, 1.6);
    const holdPosition = anchorIntent > 0 && Math.abs(rangeError) < 0.24 && context.targetVisible;
    return {
      ruleId: this.id,
      score,
      destination: holdPosition ? { ...context.self } : destination,
      speedScale,
      separationScale,
      holdPosition,
      preferredRange: this.desiredRange,
      style: this.style,
      reason: this.explain(distance, rangeError, hazardPressure, context.targetVisible),
    };
  }

  private explain(distance: number, rangeError: number, hazardPressure: number, visible: boolean): string {
    const rangeLabel = rangeError > 0.2 ? 'closing' : rangeError < -0.2 ? 'creating-distance' : 'holding-range';
    const safetyLabel = hazardPressure > 0.45 ? 'avoiding-hazard' : 'safe-ground';
    const sightLabel = visible ? 'visual-contact' : 'memory-contact';
    return [this.style, rangeLabel, safetyLabel, sightLabel, Math.round(distance)].join(':');
  }
}

export class TacticalRule0167 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0167';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 86;
  private readonly lateralBias = 0.5;
  private readonly aggression = 0.928;
  private readonly cohesion = 0.261;
  private readonly hazardWeight = 1.4;
  private readonly healthThreshold = 0.64;
  private readonly phase = 1.1781;
  private readonly stride = 186;

  public supports(context: GeneratedTacticalContext): boolean {
    if (context.role !== this.role) return false;
    if (context.state === this.state) return true;
    if (this.state === 'chase' && context.state === 'investigate') return true;
    if (this.state === 'engage' && context.state === 'alert') return context.targetVisible;
    return false;
  }

  public evaluate(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const offset = { x: context.self.x - context.target.x, y: context.self.y - context.target.y };
    const distance = Math.max(0.001, generatedDistance(context.self, context.target));
    const radial = generatedNormalize(offset);
    const tangentSign = this.style === 'flank-left' ? -1 : this.style === 'flank-right' ? 1 : this.lateralBias >= 0 ? 1 : -1;
    const tangent = { x: -radial.y * tangentSign, y: radial.x * tangentSign };
    const healthPressure = generatedClamp((this.healthThreshold - context.healthRatio) * 2.2, -1, 1);
    const rangeError = generatedClamp((distance - this.desiredRange) / Math.max(32, this.desiredRange), -1.5, 1.5);
    const allyPressure = generatedClamp(context.nearbyAllies / 8, 0, 1);
    const routePressure = generatedClamp(context.routeCost / 900, 0, 1);
    const hazardPressure = generatedClamp(context.hazard, 0, 1) * this.hazardWeight;
    const pulse = Math.sin(context.elapsed * 0.001 + this.phase + context.actorId * 0.37);
    const retreatIntent = this.style === 'retreat' ? 1 : healthPressure > 0.2 ? healthPressure : 0;
    const advanceIntent = this.style === 'advance' ? this.aggression : generatedClamp(rangeError, 0, 1) * this.aggression;
    const orbitIntent = this.style === 'orbit' ? 0.9 : Math.abs(this.lateralBias) * 0.45;
    const anchorIntent = this.style === 'anchor' ? 1 : 0;
    const radialDistance = this.desiredRange + retreatIntent * this.stride - advanceIntent * this.stride * 0.45;
    const lateralDistance = (orbitIntent + allyPressure * this.cohesion) * this.stride * (0.65 + pulse * 0.15);
    const destination = {
      x: context.target.x + radial.x * radialDistance + tangent.x * lateralDistance,
      y: context.target.y + radial.y * radialDistance + tangent.y * lateralDistance,
    };
    const visibilityScore = context.targetVisible ? 0.24 : -0.08;
    const rangeScore = 1 - Math.min(1, Math.abs(distance - this.desiredRange) / Math.max(1, this.desiredRange));
    const formationScore = generatedClamp(1 - Math.abs(context.nearbyAllies - 1) * 0.16, 0, 1);
    const safetyScore = generatedClamp(1 - hazardPressure - routePressure * 0.35, 0, 1);
    const score = generatedClamp(rangeScore * 0.36 + formationScore * 0.2 + safetyScore * 0.24 + visibilityScore + this.aggression * 0.12, -1, 2);
    const speedScale = generatedClamp(0.72 + advanceIntent * 0.35 + retreatIntent * 0.28 - routePressure * 0.12, 0.55, 1.45);
    const separationScale = generatedClamp(0.65 + allyPressure * this.cohesion + Math.abs(pulse) * 0.16, 0.5, 1.6);
    const holdPosition = anchorIntent > 0 && Math.abs(rangeError) < 0.24 && context.targetVisible;
    return {
      ruleId: this.id,
      score,
      destination: holdPosition ? { ...context.self } : destination,
      speedScale,
      separationScale,
      holdPosition,
      preferredRange: this.desiredRange,
      style: this.style,
      reason: this.explain(distance, rangeError, hazardPressure, context.targetVisible),
    };
  }

  private explain(distance: number, rangeError: number, hazardPressure: number, visible: boolean): string {
    const rangeLabel = rangeError > 0.2 ? 'closing' : rangeError < -0.2 ? 'creating-distance' : 'holding-range';
    const safetyLabel = hazardPressure > 0.45 ? 'avoiding-hazard' : 'safe-ground';
    const sightLabel = visible ? 'visual-contact' : 'memory-contact';
    return [this.style, rangeLabel, safetyLabel, sightLabel, Math.round(distance)].join(':');
  }
}

export class TacticalRule0168 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0168';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 103;
  private readonly lateralBias = 0.625;
  private readonly aggression = 0.955;
  private readonly cohesion = 0.322;
  private readonly hazardWeight = 1.59;
  private readonly healthThreshold = 0.75;
  private readonly phase = 1.3744;
  private readonly stride = 49;

  public supports(context: GeneratedTacticalContext): boolean {
    if (context.role !== this.role) return false;
    if (context.state === this.state) return true;
    if (this.state === 'chase' && context.state === 'investigate') return true;
    if (this.state === 'engage' && context.state === 'alert') return context.targetVisible;
    return false;
  }

  public evaluate(context: GeneratedTacticalContext): GeneratedTacticalDecision {
    const offset = { x: context.self.x - context.target.x, y: context.self.y - context.target.y };
    const distance = Math.max(0.001, generatedDistance(context.self, context.target));
    const radial = generatedNormalize(offset);
    const tangentSign = this.style === 'flank-left' ? -1 : this.style === 'flank-right' ? 1 : this.lateralBias >= 0 ? 1 : -1;
    const tangent = { x: -radial.y * tangentSign, y: radial.x * tangentSign };
    const healthPressure = generatedClamp((this.healthThreshold - context.healthRatio) * 2.2, -1, 1);
    const rangeError = generatedClamp((distance - this.desiredRange) / Math.max(32, this.desiredRange), -1.5, 1.5);
    const allyPressure = generatedClamp(context.nearbyAllies / 8, 0, 1);
    const routePressure = generatedClamp(context.routeCost / 900, 0, 1);
    const hazardPressure = generatedClamp(context.hazard, 0, 1) * this.hazardWeight;
    const pulse = Math.sin(context.elapsed * 0.001 + this.phase + context.actorId * 0.37);
    const retreatIntent = this.style === 'retreat' ? 1 : healthPressure > 0.2 ? healthPressure : 0;
    const advanceIntent = this.style === 'advance' ? this.aggression : generatedClamp(rangeError, 0, 1) * this.aggression;
    const orbitIntent = this.style === 'orbit' ? 0.9 : Math.abs(this.lateralBias) * 0.45;
    const anchorIntent = this.style === 'anchor' ? 1 : 0;
    const radialDistance = this.desiredRange + retreatIntent * this.stride - advanceIntent * this.stride * 0.45;
    const lateralDistance = (orbitIntent + allyPressure * this.cohesion) * this.stride * (0.65 + pulse * 0.15);
    const destination = {
      x: context.target.x + radial.x * radialDistance + tangent.x * lateralDistance,
      y: context.target.y + radial.y * radialDistance + tangent.y * lateralDistance,
    };
    const visibilityScore = context.targetVisible ? 0.24 : -0.08;
    const rangeScore = 1 - Math.min(1, Math.abs(distance - this.desiredRange) / Math.max(1, this.desiredRange));
    const formationScore = generatedClamp(1 - Math.abs(context.nearbyAllies - 2) * 0.16, 0, 1);
    const safetyScore = generatedClamp(1 - hazardPressure - routePressure * 0.35, 0, 1);
    const score = generatedClamp(rangeScore * 0.36 + formationScore * 0.2 + safetyScore * 0.24 + visibilityScore + this.aggression * 0.12, -1, 2);
    const speedScale = generatedClamp(0.72 + advanceIntent * 0.35 + retreatIntent * 0.28 - routePressure * 0.12, 0.55, 1.45);
    const separationScale = generatedClamp(0.65 + allyPressure * this.cohesion + Math.abs(pulse) * 0.16, 0.5, 1.6);
    const holdPosition = anchorIntent > 0 && Math.abs(rangeError) < 0.24 && context.targetVisible;
    return {
      ruleId: this.id,
      score,
      destination: holdPosition ? { ...context.self } : destination,
      speedScale,
      separationScale,
      holdPosition,
      preferredRange: this.desiredRange,
      style: this.style,
      reason: this.explain(distance, rangeError, hazardPressure, context.targetVisible),
    };
  }

  private explain(distance: number, rangeError: number, hazardPressure: number, visible: boolean): string {
    const rangeLabel = rangeError > 0.2 ? 'closing' : rangeError < -0.2 ? 'creating-distance' : 'holding-range';
    const safetyLabel = hazardPressure > 0.45 ? 'avoiding-hazard' : 'safe-ground';
    const sightLabel = visible ? 'visual-contact' : 'memory-contact';
    return [this.style, rangeLabel, safetyLabel, sightLabel, Math.round(distance)].join(':');
  }
}

export const TacticalRulePack21: readonly GeneratedTacticalRule[] = [
  new TacticalRule0161(),
  new TacticalRule0162(),
  new TacticalRule0163(),
  new TacticalRule0164(),
  new TacticalRule0165(),
  new TacticalRule0166(),
  new TacticalRule0167(),
  new TacticalRule0168(),
];
