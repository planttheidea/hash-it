import type { Class, RecursiveClass } from './constants.js';
import {
  ARRAY_LIKE_CLASSES,
  CLASSES,
  NON_ENUMERABLE_CLASSES,
  PRIMITIVE_WRAPPER_CLASSES,
  RECURSIVE_CLASSES,
  TYPED_ARRAY_CLASSES,
  XML_ELEMENT_REGEXP,
} from './constants.js';

/**
 * Folds a value into a hash while walking it, rather than materializing the
 * whole tree as a string and scanning that afterward. Only numbers travel up
 * the call stack, so peak memory is proportional to the deepest path rather
 * than to the total serialized size.
 *
 * The two accumulators, their multipliers, and the final 53-bit combination
 * are the same as `hash.ts`; what changes is that a child contributes its
 * finished accumulator pair instead of a run of character codes.
 */

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

/** Feature-detected once. Typed as always present, hence the `typeof` guard. */
const imul = typeof Math.imul === 'function' ? Math.imul : imulFallback;

const MULTIPLIER_A = 2654435761;
const MULTIPLIER_B = 1597334677;

const SEED_A = 5381;
const SEED_B = 52711;

/**
 * Every tag lives in one flat namespace, because every tagged value competes
 * for the same output space. A primitive tag colliding with a class tag would
 * reintroduce exactly the cross-type collisions that the string encoding's
 * type prefixes exist to prevent, e.g. `Symbol('foo')` against the string
 * `'Symbol(foo)'`.
 */
const TAG_BIGINT = 0;
const TAG_BOOLEAN = 1;
const TAG_EMPTY = 2;
const TAG_FUNCTION = 3;
const TAG_NUMBER = 4;
const TAG_NUMBER_INTEGER = 5;
const TAG_NUMBER_NAN = 6;
const TAG_STRING = 7;
const TAG_SYMBOL = 8;
const TAG_KEY = 9;

/** Class tags are offset clear of the primitive tags above. */
const CLASS_TAG_OFFSET = 16;

/**
 * Structural markers sit above every class tag, so a marker can never be
 * mistaken for the class of a value that legitimately appears in that slot.
 */
const TAG_RECURSIVE = 2048;
const TAG_ARRAY_PROPERTIES = 2049;
const TAG_ENTRY = 2050;
const TAG_COUNT = 2051;
const TAG_UNSUPPORTED = 2052;

const CLASS_TAGS: Record<string, number> = Object.keys(CLASSES).reduce<Record<string, number>>((tags, classType) => {
  tags[classType] = CLASSES[classType]! + CLASS_TAG_OFFSET;

  return tags;
}, {});

/**
 * Reference identity for values with no enumerable contents. Kept here rather
 * than shared with the string encoding's equivalent so that the fold pulls in
 * nothing from that path.
 */
const NON_ENUMERABLE_REF_IDS = new WeakMap<object, number>();

let refId = 0;

function getUnsupportedRefId(value: object): number {
  const cached = NON_ENUMERABLE_REF_IDS.get(value);

  if (cached !== undefined) {
    return cached;
  }

  const id = ++refId;

  NON_ENUMERABLE_REF_IDS.set(value, id);

  return id;
}

export interface FoldState {
  /**
   * The accumulator pair of the most recently folded value, which is how a
   * child returns its result to its parent. Carried on the state rather than
   * in module scope so that concurrent or re-entrant folds - a getter, a Proxy
   * trap or a custom `toString` reached mid-walk can call back into `hash` -
   * cannot observe or overwrite each other's partial results.
   *
   * A caller still reads both halves immediately after the call that produced
   * them, but now a stale read is confined to one fold rather than shared with
   * every other.
   */
  a: number;
  b: number;
  /**
   * Doubles as the ancestor registry and the memoization table. A `number`
   * entry is the depth of a value currently being folded higher up the path;
   * an array entry is the finished accumulator pair for a value that has
   * already been folded.
   *
   * Built on first use, so folding a primitive - the common case for a bare
   * `hash(value)` - allocates nothing beyond the state itself.
   */
  cache: WeakMap<any, number | number[]> | undefined;
  cycles: number;
  depth: number;
}

export function createFoldState(): FoldState {
  return { a: 0, b: 0, cache: undefined, cycles: 0, depth: 0 };
}

const { keys } = Object;
// eslint-disable-next-line @typescript-eslint/unbound-method
const toString = Object.prototype.toString;

/**
 * Scratch storage for reinterpreting a double as its two 32-bit halves, so a
 * number can be folded without being converted to a string first.
 */
