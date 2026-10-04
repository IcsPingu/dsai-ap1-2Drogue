import Phaser from 'phaser';
import { ALL_ENEMIES, EnemyDefinition } from '../data/EnemyDatabase';
import { CLASS_DATABASE, PLAYER_CLASS_ORDER } from '../data/ClassDatabase';
import { WEAPON_DATABASE, WeaponDefinition } from '../data/WeaponDatabase';

type Tab = 'mobs' | 'players' | 'weapons';

interface CatalogEntry {
  name: string;
  subtitle: string;
  description: string;
  lore?: string;
  iconKey?: string;
  iconFrame?: number;
}

export class CatalogScene extends Phaser.Scene {
  private tab: Tab = 'mobs';
  private rows: Phaser.GameObjects.GameObject[] = [];
  private detailGroup?: Phaser.GameObjects.Container;

  constructor() {
    super('CatalogScene');
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#100b18');
    this.add.text(640, 50, 'CATÁLOGO', {
      fontFamily: 'Courier New, monospace', fontSize: '40px', color: '#f6d77a', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.createTabButton(340, 115, 'MOBS', 'mobs');
    this.createTabButton(640, 115, 'PERSONAGENS', 'players');
    this.createTabButton(940, 115, 'ARMAS', 'weapons');

    const back = this.add.text(640, 675, '[ VOLTAR ]', {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#decfe5',
      backgroundColor: '#2d2038', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => this.scene.start('MenuScene'));

    this.renderRows();
  }

  private createTabButton(x: number, y: number, label: string, tab: Tab): void {
    const bg = this.add.rectangle(x, y, 240, 44, tab === this.tab ? 0x9b3f68 : 0x2d2038, 1)
      .setStrokeStyle(2, 0x765683).setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#fff1b8', fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerdown', () => {
      this.tab = tab;
      this.scene.restart();
    });
  }

  private getEntries(): CatalogEntry[] {
    if (this.tab === 'mobs') {
      return ALL_ENEMIES.map((e: EnemyDefinition) => ({
        name: e.name,
        subtitle: e.title,
        description: e.description,
        lore: e.lore,
        iconKey: e.name.toLowerCase().includes('joy') || e.name.toLowerCase().includes('harmony')
          ? 'enemy_ranged_anim'
          : e.name.toLowerCase().includes('fortitude') || e.name.toLowerCase().includes('jubileu')
            ? 'boss_guardian_anim'
            : 'enemy_melee_anim',
        iconFrame: 0,
      }));
    }
    if (this.tab === 'players') {
      return PLAYER_CLASS_ORDER.map(id => {
        const c = CLASS_DATABASE[id];
        return {
          name: c.name,
          subtitle: `${c.title} — ${c.weaponName}`,
          description: `${c.description}\n\nEspecial: ${c.specialName}\n${c.specialDescription}`,
          iconKey: `class_${id}_woman`,
        };
      });
    }
    return Object.values(WEAPON_DATABASE).map((w: WeaponDefinition) => ({
      name: w.name,
      subtitle: `${w.title} — ${w.category}`,
      description: `${w.description}\n\nDano base: ${w.baseDamage} | Nível: ${w.requiredLevel} | Preço: ${w.price}⏣`,
      lore: w.lore,
      iconKey: 'item_halo',
    }));
  }

  private renderRows(): void {
    this.rows.forEach(r => r.destroy());
    this.rows = [];
    this.detailGroup?.destroy();
    this.detailGroup = undefined;

    const entries = this.getEntries();
    entries.slice(0, 13).forEach((entry, i) => {
      const y = 175 + i * 36;
      const rowBg = this.add.rectangle(300, y, 520, 32, 0x2d2038, 0.9)
        .setStrokeStyle(1, 0x765683).setInteractive({ useHandCursor: true });
      const text = this.add.text(60, y, entry.name, {
        fontFamily: 'Courier New, monospace', fontSize: '16px', color: '#decfe5',
      }).setOrigin(0, 0.5);
      if (entry.iconKey) {
        const icon = this.add.image(32, y, entry.iconKey, entry.iconFrame).setDisplaySize(28, 28);
        this.rows.push(icon);
      }
      rowBg.on('pointerover', () => rowBg.setFillStyle(0x3d2a48));
      rowBg.on('pointerout', () => rowBg.setFillStyle(0x2d2038));
      rowBg.on('pointerdown', () => this.showDetail(entry));
      this.rows.push(rowBg, text);
    });
  }

  private showDetail(entry: CatalogEntry): void {
    this.detailGroup?.destroy();
    const group = this.add.container(610, 160);
    const bg = this.add.rectangle(285, 220, 580, 440, 0x1b1226, 1).setStrokeStyle(2, 0x9b3f68);
    group.add(bg);
    if (entry.iconKey) {
      const big = this.add.image(285, 90, entry.iconKey, entry.iconFrame).setDisplaySize(110, 110);
      group.add(big);
    }
    const title = this.add.text(285, 165, entry.name, {
      fontFamily: 'Courier New, monospace', fontSize: '24px', color: '#f6d77a', fontStyle: 'bold',
    }).setOrigin(0.5);
    const subtitle = this.add.text(285, 195, entry.subtitle, {
      fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#b89dc7',
    }).setOrigin(0.5);
    const body = this.add.text(285, 230, `${entry.description}${entry.lore ? `\n\n“${entry.lore}”` : ''}`, {
      fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#decfe5',
      wordWrap: { width: 520 }, align: 'center', lineSpacing: 4,
    }).setOrigin(0.5, 0);
    group.add([title, subtitle, body]);
    this.detailGroup = group;
  }
}
