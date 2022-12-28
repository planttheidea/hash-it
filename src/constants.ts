export const CLASSES = {
  '[object Arguments]': 0,
  '[object Array]': 1,
  '[object ArrayBuffer]': 2,
  '[object BigInt]': 3,
  '[object Boolean]': 4,
  '[object DataView]': 5,
  '[object Date]': 6,
  '[object DocumentFragment]': 7,
  '[object Error]': 8,
  '[object Event]': 9,
  '[object Float32Array]': 10,
  '[object Float64Array]': 11,
  '[object Generator]': 12,
  '[object Int8Array]': 13,
  '[object Int16Array]': 14,
  '[object Map]': 15,
  '[object Number]': 16,
  '[object Object]': 17,
  '[object Promise]': 18,
  '[object RegExp]': 19,
  '[object Set]': 20,
  '[object String]': 21,
  '[object Uint8Array]': 22,
  '[object Uint8ClampedArray]': 23,
  '[object Uint16Array]': 24,
  '[object Uint32Array]': 25,
  '[object WeakMap]': 26,
  '[object WeakSet]': 27,
  ELEMENT: 28,
  CUSTOM: 29,
} as const;

export const ARRAY_LIKE_CLASSES = {
  '[object Arguments]': 1,
  '[object Array]': 2,
} as const;

export const NON_ENUMERABLE_CLASSES = {
  '[object Generator]': 1,
  '[object Promise]': 2,
  '[object WeakMap]': 3,
  '[object WeakSet]': 4,
} as const;

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

export const TYPES = {
  string: 0,
  number: 1,
  bigint: 2,
  boolean: 3,
  symbol: 4,
  undefined: 5,
  object: 6,
  function: 7,
} as const;