const FLOAT_SCRATCH = typeof Float64Array === 'function' ? new Float64Array(1) : undefined;
const FLOAT_BITS =
  FLOAT_SCRATCH && typeof Uint32Array === 'function' ? new Uint32Array(FLOAT_SCRATCH.buffer) : undefined;

const HAS_UINT8_ARRAY = typeof Uint8Array === 'function';

/**
 * Bijective 32-bit finalizer. Multiplication propagates entropy from low bits
 * to high ones only, so without this the low bits of a container's hash would
 * carry almost none of its children's. Applied once per container rather than
 * per element, and invertible, so it can only improve distribution.
 */
function avalanche(value: number): number {
  value ^= value >>> 16;
  value = imul(value, 2246822507);
  value ^= value >>> 13;
  value = imul(value, 3266489909);

  return value ^ (value >>> 16);
}

/** Fold the characters of `string` into the accumulators, tagged and framed. */
function foldString(string: string, tag: number, state: FoldState): void {
  let index = string.length;
  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);
  let charCode;

  // The length is mixed in before the content, so two values cannot agree on
  // every character and disagree on where they end. This is the framing that a
  // string encoding has to buy with explicit length prefixes.
  hashA = imul(hashA ^ index, MULTIPLIER_A);
  hashB = imul(hashB ^ index, MULTIPLIER_B);

  while (index--) {
    charCode = string.charCodeAt(index);

    hashA = imul(hashA ^ charCode, MULTIPLIER_A);
    hashB = imul(hashB ^ charCode, MULTIPLIER_B);
  }

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

/**
 * Fold a number by value rather than through its string form. `-0` collapses
 * onto `0` via the integer path and every `NaN` onto a single tag, keeping the
 * `SameValueZero` equality the package documents.
 */
function foldNumber(value: number, tag: number, state: FoldState): void {
  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  // `-0 | 0` is `0`, so signed zero needs no special case of its own.
  if ((value | 0) === value) {
    hashA = imul(hashA ^ TAG_NUMBER_INTEGER, MULTIPLIER_A);
    hashB = imul(hashB ^ TAG_NUMBER_INTEGER, MULTIPLIER_B);
    hashA = imul(hashA ^ value, MULTIPLIER_A);
    hashB = imul(hashB ^ value, MULTIPLIER_B);

    state.a = avalanche(hashA);
    state.b = avalanche(hashB);

    return;
  }

  if (value !== value) {
    hashA = imul(hashA ^ TAG_NUMBER_NAN, MULTIPLIER_A);
    hashB = imul(hashB ^ TAG_NUMBER_NAN, MULTIPLIER_B);

    state.a = avalanche(hashA);
    state.b = avalanche(hashB);

    return;
  }

  if (FLOAT_BITS && FLOAT_SCRATCH) {
    FLOAT_SCRATCH[0] = value;

    const low = FLOAT_BITS[0]!;
    const high = FLOAT_BITS[1]!;

    hashA = imul(hashA ^ low, MULTIPLIER_A);
    hashB = imul(hashB ^ low, MULTIPLIER_B);
    hashA = imul(hashA ^ high, MULTIPLIER_A);
    hashB = imul(hashB ^ high, MULTIPLIER_B);

    state.a = avalanche(hashA);
    state.b = avalanche(hashB);

    return;
  }

  foldString('' + value, tag, state);
}

/** Mix a finished child pair into a running parent pair. */
function mixA(accumulator: number, value: number): number {
  return imul(accumulator ^ value, MULTIPLIER_A);
}

function mixB(accumulator: number, value: number): number {
  return imul(accumulator ^ value, MULTIPLIER_B);
}

