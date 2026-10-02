// src/data/ItemDatabase.ts
// Catalog of usable items, health lollipops, magic concoctions, rings, accessories, 
// and currency drops inspired by Bayonetta's gates of hell shop.

export interface ItemDefinition {
  id: string;
  name: string;
  type: 'consumable' | 'accessory' | 'currency' | 'key' | 'upgrade';
  description: string;
  lore: string;
  price: number;
  icon: string;
  tint: number;
  healAmount?: number;
  magicAmount?: number;
  witchTimeDurationBonus?: number;
  damageMultiplier?: number;
  invincibleSeconds?: number;
  isEquippable?: boolean;
  accessorySlot?: 'ring1' | 'ring2' | 'pendant';
}

export const ITEM_DATABASE: Record<string, ItemDefinition> = {
  green_lollipop: {
    id: 'green_lollipop',
    name: 'Green Herb Lollipop',
    type: 'consumable',
    description: 'Restores 50 HP immediately.',
    lore: 'Concocted by Umbran witches using distilled green herbs from the vigrid hills.',
    price: 500,
    icon: 'item_potion',
    tint: 0x00ff44,
    healAmount: 50
  },
  mega_green_lollipop: {
    id: 'mega_green_lollipop',
    name: 'Mega Green Lollipop',
    type: 'consumable',
    description: 'Fully restores health to 100%.',
    lore: 'A concentrated witch elixir capable of mending mortal wounds in seconds.',
    price: 2500,
    icon: 'item_potion',
    tint: 0x00ffaa,
    healAmount: 999
  },
  purple_lollipop: {
    id: 'purple_lollipop',
    name: 'Purple Magic Lollipop',
    type: 'consumable',
    description: 'Fills the Magic Orbs meter to maximum for Torture Attacks.',
    lore: 'Tastes like sweet blueberries infused with infernal spirit energy.',
    price: 1200,
    icon: 'item_potion',
    tint: 0xaa00ff,
    magicAmount: 100
  },
  yellow_lollipop: {
    id: 'yellow_lollipop',
    name: 'Yellow Shield Lollipop',
    type: 'consumable',
    description: 'Grants complete invincibility for 10 seconds.',
    lore: 'Envelops the witch in a shimmering barrier of golden light.',
    price: 3000,
    icon: 'item_potion',
    tint: 0xffdd00,
    invincibleSeconds: 10
  },
  red_lollipop: {
    id: 'red_lollipop',
    name: 'Red Rage Lollipop',
    type: 'consumable',
    description: 'Doubles attack damage for 15 seconds.',
    lore: 'Infuses Bayonetta’s veins with pure infernal fury.',
    price: 2000,
    icon: 'item_potion',
    tint: 0xff2200,
    damageMultiplier: 2.0
  },
  moon_mahaa_kalaa: {
    id: 'moon_mahaa_kalaa',
    name: 'Moon of Mahaa-Kalaa',
    type: 'accessory',
    description: 'Pushing movement toward incoming attacks parries them perfectly, triggering instant Witch Time.',
    lore: 'A holy artifact crafted to reflect divine rays back at their source.',
    price: 20000,
    icon: 'item_chest',
    tint: 0x00e5ff,
    isEquippable: true,
    accessorySlot: 'ring1'
  },
  evil_harvest_rosary: {
    id: 'evil_harvest_rosary',
    name: 'Evil Harvest Rosary',
    type: 'accessory',
    description: 'Replaces Witch Time dodge with a delayed shadowy explosion that detonates on attackers.',
    lore: 'Blessed beads that absorb impact energy and detonate in a burst of dark flame.',
    price: 25000,
    icon: 'item_chest',
    tint: 0xff0055,
    isEquippable: true,
    accessorySlot: 'ring2'
  },
  selene_light: {
    id: 'selene_light',
    name: 'Selene’s Light',
    type: 'accessory',
    description: 'Automatically activates Witch Time whenever taking damage (consumes Magic Meter).',
    lore: 'Reflects the moonlight to slow down time when near death.',
    price: 18000,
    icon: 'item_chest',
    tint: 0xffd700,
    isEquippable: true,
    accessorySlot: 'pendant'
  },
  climax_brace: {
    id: 'climax_brace',
    name: 'Climax Brace',
    type: 'accessory',
    description: 'Grants infinite Magic Meter, allowing endless Torture Attacks and Wicked Weaves.',
    lore: 'Forbidden Umbran relic that unseals the witch’s full infernal power.',
    price: 100000,
    icon: 'item_chest',
    tint: 0xff00ff,
    isEquippable: true,
    accessorySlot: 'ring1'
  },
  halo_single: {
    id: 'halo_single',
    name: 'Halo Ring',
    type: 'currency',
    description: 'Golden currency dropped by slain angels.',
    lore: 'Sacred light bound into golden rings. Rodin accepts these at the Gates of Hell.',
    price: 0,
    icon: 'item_halo',
    tint: 0xffd700
  },
  witch_heart_fragment: {
    id: 'witch_heart_fragment',
    name: 'Witch Heart Fragment',
    type: 'upgrade',
    description: 'Collect 4 to permanently increase maximum Health by +25 HP.',
    lore: 'A glowing remnant of an Umbran Witch’s eternal soul.',
    price: 10000,
    icon: 'item_potion',
    tint: 0xff0044
  },
  moon_pearl_fragment: {
    id: 'moon_pearl_fragment',
    name: 'Broken Moon Pearl',
    type: 'upgrade',
    description: 'Collect 2 to permanently add +1 Magic Orb to the Magic Meter.',
    lore: 'Crystallized moonlight that stores infernal magic energy.',
    price: 12000,
    icon: 'item_potion',
    tint: 0xaaeeff
  }
};

export function getItemById(id: string): ItemDefinition {
  return ITEM_DATABASE[id] || ITEM_DATABASE.green_lollipop;
}
