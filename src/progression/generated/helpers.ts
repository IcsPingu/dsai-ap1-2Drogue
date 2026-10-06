import {
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
