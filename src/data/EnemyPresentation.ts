export type ImplementedEnemyId = 'affinity' | 'applaud' | 'fortitudo';

export interface EnemyPresentation {
  id: ImplementedEnemyId;
  name: string;
  title: string;
  description: string;
  lore: string;
  tint: number;
  textureKey: 'enemy_melee_anim' | 'enemy_ranged_anim' | 'boss_guardian_anim';
}

export const ENEMY_PRESENTATIONS: Record<ImplementedEnemyId, EnemyPresentation> = {
  affinity: {
    id: 'affinity',
    name: 'Afinidade',
    title: 'Soldado dos Céus',
    description: 'Anjo de linha de frente que persegue o herói e desfere investidas corpo a corpo.',
    lore: 'Criadas em grande número, as Afinidades executam a vontade celestial com disciplina e força coletiva.',
    tint: 0xf2cf68,
    textureKey: 'enemy_melee_anim',
  },
  applaud: {
    id: 'applaud',
    name: 'Aplauso',
    title: 'Arqueiro da Luz Divina',
    description: 'Combatente de longa distância que recua, prepara o disparo e lança flechas de luz.',
    lore: 'Os Aplausos vigiam o campo de batalha do alto e castigam quem permanece exposto por tempo demais.',
    tint: 0x69c9ff,
    textureKey: 'enemy_ranged_anim',
  },
  fortitudo: {
    id: 'fortitudo',
    name: 'Fortitudo',
    title: 'Virtude Cardeal da Coragem',
    description: 'Guardião colossal com muita vida, investidas pesadas e ondas de choque de curto alcance.',
    lore: 'Fortitudo encarna uma coragem impiedosa e protege os caminhos celestiais como uma muralha viva.',
    tint: 0xff704d,
    textureKey: 'boss_guardian_anim',
  },
};

export const IMPLEMENTED_ENEMY_IDS = Object.freeze(
  Object.keys(ENEMY_PRESENTATIONS) as ImplementedEnemyId[],
);

export function getEnemyPresentation(id: string): EnemyPresentation | undefined {
  return ENEMY_PRESENTATIONS[id as ImplementedEnemyId];
}
