export const SEPARATOR = '|';
export const XML_ELEMENT_REGEXP = /\[object ((?:HTML|MathML|SVG)(.*)Element)\]/;

export const CLASSES: Record<string, number> = {
  '[object Arguments]': 0,
  '[object Array]': 1,
  '[object ArrayBuffer]': 2,
  '[object AsyncFunction]': 3,
  '[object AsyncGeneratorFunction]': 4,
  '[object BigInt]': 5,
  '[object BigInt64Array]': 6,
  '[object BigUint64Array]': 7,
  '[object Blob]': 8,
  '[object Boolean]': 9,
  '[object DataView]': 10,
  '[object Date]': 11,
  '[object DocumentFragment]': 12,
  '[object Error]': 13,
  '[object Event]': 14,
  '[object Float16Array]': 15,
  '[object Float32Array]': 16,
  '[object Float64Array]': 17,
  '[object Function]': 18,
  '[object Generator]': 19,
  '[object GeneratorFunction]': 20,
  '[object Int8Array]': 21,
  '[object Int16Array]': 22,
  '[object Int32Array]': 23,
  '[object Map]': 24,
  '[object Number]': 25,
  '[object Object]': 26,
  '[object Promise]': 27,
  '[object RegExp]': 28,
  '[object Set]': 29,
  '[object SharedArrayBuffer]': 30,
  '[object String]': 31,
  '[object Symbol]': 32,
  '[object Uint8Array]': 33,
  '[object Uint8ClampedArray]': 34,
  '[object Uint16Array]': 35,
  '[object Uint32Array]': 36,
  '[object WeakMap]': 37,
  '[object WeakRef]': 38,
  '[object WeakSet]': 39,
  CUSTOM: 40,
  ELEMENT: 41,
};

export type Class = keyof typeof CLASSES;

export const ARRAY_LIKE_CLASSES: Record<string, number> = {
  '[object Arguments]': 1,
  '[object Array]': 2,
};

export type ArrayLikeClass = keyof typeof ARRAY_LIKE_CLASSES;

export const NON_ENUMERABLE_CLASSES: Record<string, number> = {
  '[object Blob]': 1,
  '[object Generator]': 2,
  '[object Promise]': 3,
  '[object WeakMap]': 4,
  '[object WeakRef]': 5,
  '[object WeakSet]': 6,
};

export type NonEnumerableClass = keyof typeof NON_ENUMERABLE_CLASSES;

/**
 * Classes that box a primitive, and therefore can be stringified based on the
 * primitive they wrap. Function classes are intentionally absent; they are
 * handled by the `typeof` check in `stringify` before class resolution occurs.
 */
export const PRIMITIVE_WRAPPER_CLASSES: Record<string, number> = {
  '[object BigInt]': 1,
  '[object Boolean]': 2,
  '[object Number]': 3,
  '[object String]': 4,
  '[object Symbol]': 5,
};

export type PrimitiveWrapperClass = keyof typeof PRIMITIVE_WRAPPER_CLASSES;

export const TYPED_ARRAY_CLASSES: Record<string, number> = {
  '[object BigInt64Array]': 1,
  '[object BigUint64Array]': 2,
  '[object Float16Array]': 3,
  '[object Float32Array]': 4,
  '[object Float64Array]': 5,
  '[object Int8Array]': 6,
  '[object Int16Array]': 7,
  '[object Int32Array]': 8,
  '[object Uint8Array]': 9,
  '[object Uint8ClampedArray]': 10,
  '[object Uint16Array]': 11,
  '[object Uint32Array]': 12,
};

export type TypedArrayClass = keyof typeof TYPED_ARRAY_CLASSES;

export const RECURSIVE_CLASSES: Record<string, number> = {
  '[object Arguments]': 1,
  '[object Array]': 2,
  '[object ArrayBuffer]': 3,
  '[object BigInt64Array]': 4,
  '[object BigUint64Array]': 5,
  '[object DataView]': 6,
  '[object Float16Array]': 7,
  '[object Float32Array]': 8,
  '[object Float64Array]': 9,
  '[object Int8Array]': 10,
  '[object Int16Array]': 11,
  '[object Int32Array]': 12,
  '[object Map]': 13,
  '[object Object]': 14,
  '[object Set]': 15,
  '[object SharedArrayBuffer]': 16,
  '[object Uint8Array]': 17,
  '[object Uint8ClampedArray]': 18,
  '[object Uint16Array]': 19,
  '[object Uint32Array]': 20,
  CUSTOM: 21,
};

export type RecursiveClass = keyof typeof RECURSIVE_CLASSES;

export const HASHABLE_TYPES: Record<string, string> = {
  bigint: 'i',
  boolean: 'b',
  empty: 'e',
  function: 'g',
  number: 'n',
  object: 'o',
  string: 's',
  symbol: 'y',
};

export type HashableType = keyof typeof HASHABLE_TYPES;

/**
 * Prefixes are precomputed so that delimiting a value of typical length is a
 * single concatenation, rather than an integer-to-string conversion followed by
 * two more. Lengths beyond the table build their prefix inline, which is rare
 * enough not to matter.
 */
export const TABLED_LENGTHS = 256;

export const LENGTH_PREFIXES: string[] = Array.from(
  { length: TABLED_LENGTHS },
  (_ignored, length) => length + SEPARATOR,
);

export const STRING_PREFIXES: string[] = Array.from(
  { length: TABLED_LENGTHS },
  (_ignored, length) => HASHABLE_TYPES.string! + length + SEPARATOR,
);

/** The full `o|<class>|` namespace prefix for each class, built once. */
export const CLASS_PREFIXES: Record<string, string> = Object.keys(CLASSES).reduce<Record<string, string>>(
  (prefixes, classType) => {
    prefixes[classType] = HASHABLE_TYPES.object! + SEPARATOR + CLASSES[classType] + SEPARATOR;

    return prefixes;
  },
  {},
);
