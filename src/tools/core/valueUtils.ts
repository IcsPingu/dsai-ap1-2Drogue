import { EditorPath, EditorValue } from '../types';

export function cloneValue<T extends EditorValue>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(item => cloneValue(item)) as T;
  const output: Record<string, EditorValue> = {};
  for (const [key, child] of Object.entries(value)) output[key] = cloneValue(child);
  return output as T;
}

export function valuesEqual(left: EditorValue, right: EditorValue): boolean {
  if (left === right) return true;
  if (typeof left !== typeof right || left === null || right === null) return false;
  if (Array.isArray(left) !== Array.isArray(right)) return false;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((value, index) => valuesEqual(value, right[index]));
  }
  if (typeof left === 'object' && typeof right === 'object') {
    const leftRecord = left as { [key: string]: EditorValue };
    const rightRecord = right as { [key: string]: EditorValue };
    const leftKeys = Object.keys(leftRecord);
    const rightKeys = Object.keys(rightRecord);
    return leftKeys.length === rightKeys.length && leftKeys.every(key => key in rightRecord && valuesEqual(leftRecord[key], rightRecord[key]));
  }
  return false;
}

export function getAtPath(root: EditorValue, path: EditorPath): EditorValue | undefined {
  let cursor: EditorValue | undefined = root;
  for (const segment of path) {
    if (cursor === null || typeof cursor !== 'object') return undefined;
    if (Array.isArray(cursor)) {
      if (typeof segment !== 'number') return undefined;
      cursor = cursor[segment];
    } else {
      cursor = cursor[String(segment)];
    }
  }
  return cursor;
}

export function setAtPath(root: EditorValue, path: EditorPath, value: EditorValue): EditorValue {
  if (path.length === 0) return cloneValue(value);
  const output = cloneValue(root);
  let cursor: EditorValue = output;
  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    const next = path[index + 1];
    if (Array.isArray(cursor) && typeof segment === 'number') {
      const child = cursor[segment];
      if (child === null || typeof child !== 'object') cursor[segment] = typeof next === 'number' ? [] : {};
      cursor = cursor[segment];
    } else if (!Array.isArray(cursor) && cursor !== null && typeof cursor === 'object') {
      const key = String(segment);
      const child = cursor[key];
      if (child === null || typeof child !== 'object') cursor[key] = typeof next === 'number' ? [] : {};
      cursor = cursor[key];
    } else {
      throw new Error(`Cannot traverse editor path ${formatPath(path)}`);
    }
  }
  const last = path[path.length - 1];
  if (Array.isArray(cursor) && typeof last === 'number') cursor[last] = cloneValue(value);
  else if (!Array.isArray(cursor) && cursor !== null && typeof cursor === 'object') cursor[String(last)] = cloneValue(value);
  else throw new Error(`Cannot set editor path ${formatPath(path)}`);
  return output;
}

export function deleteAtPath(root: EditorValue, path: EditorPath): EditorValue {
  if (path.length === 0) return null;
  const output = cloneValue(root);
  let cursor: EditorValue = output;
  for (const segment of path.slice(0, -1)) {
    const child = Array.isArray(cursor) && typeof segment === 'number'
      ? cursor[segment]
      : cursor !== null && typeof cursor === 'object' && !Array.isArray(cursor)
        ? cursor[String(segment)]
        : undefined;
    if (child === undefined) return output;
    cursor = child;
  }
  const last = path[path.length - 1];
  if (Array.isArray(cursor) && typeof last === 'number') cursor.splice(last, 1);
  else if (cursor !== null && typeof cursor === 'object' && !Array.isArray(cursor)) delete cursor[String(last)];
  return output;
}

export function insertAtPath(root: EditorValue, path: EditorPath, value: EditorValue): EditorValue {
  if (path.length === 0 || typeof path[path.length - 1] !== 'number') {
    throw new Error(`Insert requires an array index: ${formatPath(path)}`);
  }
  const output = cloneValue(root);
  const parent = getMutableAtPath(output, path.slice(0, -1));
  const index = path[path.length - 1] as number;
  if (!Array.isArray(parent)) throw new Error(`Insert target is not an array: ${formatPath(path)}`);
  parent.splice(Math.max(0, Math.min(index, parent.length)), 0, cloneValue(value));
  return output;
}

function getMutableAtPath(root: EditorValue, path: EditorPath): EditorValue {
  let cursor = root;
  for (const segment of path) {
    if (Array.isArray(cursor) && typeof segment === 'number') cursor = cursor[segment];
    else if (cursor !== null && typeof cursor === 'object' && !Array.isArray(cursor)) cursor = cursor[String(segment)];
    else throw new Error(`Invalid editor path ${formatPath(path)}`);
  }
  return cursor;
}

export function formatPath(path: EditorPath): string {
  if (path.length === 0) return '$';
  return path.reduce<string>((text, segment) => typeof segment === 'number' ? `${text}[${segment}]` : `${text}.${segment}`, '$');
}

export function pathKey(path: EditorPath): string {
  return JSON.stringify(path);
}

export function stableStringify(value: EditorValue): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

export function hashValue(value: EditorValue): string {
  const source = stableStringify(value);
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function isEditorValue(value: unknown): value is EditorValue {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isEditorValue);
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).every(isEditorValue);
  return false;
}
