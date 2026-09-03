// Feature-detected once, matching how `stringifyArrayBuffer` selects its
// implementation. Typed as always present, hence the `typeof` guard.
const imul = typeof Math.imul === 'function' ? Math.imul : imulFallback;

/**
 * 32-bit multiply for environments without `Math.imul`. Splitting each operand
 * into 16-bit halves keeps every intermediate product inside the range floats
 * represent exactly, so the result matches `Math.imul` bit for bit.
 */
export function imulFallback(first: number, second: number): number {
  const firstHigh = (first >>> 16) & 0xffff;
  const firstLow = first & 0xffff;
  const secondHigh = (second >>> 16) & 0xffff;
  const secondLow = second & 0xffff;

  return (firstLow * secondLow + (((firstHigh * secondLow + firstLow * secondHigh) << 16) >>> 0)) | 0;
}

/**
 * Based on the string passed, get the integer hash value.
 *
 * Two independent 32-bit accumulators are mixed with a true 32-bit multiply;
 * `*` would route through a float and discard the high bits on every step. The
 * accumulators use different multipliers so that they do not evolve in
 * lockstep - sharing one multiplier made `hashB` almost a function of `hashA`,
 * which capped the pair at roughly 32 bits of entropy no matter how the two
 * were combined.
 *
 * Scaling by 2 ** 21 lifts `hashA` clear of the 21 bits contributed by
 * `hashB`, so the two never overlap. The result fills 53 bits and its maximum
 * is exactly `Number.MAX_SAFE_INTEGER`.
 */
export function hash(string: string): number {
  let index = string.length;
  let hashA = 5381;
  let hashB = 52711;
  let charCode;

  while (index--) {
    charCode = string.charCodeAt(index);

    hashA = imul(hashA ^ charCode, 2654435761);
    hashB = imul(hashB ^ charCode, 1597334677);
  }

  return (hashA >>> 0) * 2097152 + (hashB >>> 11);
}
