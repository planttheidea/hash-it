export const SEPARATOR = '|';
export const XML_ELEMENT_REGEXP = /\[object ([HTML|SVG](.*)Element)\]/;

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
  '[object Float32Array]': 15,
  '[object Float64Array]': 16,
  '[object Function]': 17,
  '[object Generator]': 18,
  '[object GeneratorFunction]': 19,
  '[object Int8Array]': 20,
  '[object Int16Array]': 21,
  '[object Map]': 22,
  '[object Number]': 23,
  '[object Object]': 24,
  '[object Promise]': 25,
  '[object RegExp]': 26,
  '[object Set]': 27,
  '[object SharedArrayBuffer]': 28,
  '[object String]': 29,
  '[object Uint8Array]': 30,
  '[object Uint8ClampedArray]': 31,
  '[object Uint16Array]': 32,
  '[object Uint32Array]': 33,
  '[object WeakMap]': 34,
  '[object WeakRef]': 35,
  '[object WeakSet]': 36,
  CUSTOM: 37,
  ELEMENT: 38,
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

export const PRIMITIVE_WRAPPER_CLASSES: Record<string, number> = {
  '[object AsyncFunction]': 1,
  '[object AsyncGeneratorFunction]': 2,
  '[object Boolean]': 3,
  '[object Function]': 4,
  '[object GeneratorFunction]': 5,
  '[object Number]': 6,
  '[object String]': 7,
};

export type PrimitiveWrapperClass = keyof typeof PRIMITIVE_WRAPPER_CLASSES;

export const TYPED_ARRAY_CLASSES: Record<string, number> = {
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
};

export type TypedArrayClass = keyof typeof TYPED_ARRAY_CLASSES;

export const RECURSIVE_CLASSES: Record<string, number> = {
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
  symbol: 's',
};

export type HashableType = keyof typeof HASHABLE_TYPES;
