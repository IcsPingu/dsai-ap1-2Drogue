import Phaser from 'phaser';
import { ALL_LEVELS, LevelDefinition } from '../data/LevelData';
import { GENERATED_EDITOR_TOOL_COUNT, LevelEditorModel, TileKind } from '../tools';

const TILE_COLORS: Record<TileKind, number> = {
  0: 0x33283d,
  1: 0x75667e,
  2: 0x9b7a86,
  3: 0x274b63,
  4: 0xd24932,
  5: 0xf6d77a,
  6: 0x6f3156,
  7: 0xc38b37,
  8: 0x4bd6a0,
  9: 0xc85cff,
};

const TILE_NAMES: Record<TileKind, string> = {
  0: 'CHÃO',
  1: 'PAREDE',
  2: 'PILAR',
  3: 'ÁGUA',
  4: 'LAVA',
  5: 'SAÍDA',
  6: 'PORTA',
  7: 'BAÚ',
  8: 'INÍCIO',
  9: 'CHEFE',
};

export class EditorScene extends Phaser.Scene {
  private model!: LevelEditorModel;
  private grid!: Phaser.GameObjects.Graphics;
  private statusText!: Phaser.GameObjects.Text;
  private toolText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private selectedTile: TileKind = 1;
  private levelIndex = 0;
  private readonly originX = 28;
  private readonly originY = 122;
  private readonly tileSize = 16;
  private dragging = false;
  private lastPainted = '';

  public constructor() {
    super('EditorScene');
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#100b18');
    this.model = new LevelEditorModel(this.cloneLevel(ALL_LEVELS[this.levelIndex]));

    this.add.rectangle(640, 42, 1280, 84, 0x1b1226);
    this.add.text(28, 18, 'FORJA DE FASES', {
      fontFamily: 'Courier New, monospace', fontSize: '30px', color: '#f6d77a', fontStyle: 'bold',
    });
    this.add.text(28, 56, `${GENERATED_EDITOR_TOOL_COUNT} FERRAMENTAS REGISTRADAS`, {
      fontFamily: 'Courier New, monospace', fontSize: '12px', color: '#b89dc7',
    });

    this.levelText = this.add.text(700, 20, '', {
      fontFamily: 'Courier New, monospace', fontSize: '17px', color: '#decfe5', align: 'right',
    }).setOrigin(1, 0);
    this.createButton(730, 40, '◀ FASE', () => this.changeLevel(-1));
    this.createButton(850, 40, 'FASE ▶', () => this.changeLevel(1));
    this.createButton(970, 40, 'VALIDAR', () => this.validateLevel());
    this.createButton(1090, 40, 'EXPORTAR', () => this.exportLevel());
    this.createButton(1210, 40, 'MENU', () => this.scene.start('MenuScene'));

    this.add.text(this.originX, 96, 'MAPA — clique para pintar • SHIFT+clique para preencher • botão direito seleciona', {
      fontFamily: 'Courier New, monospace', fontSize: '12px', color: '#8f7b99',
    });
    this.grid = this.add.graphics();
    this.createPalette();
    this.createSidePanel();
    this.bindInput();
    this.refresh();
  }

