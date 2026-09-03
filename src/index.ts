import { createFoldState, foldValue } from './fold.js';

/**
 * Fold `value` into a 53-bit result: the full 32 bits of one accumulator
 * lifted clear of the 21 retained from the other, giving a maximum of exactly
 * `Number.MAX_SAFE_INTEGER`.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function hash<Value>(value: Value): number {
  const state = createFoldState();

  foldValue(value, state);

  return (state.a >>> 0) * 2097152 + (state.b >>> 11);
}
