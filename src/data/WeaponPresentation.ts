import { WeaponDefinition } from './WeaponDatabase';

export interface WeaponPresentation {
  name: string;
  title: string;
  category: string;
  description: string;
  lore: string;
  iconKey: string;
}

export const WEAPON_PRESENTATIONS: Record<string, WeaponPresentation> = {
  scarborough_fair: {
    name: 'Scarborough Fair',
    title: 'Pistolas de Salsa, Sálvia, Alecrim e Tomilho',
    category: 'Pistolas',
    description: 'Quatro pistolas encantadas que disparam projéteis mágicos rápidos contra criaturas celestiais.',
    lore: 'Forjadas com ligas demoníacas e runas antigas, recebem nomes de ervas ligadas à morte e ao renascimento na tradição Umbra.',
    iconKey: 'weapon_scarborough_fair',
  },
  shuraba: {
    name: 'Shuraba',
    title: 'Lâmina Demoníaca de Ashura',
    category: 'Katana',
    description: 'Katana viva que atravessa armaduras com cortes precisos e rastros de energia carmesim.',
    lore: 'A ira de Ashura habita a lâmina, que busca sangue celestial e manifesta golpes de um dragão sombrio.',
    iconKey: 'weapon_shuraba',
  },
  kulshedra: {
    name: 'Kulshedra',
    title: 'Chicote Serpentino do Abismo',
    category: 'Chicote',
    description: 'Chicote demoníaco de longo alcance que envolve inimigos distantes e os puxa para perto.',
    lore: 'A alma de uma serpente voraz permanece selada em seu punho de cristal e se estende pelo campo de batalha.',
    iconKey: 'weapon_kulshedra',
  },
  durga: {
    name: 'Durga',
    title: 'Garras Elementais de Fogo e Gelo',
    category: 'Garras elementais',
    description: 'Manoplas e grevas gêmeas que alternam explosões de fogo com golpes congelantes.',
    lore: 'Forjada nas chamas do Estige, Durga aprisiona espíritos opostos que atacam em perfeita combinação.',
    iconKey: 'weapon_durga',
  },
  kilgore: {
    name: 'Tenente-Coronel Kilgore',
    title: 'Lança-foguetes Infernal',
    category: 'Lança-foguetes',
    description: 'Artilharia pesada que dispara foguetes explosivos capazes de romper a defesa de chefes.',
    lore: 'Carrega o nome de um senhor da guerra que vendeu a alma ao Inferno; seus foguetes perseguem a aura divina.',
    iconKey: 'weapon_kilgore',
  },
};

export function getWeaponPresentation(weapon: WeaponDefinition): WeaponPresentation {
  return WEAPON_PRESENTATIONS[weapon.id] ?? {
    name: weapon.name,
    title: weapon.title,
    category: weapon.category,
    description: weapon.description,
    lore: weapon.lore,
    iconKey: weapon.icon,
  };
}
