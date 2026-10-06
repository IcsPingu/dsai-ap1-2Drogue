import { ALL_LEVELS } from '../data/LevelData';
import {
  DocumentSerializer,
  EditorDocument,
  EditorWorkspace,
  GENERATED_EDITOR_TOOL_COUNT,
  GENERATED_EDITOR_TOOLS,
  LevelEditorModel,
  SelectionModel,
  ToolRegistry,
  hashValue,
} from '../tools';

function cloneFirstLevel() {
  return JSON.parse(JSON.stringify(ALL_LEVELS[0]));
}

describe('editor document and history', () => {
  it('applies changes and supports undo and redo', () => {
    const document = new EditorDocument('test', { name: 'before', stats: { power: 2 } });
    document.set(['name'], 'after');
    document.set(['stats', 'power'], 5);

    expect(document.get(['name'])).toBe('after');
    expect(document.get(['stats', 'power'])).toBe(5);
    expect(document.history.snapshot().undoDepth).toBe(2);

    expect(document.undo()).toBe(true);
    expect(document.get(['stats', 'power'])).toBe(2);
    expect(document.undo()).toBe(true);
    expect(document.get(['name'])).toBe('before');
    expect(document.redo()).toBe(true);
    expect(document.get(['name'])).toBe('after');
  });

  it('commits a transaction as one history entry', () => {
    const document = new EditorDocument('transaction', { values: [1, 2, 3] });
    document.history.transaction('batch', () => {
      document.set(['values', 0], 10);
      document.set(['values', 1], 20);
      document.set(['values', 2], 30);
    });

    expect(document.value).toEqual({ values: [10, 20, 30] });
    expect(document.history.snapshot().undoDepth).toBe(1);
    document.undo();
    expect(document.value).toEqual({ values: [1, 2, 3] });
  });
});

describe('level editor', () => {
  it('paints strokes and restores them through history', () => {
    const editor = new LevelEditorModel(cloneFirstLevel());
    const before = editor.tileAt(2, 2);
    const changed = editor.paintStroke([{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }], 4);

    expect(changed).toBe(2);
    expect(editor.tileAt(2, 2)).toBe(4);
    expect(editor.tileAt(3, 2)).toBe(4);
    expect(editor.undo()).toBe(true);
    expect(editor.tileAt(2, 2)).toBe(before);
  });

  it('flood fills only the connected source region', () => {
    const editor = new LevelEditorModel(cloneFirstLevel());
    const original = editor.tileAt(2, 2);
    const changed = editor.fill(2, 2, 3);

    expect(changed).toBeGreaterThan(10);
    expect(editor.tileAt(2, 2)).toBe(3);
    expect(editor.tileAt(0, 0)).toBe(1);
    editor.undo();
    expect(editor.tileAt(2, 2)).toBe(original);
  });

  it('reports invalid level metadata and entity positions', () => {
    const level = cloneFirstLevel();
    level.difficulty = 99;
    level.enemies.push({ type: 'invalid', x: 999, y: 999, level: 1 });
    const diagnostics = new LevelEditorModel(level).validate();

    expect(diagnostics.some(item => item.id === 'difficulty' && item.severity === 'error')).toBe(true);
    expect(diagnostics.some(item => item.id.startsWith('entity-oob-'))).toBe(true);
  });
});

describe('serialization and selection', () => {
  it('round-trips editor documents and detects corruption', () => {
    const serializer = new DocumentSerializer();
    const value = { title: 'phase', values: [1, true, null] };
    const source = serializer.serialize(value);

    expect(serializer.deserialize(source)).toEqual(value);
    const corrupted = source.replace(hashValue(value), '00000000');
    expect(() => serializer.deserialize(corrupted)).toThrow('checksum mismatch');
  });

  it('builds rectangular and additive selections', () => {
    const selection = new SelectionModel();
    selection.selectRect({ x: 2, y: 3, width: 3, height: 2 });
    expect(selection.value.cells).toHaveLength(6);
    selection.selectCell({ x: 10, y: 10 }, true);
    expect(selection.value.cells).toHaveLength(7);
    selection.move(1, -1);
    expect(selection.value.cells).toContainEqual({ x: 11, y: 9 });
  });
});

describe('generated editor tool catalog', () => {
  it('contains 200 unique, categorized executable tools', () => {
    const ids = GENERATED_EDITOR_TOOLS.map(tool => tool.descriptor.id);
    expect(GENERATED_EDITOR_TOOL_COUNT).toBe(200);
    expect(new Set(ids).size).toBe(200);
    expect(GENERATED_EDITOR_TOOLS.every(tool => tool.descriptor.tags.includes('generated'))).toBe(true);
    expect(new Set(GENERATED_EDITOR_TOOLS.map(tool => tool.descriptor.category)).size).toBe(8);
  });

  it('previews without mutation and executes through the registry', () => {
    const workspace = new EditorWorkspace();
    const document = workspace.open('level', { name: 'test', editorMetadata: { operations: {} } });
    const tool = workspace.registry.list()[0];
    const before = document.value;
    const preview = workspace.preview(tool.descriptor.id, { parameters: { amount: 3 }, seed: 42 });

    expect(preview.applied).toBe(false);
    expect(preview.patches).toHaveLength(1);
    expect(document.value).toEqual(before);

    const result = workspace.execute(tool.descriptor.id, { parameters: { amount: 3 }, seed: 42 });
    expect(result.applied).toBe(true);
    expect(document.revision).toBe(1);
    expect(document.value).not.toEqual(before);
    expect(document.undo()).toBe(true);
    expect(document.value).toEqual(before);
  });

  it('supports search, categories, and duplicate protection', () => {
    const registry = new ToolRegistry();
    registry.registerMany(GENERATED_EDITOR_TOOLS.slice(0, 20));
    expect(registry.size()).toBe(20);
    expect(registry.search('generated').length).toBe(20);
    expect(registry.list('layout').length).toBeGreaterThan(0);
    expect(() => registry.register(GENERATED_EDITOR_TOOLS[0])).toThrow('already registered');
  });
});
