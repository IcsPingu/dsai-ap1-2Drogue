// src/data/WeaponDatabase.ts
// Comprehensive weapon catalog inspired by Bayonetta's arsenal.
// Defines weapon stats, attack combos, wicked weave finishers, visuals, and sound triggers.

export interface MoveDefinition {
  id: string;
  name: string;
  sequence: ('P' | 'K' | 'D' | 'H')[]; // Punch, Kick, Delay, Hold
  damageMultiplier: number;
  range: number;
  knockback: number;
  stunFrames: number;
  isWickedWeave: boolean;
  wickedWeaveType?: 'giant_fist' | 'giant_boot' | 'demon_blade' | 'infernal_whip' | 'fire_wave' | 'ice_spike';
  animation: string;
  fxColor: number;
  soundEffect: string;
  description: string;
}

export interface WeaponDefinition {
  id: string;
  name: string;
  title: string;
  category: 'handguns' | 'katana' | 'whip' | 'claws' | 'skates' | 'shotguns' | 'rocket_launchers' | 'nunchaku' | 'beam_saber';
  description: string;
  lore: string;
  icon: string;
  baseDamage: number;
  attackSpeed: number; // Attack rate multiplier
  attackRange: number;
  critChance: number;
  critMultiplier: number;
  witchTimeBonusDuration: number; // Extra Witch Time seconds granted on perfect dodge with this weapon
  magicGainMultiplier: number; // Magic meter charge rate
  tintColor: number;
  trailColor: number;
  glowColor: number;
  moves: MoveDefinition[];
  price: number;
  requiredLevel: number;
  isUnlockedDefault: boolean;
}

