export type PlayerClassId = 'knight' | 'mage' | 'ranger' | 'rogue';

export type PrimaryStyle = 'melee' | 'orb' | 'arrow' | 'daggers';
export type SpecialStyle = 'aegis' | 'nova' | 'volley' | 'shadow';

export interface PlayerClassDefinition {
  id: PlayerClassId;
  name: string;
  title: string;
  weaponName: string;
  specialName: string;
  description: string;
  specialDescription: string;
  primaryStyle: PrimaryStyle;
  specialStyle: SpecialStyle;
  spriteFacing: 'left' | 'right';
  maxHp: number;
  maxMagic: number;
  speed: number;
  baseDamage: number;
  attackRange: number;
  attackCooldown: number;
  projectileSpeed: number;
  magicCost: number;
  color: number;
  accentColor: number;
}

export const PLAYER_CLASS_ORDER: PlayerClassId[] = ['knight', 'mage', 'ranger', 'rogue'];

export const CLASS_DATABASE: Record<PlayerClassId, PlayerClassDefinition> = {
  knight: {
    id: 'knight',
    name: 'CAVALEIRO',
    title: 'Guardião da Aurora',
    weaponName: 'Espada do Alvorecer',
    specialName: 'Invocação: Ícaro',
    description: 'Resistente e direto. Combate de perto com espada e escudo.',
    specialDescription: 'Invoca Ícaro, um serafim que protege e dispara lâminas sagradas (consome magia).',
    primaryStyle: 'melee',
    specialStyle: 'aegis',
    spriteFacing: 'left',
    maxHp: 6,
    maxMagic: 100,
    speed: 205,
    baseDamage: 42,
    attackRange: 92,
    attackCooldown: 430,
    projectileSpeed: 360,
    magicCost: 35,
    color: 0x3564a8,
    accentColor: 0xf5cf5b,
  },
  mage: {
    id: 'mage',
    name: 'MAGA',
    title: 'Tecelã do Arcano',
    weaponName: 'Cajado Lunar',
    specialName: 'Invocação: Nix',
    description: 'Ataca à distância com rajadas finas de magia concentrada.',
    specialDescription: 'Invoca Nix, uma chama arcana que orbita e lança magias em leque (consome magia).',
    primaryStyle: 'orb',
    specialStyle: 'nova',
    spriteFacing: 'left',
    maxHp: 4,
    maxMagic: 140,
    speed: 215,
    baseDamage: 30,
    attackRange: 360,
    attackCooldown: 330,
    projectileSpeed: 560,
    magicCost: 40,
    color: 0x6c3da3,
    accentColor: 0x62e1ff,
  },
  ranger: {
    id: 'ranger',
    name: 'ARQUEIRO',
    title: 'Olho da Floresta',
    weaponName: 'Arco Ventofino',
    specialName: 'Invocação: Sylphi',
    description: 'Segure o ataque para aumentar o dano e o alcance da flecha.',
    specialDescription: 'Invoca Sylphi, um espírito guardião que dispara flechas triplas (consome magia).',
    primaryStyle: 'arrow',
    specialStyle: 'volley',
    spriteFacing: 'right',
    maxHp: 5,
    maxMagic: 110,
    speed: 215,
    baseDamage: 34,
    attackRange: 460,
    attackCooldown: 390,
    projectileSpeed: 570,
    magicCost: 35,
    color: 0x2f714f,
    accentColor: 0xc8e66b,
  },
  rogue: {
    id: 'rogue',
    name: 'LADINO',
    title: 'Passo das Sombras',
    weaponName: 'Adagas Gêmeas',
    specialName: 'Invocação: Umbra',
    description: 'Clique para cortar; segure para arremessar uma adaga mais forte.',
    specialDescription: 'Invoca Umbra, um espelho das trevas que lança adagas cerradas (consome magia).',
    primaryStyle: 'daggers',
    specialStyle: 'shadow',
    spriteFacing: 'left',
    maxHp: 4,
    maxMagic: 100,
    speed: 265,
    baseDamage: 19,
    attackRange: 230,
    attackCooldown: 245,
    projectileSpeed: 500,
    magicCost: 30,
    color: 0x24213c,
    accentColor: 0xe84f75,
  },
};

export function getPlayerClass(id?: string): PlayerClassDefinition {
  return CLASS_DATABASE[(id as PlayerClassId) || 'knight'] ?? CLASS_DATABASE.knight;
}
