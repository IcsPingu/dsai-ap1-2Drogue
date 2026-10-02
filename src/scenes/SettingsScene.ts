import Phaser from 'phaser';
import { GameSettings, loadSettings, saveSettings } from '../data/PlayerProfile';
import { SoundManager } from '../managers/SoundManager';

export class SettingsScene extends Phaser.Scene {
  private settings!: GameSettings;

  constructor() {
    super('SettingsScene');
  }

  public create(): void {
    this.settings = { ...loadSettings() };
    this.cameras.main.setBackgroundColor('#120d1a');
    this.add.rectangle(640, 360, 760, 540, 0x21162b, 1).setStrokeStyle(4, 0x6f4b7d);
    this.add.text(640, 125, 'AJUSTES', {
      fontFamily: 'Courier New, monospace', fontSize: '42px', color: '#f6d77a', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.createToggle(640, 270, 'EFEITOS SONOROS', 'sound');
    this.createToggle(640, 365, 'MOSTRAR COMANDOS', 'showControls');
    this.add.text(640, 455, 'A resolução se adapta automaticamente à sua tela.', {
      fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#9a86a4',
    }).setOrigin(0.5);
    this.add.text(640, 550, 'SALVAR E VOLTAR', {
      fontFamily: 'Courier New, monospace', fontSize: '20px', color: '#ffffff', backgroundColor: '#8f365f', padding: { x: 30, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      saveSettings(this.settings);
      SoundManager.setEnabled(this.settings.sound);
      this.scene.start('MenuScene');
    });
  }

  private createToggle(x: number, y: number, label: string, key: keyof GameSettings): void {
    this.add.text(x - 270, y, label, {
      fontFamily: 'Courier New, monospace', fontSize: '19px', color: '#d8c6df', fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    const button = this.add.text(x + 220, y, '', {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#ffffff', padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const refresh = () => button.setText(this.settings[key] ? 'LIGADO' : 'DESLIGADO').setBackgroundColor(this.settings[key] ? '#426b55' : '#633245');
    button.on('pointerdown', () => {
      this.settings[key] = !this.settings[key];
      refresh();
    });
    refresh();
  }
}