function foldBytes(bytes: Uint8Array, tag: number, state: FoldState): void {
  const length = bytes.length;

  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  hashA = imul(hashA ^ length, MULTIPLIER_A);
  hashB = imul(hashB ^ length, MULTIPLIER_B);

  let index = 0;

  // Packed a word at a time to quarter the number of multiplies. Assembled
  // from byte reads rather than a `Uint32Array` view so that the result does
  // not depend on the alignment of the window within its buffer - two views
  // over identical bytes must agree regardless of their `byteOffset`.
  for (; index + 3 < length; index += 4) {
    const word = bytes[index]! | (bytes[index + 1]! << 8) | (bytes[index + 2]! << 16) | (bytes[index + 3]! << 24);

    hashA = imul(hashA ^ word, MULTIPLIER_A);
    hashB = imul(hashB ^ word, MULTIPLIER_B);
  }

  for (; index < length; ++index) {
    hashA = imul(hashA ^ bytes[index]!, MULTIPLIER_A);
    hashB = imul(hashB ^ bytes[index]!, MULTIPLIER_B);
  }

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

function foldArrayBufferLike(
  buffer: ArrayBufferLike,
  byteOffset: number,
  byteLength: number,
  tag: number,
  state: FoldState,
): void {
  if (!HAS_UINT8_ARRAY) {
    foldString('UNSUPPORTED', tag, state);

    return;
  }

  // A view over the window, never a copy of it.
  foldBytes(new Uint8Array(buffer, byteOffset, byteLength), tag, state);
}

function foldComplexType(value: any, classType: Class, state: FoldState): void {
  if (RECURSIVE_CLASSES[classType]) {
    foldRecursive(classType, value, state);

    return;
  }

  const tag = CLASS_TAGS[classType];

  if (classType === '[object Date]') {
    foldNumber(value.getTime(), tag!, state);

    return;
  }

  if (classType === '[object RegExp]') {
    foldString(value.toString(), tag!, state);

    return;
  }

  if (classType === '[object Event]') {
    foldEvent(value, state, tag!);

    return;
  }

  if (classType === '[object Error]') {
    let hashA = imul(SEED_A ^ tag!, MULTIPLIER_A);
    let hashB = imul(SEED_B ^ tag!, MULTIPLIER_B);

    foldString('' + value.message, TAG_STRING, state);
    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);

    foldString('' + value.stack, TAG_STRING, state);
    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);

    state.a = avalanche(hashA);
    state.b = avalanche(hashB);

    return;
  }

  if (classType === '[object DocumentFragment]') {
    foldDocumentFragment(value, tag!, state);

    return;
  }

  const element = classType.match(XML_ELEMENT_REGEXP);

  if (element) {
    const elementTag = CLASS_TAGS.ELEMENT!;

    let hashA = imul(SEED_A ^ elementTag, MULTIPLIER_A);
    let hashB = imul(SEED_B ^ elementTag, MULTIPLIER_B);

    foldString(element[1]!, TAG_STRING, state);
    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);

    foldString(value.outerHTML, TAG_STRING, state);
    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);

    state.a = avalanche(hashA);
    state.b = avalanche(hashB);

    return;
  }

  if (NON_ENUMERABLE_CLASSES[classType]) {
    foldUnsupported(value, tag!, state);

    return;
  }

  if (PRIMITIVE_WRAPPER_CLASSES[classType]) {
    foldString(value.toString(), tag!, state);

    return;
  }

  // This would only be hit with custom `toStringTag` values
  foldRecursive('CUSTOM', value, state);
}

/**
 * A value with no enumerable contents is identified by reference. The id is
 * stable for the lifetime of the value, so the same reference folds the same
 * way and two distinct references never agree.
 */
