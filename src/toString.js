const ARRAY = '[object Array]';
const ARRAY_BUFFER = '[object ArrayBuffer]';
const BOOLEAN = '[object Boolean]';
const DATA_VIEW = '[object DataView]';
const DATE = '[object Date]';
const ERROR = '[object Error]';
const FLOAT_32_ARRAY = '[object Float32Array]';
const FLOAT_64_ARRAY = '[object Float64Array]';
const FUNCTION = '[object Function]';
const GENERATOR = '[object GeneratorFunction]';
const INT_8_ARRAY = '[object Int8Array]';
const INT_16_ARRAY = '[object Int16Array]';
const INT_32_ARRAY = '[object Int32Array]';
const MAP = '[object Map]';
const MATH = '[object Math]';
const NULL = '[object Null]';
const NUMBER = '[object Number]';
const OBJECT = '[object Object]';
const PROMISE = '[object Promise]';
const REGEXP = '[object RegExp]';
const SET = '[object Set]';
const STRING = '[object String]';
const SYMBOL = '[object Symbol]';
const UINT_8_ARRAY = '[object Uint8Array]';
const UINT_8_CLAMPED_ARRAY = '[object Uint8ClampedArray]';
const UINT_16_ARRAY = '[object Uint16Array]';
const UINT_32_ARRAY = '[object Uint32Array]';
const UNDEFINED = '[object Undefined]';
const WEAKMAP = '[object WeakMap]';
const WEAKSET = '[object WeakSet]';
const WINDOW = '[object Window]';

const TYPES = {
  ARRAY,
  ARRAY_BUFFER,
  BOOLEAN,
  DATA_VIEW,
  DATE,
  ERROR,
  FLOAT_32_ARRAY,
  FLOAT_64_ARRAY,
  FUNCTION,
  GENERATOR,
  INT_8_ARRAY,
  INT_16_ARRAY,
  INT_32_ARRAY,
  MAP,
  MATH,
  NULL,
  NUMBER,
  OBJECT,
  PROMISE,
  REGEXP,
  SET,
  STRING,
  SYMBOL,
  UINT_8_ARRAY,
  UINT_8_CLAMPED_ARRAY,
  UINT_16_ARRAY,
  UINT_32_ARRAY,
  UNDEFINED,
  WEAKMAP,
  WEAKSET,
  WINDOW
};

/**
 * get the generic string value of the function passed
 *
 * @param {function} fn
 * @param {boolean} isGenerator=false
 * @returns {string}
 */
const toFunctionString = (fn, isGenerator = false) => {
  return `function${isGenerator ? '*' : ''} ${fn.name || 'anonymous'}(${(new Array(fn.length + 1)).join(',arg').slice(1)}){}`;
};

/**
 * get the toString value of object
 *
 * @param {any} object
 * @returns {string}
 */
const toString = (object) => {
  return Object.prototype.toString.call(object);
};

export {toFunctionString};
export {toString};
export {TYPES as types};
