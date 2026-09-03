import type { Class } from './constants.js';
import { CLASS_PREFIXES, LENGTH_PREFIXES, SEPARATOR, TABLED_LENGTHS } from './constants.js';

/**
 * Prefix `value` with its own length, making the chunk self-delimiting.
 *
 * Chunks are concatenated using simple separators, so any chunk carrying
 * arbitrary content must declare its extent up front. Without this, content
 * containing those separators can forge a structural boundary, e.g. `['a,sb']`
 * and `['a', 'b']` would both flatten to `sa,sb`.
 */
export function delimit(value: string): string {
  const length = value.length;

  return length < TABLED_LENGTHS ? LENGTH_PREFIXES[length]! + value : length + SEPARATOR + value;
}

export function namespaceComplexValue(classType: Class, value: string | number | boolean) {
  return CLASS_PREFIXES[classType]! + delimit(typeof value === 'string' ? value : '' + value);
}