function foldUnsupported(value: any, tag: number, state: FoldState): void {
  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  hashA = imul(hashA ^ TAG_UNSUPPORTED, MULTIPLIER_A);
  hashB = imul(hashB ^ TAG_UNSUPPORTED, MULTIPLIER_B);

  const refId = getUnsupportedRefId(value);

  hashA = imul(hashA ^ refId, MULTIPLIER_A);
  hashB = imul(hashB ^ refId, MULTIPLIER_B);

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

function foldRecursive(classType: RecursiveClass, value: any, state: FoldState): void {
  const cache = (state.cache ??= new WeakMap<any, number | number[]>());

  const cached = cache.get(value);

  if (cached != null) {
    if (typeof cached === 'number') {
      // A cycle. The ancestor is identified by its depth rather than by visit
      // order, so the same structure folds identically regardless of which
      // sibling happened to be traversed first.
      ++state.cycles;

      const tag = CLASS_TAGS[classType]!;

      let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
      let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

      hashA = imul(hashA ^ TAG_RECURSIVE, MULTIPLIER_A);
      hashB = imul(hashB ^ TAG_RECURSIVE, MULTIPLIER_B);
      hashA = imul(hashA ^ cached, MULTIPLIER_A);
      hashB = imul(hashB ^ cached, MULTIPLIER_B);

      state.a = avalanche(hashA);
      state.b = avalanche(hashB);

      return;
    }

    // Already folded elsewhere in this pass. Reusing the pair keeps a value
    // referenced many times from being walked many times.
    state.a = cached[0]!;
    state.b = cached[1]!;

    return;
  }

  const cycles = state.cycles;

  cache.set(value, state.depth++);

  foldRecursiveValue(classType, value, state);

  --state.depth;

  if (state.cycles === cycles) {
    cache.set(value, [state.a, state.b]);
  } else {
    // The pair embeds an ancestor depth, so it is only valid at the position
    // it was produced and must not be reused.
    cache.delete(value);
  }
}

const FLOAT_TYPED_ARRAY_CLASSES: Record<string, number> = {
  '[object Float16Array]': 1,
  '[object Float32Array]': 2,
  '[object Float64Array]': 3,
};

function foldRecursiveValue(classType: RecursiveClass, value: any, state: FoldState): void {
  const tag = CLASS_TAGS[classType]!;

  if (classType === '[object Object]') {
    foldObject(value, state, tag);

    return;
  }

  if (ARRAY_LIKE_CLASSES[classType]) {
    foldArray(value, state, tag);

    return;
  }

  if (classType === '[object Map]') {
    foldMap(value, state, tag);

    return;
  }

  if (classType === '[object Set]') {
    foldSet(value, state, tag);

    return;
  }

  if (TYPED_ARRAY_CLASSES[classType]) {
    if (FLOAT_TYPED_ARRAY_CLASSES[classType]) {
      // Folded element by element rather than over the raw bytes, because the
      // bytes distinguish `-0` from `0` and one `NaN` payload from another,
      // which `SameValueZero` does not.
      foldFloatArray(value, tag, state);
    } else {
      foldArrayBufferLike(value.buffer, value.byteOffset, value.byteLength, tag, state);
    }

    return;
  }

  if (classType === '[object ArrayBuffer]' || classType === '[object SharedArrayBuffer]') {
    foldArrayBufferLike(value, 0, value.byteLength, tag, state);

    return;
  }

  if (classType === '[object DataView]') {
    foldArrayBufferLike(value.buffer, value.byteOffset, value.byteLength, tag, state);

    return;
  }

  if (NON_ENUMERABLE_CLASSES[classType]) {
    foldUnsupported(value, tag, state);

    return;
  }

  foldObject(value, state, CLASS_TAGS.CUSTOM!);
}

function foldFloatArray(value: ArrayLike<number>, tag: number, state: FoldState): void {
  const length = value.length;

  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  hashA = imul(hashA ^ length, MULTIPLIER_A);
  hashB = imul(hashB ^ length, MULTIPLIER_B);

  for (let index = 0; index < length; ++index) {
    foldNumber(value[index]!, TAG_NUMBER, state);

    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);
  }

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

function foldArray(value: any[], state: FoldState, tag: number): void {
  const length = value.length;

  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  hashA = imul(hashA ^ length, MULTIPLIER_A);
  hashB = imul(hashB ^ length, MULTIPLIER_B);

  for (let index = 0; index < length; ++index) {
    foldValue(value[index], state);

    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);
  }

  // Named keys are always enumerated after indices, so walking back from the
  // end stops at the first index and costs only as much as there are extras.
  const properties = keys(value);

  let start = properties.length;

  while (--start >= 0) {
    const key = properties[start]!;
    const asIndex = +key;

    // Comparing against the round-tripped number rejects near-index names such
    // as `'01'` or `'1e2'`, which are ordinary properties rather than indices.
    if (asIndex >= 0 && asIndex < length && '' + asIndex === key) {
      break;
    }
  }

  if (++start !== properties.length) {
    hashA = imul(hashA ^ TAG_ARRAY_PROPERTIES, MULTIPLIER_A);
    hashB = imul(hashB ^ TAG_ARRAY_PROPERTIES, MULTIPLIER_B);

    const extras = properties.slice(start).sort();

    for (const property of extras) {
      foldString(property, TAG_KEY, state);
      hashA = mixA(hashA, state.a);
      hashB = mixB(hashB, state.b);

      foldValue(value[property as unknown as number], state);
      hashA = mixA(hashA, state.a);
      hashB = mixB(hashB, state.b);
    }

    hashA = imul(hashA ^ (extras.length ^ TAG_COUNT), MULTIPLIER_A);
    hashB = imul(hashB ^ (extras.length ^ TAG_COUNT), MULTIPLIER_B);
  }

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

function foldObject(value: Record<string, any>, state: FoldState, tag: number): void {
  const properties = keys(value).sort();
  const length = properties.length;

  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  hashA = imul(hashA ^ length, MULTIPLIER_A);
  hashB = imul(hashB ^ length, MULTIPLIER_B);

  for (let index = 0; index < length; ++index) {
    const property = properties[index]!;

    // Keys carry their own tag, so a key can never fold the same way as a
    // string value holding the same characters.
    foldString(property, TAG_KEY, state);
    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);

    foldValue(value[property], state);
    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);
  }

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