export const WEAPON_DATABASE: Record<string, WeaponDefinition> = {
  scarborough_fair: {
    id: 'scarborough_fair',
    name: 'Scarborough Fair',
    title: 'Guns of Parsley, Sage, Rosemary & Thyme',
    category: 'handguns',
    description: 'Four enchanted handguns forged by the famous demon smith Rodin. They fire rapid magical rounds that tear through angelic flesh.',
    lore: 'Crafted with demonic alloys and inscribed with ancient runes. Each gun is named after herbs symbolizing death and rebirth in Umbran myth.',
    icon: 'gun_icon',
    baseDamage: 20,
    attackSpeed: 1.2,
    attackRange: 220,
    critChance: 0.15,
    critMultiplier: 1.8,
    witchTimeBonusDuration: 0.5,
    magicGainMultiplier: 1.2,
    tintColor: 0xcc9933,
    trailColor: 0xffdd66,
    glowColor: 0xffaa00,
    isUnlockedDefault: true,
    price: 0,
    requiredLevel: 1,
    moves: [
      {
        id: 'sf_p',
        name: 'Parsley Jab',
        sequence: ['P'],
        damageMultiplier: 1.0,
        range: 120,
        knockback: 10,
        stunFrames: 6,
        isWickedWeave: false,
        animation: 'punch_light',
        fxColor: 0xffcc44,
        soundEffect: 'sfx_gun_shot',
        description: 'A swift magical bullet punch.'
      },
      {
        id: 'sf_pp',
        name: 'Sage Barrage',
        sequence: ['P', 'P'],
        damageMultiplier: 1.2,
        range: 130,
        knockback: 15,
        stunFrames: 8,
        isWickedWeave: false,
        animation: 'punch_heavy',
        fxColor: 0xffdd55,
        soundEffect: 'sfx_gun_rapid',
        description: 'Double shot followed by a high kick.'
      },
      {
        id: 'sf_ppp',
        name: 'Rosemary Staccato',
        sequence: ['P', 'P', 'P'],
        damageMultiplier: 1.5,
        range: 150,
        knockback: 25,
        stunFrames: 12,
        isWickedWeave: false,
        animation: 'spin_kick',
        fxColor: 0xffee66,
        soundEffect: 'sfx_gun_rapid',
        description: 'Spinning quad-burst spraying bullets in all directions.'
      },
      {
        id: 'sf_pppp',
        name: 'Thyme Wicked Punch',
        sequence: ['P', 'P', 'P', 'P'],
        damageMultiplier: 3.5,
        range: 250,
        knockback: 80,
        stunFrames: 25,
        isWickedWeave: true,
        wickedWeaveType: 'giant_fist',
        animation: 'wicked_fist',
        fxColor: 0x9900ff,
        soundEffect: 'sfx_wicked_weave',
        description: 'Summons a colossal infernal fist from the shadows to crush enemies.'
      },
      {
        id: 'sf_pk',
        name: 'Low Sweep',
        sequence: ['P', 'K'],
        damageMultiplier: 1.3,
        range: 140,
        knockback: 30,
        stunFrames: 10,
        isWickedWeave: false,
        animation: 'kick_low',
        fxColor: 0xffaa00,
        soundEffect: 'sfx_kick_heavy',
        description: 'Sweeping leg strike firing heel-guns.'
      },
      {
        id: 'sf_pkk',
        name: 'Wicked Boot Finisher',
        sequence: ['P', 'K', 'K'],
        damageMultiplier: 3.8,
        range: 260,
        knockback: 90,
        stunFrames: 30,
        isWickedWeave: true,
        wickedWeaveType: 'giant_boot',
        animation: 'wicked_boot',
        fxColor: 0xaa00ff,
        soundEffect: 'sfx_wicked_weave',
        description: 'Summons Madama Butterfly’s colossal high-heeled boot to stomp the arena.'
      }
    ]
  },
  shuraba: {
    id: 'shuraba',
    name: 'Shuraba',
    title: 'Demon Blade of Ashura',
    category: 'katana',
    description: 'A living blade forged from the soul of an ancient demon swordmaster. Slashes through armor with terrifying precision.',
    lore: 'Imbued with Ashuras wrath. It thirsts for celestial blood and unleashes dark dragon weaves on heavy slashes.',
    icon: 'blade_icon',
    baseDamage: 38,
    attackSpeed: 1.4,
    attackRange: 180,
    critChance: 0.25,
    critMultiplier: 2.2,
    witchTimeBonusDuration: 0.8,
    magicGainMultiplier: 1.4,
    tintColor: 0xcc0033,
    trailColor: 0xff3366,
    glowColor: 0xff0044,
    isUnlockedDefault: false,
    price: 15000,
    requiredLevel: 2,
    moves: [
      {
        id: 'sh_p',
        name: 'Crimson Slash',
        sequence: ['P'],
        damageMultiplier: 1.2,
        range: 160,
        knockback: 15,
        stunFrames: 8,
        isWickedWeave: false,
        animation: 'sword_slash_1',
        fxColor: 0xff2255,
        soundEffect: 'sfx_sword_slash',
        description: 'Horizontal arc cut with blood-red energy trail.'
      },
      {
        id: 'sh_pp',
        name: 'Iai Thrust',
        sequence: ['P', 'P'],
        damageMultiplier: 1.6,
        range: 200,
        knockback: 25,
        stunFrames: 10,
        isWickedWeave: false,
        animation: 'sword_thrust',
        fxColor: 0xff4477,
        soundEffect: 'sfx_sword_slash',
        description: 'Lightning-fast lunging pierce.'
      },
      {
        id: 'sh_ppp',
        name: 'Demon Dragon Weave',
        sequence: ['P', 'P', 'P'],
        damageMultiplier: 4.2,
        range: 300,
        knockback: 110,
        stunFrames: 35,
        isWickedWeave: true,
        wickedWeaveType: 'demon_blade',
        animation: 'demon_blade_slash',
        fxColor: 0xff0033,
        soundEffect: 'sfx_demon_roar',
        description: 'Summons a gargantuan shadow blade that splits the screen.'
      }
    ]
  },
  kulshedra: {
    id: 'kulshedra',
    name: 'Kulshedra',
    title: 'Serpentine Whip of the Abyss',
    category: 'whip',
    description: 'A demonic whip possessing the soul of a hungry viper dragon. Pulls distant angels into melee combo range.',
    lore: 'Sealed within a crystal hilt, Kulshedra reaches out across the battlefield to bind and strangle foes.',
    icon: 'whip_icon',
    baseDamage: 28,
    attackSpeed: 1.1,
    attackRange: 320,
    critChance: 0.18,
    critMultiplier: 1.9,
    witchTimeBonusDuration: 0.6,
    magicGainMultiplier: 1.5,
    tintColor: 0x9900cc,
    trailColor: 0xcc66ff,
    glowColor: 0xaa00ee,
    isUnlockedDefault: false,
    price: 25000,
    requiredLevel: 3,
    moves: [
      {
        id: 'ks_p',
        name: 'Viper Crack',
        sequence: ['P'],
        damageMultiplier: 1.1,
        range: 280,
        knockback: 5,
        stunFrames: 10,
        isWickedWeave: false,
        animation: 'whip_lash',
        fxColor: 0xaa33ff,
        soundEffect: 'sfx_whip_crack',
        description: 'Long-range whip snap that pulls targets toward Bayonetta.'
      },
      {
        id: 'ks_pp',
        name: 'Serpent Coil',
        sequence: ['P', 'P'],
        damageMultiplier: 1.8,
        range: 300,
        knockback: -150, // Pulls enemies close!
        stunFrames: 15,
        isWickedWeave: false,
        animation: 'whip_grapple',
        fxColor: 0xcc44ff,
        soundEffect: 'sfx_whip_pull',
        description: 'Wraps around target and yanks them directly into strike range.'
      },
      {
        id: 'ks_ppp',
        name: 'Infernal Hydra Weave',
        sequence: ['P', 'P', 'P'],
        damageMultiplier: 4.5,
        range: 350,
        knockback: 100,
        stunFrames: 30,
        isWickedWeave: true,
        wickedWeaveType: 'infernal_whip',
        animation: 'hydra_strike',
        fxColor: 0x8800ff,
        soundEffect: 'sfx_hydra_roar',
        description: 'Summons three demonic serpent jaws that devour all surrounding enemies.'
      }
    ]
  },
  durga: {
    id: 'durga',
    name: 'Durga',
    title: 'Elemental Claws of Fire & Ice',
    category: 'claws',
    description: 'Twin gauntlets and greaves housing elemental spirits of fiery explosion and freezing frost.',
    lore: 'Forged in the infernal forge of Styx, Durga alternates between flame bursts and ice spikes.',
    icon: 'claw_icon',
    baseDamage: 32,
    attackSpeed: 1.5,
    attackRange: 140,
    critChance: 0.22,
    critMultiplier: 2.0,
    witchTimeBonusDuration: 0.7,
    magicGainMultiplier: 1.3,
    tintColor: 0xff5500,
    trailColor: 0xff9900,
    glowColor: 0xff3300,
    isUnlockedDefault: false,
    price: 35000,
    requiredLevel: 4,
    moves: [
      {
        id: 'dg_p',
        name: 'Flame Claw',
        sequence: ['P'],
        damageMultiplier: 1.3,
        range: 130,
        knockback: 20,
        stunFrames: 8,
        isWickedWeave: false,
        animation: 'claw_swipe',
        fxColor: 0xff6600,
        soundEffect: 'sfx_fire_burst',
        description: 'Fiery swipe creating an explosive shockwave.'
      },
      {
        id: 'dg_pp',
        name: 'Frost Spike',
        sequence: ['P', 'P'],
        damageMultiplier: 1.7,
        range: 150,
        knockback: 30,
        stunFrames: 18,
        isWickedWeave: false,
        animation: 'claw_freeze',
        fxColor: 0x00ccff,
        soundEffect: 'sfx_ice_shatter',
        description: 'Freezes target in place for 2 seconds.'
      },
      {
        id: 'dg_ppp',
        name: 'Infernal Elemental Eruption',
        sequence: ['P', 'P', 'P'],
        damageMultiplier: 4.8,
        range: 280,
        knockback: 120,
        stunFrames: 40,
        isWickedWeave: true,
        wickedWeaveType: 'fire_wave',
        animation: 'elemental_nuke',
        fxColor: 0xff3300,
        soundEffect: 'sfx_explosion_large',
        description: 'Triggers a massive fire-ice elemental explosion clearing the room.'
      }
    ]
  },
  kilgore: {
    id: 'kilgore',
    name: 'Lt. Col. Kilgore',
    title: 'Infernal Grenade Launchers',
    category: 'rocket_launchers',
    description: 'Heavy explosive artillery mounted on limbs. Fires mortar shells that obliterate boss armor.',
    lore: 'Named after a warlord who sold his soul to Hell. The rockets home in on divine aura.',
    icon: 'rocket_icon',
    baseDamage: 55,
    attackSpeed: 0.8,
    attackRange: 350,
    critChance: 0.30,
    critMultiplier: 2.5,
    witchTimeBonusDuration: 0.4,
    magicGainMultiplier: 1.1,
    tintColor: 0x88bb33,
    trailColor: 0xaaff44,
    glowColor: 0x669911,
    isUnlockedDefault: false,
    price: 50000,
    requiredLevel: 5,
    moves: [
      {
        id: 'kg_p',
        name: 'Mortar Shot',
        sequence: ['P'],
        damageMultiplier: 2.0,
        range: 320,
        knockback: 50,
        stunFrames: 15,
        isWickedWeave: false,
        animation: 'heavy_shot',
        fxColor: 0xffaa22,
        soundEffect: 'sfx_rocket_launch',
        description: 'Fires high-explosive rocket dealing AoE damage.'
      },
      {
        id: 'kg_pp',
        name: 'Salvo Barrage',
        sequence: ['P', 'P'],
        damageMultiplier: 2.8,
        range: 350,
        knockback: 75,
        stunFrames: 22,
        isWickedWeave: false,
        animation: 'heavy_salvo',
        fxColor: 0xffbb33,
        soundEffect: 'sfx_rocket_salvo',
        description: 'Launches 4 micro-missiles in a spread pattern.'
      },
      {
        id: 'kg_ppp',
        name: 'Nuclear Wicked Shell',
        sequence: ['P', 'P', 'P'],
        damageMultiplier: 6.0,
        range: 400,
        knockback: 180,
        stunFrames: 50,
        isWickedWeave: true,
        wickedWeaveType: 'fire_wave',
        animation: 'nuke_blast',
        fxColor: 0xff4400,
        soundEffect: 'sfx_nuke_boom',
        description: 'Summons an apocalyptic demonic warhead detonating the entire screen.'
      }
    ]
  }
};

export function getWeaponById(id: string): WeaponDefinition {
  return WEAPON_DATABASE[id] || WEAPON_DATABASE.scarborough_fair;
}
