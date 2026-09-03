import type { Class } from './constants.js';
import { CLASSES, HASHABLE_TYPES, SEPARATOR } from './constants.js';

/**
 * Prefix `value` with its own length, making the chunk self-delimiting.
 *
 * Chunks are concatenated using simple separators, so any chunk carrying
 * arbitrary content must declare its extent up front. Without this, content
 * containing those separators can forge a structural boundary, e.g. `['a,sb']`
 * and `['a', 'b']` would both flatten to `sa,sb`.
 */
export function delimit(value: string): string {
  return value.length + SEPARATOR + value;
}

export function namespaceComplexValue(classType: Class, value: string | number | boolean) {
  return (
    HASHABLE_TYPES.object
    + SEPARATOR
    + CLASSES[classType]
    + SEPARATOR
    + delimit(typeof value === 'string' ? value : '' + value)
  );
}