/**
 * Members are ordered by the 53-bit combination of their folded pair, the same
 * combination `fold` itself ends with. Collapsing each member to one number
 * lets the sort run over a typed array without a comparator, where the string
 * encoding pays for the same ordering guarantee in string comparisons - and
 * costs nothing in practice, since 53 bits per member feed a 53-bit result.
 */
function combine(hashA: number, hashB: number): number {
  return (hashA >>> 0) * 2097152 + (hashB >>> 11);
}

/**
 * A `Float64Array` rather than an array of numbers so the ordering stays
 * monomorphic and its sort runs without a comparator. Typed arrays are part of
 * the ES2015 floor the package already requires.
 */
function foldOrdering(ordering: Float64Array, size: number, tag: number, state: FoldState): void {
  ordering.sort();

  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  hashA = imul(hashA ^ size, MULTIPLIER_A);
  hashB = imul(hashB ^ size, MULTIPLIER_B);

  for (let index = 0; index < size; ++index) {
    const member = ordering[index]!;

    // Split at bit 32 rather than at the seam the combination was built on:
    // any bijective split preserves the member, and `ToUint32` gives the low
    // half without arithmetic, leaving a single divide for the high half.
    const low = member >>> 0;
    const high = (member - low) / 4294967296;

    hashA = mixA(hashA, high);
    hashB = mixB(hashB, low);
    hashA = mixA(hashA, low);
    hashB = mixB(hashB, high);
  }

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

function foldMap(map: Map<any, any>, state: FoldState, tag: number): void {
  const size = map.size;
  const ordering = new Float64Array(size);

  let index = 0;

  map.forEach((value, key) => {
    let entryA = imul(SEED_A ^ TAG_ENTRY, MULTIPLIER_A);
    let entryB = imul(SEED_B ^ TAG_ENTRY, MULTIPLIER_B);

    foldValue(key, state);
    entryA = mixA(entryA, state.a);
    entryB = mixB(entryB, state.b);

    foldValue(value, state);
    entryA = mixA(entryA, state.a);
    entryB = mixB(entryB, state.b);

    ordering[index++] = combine(avalanche(entryA), avalanche(entryB));
  });

  foldOrdering(ordering, size, tag, state);
}

function foldSet(set: Set<any>, state: FoldState, tag: number): void {
  const size = set.size;
  const ordering = new Float64Array(size);

  let index = 0;

  set.forEach((value) => {
    foldValue(value, state);

    ordering[index++] = combine(state.a, state.b);
  });

  foldOrdering(ordering, size, tag, state);
}

function foldDocumentFragment(fragment: DocumentFragment, tag: number, state: FoldState): void {
  const children = fragment.children;
  const length = children.length;

  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  hashA = imul(hashA ^ length, MULTIPLIER_A);
  hashB = imul(hashB ^ length, MULTIPLIER_B);

  for (let index = 0; index < length; ++index) {
    foldString(children[index]!.outerHTML, TAG_STRING, state);

    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);
  }

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

function foldEvent(value: Event, state: FoldState, tag: number): void {
  let hashA = imul(SEED_A ^ tag, MULTIPLIER_A);
  let hashB = imul(SEED_B ^ tag, MULTIPLIER_B);

  const fields = [
    value.bubbles,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    value.cancelBubble,
    value.cancelable,
    value.composed,
    value.currentTarget,
    value.defaultPrevented,
    value.eventPhase,
    value.isTrusted,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    value.returnValue,
    value.target,
    value.type,
  ];

  for (const field of fields) {
    foldValue(field, state);

    hashA = mixA(hashA, state.a);
    hashB = mixB(hashB, state.b);
  }

  state.a = avalanche(hashA);
  state.b = avalanche(hashB);
}

export function foldValue(value: any, state: FoldState): void {
  const type = typeof value;

  if (value == null) {
    foldString('' + value, TAG_EMPTY, state);

    return;
  }

  if (type === 'object') {
    foldComplexType(value, toString.call(value), state);

    return;
  }

  if (type === 'string') {
    foldString(value, TAG_STRING, state);

    return;
  }

  if (type === 'number') {
    foldNumber(value, TAG_NUMBER, state);

    return;
  }

  if (type === 'function') {
    foldString(value.toString(), TAG_FUNCTION, state);

    return;
  }

  if (type === 'symbol') {
    foldString(value.toString(), TAG_SYMBOL, state);

    return;
  }

  if (type === 'boolean') {
    foldNumber(+value, TAG_BOOLEAN, state);

    return;
  }

  foldString('' + value, TAG_BIGINT, state);
}
