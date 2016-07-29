const ARRAY = '[object Array]';
const BOOLEAN = '[object Boolean]';
const DATE = '[object Date]';
const ERROR = '[object Error]';
const FUNCTION = '[object Function]';
const MAP = '[object Map]';
const MATH = '[object Math]';
const NULL = '[object Null]';
const NUMBER = '[object Number]';
const OBJECT = '[object Object]';
const REGEXP = '[object RegExp]';
const SET = '[object Set]';
const STRING = '[object String]';
const SYMBOL = '[object Symbol]';
const UNDEFINED = '[object Undefined]';
const WEAKMAP = '[object WeakMap]';
const WEAKSET = '[object WeakSet]';
const WINDOW = '[object Window]';

const TYPES = {
  ARRAY,
  BOOLEAN,
  DATE,
  ERROR,
  FUNCTION,
  MAP,
  MATH,
  NULL,
  NUMBER,
  OBJECT,
  REGEXP,
  SET,
  STRING,
  SYMBOL,
  UNDEFINED,
  WEAKMAP,
  WEAKSET,
  WINDOW
};

/**
 * get the generic string value of the function passed
 *
 * @param {function} fn
 * @returns {string}
 */
const toFunctionString = (fn) => {
  return `function ${fn.name || 'anonymous'}(${(new Array(fn.length + 1)).join(',arg').slice(1)}){}`;
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
