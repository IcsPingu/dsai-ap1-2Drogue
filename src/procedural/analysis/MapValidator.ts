import { Grid } from '../core/Grid';
import { GeneratedMap, TileKind, ValidationIssue, ValidationReport } from '../core/types';
import { tileIsPassable } from '../core/GenerationSupport';
import { Pathfinder } from './Pathfinder';
import { TopologyAnalyzer } from './TopologyAnalyzer';

export class MapValidator {
  private readonly pathfinder = new Pathfinder();
  private readonly analyzer = new TopologyAnalyzer();

  public validate(map: GeneratedMap): ValidationReport {
    const issues: ValidationIssue[] = [];
    if (map.tiles.length !== map.height || map.tiles.some((row) => row.length !== map.width)) {
      issues.push({ code: 'invalid-dimensions', severity: 'error', message: 'Tile matrix dimensions do not match map metadata.' });
      return { valid: false, issues, metrics: map.metrics };
    }
    const grid = Grid.fromRows(map.tiles);
    this.checkBorder(grid, issues);
    this.checkPoint(grid, map.spawn, TileKind.Spawn, 'spawn', issues);
    this.checkPoint(grid, map.exit, TileKind.Exit, 'exit', issues);
    const path = this.pathfinder.breadthFirst(grid, map.spawn, map.exit, tileIsPassable);
    if (path.length === 0) issues.push({ code: 'unreachable-exit', severity: 'error', message: 'Exit cannot be reached from spawn.' });
    const metrics = this.analyzer.analyze(map);
    if (metrics.openness < 0.12) issues.push({ code: 'too-dense', severity: 'warning', message: 'The map has very little traversable area.' });
    if (metrics.openness > 0.8) issues.push({ code: 'too-open', severity: 'warning', message: 'The map is excessively open.' });
    if (metrics.mainPathLength < Math.min(map.width, map.height)) {
      issues.push({ code: 'short-main-path', severity: 'warning', message: 'The main path is shorter than the target traversal length.' });
    }
    if (metrics.componentCount > 1) issues.push({ code: 'disconnected-regions', severity: 'warning', message: 'Optional floor regions are disconnected.' });
    this.checkPlacements(grid, map, issues);
    return { valid: !issues.some((issue) => issue.severity === 'error'), issues, metrics };
  }

  private checkBorder(grid: Grid<number>, issues: ValidationIssue[]): void {
    grid.forEach((tile, x, y) => {
      if (grid.isBorder(x, y) && tile !== TileKind.Wall) {
        issues.push({ code: 'open-border', severity: 'error', message: 'The map border must be sealed.', position: { x, y } });
      }
    });
  }

  private checkPoint(grid: Grid<number>, point: { x: number; y: number }, expected: TileKind, label: string, issues: ValidationIssue[]): void {
    if (!grid.inBounds(point.x, point.y)) {
      issues.push({ code: label + '-outside-map', severity: 'error', message: label + ' is outside map bounds.', position: point });
    } else if (grid.get(point.x, point.y) !== expected) {
      issues.push({ code: label + '-tile-mismatch', severity: 'error', message: label + ' metadata does not match its tile.', position: point });
    }
  }

  private checkPlacements(grid: Grid<number>, map: GeneratedMap, issues: ValidationIssue[]): void {
    const occupied = new Set<string>();
    const placements = [
      ...map.enemies.map((entry) => ({ id: entry.id, position: entry.position })),
      ...map.items.map((entry) => ({ id: entry.id, position: entry.position })),
    ];
    for (const placement of placements) {
      const key = placement.position.x + ',' + placement.position.y;
      if (!grid.inBounds(placement.position.x, placement.position.y) || !tileIsPassable(grid.get(placement.position.x, placement.position.y))) {
        issues.push({ code: 'placement-on-solid', severity: 'error', message: placement.id + ' is placed on a solid tile.', position: placement.position });
      }
      if (occupied.has(key)) issues.push({ code: 'placement-overlap', severity: 'warning', message: 'Multiple content entries occupy ' + key + '.', position: placement.position });
      occupied.add(key);
    }
  }
}
