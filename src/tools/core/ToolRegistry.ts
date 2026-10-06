import { EditorToolOperation, ToolCategory, ToolContext, ToolExecutionResult } from '../types';
import { EditorDocument } from './EditorDocument';

export class ToolRegistry {
  private readonly tools = new Map<string, EditorToolOperation>();

  public register(tool: EditorToolOperation): this {
    const id = tool.descriptor.id;
    if (this.tools.has(id)) throw new Error(`Tool already registered: ${id}`);
    this.tools.set(id, tool);
    return this;
  }

  public registerMany(tools: readonly EditorToolOperation[]): this {
    tools.forEach(tool => this.register(tool));
    return this;
  }

  public get(id: string): EditorToolOperation | undefined {
    return this.tools.get(id);
  }

  public list(category?: ToolCategory): readonly EditorToolOperation[] {
    const tools = [...this.tools.values()];
    return (category ? tools.filter(tool => tool.descriptor.category === category) : tools)
      .sort((left, right) => left.descriptor.label.localeCompare(right.descriptor.label));
  }

  public search(query: string): readonly EditorToolOperation[] {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return this.list();
    return this.list().filter(tool => {
      const haystack = [tool.descriptor.id, tool.descriptor.label, tool.descriptor.description, ...tool.descriptor.tags].join(' ').toLowerCase();
      return terms.every(term => haystack.includes(term));
    });
  }

  public execute(id: string, document: EditorDocument, context: ToolContext): ToolExecutionResult {
    const tool = this.tools.get(id);
    if (!tool) throw new Error(`Unknown editor tool: ${id}`);
    const current = document.value;
    if (!tool.supports(current, context)) throw new Error(`Tool ${id} does not support the active document`);
    const result = tool.execute(current, context);
    if (result.applied && result.patches.length > 0 && !context.dryRun) {
      document.apply(result.patches, tool.descriptor.label);
      return { ...result, revision: document.revision };
    }
    return { ...result, revision: document.revision };
  }

  public size(): number {
    return this.tools.size;
  }
}
