import { DecorationPlacement, EnemyPlacement, ItemPlacement, LevelDefinition } from '../../data/LevelData';
import { EditorDocument } from '../core/EditorDocument';
import { DocumentSerializer } from '../core/DocumentSerializer';
import { SelectionModel } from '../core/SelectionModel';
import { EditorDiagnostic, EditorValue, GridPoint, GridRect } from '../types';

export type TileKind = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

function toEditorValue(level: LevelDefinition): EditorValue {
  return JSON.parse(JSON.stringify(level)) as EditorValue;
}

function toLevelDefinition(value: EditorValue): LevelDefinition {
  return JSON.parse(JSON.stringify(value)) as LevelDefinition;
}

export class LevelEditorModel {
  public readonly document: EditorDocument;
  public readonly selection = new SelectionModel();
  private readonly serializer = new DocumentSerializer();

  public constructor(level: LevelDefinition) {
    this.document = new EditorDocument(level.name, toEditorValue(level), 500);
  }

  public get level(): LevelDefinition {
    return toLevelDefinition(this.document.value);
  }

  public get width(): number {
    return this.level.tileMap[0]?.length ?? 0;
  }

  public get height(): number {
    return this.level.tileMap.length;
  }

  public tileAt(x: number, y: number): TileKind | undefined {
    if (!this.inBounds(x, y)) return undefined;
    return this.level.tileMap[y][x] as TileKind;
  }

  public paint(x: number, y: number, tile: TileKind): boolean {
    if (!this.inBounds(x, y) || this.tileAt(x, y) === tile) return false;
    this.document.set(['tileMap', y, x], tile, `Pintar bloco ${x},${y}`);
    return true;
  }

  public paintStroke(points: readonly GridPoint[], tile: TileKind): number {
    const unique = points.filter((point, index) => points.findIndex(candidate => candidate.x === point.x && candidate.y === point.y) === index);
    let count = 0;
    this.document.history.transaction(`Pincel: ${tile}`, () => {
      unique.forEach(point => { if (this.paint(point.x, point.y, tile)) count += 1; });
    });
    return count;
  }

