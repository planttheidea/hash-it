export const ARGUMENTS = '[object Arguments]';
export const ARRAY = '[object Array]';
export const ARRAY_BUFFER = '[object ArrayBuffer]';
export const BOOLEAN = '[object Boolean]';
export const DATA_VIEW = '[object DataView]';
export const DATE = '[object Date]';
export const ERROR = '[object Error]';
export const FLOAT_32_ARRAY = '[object Float32Array]';
export const FLOAT_64_ARRAY = '[object Float64Array]';
export const FUNCTION = '[object Function]';
export const GENERATOR = '[object GeneratorFunction]';
export const INT_8_ARRAY = '[object Int8Array]';
export const INT_16_ARRAY = '[object Int16Array]';
export const INT_32_ARRAY = '[object Int32Array]';
export const MAP = '[object Map]';
export const MATH = '[object Math]';
export const NULL = '[object Null]';
export const NUMBER = '[object Number]';
export const OBJECT = '[object Object]';
export const PROMISE = '[object Promise]';
export const REGEXP = '[object RegExp]';
export const SET = '[object Set]';
export const STRING = '[object String]';
export const UINT_8_ARRAY = '[object Uint8Array]';
export const UINT_8_CLAMPED_ARRAY = '[object Uint8ClampedArray]';
export const UINT_16_ARRAY = '[object Uint16Array]';
export const UINT_32_ARRAY = '[object Uint32Array]';
export const UNDEFINED = '[object Undefined]';
export const WEAKMAP = '[object WeakMap]';
export const WEAKSET = '[object WeakSet]';

export const BOOLEAN_TYPEOF = 'boolean';
export const FUNCTION_TYPEOF = 'function';
export const NUMBER_TYPEOF = 'number';
export const STRING_TYPEOF = 'string';
export const SYMBOL_TYPEOF = 'symbol';
export const UNDEFINED_TYPEOF = 'undefined';

const objectToString = Object.prototype.toString;

/**
 * get the generic string value of the function passed
 *
 * @param {function} fn
 * @param {boolean} isGenerator=false
 * @returns {string}
 */
export const toFunctionString = (fn, isGenerator = false) => {
  return `function${isGenerator ? '*' : ''} ${fn.name || 'anonymous'}(${(new Array(fn.length + 1)).join(',arg').slice(1)}){}`;
};

/**
 * get the toString value of object
 *
 * @param {*} object
 * @returns {string}
 */
export const toString = (object) => {
  return objectToString.call(object);
};
