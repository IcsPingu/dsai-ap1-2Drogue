// Auto-generated tactical rule pack.
import {
  GeneratedTacticalContext,
  GeneratedTacticalDecision,
  GeneratedTacticalRule,
  generatedClamp,
  generatedDistance,
  generatedNormalize,
} from '../types';

export class TacticalRule0113 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0113';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'return';
  public readonly style: GeneratedTacticalRule['style'] = 'retreat';
  private readonly desiredRange = 288;
  private readonly lateralBias = 0.25;
  private readonly aggression = 1.009;
  private readonly cohesion = 0.322;
  private readonly hazardWeight = 0.45;
  private readonly healthThreshold = 0.64;
  private readonly phase = 3.1416;
  private readonly stride = 64;

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

export class TacticalRule0114 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0114';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'return';
  public readonly style: GeneratedTacticalRule['style'] = 'retreat';
  private readonly desiredRange = 305;
  private readonly lateralBias = 0.375;
  private readonly aggression = 1.036;
  private readonly cohesion = 0.383;
  private readonly hazardWeight = 0.64;
  private readonly healthThreshold = 0.75;
  private readonly phase = 3.3379;
  private readonly stride = 87;

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

export class TacticalRule0115 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0115';
  public readonly role: GeneratedTacticalRule['role'] = 'melee';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'retreat';
  private readonly desiredRange = 322;
  private readonly lateralBias = 0.5;
  private readonly aggression = 0.55;
  private readonly cohesion = 0.444;
  private readonly hazardWeight = 0.83;
  private readonly healthThreshold = 0.2;
  private readonly phase = 3.5343;
  private readonly stride = 110;

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

export class TacticalRule0116 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0116';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'retreat';
  private readonly desiredRange = 339;
  private readonly lateralBias = 0.625;
  private readonly aggression = 0.577;
  private readonly cohesion = 0.505;
  private readonly hazardWeight = 1.02;
  private readonly healthThreshold = 0.31;
  private readonly phase = 3.7306;
  private readonly stride = 133;

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

export class TacticalRule0117 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0117';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'patrol';
  public readonly style: GeneratedTacticalRule['style'] = 'retreat';
  private readonly desiredRange = 76;
  private readonly lateralBias = 0.75;
  private readonly aggression = 0.604;
  private readonly cohesion = 0.566;
  private readonly hazardWeight = 1.21;
  private readonly healthThreshold = 0.42;
  private readonly phase = 3.927;
  private readonly stride = 156;

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

export class TacticalRule0118 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0118';
  public readonly role: GeneratedTacticalRule['role'] = 'melee';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'retreat';
  private readonly desiredRange = 93;
  private readonly lateralBias = -0.75;
  private readonly aggression = 0.631;
  private readonly cohesion = 0.627;
  private readonly hazardWeight = 1.4;
  private readonly healthThreshold = 0.53;
  private readonly phase = 4.1233;
  private readonly stride = 179;

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

export class TacticalRule0119 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0119';
  public readonly role: GeneratedTacticalRule['role'] = 'ranged';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'retreat';
  private readonly desiredRange = 110;
  private readonly lateralBias = -0.625;
  private readonly aggression = 0.658;
  private readonly cohesion = 0.688;
  private readonly hazardWeight = 1.59;
  private readonly healthThreshold = 0.64;
  private readonly phase = 4.3197;
  private readonly stride = 202;

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

export class TacticalRule0120 implements GeneratedTacticalRule {
  public readonly id = 'tactical-rule-0120';
  public readonly role: GeneratedTacticalRule['role'] = 'boss';
  public readonly state: GeneratedTacticalRule['state'] = 'idle';
  public readonly style: GeneratedTacticalRule['style'] = 'retreat';
  private readonly desiredRange = 127;
  private readonly lateralBias = -0.5;
  private readonly aggression = 0.685;
  private readonly cohesion = 0.749;
  private readonly hazardWeight = 0.45;
  private readonly healthThreshold = 0.75;
  private readonly phase = 4.516;
  private readonly stride = 65;

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

export const TacticalRulePack15: readonly GeneratedTacticalRule[] = [
  new TacticalRule0113(),
  new TacticalRule0114(),
  new TacticalRule0115(),
  new TacticalRule0116(),
  new TacticalRule0117(),
  new TacticalRule0118(),
  new TacticalRule0119(),
  new TacticalRule0120(),
];