  public fill(startX: number, startY: number, tile: TileKind): number {
    const target = this.tileAt(startX, startY);
    if (target === undefined || target === tile) return 0;
    const queue: GridPoint[] = [{ x: startX, y: startY }];
    const visited = new Set<string>();
    const points: GridPoint[] = [];
    while (queue.length > 0) {
      const point = queue.shift()!;
      const key = `${point.x}:${point.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      if (this.tileAt(point.x, point.y) !== target) continue;
      points.push(point);
      queue.push({ x: point.x - 1, y: point.y }, { x: point.x + 1, y: point.y }, { x: point.x, y: point.y - 1 }, { x: point.x, y: point.y + 1 });
    }
    return this.paintStroke(points, tile);
  }

  public rectangle(rect: GridRect, tile: TileKind, filled = true): number {
    const points: GridPoint[] = [];
    for (let y = rect.y; y < rect.y + rect.height; y += 1) {
      for (let x = rect.x; x < rect.x + rect.width; x += 1) {
        const border = x === rect.x || y === rect.y || x === rect.x + rect.width - 1 || y === rect.y + rect.height - 1;
        if (filled || border) points.push({ x, y });
      }
    }
    return this.paintStroke(points, tile);
  }

  public line(from: GridPoint, to: GridPoint, tile: TileKind): number {
    const points: GridPoint[] = [];
    let x = from.x;
    let y = from.y;
    const dx = Math.abs(to.x - from.x);
    const sx = from.x < to.x ? 1 : -1;
    const dy = -Math.abs(to.y - from.y);
    const sy = from.y < to.y ? 1 : -1;
    let error = dx + dy;
    while (true) {
      points.push({ x, y });
      if (x === to.x && y === to.y) break;
      const doubled = 2 * error;
      if (doubled >= dy) { error += dy; x += sx; }
      if (doubled <= dx) { error += dx; y += sy; }
    }
    return this.paintStroke(points, tile);
  }

  public addEnemy(enemy: EnemyPlacement): void {
    this.assertPosition(enemy.x, enemy.y);
    this.document.insert(['enemies', this.level.enemies.length], toEditorValue(enemy as unknown as LevelDefinition), 'Adicionar inimigo');
  }

  public updateEnemy(index: number, update: Partial<EnemyPlacement>): void {
    const enemy = this.level.enemies[index];
    if (!enemy) throw new Error(`Enemy index out of range: ${index}`);
    const next = { ...enemy, ...update };
    this.assertPosition(next.x, next.y);
    this.document.set(['enemies', index], toEditorValue(next as unknown as LevelDefinition), 'Editar inimigo');
  }

  public removeEnemy(index: number): void {
    if (!this.level.enemies[index]) throw new Error(`Enemy index out of range: ${index}`);
    this.document.delete(['enemies', index], 'Remover inimigo');
  }

  public addItem(item: ItemPlacement): void {
    this.assertPosition(item.x, item.y);
    this.document.insert(['items', this.level.items.length], JSON.parse(JSON.stringify(item)) as EditorValue, 'Adicionar item');
  }

  public addDecoration(decoration: DecorationPlacement): void {
    this.assertPosition(decoration.x, decoration.y);
    this.document.insert(['decorations', this.level.decorations.length], JSON.parse(JSON.stringify(decoration)) as EditorValue, 'Adicionar decoração');
  }

  public moveEntitiesInSelection(dx: number, dy: number): number {
    const selected = this.selection.value.cells;
    const selectedKeys = new Set(selected.map(point => `${point.x}:${point.y}`));
    let moved = 0;
    this.document.history.transaction('Mover entidades selecionadas', () => {
      this.level.enemies.forEach((enemy, index) => {
        if (!selectedKeys.has(`${enemy.x}:${enemy.y}`)) return;
        const x = Math.max(0, Math.min(this.width - 1, enemy.x + dx));
        const y = Math.max(0, Math.min(this.height - 1, enemy.y + dy));
        this.updateEnemy(index, { x, y });
        moved += 1;
      });
    });
    return moved;
  }

  public validate(): EditorDiagnostic[] {
    const level = this.level;
    const diagnostics: EditorDiagnostic[] = [];
    if (level.tileMap.length === 0) diagnostics.push(this.diagnostic('map-empty', 'error', 'O mapa não possui linhas.', ['tileMap']));
    const expectedWidth = level.tileMap[0]?.length ?? 0;
    level.tileMap.forEach((row, y) => {
      if (row.length !== expectedWidth) diagnostics.push(this.diagnostic(`row-width-${y}`, 'error', `A linha ${y} possui largura inconsistente.`, ['tileMap', y]));
      row.forEach((tile, x) => {
        if (!Number.isInteger(tile) || tile < 0 || tile > 9) diagnostics.push(this.diagnostic(`tile-${x}-${y}`, 'error', `Bloco inválido em ${x},${y}.`, ['tileMap', y, x]));
      });
    });
    const spawnCount = level.tileMap.flat().filter(tile => tile === 8).length;
    if (spawnCount === 0) diagnostics.push(this.diagnostic('spawn-missing', 'error', 'A fase precisa de pelo menos um ponto inicial.', ['tileMap']));
    if (spawnCount > 1) diagnostics.push(this.diagnostic('spawn-multiple', 'warning', 'Há mais de um ponto inicial no mapa.', ['tileMap']));
    const exitCount = level.tileMap.flat().filter(tile => tile === 5).length;
    if (exitCount === 0 && !level.bossId) diagnostics.push(this.diagnostic('exit-missing', 'warning', 'Fase sem saída e sem chefe final.', ['tileMap']));
    [...level.enemies, ...level.items, ...level.decorations].forEach((entity, index) => {
      if (!this.inBounds(entity.x, entity.y)) diagnostics.push(this.diagnostic(`entity-oob-${index}`, 'error', `Entidade fora do mapa em ${entity.x},${entity.y}.`, []));
    });
    if (level.difficulty < 1 || level.difficulty > 10) diagnostics.push(this.diagnostic('difficulty', 'error', 'Dificuldade deve ficar entre 1 e 10.', ['difficulty']));
    if (level.parTime <= 0) diagnostics.push(this.diagnostic('par-time', 'error', 'Tempo-alvo deve ser positivo.', ['parTime']));
    return diagnostics;
  }

  public exportDocument(): string {
    return this.serializer.serialize(this.document.value);
  }

  public importDocument(source: string): void {
    const value = this.serializer.deserialize(source);
    this.document.replace(value, 'Importar fase');
  }

  public undo(): boolean { return this.document.undo(); }
  public redo(): boolean { return this.document.redo(); }

  private inBounds(x: number, y: number): boolean {
    return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  private assertPosition(x: number, y: number): void {
    if (!this.inBounds(x, y)) throw new Error(`Position outside level: ${x},${y}`);
  }

  private diagnostic(id: string, severity: EditorDiagnostic['severity'], message: string, path: readonly (string | number)[]): EditorDiagnostic {
    return { id, severity, message, path, source: 'level-editor' };
  }
}
