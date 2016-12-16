export const ARGUMENTS = '[object Arguments]';
export const ARRAY = '[object Array]';
export const ARRAY_BUFFER = '[object ArrayBuffer]';
export const DATA_VIEW = '[object DataView]';
export const DATE = '[object Date]';
export const ERROR = '[object Error]';
export const FLOAT_32_ARRAY = '[object Float32Array]';
export const FLOAT_64_ARRAY = '[object Float64Array]';
export const GENERATOR = '[object GeneratorFunction]';
export const INT_8_ARRAY = '[object Int8Array]';
export const INT_16_ARRAY = '[object Int16Array]';
export const INT_32_ARRAY = '[object Int32Array]';
export const MAP = '[object Map]';
export const MATH = '[object Math]';
export const OBJECT = '[object Object]';
export const PROMISE = '[object Promise]';
export const REGEXP = '[object RegExp]';
export const SET = '[object Set]';
export const STRING = '[object String]';
export const UINT_8_ARRAY = '[object Uint8Array]';
export const UINT_8_CLAMPED_ARRAY = '[object Uint8ClampedArray]';
export const UINT_16_ARRAY = '[object Uint16Array]';
export const UINT_32_ARRAY = '[object Uint32Array]';
export const WEAKMAP = '[object WeakMap]';
export const WEAKSET = '[object WeakSet]';

export const BOOLEAN_TYPEOF = 'boolean';
export const FUNCTION_TYPEOF = 'function';
export const NUMBER_TYPEOF = 'number';
export const STRING_TYPEOF = 'string';
export const SYMBOL_TYPEOF = 'symbol';
export const UNDEFINED_TYPEOF = 'undefined';

export const DEFAULT_MAX_DEPTH = 6;
export const DEFAULT_ARRAY_MAX_LENGTH = 50;
export const DEFAULT_PRUNED_VALUE = '*Recursive';
export const ESCAPABLE = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
export const META = {	// table of character substitutions
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"' : '\\"',
  '\\': '\\\\'
};

export const HTML_ELEMENT_REGEXP = /\[object (HTML(.*)Element)\]/;
export const MATH_OBJECT = [
  'E',
  'LN2',
  'LN10',
  'LOG2E',
  'LOG10E',
  'PI',
  'SQRT1_2',
  'SQRT2'
].reduce((mathObject, property) => {
  return {
    ...mathObject,
    [property]: Math[property]
  };
}, {});
