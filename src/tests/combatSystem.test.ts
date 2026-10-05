import { DeterministicRandom } from '../simulation/core/DeterministicRandom';
import {
  AbilityRegistry,
  CombatClock,
  CombatDecisionScorer,
  CombatEventStream,
  CombatReplayLog,
  CombatRuntime,
  CombatZoneSystem,
  Combatant,
  CooldownBook,
  DamagePipeline,
  EffectRegistry,
  ElementalReactionEngine,
  HitboxGeometry,
  ResourcePool,
  TagSet,
  TargetResolver,
  ThreatTable,
  createAbilityCatalog,
  createCombatEffectCatalog,
  createDefaultStats,
} from '../combat';

describe('sistema de combate, habilidades e efeitos', () => {
  test('catálogo registra 120 habilidades, trinta por classe', () => {
    const registry = new AbilityRegistry().registerMany(createAbilityCatalog());
    expect(registry.size).toBe(120);
    expect(registry.forClass('knight')).toHaveLength(30);
    expect(registry.forClass('mage')).toHaveLength(30);
    expect(registry.forClass('ranger')).toHaveLength(30);
    expect(registry.forClass('rogue')).toHaveLength(30);
    expect(new Set(registry.list().map((ability) => ability.definition.id)).size).toBe(120);
  });

  test('catálogo registra oitenta efeitos executáveis', () => {
    const registry = new EffectRegistry().registerMany(createCombatEffectCatalog());
    expect(registry.size).toBe(80);
    expect(registry.byTag('fire')).toHaveLength(10);
    expect(registry.byTag('frost')).toHaveLength(10);
    expect(registry.byTag('shadow')).toHaveLength(10);
  });

  test('pool de recursos realiza gasto atômico', () => {
    const values = { health: 100, mana: 40, stamina: 30, guard: 20, combo: 0, ultimate: 0 };
    const pool = new ResourcePool(values, { health: 100, mana: 100, stamina: 100, guard: 100, combo: 100, ultimate: 100 });
    expect(pool.spend([{ resource: 'mana', amount: 25 }, { resource: 'stamina', amount: 20 }])).toEqual(expect.objectContaining({ mana: 25, stamina: 20 }));
    expect(pool.get('mana')).toBe(15);
    expect(pool.spend([{ resource: 'mana', amount: 20 }, { resource: 'health', amount: 10 }])).toBeUndefined();
    expect(pool.get('health')).toBe(100);
  });

  test('cooldowns recarregam múltiplas cargas', () => {
    const cooldowns = new CooldownBook();
    expect(cooldowns.consume('dash', 0, 1000, 2)).toBe(true);
    expect(cooldowns.consume('dash', 10, 1000, 2)).toBe(true);
    expect(cooldowns.consume('dash', 20, 1000, 2)).toBe(false);
    expect(cooldowns.charges('dash', 1001)).toBe(1);
    expect(cooldowns.charges('dash', 2001)).toBe(2);
  });

  test('tags aceitam consultas compostas', () => {
    const tags = new TagSet(['player', 'burning', 'airborne']);
    expect(tags.matches('player&burning')).toBe(true);
    expect(tags.matches('enemy|airborne')).toBe(true);
    expect(tags.matches('player&!stunned')).toBe(true);
    expect(tags.matches('enemy&burning')).toBe(false);
  });

  test('bloco de atributos aplica soma, multiplicação e override por prioridade', () => {
    const combatant = new Combatant({ id: 'hero', name: 'Hero', classId: 'knight', team: 'player', stats: { attackPower: 20 } });
    combatant.addStatModifier({ id: 'flat', stat: 'attackPower', operation: 'add', value: 10, priority: 1 });
    combatant.addStatModifier({ id: 'mult', stat: 'attackPower', operation: 'multiply', value: 2, priority: 2 });
    expect(combatant.stats.get('attackPower')).toBe(60);
    combatant.addStatModifier({ id: 'override', stat: 'attackPower', operation: 'override', value: 99, priority: 3 });
    expect(combatant.stats.get('attackPower')).toBe(99);
  });

  test('pipeline de dano respeita armadura', () => {
    const source = new Combatant({ id: 'source', name: 'Source', classId: 'knight', team: 'player', stats: { attackPower: 0 } });
    const target = new Combatant({ id: 'target', name: 'Target', classId: 'enemy', team: 'enemy', stats: { maximumHealth: 1000, armor: 100, dodgeChance: 0, blockChance: 0 } });
    const result = new DamagePipeline().resolve({ sourceId: source.id, targetId: target.id, damageType: 'physical', baseAmount: 100, powerRatio: 0, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0, tags: [], hitIndex: 0 }, source, target, new DeterministicRandom(1));
    expect(result.applied).toBeCloseTo(50);
    expect(result.mitigated).toBeCloseTo(50);
  });

  test('dano verdadeiro ignora defesa e resistência', () => {
    const source = new Combatant({ id: 'source', name: 'Source', classId: 'mage', team: 'player' });
    const target = new Combatant({ id: 'target', name: 'Target', classId: 'boss', team: 'enemy', stats: { maximumHealth: 1000, armor: 500, resistance: 500 }, resistances: { true: 0.9 } });
    const result = new DamagePipeline().resolve({ sourceId: source.id, targetId: target.id, damageType: 'true', baseAmount: 100, powerRatio: 0, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0, tags: [], hitIndex: 0 }, source, target, new DeterministicRandom(1));
    expect(result.applied).toBe(100);
  });

  test('runtime executa habilidade, dano e efeito', () => {
    const runtime = createDuel('cast-test');
    const accepted = runtime.cast({ casterId: 'hero', abilityId: 'knight-opening-strike', targetId: 'enemy', targetPosition: { x: 40, y: 0 }, direction: { x: 1, y: 0 } });
    expect(accepted.accepted).toBe(true);
    const update = runtime.update(16);
    expect(update.damage.length).toBeGreaterThan(0);
    expect(runtime.getCombatant('enemy')!.resources.get('health')).toBeLessThan(1000);
    expect(runtime.effectEngine.forTarget('enemy').length).toBeGreaterThan(0);
  });

  test('runtime rejeita habilidade de outra classe', () => {
    const runtime = createDuel('wrong-class');
    expect(runtime.cast({ casterId: 'hero', abilityId: 'mage-opening-strike', targetId: 'enemy', targetPosition: { x: 40, y: 0 } }).reason).toBe('wrong-class');
  });

  test('runtime rejeita custo indisponível sem gastar recursos', () => {
    const runtime = createDuel('cost');
    const hero = runtime.getCombatant('hero')!;
    hero.resources.empty('ultimate');
    const result = runtime.cast({ casterId: 'hero', abilityId: 'knight-ultimate-art', targetId: 'enemy', targetPosition: { x: 40, y: 0 } });
    expect(result.accepted).toBe(false);
    expect(hero.resources.get('ultimate')).toBe(0);
  });

  test('efeito periódico produz ticks e expira', () => {
    const runtime = createDuel('effects');
    runtime.applyEffect({ effectId: 'fire-surge', sourceId: 'hero', targetId: 'enemy', duration: 1200 });
    const before = runtime.getCombatant('enemy')!.resources.get('health');
    for (let index = 0; index < 5; index++) runtime.update(250);
    expect(runtime.getCombatant('enemy')!.resources.get('health')).toBeLessThan(before);
    runtime.update(200);
    expect(runtime.effectEngine.has('enemy', 'fire-surge')).toBe(false);
  });

  test('efeitos de intensidade acumulam até o limite', () => {
    const runtime = createDuel('stacking');
    for (let index = 0; index < 8; index++) runtime.applyEffect({ effectId: 'fire-exposure', sourceId: 'hero', targetId: 'enemy' });
    expect(runtime.effectEngine.stacks('enemy', 'fire-exposure')).toBe(2);
  });

  test('limpeza remove apenas efeitos dissipáveis', () => {
    const runtime = createDuel('cleanse');
    runtime.applyEffect({ effectId: 'poison-wound', sourceId: 'hero', targetId: 'enemy' });
    expect(runtime.effectEngine.cleanse('enemy', runtime.time(), () => true)).toHaveLength(1);
  });

  test('reação elemental consome efeitos e causa dano', () => {
    const runtime = createDuel('reaction');
    runtime.applyEffect({ effectId: 'fire-brand', sourceId: 'hero', targetId: 'enemy' });
    runtime.applyEffect({ effectId: 'frost-brand', sourceId: 'hero', targetId: 'enemy' });
    const before = runtime.getCombatant('enemy')!.resources.get('health');
    const reaction = runtime.triggerReaction('hero', 'enemy', []);
    expect(reaction?.reaction.id).toBe('melt');
    expect(runtime.getCombatant('enemy')!.resources.get('health')).toBeLessThan(before);
    expect(reaction!.consumedInstances).toHaveLength(2);
  });

  test('registro de reações contém combinações distintas', () => {
    const reactions = new ElementalReactionEngine().list();
    expect(reactions).toHaveLength(8);
    expect(new Set(reactions.map((reaction) => reaction.id)).size).toBe(8);
  });

  test('zona persistente atinge combatentes dentro do círculo', () => {
    const runtime = createDuel('zone');
    runtime.createZone({ id: 'fire-zone', sourceId: 'hero', abilityId: 'knight-area-denial', position: { x: 40, y: 0 }, direction: { x: 1, y: 0 }, shape: 'circle', radius: 60, innerRadius: 0, width: 0, length: 0, duration: 1000, tickInterval: 250, damageType: 'fire', damagePerTick: 10, powerRatio: 0, effectDuration: 0, affectsTeams: ['enemy'], maximumTargets: 4, hitOnce: false, tags: ['fire'] });
    const before = runtime.getCombatant('enemy')!.resources.get('health');
    runtime.update(16);
    expect(runtime.getCombatant('enemy')!.resources.get('health')).toBeLessThan(before);
  });

  test('resolvedor seleciona alvos dentro de cone', () => {
    const caster = new Combatant({ id: 'a', name: 'A', classId: 'mage', team: 'player', position: { x: 0, y: 0 } }).snapshot();
    const front = new Combatant({ id: 'b', name: 'B', classId: 'enemy', team: 'enemy', position: { x: 50, y: 0 } }).snapshot();
    const back = new Combatant({ id: 'c', name: 'C', classId: 'enemy', team: 'enemy', position: { x: -50, y: 0 } }).snapshot();
    const result = new TargetResolver().resolve({ caster, candidates: [front, back], mode: 'cone', targetPosition: front.position, direction: { x: 1, y: 0 }, range: 100, radius: 20, angle: 60 });
    expect(result.map((entry) => entry.id)).toEqual(['b']);
  });

  test('projétil detecta colisão por varredura', () => {
    const runtime = createDuel('projectile');
    runtime.projectiles.spawn({ sourceId: 'hero', abilityId: 'knight-opening-strike', origin: { x: 0, y: 0 }, direction: { x: 1, y: 0 }, targetId: 'enemy', definition: { speed: 500, lifetime: 1000, radius: 15, piercing: 0, bounces: 0, homingStrength: 0, gravity: 0, acceleration: 0, maximumSpeed: 500, collisionTeams: ['enemy'], tags: [] } }, runtime.time());
    const result = runtime.update(100);
    expect(result.projectileCollisions).toBe(1);
  });

  test('combo reconhece sequência registrada', () => {
    const runtime = createDuel('combo');
    runtime.inputCombo('hero', 'light');
    runtime.update(100);
    runtime.inputCombo('hero', 'heavy');
    expect(runtime.comboState('hero').activeMoveId).toBe('knight-combo-1');
  });

  test('combo aumenta rank com dano acumulado', () => {
    const runtime = createDuel('combo-rank');
    for (let index = 0; index < 12; index++) runtime.combo.registerHit('hero', index * 50, 60, 'variety-' + index);
    expect(runtime.comboState('hero').rank).not.toBe('D');
    expect(runtime.combo.damageMultiplier('hero')).toBeGreaterThan(1);
  });

  test('tabela de ameaça prioriza taunt temporário', () => {
    const threat = new ThreatTable();
    threat.add('mage', 100, 0);
    threat.add('knight', 20, 0);
    expect(threat.target(0)).toBe('mage');
    threat.taunt('knight', 100, 1000);
    expect(threat.target(500)).toBe('knight');
    expect(threat.target(1200)).toBe('knight');
  });

  test('geometria reconhece interseção de círculo e cápsula', () => {
    const geometry = new HitboxGeometry();
    expect(geometry.intersects(
      { kind: 'circle', center: { x: 10, y: 5 }, radius: 8 },
      { kind: 'capsule', start: { x: 0, y: 0 }, end: { x: 20, y: 0 }, radius: 3 },
    )).toBe(true);
  });

  test('geometria reconhece ponto dentro de setor', () => {
    expect(new HitboxGeometry().contains({ kind: 'sector', center: { x: 0, y: 0 }, direction: { x: 1, y: 0 }, radius: 100, angle: 60 }, { x: 50, y: 5 })).toBe(true);
  });

  test('scorer de IA prefere uma decisão válida', () => {
    const runtime = createDuel('ai');
    const hero = runtime.getCombatant('hero')!;
    const enemy = runtime.getCombatant('enemy')!;
    const result = new CombatDecisionScorer().best({ actor: hero.snapshot(), allies: [hero.snapshot()], enemies: [enemy.snapshot()], abilities: runtime.abilities.forClass('knight'), cooldownReady: () => true });
    expect(result).toBeDefined();
    expect(result!.score).toBeGreaterThan(-Infinity);
  });

  test('métricas acumulam dano por combatente', () => {
    const runtime = createDuel('metrics');
    runtime.applyDamage({ sourceId: 'hero', targetId: 'enemy', damageType: 'physical', baseAmount: 50, powerRatio: 0, canCrit: false, canBlock: false, ignoresArmor: 0, ignoresResistance: 0, tags: [], hitIndex: 0 });
    const hero = runtime.metrics.snapshot().byCombatant.find((entry) => entry.combatantId === 'hero');
    expect(hero!.damageDealt).toBeGreaterThan(0);
  });

  test('snapshot restaura vida, posição e efeitos', () => {
    const runtime = createDuel('snapshot');
    runtime.applyEffect({ effectId: 'shadow-weakness', sourceId: 'hero', targetId: 'enemy' });
    const snapshot = runtime.capture();
    runtime.getCombatant('enemy')!.lose('health', 500);
    runtime.getCombatant('enemy')!.moveTo({ x: 999, y: 999 });
    runtime.restore(snapshot);
    expect(runtime.getCombatant('enemy')!.resources.get('health')).toBe(1000);
    expect(runtime.getCombatant('enemy')!.snapshot().position).toEqual({ x: 40, y: 0 });
    expect(runtime.effectEngine.has('enemy', 'shadow-weakness')).toBe(true);
  });

  test('replay serializa, valida checksum e desserializa', () => {
    const runtime = createDuel('replay');
    const replay = new CombatReplayLog('replay');
    replay.recordMove(10, 'hero', { x: 20, y: 30 });
    replay.recordCast(20, { casterId: 'hero', abilityId: 'knight-opening-strike', targetId: 'enemy' });
    replay.checkpoint(25, 'opening', runtime.capture());
    replay.setMetadata('difficulty', 3);
    const restored = CombatReplayLog.deserialize(replay.serialize());
    expect(restored.toData().commands).toHaveLength(2);
    expect(restored.verifyCheckpoints().every((entry) => entry.valid)).toBe(true);
  });

  test('relógio avança em passos fixos e respeita pausa', () => {
    const clock = new CombatClock(10, 100);
    const frames: number[] = [];
    expect(clock.advance(35, (_step, _time, frame) => frames.push(frame))).toBe(3);
    expect(frames).toEqual([1, 2, 3]);
    clock.pause();
    expect(clock.advance(50, () => fail('não deveria avançar'))).toBe(0);
    clock.resume();
    expect(clock.advanceTo(50, () => undefined)).toBe(2);
  });

  test('mesma semente produz o mesmo dano crítico', () => {
    const first = createDuel('deterministic');
    const second = createDuel('deterministic');
    const packet = { sourceId: 'hero', targetId: 'enemy', damageType: 'physical' as const, baseAmount: 80, powerRatio: 0.2, canCrit: true, canBlock: true, ignoresArmor: 0, ignoresResistance: 0, tags: ['test'], hitIndex: 7 };
    expect(first.previewDamage(packet)).toEqual(second.previewDamage(packet));
  });
});

function createDuel(seed: string): CombatRuntime {
  const runtime = new CombatRuntime(seed);
  runtime.addCombatant({
    id: 'hero',
    name: 'Hero',
    classId: 'knight',
    team: 'player',
    position: { x: 0, y: 0 },
    stats: { ...createDefaultStats(500, 200), attackPower: 45, spellPower: 30, criticalChance: 0.1 },
    resources: { ultimate: 100 },
  });
  runtime.addCombatant({
    id: 'enemy',
    name: 'Enemy',
    classId: 'enemy',
    team: 'enemy',
    position: { x: 40, y: 0 },
    stats: { ...createDefaultStats(1000, 100), armor: 10, resistance: 10, dodgeChance: 0, blockChance: 0 },
  });
  return runtime;
}
