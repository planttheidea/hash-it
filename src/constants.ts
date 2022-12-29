export const SEPARATOR = '|';
export const XML_ELEMENT_REGEXP = /\[object ([HTML|SVG](.*)Element)\]/;

export const CLASSES = {
  '[object Arguments]': 0,
  '[object Array]': 1,
  '[object ArrayBuffer]': 2,
  '[object AsyncFunction]': 3,
  '[object AsyncGeneratorFunction]': 4,
  '[object BigInt]': 5,
  '[object Boolean]': 6,
  '[object DataView]': 7,
  '[object Date]': 8,
  '[object DocumentFragment]': 9,
  '[object Error]': 10,
  '[object Event]': 11,
  '[object Float32Array]': 12,
  '[object Float64Array]': 13,
  '[object Function]': 14,
  '[object Generator]': 15,
  '[object GeneratorFunction]': 16,
  '[object Int8Array]': 17,
  '[object Int16Array]': 18,
  '[object Map]': 19,
  '[object Number]': 20,
  '[object Object]': 21,
  '[object Promise]': 22,
  '[object RegExp]': 23,
  '[object Set]': 24,
  '[object String]': 25,
  '[object Uint8Array]': 26,
  '[object Uint8ClampedArray]': 27,
  '[object Uint16Array]': 28,
  '[object Uint32Array]': 29,
  '[object WeakMap]': 30,
  '[object WeakSet]': 31,
  ELEMENT: 32,
  CUSTOM: 33,
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
  '[object WeakSet]': 4,
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
  '[object Float32Array]': 1,
  '[object Float64Array]': 2,
  '[object Int8Array]': 3,
  '[object Int16Array]': 4,
  '[object Uint8Array]': 5,
  '[object Uint8ClampedArray]': 6,
  '[object Uint16Array]': 7,
  '[object Uint32Array]': 8,
} as const;

export type TypedArrayClass = keyof typeof TYPED_ARRAY_CLASSES;

export const RECURSIVE_CLASSES = {
  '[object Arguments]': 1,
  '[object Array]': 2,
  '[object ArrayBuffer]': 3,
  '[object DataView]': 4,
  '[object Float32Array]': 5,
  '[object Float64Array]': 6,
  '[object Int8Array]': 7,
  '[object Int16Array]': 8,
  '[object Map]': 9,
  '[object Object]': 1,
  '[object Set]': 11,
  '[object Uint8Array]': 12,
  '[object Uint8ClampedArray]': 13,
  '[object Uint16Array]': 14,
  '[object Uint32Array]': 15,
  CUSTOM: 16,
} as const;

export type RecursiveClass = keyof typeof RECURSIVE_CLASSES;

export const HASHABLE_TYPES = {
  bigint: 'i',
  boolean: 'b',
  function: 'g',
  number: 'n',
  object: 'o',
  string: 's',
  symbol: 's',
  undefined: 'u',
} as const;

export type HashableType = keyof typeof HASHABLE_TYPES;
