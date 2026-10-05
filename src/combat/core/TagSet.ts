export class TagSet {
  private readonly tags = new Set<string>();

  public constructor(initial: Iterable<string> = []) { for (const tag of initial) this.add(tag); }
  public add(tag: string): this { const normalized = this.normalize(tag); if (normalized) this.tags.add(normalized); return this; }
  public addMany(tags: Iterable<string>): this { for (const tag of tags) this.add(tag); return this; }
  public remove(tag: string): boolean { return this.tags.delete(this.normalize(tag)); }
  public has(tag: string): boolean { return this.tags.has(this.normalize(tag)); }
  public hasAny(tags: Iterable<string>): boolean { for (const tag of tags) if (this.has(tag)) return true; return false; }
  public hasAll(tags: Iterable<string>): boolean { for (const tag of tags) if (!this.has(tag)) return false; return true; }
  public clear(): void { this.tags.clear(); }
  public values(): string[] { return [...this.tags].sort(); }
  public clone(): TagSet { return new TagSet(this.tags); }
  public get size(): number { return this.tags.size; }

  public matches(query: string): boolean {
    const alternatives = query.split('|').map((part) => part.trim()).filter(Boolean);
    return alternatives.some((alternative) => alternative.split('&').map((part) => part.trim()).filter(Boolean).every((term) => {
      const negated = term.startsWith('!');
      const present = this.has(negated ? term.slice(1) : term);
      return negated ? !present : present;
    }));
  }

  private normalize(tag: string): string { return tag.trim().toLowerCase().replace(/\s+/g, '-'); }
}
