import { createFoldState, foldValue } from './fold.js';

/**
 * Get a hashCode for `value`, derived from what it contains rather than which
 * object it is.
 *
 * Values that are equal by content hash the same, however they were built:
 * key insertion order, `Map` and `Set` insertion order, and whether a nested
 * value is shared by reference or duplicated all make no difference. Values
 * that differ anywhere in their contents hash differently. Every type is
 * supported, including circular and shared structures.
 *
 * The result is a non-negative integer no larger than
 * `Number.MAX_SAFE_INTEGER`.
 *
 * Use it to compare values within a single running program - deduplication,
 * cache keys, equality checks. Do not persist it or send it somewhere else to
 * be compared: the hash for a given value is stable within one version and one
 * environment, and may change across either.
 *
 * @example
 * hash({ foo: 'bar' }) === hash({ foo: 'bar' }); // true
 * hash({ a: 1, b: 2 }) === hash({ b: 2, a: 1 }); // true
 * hash([1, 2, 3]) === hash([1, 2, 4]); // false
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function hash<Value>(value: Value): number {
  const state = createFoldState();

  foldValue(value, state);

  return (state.a >>> 0) * 2097152 + (state.b >>> 11);
}