  private createPalette(): void {
    const startX = 30;
    const y = 555;
    this.add.text(startX, 526, 'PALETA [0–9]', {
      fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#f6d77a', fontStyle: 'bold',
    });
    for (let tile = 0; tile <= 9; tile += 1) {
      const kind = tile as TileKind;
      const x = startX + tile * 66;
      const swatch = this.add.rectangle(x + 27, y + 21, 56, 44, TILE_COLORS[kind])
        .setStrokeStyle(kind === this.selectedTile ? 4 : 1, kind === this.selectedTile ? 0xffffff : 0x5a4865)
        .setInteractive({ useHandCursor: true });
      swatch.setData('tile', kind);
      swatch.on('pointerdown', () => {
        this.selectedTile = kind;
        this.refreshPalette();
        this.setStatus(`Pincel: ${TILE_NAMES[kind]} (${kind})`);
      });
      this.add.text(x + 27, y + 20, String(tile), {
        fontFamily: 'Courier New, monospace', fontSize: '16px', color: tile === 0 ? '#ffffff' : '#160e1d', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(2);
      this.add.text(x + 27, y + 50, TILE_NAMES[kind], {
        fontFamily: 'Courier New, monospace', fontSize: '8px', color: '#a994b4',
      }).setOrigin(0.5);
    }
  }

  private createSidePanel(): void {
    this.add.rectangle(977, 330, 540, 410, 0x1b1226, 0.92).setStrokeStyle(2, 0x4b3558);
    this.add.text(730, 140, 'FERRAMENTAS RÁPIDAS', {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#f6d77a', fontStyle: 'bold',
    });
    this.createButton(790, 190, 'DESFAZER [Z]', () => this.performUndo(), 128);
    this.createButton(930, 190, 'REFAZER [Y]', () => this.performRedo(), 128);
    this.createButton(1070, 190, 'BORDA', () => this.paintBorder(), 128);
    this.createButton(1210, 190, 'LIMPAR', () => this.clearInterior(), 128);

    this.add.text(730, 230, 'ATALHOS', {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#b89dc7', fontStyle: 'bold',
    });
    this.add.text(730, 255,
      '0–9  escolhe bloco\nZ     desfaz\nY     refaz\nV     valida\nE     exporta JSON\nESC   volta ao menu', {
        fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#decfe5', lineSpacing: 7,
      });

    this.toolText = this.add.text(730, 400, '', {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#a9dfc6', lineSpacing: 6, wordWrap: { width: 485 },
    });
    this.statusText = this.add.text(28, 648, '', {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#f6d77a', wordWrap: { width: 1210 },
    });
    this.add.text(28, 688, 'Editor integrado • alterações são reversíveis • exportação preserva checksum', {
      fontFamily: 'Courier New, monospace', fontSize: '11px', color: '#695b72',
    });
  }

  private bindInput(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.isInsideGrid(pointer.x, pointer.y)) return;
      if (pointer.rightButtonDown()) {
        const point = this.toGrid(pointer.x, pointer.y);
        this.model.selection.selectCell(point, pointer.event.shiftKey);
        this.refresh();
        return;
      }
      this.dragging = true;
      this.lastPainted = '';
      this.paintPointer(pointer);
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.dragging && pointer.isDown) this.paintPointer(pointer);
    });
    this.input.on('pointerup', () => { this.dragging = false; this.lastPainted = ''; });

    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    keyboard.on('keydown', (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) {
        this.selectedTile = Number(event.key) as TileKind;
        this.refreshPalette();
      } else if (event.key.toLowerCase() === 'z') this.performUndo();
      else if (event.key.toLowerCase() === 'y') this.performRedo();
      else if (event.key.toLowerCase() === 'v') this.validateLevel();
      else if (event.key.toLowerCase() === 'e') this.exportLevel();
      else if (event.key === 'Escape') this.scene.start('MenuScene');
    });
  }

  private paintPointer(pointer: Phaser.Input.Pointer): void {
    if (!this.isInsideGrid(pointer.x, pointer.y)) return;
    const point = this.toGrid(pointer.x, pointer.y);
    const key = `${point.x}:${point.y}`;
    if (key === this.lastPainted) return;
    this.lastPainted = key;
    const count = pointer.event.shiftKey
      ? this.model.fill(point.x, point.y, this.selectedTile)
      : this.model.paint(point.x, point.y, this.selectedTile) ? 1 : 0;
    if (count > 0) {
      this.setStatus(`${count} bloco${count === 1 ? '' : 's'} alterado${count === 1 ? '' : 's'}.`);
      this.refresh();
    }
  }

  private paintBorder(): void {
    const width = this.model.width;
    const height = this.model.height;
    this.model.rectangle({ x: 0, y: 0, width, height }, this.selectedTile, false);
    this.setStatus(`Borda pintada com ${TILE_NAMES[this.selectedTile]}.`);
    this.refresh();
  }

  private clearInterior(): void {
    if (this.model.width < 3 || this.model.height < 3) return;
    const count = this.model.rectangle({ x: 1, y: 1, width: this.model.width - 2, height: this.model.height - 2 }, 0, true);
    this.setStatus(`${count} blocos internos limpos.`);
    this.refresh();
  }

  private performUndo(): void {
    this.setStatus(this.model.undo() ? 'Alteração desfeita.' : 'Nada para desfazer.');
    this.refresh();
  }

  private performRedo(): void {
    this.setStatus(this.model.redo() ? 'Alteração refeita.' : 'Nada para refazer.');
    this.refresh();
  }

  private validateLevel(): void {
    const diagnostics = this.model.validate();
    const errors = diagnostics.filter(item => item.severity === 'error').length;
    const warnings = diagnostics.filter(item => item.severity === 'warning').length;
    const first = diagnostics[0]?.message ?? 'Fase válida e pronta para jogar.';
    this.setStatus(`Validação: ${errors} erro(s), ${warnings} aviso(s). ${first}`);
  }

  private exportLevel(): void {
    const source = this.model.exportDocument();
    const clipboard = globalThis.navigator?.clipboard;
    if (clipboard) {
      void clipboard.writeText(source).then(
        () => this.setStatus(`JSON copiado (${source.length} caracteres).`),
        () => this.setStatus(`JSON pronto (${source.length} caracteres); clipboard indisponível.`),
      );
    } else {
      this.setStatus(`JSON pronto (${source.length} caracteres); clipboard indisponível.`);
    }
  }

  private changeLevel(direction: number): void {
    this.levelIndex = (this.levelIndex + direction + ALL_LEVELS.length) % ALL_LEVELS.length;
    this.model = new LevelEditorModel(this.cloneLevel(ALL_LEVELS[this.levelIndex]));
    this.setStatus(`Fase carregada: ${this.model.level.name}.`);
    this.refresh();
  }

  private refresh(): void {
    const level = this.model.level;
    this.levelText.setText(`${this.levelIndex + 1}/${ALL_LEVELS.length}\n${level.name}`);
    this.toolText.setText([
      `Tamanho: ${this.model.width} × ${this.model.height}`,
      `Inimigos: ${level.enemies.length}`,
      `Itens: ${level.items.length}`,
      `Decorações: ${level.decorations.length}`,
      `Revisão: ${this.model.document.revision}`,
      `Selecionados: ${this.model.selection.value.cells.length}`,
    ]);
    this.drawGrid();
  }

  private drawGrid(): void {
    this.grid.clear();
    const selected = new Set(this.model.selection.value.cells.map(point => `${point.x}:${point.y}`));
    this.model.level.tileMap.forEach((row, y) => row.forEach((tile, x) => {
      const kind = tile as TileKind;
      const px = this.originX + x * this.tileSize;
      const py = this.originY + y * this.tileSize;
      this.grid.fillStyle(TILE_COLORS[kind] ?? 0xff00ff, 1);
      this.grid.fillRect(px, py, this.tileSize - 1, this.tileSize - 1);
      if (selected.has(`${x}:${y}`)) {
        this.grid.lineStyle(2, 0xffffff, 1);
        this.grid.strokeRect(px + 1, py + 1, this.tileSize - 3, this.tileSize - 3);
      }
    }));
  }

  private refreshPalette(): void {
    this.children.list.forEach(child => {
      if (!(child instanceof Phaser.GameObjects.Rectangle)) return;
      const tile = child.getData('tile') as TileKind | undefined;
      if (tile === undefined) return;
      child.setStrokeStyle(tile === this.selectedTile ? 4 : 1, tile === this.selectedTile ? 0xffffff : 0x5a4865);
    });
  }

  private createButton(x: number, y: number, label: string, action: () => void, width = 108): void {
    const rectangle = this.add.rectangle(x, y, width, 38, 0x2d2038).setStrokeStyle(2, 0x765683).setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: 'Courier New, monospace', fontSize: '12px', color: '#decfe5', fontStyle: 'bold',
    }).setOrigin(0.5);
    rectangle.on('pointerover', () => rectangle.setFillStyle(0x49304f));
    rectangle.on('pointerout', () => rectangle.setFillStyle(0x2d2038));
    rectangle.on('pointerdown', action);
  }

  private isInsideGrid(x: number, y: number): boolean {
    return x >= this.originX && y >= this.originY && x < this.originX + this.model.width * this.tileSize && y < this.originY + this.model.height * this.tileSize;
  }

  private toGrid(x: number, y: number): { x: number; y: number } {
    return { x: Math.floor((x - this.originX) / this.tileSize), y: Math.floor((y - this.originY) / this.tileSize) };
  }

  private setStatus(message: string): void {
    this.statusText.setText(message);
  }

  private cloneLevel(level: LevelDefinition): LevelDefinition {
    return JSON.parse(JSON.stringify(level)) as LevelDefinition;
  }
}
