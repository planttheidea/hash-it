const multiply32Bit = Math.imul;

/**
 * Based on the string passed, get the integer hash value.
 *
 * Two independent 32-bit accumulators are mixed with `Math.imul`, which is a
 * true 32-bit multiply; `*` would route through a float and discard the high
 * bits on every step. The accumulators use different multipliers so that they
 * do not evolve in lockstep - sharing one multiplier made `hashB` almost a
 * function of `hashA`, which capped the pair at roughly 32 bits of entropy no
 * matter how the two were combined.
 */
export function hash(string: string): number {
  let index = string.length;
  let hashA = 5381;
  let hashB = 52711;
  let charCode;

  while (index--) {
    charCode = string.charCodeAt(index);

    hashA = multiply32Bit(hashA ^ charCode, 2654435761);
    hashB = multiply32Bit(hashB ^ charCode, 1597334677);
  }

  // Scaling by 2 ** 21 lifts `hashA` clear of the 21 bits contributed by
  // `hashB`, so the two never overlap. The result fills 53 bits and its maximum
  // is exactly `Number.MAX_SAFE_INTEGER`.
  return (hashA >>> 0) * 2097152 + (hashB >>> 11);
}
