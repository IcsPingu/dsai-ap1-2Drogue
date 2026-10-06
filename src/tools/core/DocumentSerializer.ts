import { EditorValue, SerializedEditorDocument } from '../types';
import { cloneValue, hashValue, isEditorValue } from './valueUtils';

export class DocumentSerializer {
  public serialize(payload: EditorValue, spacing = 2): string {
    const envelope: SerializedEditorDocument = {
      format: 'umbra-editor-document',
      version: 1,
      checksum: hashValue(payload),
      savedAt: new Date().toISOString(),
      payload: cloneValue(payload),
    };
    return JSON.stringify(envelope, null, spacing);
  }

  public deserialize(source: string): EditorValue {
    let parsed: unknown;
    try {
      parsed = JSON.parse(source);
    } catch (error) {
      throw new Error(`Invalid editor JSON: ${error instanceof Error ? error.message : 'parse failure'}`);
    }
    if (!parsed || typeof parsed !== 'object') throw new Error('Editor document must be an object');
    const envelope = parsed as Partial<SerializedEditorDocument>;
    if (envelope.format !== 'umbra-editor-document' || envelope.version !== 1) throw new Error('Unsupported editor document format');
    if (!isEditorValue(envelope.payload)) throw new Error('Editor payload contains unsupported values');
    const actual = hashValue(envelope.payload);
    if (actual !== envelope.checksum) throw new Error(`Editor checksum mismatch: expected ${envelope.checksum}, received ${actual}`);
    return cloneValue(envelope.payload);
  }

  public exportPlain(payload: EditorValue, spacing = 2): string {
    return JSON.stringify(payload, null, spacing);
  }

  public importPlain(source: string): EditorValue {
    const parsed: unknown = JSON.parse(source);
    if (!isEditorValue(parsed)) throw new Error('JSON contains values unsupported by the editor');
    return cloneValue(parsed);
  }
}
