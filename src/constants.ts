export const SEPARATOR = '|';
export const XML_ELEMENT_REGEXP = /\[object ([HTML|SVG](.*)Element)\]/;

export const CLASSES = {
  '[object Arguments]': 0,
  '[object Array]': 1,
  '[object ArrayBuffer]': 2,
  '[object AsyncFunction]': 3,
  '[object AsyncGeneratorFunction]': 4,
  '[object BigInt]': 5,
  '[object BigInt64Array]': 6,
  '[object BigUint64Array]': 7,
  '[object Boolean]': 8,
  '[object DataView]': 9,
  '[object Date]': 10,
  '[object DocumentFragment]': 11,
  '[object Error]': 12,
  '[object Event]': 13,
  '[object Float32Array]': 14,
  '[object Float64Array]': 15,
  '[object Function]': 16,
  '[object Generator]': 17,
  '[object GeneratorFunction]': 18,
  '[object Int8Array]': 19,
  '[object Int16Array]': 20,
  '[object Map]': 21,
  '[object Number]': 22,
  '[object Object]': 23,
  '[object Promise]': 24,
  '[object RegExp]': 25,
  '[object Set]': 26,
  '[object SharedArrayBuffer]': 27,
  '[object String]': 28,
  '[object Uint8Array]': 29,
  '[object Uint8ClampedArray]': 30,
  '[object Uint16Array]': 31,
  '[object Uint32Array]': 32,
  '[object WeakMap]': 33,
  '[object WeakRef]': 34,
  '[object WeakSet]': 35,
  CUSTOM: 36,
  ELEMENT: 37,
} as const;

export type Class = keyof typeof CLASSES;

export const ARRAY_LIKE_CLASSES = {
  '[object Arguments]': 1,
  '[object Array]': 2,
} as const;

export type ArrayLikeClass = keyof typeof ARRAY_LIKE_CLASSES;

export const NON_ENUMERABLE_CLASSES = {
  '[object Generator]': 1,
  '[object Promise]': 2,
  '[object WeakMap]': 3,
  '[object WeakRef]': 4,
  '[object WeakSet]': 5,
} as const;

export type NonEnumerableClass = keyof typeof NON_ENUMERABLE_CLASSES;

export const PRIMITIVE_WRAPPER_CLASSES = {
  '[object AsyncFunction]': 1,
  '[object AsyncGeneratorFunction]': 2,
  '[object Boolean]': 3,
  '[object Function]': 4,
  '[object GeneratorFunction]': 5,
  '[object Number]': 6,
  '[object String]': 7,
} as const;

export type PrimitiveWrapperClass = keyof typeof PRIMITIVE_WRAPPER_CLASSES;

export const TYPED_ARRAY_CLASSES = {
  '[object BigInt64Array]': 1,
  '[object BigUint64Array]': 2,
  '[object Float32Array]': 3,
  '[object Float64Array]': 4,
  '[object Int8Array]': 5,
  '[object Int16Array]': 6,
  '[object Uint8Array]': 7,
  '[object Uint8ClampedArray]': 8,
  '[object Uint16Array]': 9,
  '[object Uint32Array]': 10,
} as const;

export type TypedArrayClass = keyof typeof TYPED_ARRAY_CLASSES;

export const RECURSIVE_CLASSES = {
  '[object Arguments]': 1,
  '[object Array]': 2,
  '[object ArrayBuffer]': 3,
  '[object BigInt64Array]': 4,
  '[object BigUint64Array]': 5,
  '[object DataView]': 6,
  '[object Float32Array]': 7,
  '[object Float64Array]': 8,
  '[object Int8Array]': 9,
  '[object Int16Array]': 10,
  '[object Map]': 11,
  '[object Object]': 12,
  '[object Set]': 13,
  '[object SharedArrayBuffer]': 14,
  '[object Uint8Array]': 15,
  '[object Uint8ClampedArray]': 16,
  '[object Uint16Array]': 17,
  '[object Uint32Array]': 18,
  CUSTOM: 19,
} as const;

export type RecursiveClass = keyof typeof RECURSIVE_CLASSES;

export const HASHABLE_TYPES = {
  bigint: 'i',
  boolean: 'b',
  empty: 'e',
  function: 'g',
  number: 'n',
  object: 'o',
  string: 's',
  symbol: 's',
} as const;

export type HashableType = keyof typeof HASHABLE_TYPES;
