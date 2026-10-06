import {
  GENERATED_TACTICAL_RULE_COUNT,
  GENERATED_TACTICAL_RULES,
  GeneratedAwarenessState,
  GeneratedEnemyRole,
  GeneratedTacticalContext,
  GeneratedTacticalDirector,
} from '../ai/generated';

function context(
  role: GeneratedEnemyRole = 'melee',
  state: GeneratedAwarenessState = 'chase',
): GeneratedTacticalContext {
  return {
    actorId: 7,
    role,
    state,
    self: { x: 64, y: 96 },
    target: { x: 320, y: 224 },
    home: { x: 64, y: 96 },
    healthRatio: 0.75,
    targetVisible: true,
    nearbyAllies: 3,
    nearbyEnemies: 1,
    routeCost: 310,
    hazard: 0,
    elapsed: 1200,
  };
}

describe('catálogo tático gerado', () => {
  test('registra as 190 políticas executáveis solicitadas', () => {
    expect(GENERATED_TACTICAL_RULE_COUNT).toBe(190);
    expect(GENERATED_TACTICAL_RULES).toHaveLength(190);
    expect(new Set(GENERATED_TACTICAL_RULES.map((rule) => rule.id)).size).toBe(190);
  });

  test.each<GeneratedEnemyRole>(['melee', 'ranged', 'boss'])('diretor encontra política para %s', (role) => {
    const director = new GeneratedTacticalDirector();
    const decision = director.decide(context(role, 'chase'));
    expect(decision.ruleId).not.toBe('generated-fallback');
    expect(Number.isFinite(decision.score)).toBe(true);
    expect(Number.isFinite(decision.destination.x)).toBe(true);
    expect(Number.isFinite(decision.destination.y)).toBe(true);
    expect(decision.speedScale).toBeGreaterThanOrEqual(0.55);
    expect(decision.speedScale).toBeLessThanOrEqual(1.45);
  });

  test('mesmo contexto produz decisão determinística', () => {
    const director = new GeneratedTacticalDirector();
    const input = context('ranged', 'engage');
    expect(director.decide(input)).toEqual(director.decide(input));
  });

  test('todas as políticas retornam decisões finitas no próprio contexto', () => {
    for (const rule of GENERATED_TACTICAL_RULES) {
      const input = context(rule.role, rule.state);
      expect(rule.supports(input)).toBe(true);
      const decision = rule.evaluate(input);
      expect(Number.isFinite(decision.score)).toBe(true);
      expect(Number.isFinite(decision.destination.x)).toBe(true);
      expect(Number.isFinite(decision.destination.y)).toBe(true);
      expect(decision.reason.length).toBeGreaterThan(0);
    }
  });

  test('diagnósticos contabilizam avaliações aceitas e rejeitadas', () => {
    const director = new GeneratedTacticalDirector();
    director.decide(context('boss', 'engage'));
    const diagnostics = director.diagnostics();
    expect(diagnostics.evaluations).toBeGreaterThan(0);
    expect(diagnostics.accepted).toBeGreaterThan(0);
    expect(diagnostics.evaluations).toBe(diagnostics.accepted + diagnostics.rejected);
    expect(diagnostics.lastRuleId).toMatch(/^tactical-rule-/);
    director.resetDiagnostics();
    expect(director.diagnostics()).toEqual({
      evaluations: 0,
      accepted: 0,
      rejected: 0,
      lastRuleId: undefined,
    });
  });
});
