import { EditorSelection, GridPoint, GridRect } from '../types';

type SelectionListener = (selection: Readonly<EditorSelection>) => void;

export class SelectionModel {
  private state: EditorSelection = { anchor: null, focus: null, cells: [], entityIds: [] };
  private readonly listeners = new Set<SelectionListener>();

  public get value(): Readonly<EditorSelection> {
    return {
      anchor: this.state.anchor ? { ...this.state.anchor } : null,
      focus: this.state.focus ? { ...this.state.focus } : null,
      cells: this.state.cells.map(cell => ({ ...cell })),
      entityIds: [...this.state.entityIds],
    };
  }

  public selectCell(point: GridPoint, additive = false): void {
    const cells = additive ? this.togglePoint(this.state.cells, point) : [{ ...point }];
    this.state = { ...this.state, anchor: { ...point }, focus: { ...point }, cells };
    this.emit();
  }

  public selectRect(rect: GridRect, additive = false): void {
    const next = additive ? [...this.state.cells] : [];
    for (let y = rect.y; y < rect.y + rect.height; y += 1) {
      for (let x = rect.x; x < rect.x + rect.width; x += 1) {
        if (!next.some(cell => cell.x === x && cell.y === y)) next.push({ x, y });
      }
    }
    this.state = {
      ...this.state,
      anchor: { x: rect.x, y: rect.y },
      focus: { x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 },
      cells: next,
    };
    this.emit();
  }

  public selectEntity(id: string, additive = false): void {
    const entityIds = additive
      ? this.state.entityIds.includes(id) ? this.state.entityIds.filter(value => value !== id) : [...this.state.entityIds, id]
      : [id];
    this.state = { ...this.state, entityIds };
    this.emit();
  }

  public move(dx: number, dy: number, bounds?: GridRect): void {
    const moved = this.state.cells.map(cell => ({ x: cell.x + dx, y: cell.y + dy }));
    const cells = bounds ? moved.filter(cell => this.contains(bounds, cell)) : moved;
    const movePoint = (point: GridPoint | null): GridPoint | null => {
      if (!point) return null;
      const result = { x: point.x + dx, y: point.y + dy };
      return bounds && !this.contains(bounds, result) ? point : result;
    };
    this.state = { ...this.state, cells, anchor: movePoint(this.state.anchor), focus: movePoint(this.state.focus) };
    this.emit();
  }

  public clear(): void {
    this.state = { anchor: null, focus: null, cells: [], entityIds: [] };
    this.emit();
  }

  public subscribe(listener: SelectionListener): () => void {
    this.listeners.add(listener);
    listener(this.value);
    return () => this.listeners.delete(listener);
  }

  private togglePoint(cells: GridPoint[], point: GridPoint): GridPoint[] {
    return cells.some(cell => cell.x === point.x && cell.y === point.y)
      ? cells.filter(cell => cell.x !== point.x || cell.y !== point.y)
      : [...cells, { ...point }];
  }

  private contains(rect: GridRect, point: GridPoint): boolean {
    return point.x >= rect.x && point.y >= rect.y && point.x < rect.x + rect.width && point.y < rect.y + rect.height;
  }

  private emit(): void {
    const value = this.value;
    this.listeners.forEach(listener => listener(value));
  }
}
