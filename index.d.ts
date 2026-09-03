/**
 * Fold `value` into a 53-bit result: the full 32 bits of one accumulator
 * lifted clear of the 21 retained from the other, giving a maximum of exactly
 * `Number.MAX_SAFE_INTEGER`.
 */
declare function hash<Value>(value: Value): number;

export { hash };
