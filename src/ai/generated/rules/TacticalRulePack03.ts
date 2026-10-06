// Auto-generated tactical rule pack.
import {
  GeneratedTacticalContext,
  GeneratedTacticalDecision,
  GeneratedTacticalRule,
  generatedClamp,
  generatedDistance,
  generatedNormalize,
} from '../types';

export class TacticalRule0017 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0017';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'return';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 336;
  private readonly lateralBias = -0.375;
  private readonly aggression = 0.982;
  private readonly cohesion = 0.505;
  private readonly hazardWeight = 0.83;
  private readonly healthThreshold = 0.64;
  private readonly phase = 3.1416;
  private readonly stride = 96;

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

export class TacticalRule0018 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0018';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'return';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 73;
  private readonly lateralBias = -0.25;
  private readonly aggression = 1.009;
  private readonly cohesion = 0.566;
  private readonly hazardWeight = 1.02;
  private readonly healthThreshold = 0.75;
  private readonly phase = 3.3379;
  private readonly stride = 119;

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

export class TacticalRule0019 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0019';
  public readonly role: GeneratedTacticalRule['role'] = 'melee';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 90;
  private readonly lateralBias = -0.125;
  private readonly aggression = 1.036;
  private readonly cohesion = 0.627;
  private readonly hazardWeight = 1.21;
  private readonly healthThreshold = 0.2;
  private readonly phase = 3.5343;
  private readonly stride = 142;

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

export class TacticalRule0020 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0020';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 107;
  private readonly lateralBias = 0;
  private readonly aggression = 0.55;
  private readonly cohesion = 0.688;
  private readonly hazardWeight = 1.4;
  private readonly healthThreshold = 0.31;
  private readonly phase = 3.7306;
  private readonly stride = 165;

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

export class TacticalRule0021 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0021';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 124;
  private readonly lateralBias = 0.125;
  private readonly aggression = 0.577;
  private readonly cohesion = 0.749;
  private readonly hazardWeight = 1.59;
  private readonly healthThreshold = 0.42;
  private readonly phase = 3.927;
  private readonly stride = 188;

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

export class TacticalRule0022 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0022';
  public readonly role: GeneratedTacticalRule['role'] = 'melee';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 141;
  private readonly lateralBias = 0.25;
  private readonly aggression = 0.604;
  private readonly cohesion = 0.81;
  private readonly hazardWeight = 0.45;
  private readonly healthThreshold = 0.53;
  private readonly phase = 4.1233;
  private readonly stride = 51;

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

export class TacticalRule0023 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0023';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 158;
  private readonly lateralBias = 0.375;
  private readonly aggression = 0.631;
  private readonly cohesion = 0.2;
  private readonly hazardWeight = 0.64;
  private readonly healthThreshold = 0.64;
  private readonly phase = 4.3197;
  private readonly stride = 74;

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

export class TacticalRule0024 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0024';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'advance';
  private readonly desiredRange = 175;
  private readonly lateralBias = 0.5;
  private readonly aggression = 0.658;
  private readonly cohesion = 0.261;
  private readonly hazardWeight = 0.83;
  private readonly healthThreshold = 0.75;
  private readonly phase = 4.516;
  private readonly stride = 97;

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

export const TacticalRulePack03: readonly GeneratedTacticalRule[] = [
  new TacticalRule0017(),
  new TacticalRule0018(),
  new TacticalRule0019(),
  new TacticalRule0020(),
  new TacticalRule0021(),
  new TacticalRule0022(),
  new TacticalRule0023(),
  new TacticalRule0024(),
];
